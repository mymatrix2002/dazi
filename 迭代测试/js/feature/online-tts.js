// js/feature/online-tts.js
// 在线 TTS 语音引擎（百度翻译版）
// 最终稳定版：停止时完全不报错
(function() {
    'use strict';

    let _isPlaying = false;
    let audioEl = null;
    let _onEndCallback = null;
    let _onErrorCallback = null;

    // ========== 配置：你的 Cloudflare Worker 地址 ==========
    const WORKER_URL = 'https://green-forest-10ba.mymatrix2002-ae86.workers.dev/';
    // ======================================================

    // 初始化 Audio 元素
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

        // 播放错误（只有真正的加载失败才会触发）
        audioEl.onerror = (e) => {
            console.warn('[OnlineTTS] 播放错误', e);
            _isPlaying = false;
            const cb = _onErrorCallback;
            _onErrorCallback = null;
            if (cb) cb(e);
        };
    }

    // 语速转换
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

        initAudio();
        
        // 先停止之前的播放
        stop();
        
        _isPlaying = false;
        
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
                    // 忽略正常的暂停中断
                    if (e.message && e.message.indexOf('interrupted by a call to pause') !== -1) {
                        return;
                    }
                    console.warn('[OnlineTTS] 播放失败:', e.message);
                    _isPlaying = false;
                    _onEndCallback = null;
                    const cb = _onErrorCallback;
                    _onErrorCallback = null;
                    if (cb) cb(e);
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
        if (!audioEl) {
            _isPlaying = false;
            return;
        }
        try {
            audioEl.pause();
            audioEl.currentTime = 0;
            // 不再清空 src，避免触发 error 事件
            // 下次播放时会设置新的 src，自动替换
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
