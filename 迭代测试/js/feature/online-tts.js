// js/feature/online-tts.js
// 在线 TTS 语音引擎（通过 Cloudflare Workers 代理有道翻译接口）
// 移动端兼容优化版 - fetch + Blob URL 方案，解决跨域解析问题
(function() {
    'use strict';

    let _isPlaying = false;
    let audioEl = null;
    let abortController = null;

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
        };

        // 播放错误
        audioEl.onerror = (e) => {
            console.warn('[OnlineTTS] 播放错误', e);
            _isPlaying = false;
        };
    }

    // 生成 TTS 地址
    function getTTSUrl(text, lang, speed) {
        const type = 2; // type=1 美音，type=2 英音
        const encoded = encodeURIComponent(text);
        return `${WORKER_URL}?text=${encoded}&type=${type}`;
    }

    // 播放
    async function speak(text, lang, speed, volume) {
        if (!text || !text.trim()) return;

        initAudio();
        
        // 先停止之前的
        stop();

        const url = getTTSUrl(text, lang, speed);
        
        try {
            // 取消之前的请求
            if (abortController) {
                abortController.abort();
            }
            abortController = new AbortController();
            
            // 用 fetch 下载音频，转成 Blob URL（解决跨域解析问题）
            const response = await fetch(url, {
                signal: abortController.signal
            });
            
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            // 设置音量
            const vol = volume || 1;
            audioEl.volume = Math.min(1, Math.max(0, vol));

            // 设置本地 Blob 地址并播放
            audioEl.src = blobUrl;
            
            const playPromise = audioEl.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    _isPlaying = true;
                }).catch(e => {
                    console.warn('[OnlineTTS] 播放失败:', e.message);
                    _isPlaying = false;
                    // 忽略 "interrupted by pause" 这种错误
                    if (e.message && e.message.indexOf('interrupted by a call to pause') === -1) {
                        alert('播放失败: ' + e.message);
                    }
                });
            } else {
                _isPlaying = true;
            }
            
        } catch (e) {
            if (e.name === 'AbortError') {
                // 主动取消的，不算错误
                return;
            }
            console.warn('[OnlineTTS] 下载失败:', e.message);
            _isPlaying = false;
            alert('语音加载失败: ' + e.message);
        }
    }

    // 停止
    function stop() {
        if (abortController) {
            abortController.abort();
            abortController = null;
        }
        if (!audioEl) return;
        try {
            audioEl.pause();
            audioEl.currentTime = 0;
            if (audioEl.src && audioEl.src.startsWith('blob:')) {
                URL.revokeObjectURL(audioEl.src);
            }
            audioEl.src = '';
        } catch (e) {}
        _isPlaying = false;
    }

    // 状态
    function isPlaying() {
        return _isPlaying;
    }

    function isSupported() {
        return !!window.Audio && !!window.fetch && !!URL.createObjectURL;
    }

    // 暴露到全局
    window.onlineTTS = {
        speak,
        stop,
        isPlaying,
        isSupported
    };

})();
