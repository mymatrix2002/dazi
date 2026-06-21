// js/feature/online-tts.js
// 在线 TTS 语音引擎（百度翻译版）
// 正式版：自定义域名 + 同域播放 + 移动端兼容 + 停止零报错
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

    // 初始化容器（放到 DOM 里，移动端兼容性更好）
    function initContainer() {
        if (audioContainer) return;
        audioContainer = document.createElement('div');
        audioContainer.style.display = 'none';
        audioContainer.style.position = 'absolute';
        audioContainer.style.left = '-9999px';
        audioContainer.style.top = '-9999px';
        document.body.appendChild(audioContainer);
    }

    // 语速转换：0.25-1.5 倍率 → 百度 1-9 语速
    function convertRateToBaiduSpeed(rate) {
        const baseSpeed = 3;
        const speed = Math.round(baseSpeed * rate);
        return Math.max(1, Math.min(9, speed));
    }

    // 生成 TTS 地址
    function getTTSUrl(text, lang, speed) {
        const baiduSpeed = convertRateToBaiduSpeed(speed);
        const encoded = encodeURIComponent(text);
        return `${WORKER_URL}?text=${encoded}&lang=${lang}&speed=${baiduSpeed}`;
    }

    // 播放
    function speak(text, lang, speed, volume, onEnd, onError) {
        if (!text || !text.trim()) {
            if (onEnd) setTimeout(onEnd, 100);
            return;
        }

        initContainer();
        
        // 先停止之前的
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
            
            // 设置音量
            const vol = volume || 1;
            audio.volume = Math.min(1, Math.max(0, vol));

            // 放到 DOM 里
            audioContainer.appendChild(audio);
            currentAudio = audio;

            // 播放结束
            audio.onended = () => {
                if (_isStopping || audio !== currentAudio) return;
                _isPlaying = false;
                const cb = _onEndCallback;
                _onEndCallback = null;
                if (audio.parentNode) audio.parentNode.removeChild(audio);
                if (cb) cb();
            };

            // 播放错误
            audio.onerror = () => {
                if (_isStopping || audio !== currentAudio) return;
                _isPlaying = false;
                const cb = _onErrorCallback;
                _onErrorCallback = null;
                if (audio.parentNode) audio.parentNode.removeChild(audio);
                if (cb) cb(new Error('播放失败'));
            };

            // 设置地址并播放（同域，无跨域问题）
            const url = getTTSUrl(text, lang, speed);
            audio.src = url;
            
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    if (_isStopping || audio !== currentAudio) return;
                    // 忽略正常的暂停中断
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

    // 停止
    function stop() {
        _isStopping = true;
        _onEndCallback = null;
        _onErrorCallback = null;
        _isPlaying = false;
        
        if (currentAudio) {
            const oldAudio = currentAudio;
            currentAudio = null;
            try {
                // 清空所有回调，避免停止后还触发事件
                oldAudio.onended = null;
                oldAudio.onerror = null;
                oldAudio.pause();
                oldAudio.currentTime = 0;
            } catch (e) {}
            // 延迟清理 DOM
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

    // 状态
    function isPlaying() {
        return _isPlaying;
    }

    function isSupported() {
        return !!window.Audio || !!window.HTMLAudioElement;
    }

    // 暴露到全局
    window.onlineTTS = {
        speak,
        stop,
        isPlaying,
        isSupported
    };

})();
