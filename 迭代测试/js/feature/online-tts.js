// js/feature/online-tts.js
// 在线 TTS 语音引擎（通过 Cloudflare Workers 代理百度翻译接口）
// 百度翻译版 - 支持长句子 + 原生语速调节
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

    // 语速转换：把 0.25-1.5 的倍率转换成百度的 1-9 语速
    function convertRateToBaiduSpeed(rate) {
        // 百度语速：1最慢，9最快，3正常
        // 我们的 rate：0.25x 到 1.5x，1.0 对应百度的 3
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

        initAudio();
        
        // 先停止之前的
        stop();

        const url = getTTSUrl(text, lang, speed);
        
        // 保存回调
        _onEndCallback = onEnd || null;
        _onErrorCallback = onError || null;
        
        try {
            // 设置音量
            const vol = volume || 1;
            audioEl.volume = Math.min(1, Math.max(0, vol));

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
