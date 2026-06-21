// js/feature/online-tts.js
// 在线 TTS 语音引擎（通过 Cloudflare Workers 代理有道翻译接口）
// 逐句播放优化版 - 支持播放结束回调 + 语速调节
(function() {
    'use strict';

    let _isPlaying = false;
    let audioEl = null;
    let _onEndCallback = null;
    let _onErrorCallback = null;

    // ========== 配置：你的 Cloudflare Worker 地址 ==========
    const WORKER_URL = 'https://green-forest-10ba.mymatrix2002-ae86.workers.dev/';
    // ======================================================

    // 初始化 Audio 元素（只创建一次）
    function initAudio() {
        if (audioEl) return;
        
        audioEl = new Audio();
        audioEl.setAttribute('playsinline', '');
        audioEl.setAttribute('webkit-playsinline', '');
        audioEl.setAttribute('preload', 'auto');
        
        // 播放结束
        audioEl.onended = () => {
            _isPlaying = false;
            const cb = _onEndCallback;
            _onEndCallback = null;
            if (cb) cb();
        };

        // 播放错误
        audioEl.onerror = (e) => {
            console.warn('[OnlineTTS] 播放错误', e);
            _isPlaying = false;
            const cb = _onErrorCallback;
            _onErrorCallback = null;
            if (cb) cb(e);
        };
    }

    // 生成 TTS 地址
    function getTTSUrl(text, lang) {
        const type = 2; // type=1 美音，type=2 英音
        const encoded = encodeURIComponent(text);
        return `${WORKER_URL}?text=${encoded}&type=${type}`;
    }

    // 播放
    function speak(text, lang, speed, volume, onEnd, onError) {
        if (!text || !text.trim()) {
            if (onEnd) setTimeout(onEnd, 100);
            return;
        }

        initAudio();
        
        // 先停止之前的
        stop();

        const url = getTTSUrl(text, lang);
        
        // 保存回调
        _onEndCallback = onEnd || null;
        _onErrorCallback = onError || null;
        
        try {
            // 设置音量
            const vol = volume || 1;
            audioEl.volume = Math.min(1, Math.max(0, vol));

            // 设置语速（通过 playbackRate 实现，可能会有点变声）
            const rate = speed || 1;
            audioEl.playbackRate = Math.min(2, Math.max(0.5, rate));

            // 设置地址并播放
            audioEl.src = url;
            
            const playPromise = audioEl.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    _isPlaying = true;
                }).catch(e => {
                    console.warn('[OnlineTTS] 播放失败:', e.message);
                    _isPlaying = false;
                    _onEndCallback = null;
                    const cb = _onErrorCallback;
                    _onErrorCallback = null;
                    // 忽略 "interrupted by pause" 这种错误
                    if (e.message && e.message.indexOf('interrupted by a call to pause') === -1) {
                        if (cb) cb(e);
                    }
                });
            } else {
                _isPlaying = true;
            }
        } catch (e) {
            console.warn('[OnlineTTS] 播放异常:', e.message);
            _isPlaying = false;
            if (onError) onError(e);
        }
    }

    // 停止
    function stop() {
        _onEndCallback = null;
        _onErrorCallback = null;
        if (!audioEl) return;
        try {
            audioEl.pause();
            audioEl.currentTime = 0;
            audioEl.src = '';
        } catch (e) {}
        _isPlaying = false;
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
