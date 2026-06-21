// js/feature/online-tts.js
// 在线 TTS 语音引擎（百度翻译版）
// 修复版：加上 crossOrigin，兼容电脑端跨域播放
(function() {
    'use strict';

    let _isPlaying = false;
    let _isStopping = false;
    let currentAudio = null;
    let _onEndCallback = null;
    let _onErrorCallback = null;
    let audioContainer = null;

    // ========== 配置：你的自定义域名 Worker 地址 ==========
    const WORKER_URL = 'https://tts.841231.xyz/';
    // ======================================================

    function initContainer() {
        if (audioContainer) return;
        audioContainer = document.createElement('div');
        audioContainer.style.display = 'none';
        audioContainer.style.position = 'absolute';
        audioContainer.style.left = '-9999px';
        audioContainer.style.top = '-9999px';
        document.body.appendChild(audioContainer);
    }

    function convertRateToBaiduSpeed(rate) {
        const baseSpeed = 3;
        const speed = Math.round(baseSpeed * rate);
        return Math.max(1, Math.min(9, speed));
    }

    function getTTSUrl(text, lang, speed) {
        const baiduSpeed = convertRateToBaiduSpeed(speed);
        const encoded = encodeURIComponent(text);
        return `${WORKER_URL}?text=${encoded}&lang=${lang}&speed=${baiduSpeed}`;
    }

    function speak(text, lang, speed, volume, onEnd, onError) {
        if (!text || !text.trim()) {
            if (onEnd) setTimeout(onEnd, 100);
            return;
        }

        initContainer();
        stop();
        
        _isStopping = false;
        _isPlaying = true;
        _onEndCallback = onEnd || null;
        _onErrorCallback = onError || null;

        try {
            const audio = new Audio();
            audio.setAttribute('playsinline', '');
            audio.setAttribute('webkit-playsinline', '');
            audio.setAttribute('x5-playsinline', '');
            audio.setAttribute('preload', 'auto');
            audio.crossOrigin = 'anonymous'; // 加上这个，CORS 方式加载跨域媒体
            
            const vol = volume || 1;
            audio.volume = Math.min(1, Math.max(0, vol));

            audioContainer.appendChild(audio);
            currentAudio = audio;

            audio.onended = () => {
                if (_isStopping || audio !== currentAudio) return;
                _isPlaying = false;
                const cb = _onEndCallback;
                _onEndCallback = null;
                if (audio.parentNode) audio.parentNode.removeChild(audio);
                if (cb) cb();
            };

            audio.onerror = () => {
                if (_isStopping || audio !== currentAudio) return;
                _isPlaying = false;
                const cb = _onErrorCallback;
                _onErrorCallback = null;
                if (audio.parentNode) audio.parentNode.removeChild(audio);
                if (cb) cb(new Error('播放失败'));
            };

            const url = getTTSUrl(text, lang, speed);
            audio.src = url;
            
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    if (_isStopping || audio !== currentAudio) return;
                    if (e.message && (
                        e.message.indexOf('interrupted by a call to pause') !== -1 ||
                        e.message.indexOf('The play() request was interrupted') !== -1
                    )) {
                        return;
                    }
                    _isPlaying = false;
                    const cb = _onErrorCallback;
                    _onErrorCallback = null;
                    if (cb) cb(e);
                });
            }
        } catch (e) {
            _isPlaying = false;
            if (onError) onError(e);
        }
    }

    function stop() {
        _isStopping = true;
        _onEndCallback = null;
        _onErrorCallback = null;
        _isPlaying = false;
        
        if (currentAudio) {
            const oldAudio = currentAudio;
            currentAudio = null;
            try {
                oldAudio.onended = null;
                oldAudio.onerror = null;
                oldAudio.pause();
                oldAudio.currentTime = 0;
            } catch (e) {}
            setTimeout(() => {
                if (oldAudio.parentNode) {
                    try {
                        oldAudio.parentNode.removeChild(oldAudio);
                    } catch (e) {}
                }
                _isStopping = false;
            }, 200);
        } else {
            _isStopping = false;
        }
    }

    function isPlaying() {
        return _isPlaying;
    }

    function isSupported() {
        return !!window.Audio || !!window.HTMLAudioElement;
    }

    window.onlineTTS = {
        speak,
        stop,
        isPlaying,
        isSupported
    };

})();
