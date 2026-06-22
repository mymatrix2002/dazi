// js/feature/online-tts.js 音量增强优化版（移动端兼容）
// 正常音量(<1.0)走原生 audio.volume，稳定可靠
// 增强音量(>1.0)才启用 Web Audio GainNode 放大，失败自动降级
(function() {
    'use strict';

    const TTS_BASE_URL = 'https://tts.841231.xyz/';

    let currentAudio = null;
    let isPlaying = false;
    let currentVolume = 1.0;
    
    // Web Audio 相关（懒加载，只有增强档才创建）
    let audioContext = null;
    let gainNode = null;
    let mediaSource = null;

    // 语速转速度（0.25-1.5 → 1-9档）
    function convertRateToSpeed(rate) {
        const speed = Math.round(rate * 3);
        return Math.max(1, Math.min(9, speed));
    }

    // 确保 AudioContext 已创建（仅在需要增强时调用）
    function ensureAudioContext() {
        if (audioContext) return true;
        if (typeof AudioContext === 'undefined' && typeof webkitAudioContext === 'undefined') {
            return false;
        }
        
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            audioContext = new AC();
            gainNode = audioContext.createGain();
            gainNode.gain.value = currentVolume;
            gainNode.connect(audioContext.destination);
            return true;
        } catch (e) {
            console.warn('Web Audio 不可用，无法使用音量增强:', e.message);
            audioContext = null;
            gainNode = null;
            return false;
        }
    }

    // 设置音量
    function setVolume(vol) {
        currentVolume = Math.max(0, vol);
        
        // 更新增益节点（如果已创建）
        if (gainNode) {
            try {
                gainNode.gain.value = currentVolume;
            } catch (e) {}
        }
        
        // 更新当前 audio 的音量（<=1.0 时直接生效）
        if (currentAudio) {
            currentAudio.volume = Math.min(1.0, currentVolume);
        }
    }

    // 播放语音
    function speak(text, lang, rate, volume, onEnd, onError) {
        if (!text || !text.trim()) {
            if (onEnd) setTimeout(onEnd, 100);
            return;
        }

        stop();

        if (volume !== undefined && volume !== null) {
            currentVolume = Math.max(0, volume);
        }

        isPlaying = true;
        const speed = convertRateToSpeed(rate || 1.0);
        const langCode = lang || 'en';
        
        const url = TTS_BASE_URL + '?text=' + encodeURIComponent(text) 
                  + '&lang=' + encodeURIComponent(langCode)
                  + '&speed=' + speed;

        const audio = new Audio();
        // 跨域支持（Web Audio 需要）
        audio.crossOrigin = 'anonymous';
        // 普通音量直接设置，超过 1.0 的部分等下用增益节点处理
        audio.volume = Math.min(1.0, currentVolume);
        audio.setAttribute('playsinline', '');
        audio.setAttribute('webkit-playsinline', '');
        currentAudio = audio;

        // 只有音量超过 1.0 时，才尝试用 Web Audio 放大
        let boostEnabled = false;
        if (currentVolume > 1.0) {
            const hasAudioCtx = ensureAudioContext();
            if (hasAudioCtx && audioContext && gainNode) {
                try {
                    // 恢复 AudioContext（浏览器自动播放策略，必须在用户交互后）
                    if (audioContext.state === 'suspended') {
                        audioContext.resume();
                    }
                    // 连接音频元素到增益节点
                    mediaSource = audioContext.createMediaElementSource(audio);
                    mediaSource.connect(gainNode);
                    gainNode.gain.value = currentVolume;
                    // 连接后 audio.volume 失效，设为 1.0 完全由增益控制
                    audio.volume = 1.0;
                    boostEnabled = true;
                } catch (e) {
                    console.warn('Web Audio 连接失败，使用普通音量:', e.message);
                    // 失败降级：用最大 1.0 音量
                    audio.volume = 1.0;
                    boostEnabled = false;
                }
            } else {
                // Web Audio 不可用，降级为最大 1.0
                audio.volume = 1.0;
            }
        }

        // 播放结束
        audio.addEventListener('ended', function() {
            isPlaying = false;
            if (currentAudio === audio) {
                currentAudio = null;
            }
            // 断开媒体源连接，避免内存泄漏
            if (boostEnabled && mediaSource) {
                try {
                    mediaSource.disconnect();
                } catch (e) {}
                mediaSource = null;
            }
            if (onEnd) {
                const cb = onEnd;
                onEnd = null;
                cb();
            }
        });

        // 播放错误
        audio.addEventListener('error', function(e) {
            isPlaying = false;
            if (currentAudio === audio) {
                currentAudio = null;
            }
            console.warn('在线语音播放失败:', e);
            if (onError) {
                const cb = onError;
                onError = null;
                cb();
            }
        });

        // 开始播放
        const playPromise = audio.play();
        if (playPromise && playPromise.catch) {
            playPromise.catch(function(e) {
                console.warn('在线语音播放失败:', e.message);
                isPlaying = false;
                if (onError) {
                    const cb = onError;
                    onError = null;
                    cb();
                }
            });
        }
    }

    // 停止播放
    function stop() {
        if (currentAudio) {
            try {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            } catch (e) {}
            currentAudio = null;
        }
        // 断开媒体源连接
        if (mediaSource) {
            try {
                mediaSource.disconnect();
            } catch (e) {}
            mediaSource = null;
        }
        isPlaying = false;
    }

    function isPlayingNow() { return isPlaying; }
    function isSupported() { return typeof Audio !== 'undefined'; }
    
    // 判断是否支持音量增强
    function isBoostSupported() {
        if (audioContext) return true;
        // 检查是否支持 AudioContext
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            return true;
        }
        return false;
    }

    window.onlineTTS = {
        speak: speak,
        stop: stop,
        isPlaying: isPlayingNow,
        isSupported: isSupported,
        setVolume: setVolume,
        isBoostSupported: isBoostSupported
    };

})();
