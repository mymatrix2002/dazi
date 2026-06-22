// js/feature/online-tts.js 完整代码（音量增强版）
// 在线 TTS 语音引擎（百度翻译接口 + Cloudflare Worker 代理）
// 支持 Web Audio 音量放大，可超过 100%
(function() {
    'use strict';

    // ========== 配置 ==========
    const TTS_BASE_URL = 'https://tts.841231.xyz/'; // 你的自定义域名

    // ========== 状态变量 ==========
    let audioEl = null;
    let isPlaying = false;
    let onEndCallback = null;
    let onErrorCallback = null;
    let currentVolume = 1.0; // 音量：0.0 - 2.0（0%-200%）

    // ========== Web Audio 音量增强相关 ==========
    let audioCtx = null;
    let gainNode = null;
    let sourceNode = null;
    let webAudioEnabled = false;

    // 初始化 Web Audio（用户首次交互后才初始化，避免浏览器限制）
    function initWebAudio() {
        if (webAudioEnabled || audioCtx) return;
        
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                webAudioEnabled = false;
                return;
            }
            
            audioCtx = new AudioContext();
            gainNode = audioCtx.createGain();
            gainNode.gain.value = currentVolume;
            gainNode.connect(audioCtx.destination);
            
            // 把 audio 元素接到 Web Audio 上
            if (audioEl) {
                sourceNode = audioCtx.createMediaElementSource(audioEl);
                sourceNode.connect(gainNode);
            }
            
            webAudioEnabled = true;
        } catch (e) {
            console.warn('Web Audio 初始化失败，使用普通音量控制:', e.message);
            webAudioEnabled = false;
        }
    }

    // 设置音量（支持 0.0 - 2.0）
    function setVolume(vol) {
        currentVolume = Math.max(0, Math.min(2.0, vol));
        
        // Web Audio 模式：用 GainNode 放大
        if (webAudioEnabled && gainNode) {
            gainNode.gain.value = currentVolume;
        }
        // 普通模式：audio 元素音量（最大 1.0）
        else if (audioEl) {
            audioEl.volume = Math.min(currentVolume, 1.0);
        }
    }

    // 初始化音频元素
    function initAudio() {
        if (audioEl) return;
        
        audioEl = new Audio();
        audioEl.preload = 'auto';
        audioEl.volume = Math.min(currentVolume, 1.0);
        
        // 播放结束
        audioEl.addEventListener('ended', function() {
            isPlaying = false;
            if (onEndCallback) {
                const cb = onEndCallback;
                onEndCallback = null;
                cb();
            }
        });
        
        // 播放错误
        audioEl.addEventListener('error', function() {
            isPlaying = false;
            if (onErrorCallback) {
                const cb = onErrorCallback;
                onErrorCallback = null;
                cb();
            }
        });

        // 放到 DOM 里，移动端兼容性更好
        audioEl.style.display = 'none';
        document.body.appendChild(audioEl);
    }

    // 语速转换：0.25-1.5 倍率 → 百度 1-9 语速
    function convertRateToSpeed(rate) {
        // 百度语速：3=正常
        // rate=1.0 → speed=3
        // rate=0.5 → speed=1.5 → 取整 2
        // rate=1.5 → speed=4.5 → 取整 5
        const speed = Math.round(rate * 3);
        return Math.max(1, Math.min(9, speed));
    }

    // 播放语音
    function speak(text, lang, rate, volume, onEnd, onError) {
        if (!text || !text.trim()) {
            if (onEnd) setTimeout(onEnd, 100);
            return;
        }

        // 停止之前的播放
        stop();
        
        // 初始化音频
        initAudio();
        
        // 初始化 Web Audio（首次播放时初始化，需要用户交互）
        initWebAudio();
        
        // 设置音量
        if (volume !== undefined && volume !== null) {
            setVolume(volume);
        }

        isPlaying = true;
        onEndCallback = onEnd || null;
        onErrorCallback = onError || null;

        const speed = convertRateToSpeed(rate || 1.0);
        const langCode = lang || 'en';
        
        const url = TTS_BASE_URL + '?text=' + encodeURIComponent(text) 
                  + '&lang=' + encodeURIComponent(langCode)
                  + '&speed=' + speed;

        audioEl.src = url;
        
        const playPromise = audioEl.play();
        if (playPromise && playPromise.catch) {
            playPromise.catch(function(e) {
                console.warn('在线语音播放失败:', e.message);
                isPlaying = false;
                if (onErrorCallback) {
                    const cb = onErrorCallback;
                    onErrorCallback = null;
                    cb();
                }
            });
        }
    }

    // 停止播放
    function stop() {
        if (audioEl) {
            try {
                audioEl.pause();
                audioEl.currentTime = 0;
            } catch (e) {}
        }
        isPlaying = false;
        onEndCallback = null;
        onErrorCallback = null;
    }

    // 是否正在播放
    function isPlayingNow() {
        return isPlaying;
    }

    // 是否支持在线语音
    function isSupported() {
        return typeof Audio !== 'undefined';
    }

    // 暴露到全局
    window.onlineTTS = {
        speak: speak,
        stop: stop,
        isPlaying: isPlayingNow,
        isSupported: isSupported,
        setVolume: setVolume
    };

})();
