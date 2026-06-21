// js/feature/online-tts.js
// 在线 TTS 语音引擎（通过 Cloudflare Workers 代理有道翻译接口）
// 移动端兼容优化版 - 复用 Audio 元素
(function() {
    'use strict';

    let _isPlaying = false;
    let audioEl = null;

    // ========== 配置：你的 Cloudflare Worker 地址 ==========
    // 把下面的地址换成你自己的 Worker 地址
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
        };

        // 播放错误
        audioEl.onerror = (e) => {
            console.warn('[OnlineTTS] 播放错误', e);
            _isPlaying = false;
        };
    }

    // 生成 TTS 地址
    function getTTSUrl(text, lang, speed) {
        // type=1 美音，type=2 英音
        const type = 2;
        const encoded = encodeURIComponent(text);
        return `${WORKER_URL}?text=${encoded}&type=${type}`;
    }

    // 播放
    function speak(text, lang, speed, volume) {
        if (!text || !text.trim()) return;

        initAudio();
        
        // 先停止之前的
        stop();

        const url = getTTSUrl(text, lang, speed);
        
        // 设置音量
        const vol = volume || 1;
        audioEl.volume = Math.min(1, Math.max(0, vol));

        // 设置新地址并播放
        audioEl.src = url;
        
        const playPromise = audioEl.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                _isPlaying = true;
            }).catch(e => {
                console.warn('[OnlineTTS] 播放失败:', e.message);
                _isPlaying = false;
                // 忽略 "interrupted by pause" 这种错误（主动停止导致的）
                if (e.message && e.message.indexOf('interrupted by a call to pause') === -1) {
                    alert('播放失败: ' + e.message);
                }
            });
        } else {
            _isPlaying = true;
        }
    }

    // 停止
    function stop() {
        if (!audioEl) return;
        try {
            audioEl.pause();
            audioEl.currentTime = 0;
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
