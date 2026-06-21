// js/feature/online-tts.js
// 在线 TTS 语音引擎（通过 Cloudflare Workers 代理有道翻译接口）
// 移动端兼容优化版
(function() {
    'use strict';

    let _isPlaying = false;
    let currentAudio = null;

    // ========== 配置：你的 Cloudflare Worker 地址 ==========
    // 把下面的地址换成你自己的 Worker 地址
    const WORKER_URL = 'https://green-forest-10ba.mymatrix2002-ae86.workers.dev/';
    // ======================================================

    // 生成 TTS 地址（通过 Cloudflare Workers 代理）
    function getTTSUrl(text, lang, speed) {
        // type=1 美音，type=2 英音
        const type = 2;
        const encoded = encodeURIComponent(text);
        return `${WORKER_URL}?text=${encoded}&type=${type}`;
    }

    // 播放
    function speak(text, lang, speed, volume) {
        if (!text || !text.trim()) return;

        stop();

        const url = getTTSUrl(text, lang, speed);
        
        // 每次都创建新的 Audio 元素（移动端兼容性更好）
        const audio = new Audio();
        currentAudio = audio;
        
        // 移动端兼容属性
        audio.setAttribute('playsinline', '');
        audio.setAttribute('webkit-playsinline', '');
        audio.setAttribute('preload', 'auto');
        
        // 音量（确保有默认值）
        const vol = volume || 1;
        audio.volume = Math.min(1, Math.max(0, vol));

        audio.src = url;
        
        // 播放
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                _isPlaying = true;
            }).catch(e => {
                console.warn('[OnlineTTS] 播放失败:', e.message);
                _isPlaying = false;
                alert('播放失败: ' + e.message);
            });
        } else {
            _isPlaying = true;
        }

        // 播放结束
        audio.onended = () => {
            _isPlaying = false;
            if (currentAudio === audio) {
                currentAudio = null;
            }
        };

        // 加载错误
        audio.onerror = (e) => {
            console.warn('[OnlineTTS] 加载失败', e);
            _isPlaying = false;
            alert('音频加载失败');
            if (currentAudio === audio) {
                currentAudio = null;
            }
        };
    }

    // 停止
    function stop() {
        if (currentAudio) {
            try {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            } catch (e) {}
            currentAudio = null;
        }
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
