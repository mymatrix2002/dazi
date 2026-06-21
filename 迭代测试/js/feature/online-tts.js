// js/feature/online-tts.js
// 在线 TTS 语音引擎（百度翻译版）
// 稳定版：修复停止后立即播放的报错问题
(function() {
    'use strict';

    let _isPlaying = false;
    let _isStopping = false;
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
            if (_isStopping) return;
            _isPlaying = false;
            const cb = _onEndCallback;
            _onEndCallback = null;
            if (cb) cb();
        };

        // 播放错误
        audioEl.onerror = (e) => {
            if (_isStopping) return; // 主动停止导致的，忽略
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
        stopInternal();
        
        // 重置停止标志，准备新播放
        _isStopping = false;
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
                    if (_isStopping) return;
                    _isPlaying = true;
                }).catch(e => {
                    if (_isStopping) return;
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
            if (_isStopping) return;
            console.warn('[OnlineTTS] 播放异常:', e.message);
            _isPlaying = false;
            if (onError) onError(e);
        }
    }

    // 内部停止（供 speak 内部调用）
    function stopInternal() {
        _isStopping = true;
        _onEndCallback = null;
        _onErrorCallback = null;
        if (!audioEl) {
            _isPlaying = false;
            return;
        }
        try {
            audioEl.pause();
            audioEl.currentTime = 0;
            audioEl.src = ''; // 直接清空，有 _isStopping 保护不会报错
        } catch (e) {}
        _isPlaying = false;
    }

    // 对外停止接口
    function stop() {
        stopInternal();
        // 对外调用的 stop，保持停止状态一小会儿，避免误触发
        setTimeout(() => {
            _isStopping = false;
        }, 100);
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
