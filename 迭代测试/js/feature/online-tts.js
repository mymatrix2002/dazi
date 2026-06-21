// js/feature/online-tts.js
// 在线 TTS 语音引擎（百度翻译版）
// 最终版：电脑/移动端都能播 + 停止零报错 + 控制台干干净净
(function() {
    'use strict';

    let _isPlaying = false;
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
        
        _isPlaying = true;
        _onEndCallback = onEnd || null;
        _onErrorCallback = onError || null;

        try {
            const audio = new Audio();
            audio.setAttribute('playsinline', '');
            audio.setAttribute('webkit-playsinline', '');
            audio.setAttribute('x5-playsinline', '');
            audio.setAttribute('preload', 'auto');
            audio.crossOrigin = 'anonymous'; // CORS 加载，电脑端必须
            
            const vol = volume || 1;
            audio.volume = Math.min(1, Math.max(0, vol));

            audioContainer.appendChild(audio);
            currentAudio = audio;

            // 播放结束
            audio.onended = () => {
                if (audio !== currentAudio) return;
                _isPlaying = false;
                const cb = _onEndCallback;
                _onEndCallback = null;
                safeRemove(audio);
                if (cb) cb();
            };

            // 播放错误（只有真正的错误才会到这里）
            audio.onerror = () => {
                if (audio !== currentAudio) return;
                _isPlaying = false;
                const cb = _onErrorCallback;
                _onErrorCallback = null;
                safeRemove(audio);
                if (cb) cb(new Error('播放失败'));
            };

            const url = getTTSUrl(text, lang, speed);
            audio.src = url;
            
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    if (audio !== currentAudio) return;
                    // 忽略所有中断类错误
                    if (e.message && (
                        e.message.indexOf('interrupted') !== -1 ||
                        e.message.indexOf('abort') !== -1
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

    // 安全移除 audio 元素（避免触发残留事件）
    function safeRemove(audio) {
        if (!audio) return;
        try {
            audio.onended = null;
            audio.onerror = null;
            audio.oncanplay = null;
            audio.onloadstart = null;
            audio.pause();
            audio.src = '';
            audio.load();
        } catch (e) {}
        setTimeout(() => {
            if (audio.parentNode) {
                try {
                    audio.parentNode.removeChild(audio);
                } catch (e) {}
            }
        }, 0);
    }

    // 停止
    function stop() {
        _onEndCallback = null;
        _onErrorCallback = null;
        _isPlaying = false;
        
        if (currentAudio) {
            const oldAudio = currentAudio;
            currentAudio = null;
            safeRemove(oldAudio);
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
