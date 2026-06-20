// js/feature/online-tts.js
// 在线 TTS 语音引擎（百度翻译接口）
// 支持中英文、音量放大（0~200%+）、智能缓存、移动端兼容
(function() {
    'use strict';

    // ========== 缓存配置 ==========
    const MAX_CACHE_SIZE = 100;
    const audioCache = new Map();

    // ========== 播放模式 ==========
    // 'webaudio' = Web Audio API（支持音量放大）
    // 'audio' = Audio 元素（兼容性好，不支持音量放大）
    let playMode = 'webaudio';

    // ========== Web Audio 相关 ==========
    let audioCtx = null;
    let gainNode = null;
    let currentSource = null;
    let _isPlaying = false;

    // ========== Audio 元素降级 ==========
    let audioEl = null;

    // ========== 初始化 AudioContext（用户交互后调用） ==========
    function initAudioContext() {
        if (!audioCtx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) {
                playMode = 'audio'; // 不支持 Web Audio，降级到 Audio 元素
                return false;
            }
            try {
                audioCtx = new AC();
                gainNode = audioCtx.createGain();
                gainNode.connect(audioCtx.destination);
            } catch (e) {
                console.warn('[OnlineTTS] Web Audio 初始化失败，降级到 Audio 元素:', e.message);
                playMode = 'audio';
                return false;
            }
        }
        // 移动端需要用户交互后才能 resume
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(e => {
                console.warn('[OnlineTTS] AudioContext resume 失败:', e.message);
            });
        }
        return true;
    }

    // ========== 尝试解锁音频（用户点击时调用） ==========
    function unlockAudio() {
        if (playMode === 'webaudio') {
            initAudioContext();
        }
        // Audio 元素也需要用户交互才能播放
        if (!audioEl) {
            try {
                audioEl = new Audio();
                audioEl.preload = 'auto';
            } catch (e) {}
        }
    }

    // ========== 音量控制 ==========
    function setVolume(volume) {
        const vol = Math.max(0, volume);
        
        if (playMode === 'webaudio' && gainNode) {
            gainNode.gain.value = vol;
        }
        if (audioEl) {
            // Audio 元素最大 1，超过的话按 1 算
            audioEl.volume = Math.min(1, vol);
        }
    }

    // ========== TTS 地址生成 ==========
    function getTTSUrl(text, lang, speed) {
        const lan = (lang === 'zh' || lang === 'zh-CN') ? 'zh' : 'en';
        const spd = Math.max(0.5, Math.min(9, speed * 3));
        const encoded = encodeURIComponent(text);
        return `https://fanyi.baidu.com/gettts?lan=${lan}&text=${encoded}&spd=${spd}&source=web`;
    }

    // ========== 加载音频（Web Audio 模式） ==========
    async function loadAudioBuffer(text, lang, speed) {
        const cacheKey = `buf_${lang}_${speed.toFixed(2)}_${text}`;

        if (audioCache.has(cacheKey)) {
            return audioCache.get(cacheKey);
        }

        if (!initAudioContext()) {
            throw new Error('Web Audio 不可用');
        }

        const url = getTTSUrl(text, lang, speed);

        try {
            const resp = await fetch(url, { mode: 'cors' });
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const buf = await resp.arrayBuffer();
            const audioBuf = await audioCtx.decodeAudioData(buf.slice(0));

            if (audioCache.size >= MAX_CACHE_SIZE) {
                const firstKey = audioCache.keys().next().value;
                audioCache.delete(firstKey);
            }
            audioCache.set(cacheKey, audioBuf);

            return audioBuf;
        } catch (e) {
            console.warn('[OnlineTTS] Web Audio 加载失败:', e.message);
            throw e;
        }
    }

    // ========== Web Audio 播放 ==========
    async function playWebAudio(text, lang, speed, volume) {
        stop();

        if (!initAudioContext()) {
            return false;
        }

        setVolume(volume);

        return new Promise(async (resolve) => {
            try {
                const audioBuf = await loadAudioBuffer(text, lang, speed);

                currentSource = audioCtx.createBufferSource();
                currentSource.buffer = audioBuf;
                currentSource.connect(gainNode);

                currentSource.onended = () => {
                    _isPlaying = false;
                    currentSource = null;
                    resolve(true);
                };

                currentSource.onerror = () => {
                    _isPlaying = false;
                    currentSource = null;
                    resolve(false);
                };

                currentSource.start(0);
                _isPlaying = true;
            } catch (e) {
                console.warn('[OnlineTTS] Web Audio 播放失败:', e.message);
                _isPlaying = false;
                resolve(false);
            }
        });
    }

    // ========== Audio 元素播放（降级方案） ==========
    async function playAudioElement(text, lang, speed, volume) {
        stop();

        if (!audioEl) {
            try {
                audioEl = new Audio();
            } catch (e) {
                return false;
            }
        }

        setVolume(volume);

        return new Promise((resolve) => {
            const url = getTTSUrl(text, lang, speed);
            
            let finished = false;
            
            const onEnded = () => {
                cleanup();
                _isPlaying = false;
                resolve(true);
            };
            
            const onError = () => {
                cleanup();
                console.warn('[OnlineTTS] Audio 元素播放失败');
                _isPlaying = false;
                resolve(false);
            };
            
            const onLoaded = () => {
                audioEl.play().catch(e => {
                    console.warn('[OnlineTTS] Audio play 失败:', e.message);
                    onError();
                });
            };
            
            function cleanup() {
                finished = true;
                audioEl.removeEventListener('ended', onEnded);
                audioEl.removeEventListener('error', onError);
                audioEl.removeEventListener('canplaythrough', onLoaded);
            }
            
            // 超时处理：10秒还没加载完就算失败
            setTimeout(() => {
                if (!finished) {
                    console.warn('[OnlineTTS] 播放超时');
                    cleanup();
                    _isPlaying = false;
                    resolve(false);
                }
            }, 10000);
            
            audioEl.addEventListener('ended', onEnded);
            audioEl.addEventListener('error', onError);
            audioEl.addEventListener('canplaythrough', onLoaded);
            
            audioEl.src = url;
            audioEl.load();
            _isPlaying = true;
        });
    }

    // ========== 统一播放接口 ==========
    async function speak(text, lang, speed, volume) {
        if (!text || !text.trim()) return false;

        // 先尝试解锁音频
        unlockAudio();

        // 优先 Web Audio
        if (playMode === 'webaudio') {
            const success = await playWebAudio(text, lang, speed, volume);
            if (success) return true;
            // Web Audio 失败，降级到 Audio 元素
            console.warn('[OnlineTTS] Web Audio 失败，尝试 Audio 元素');
            playMode = 'audio';
        }

        // Audio 元素降级
        return await playAudioElement(text, lang, speed, volume);
    }

    // ========== 停止播放 ==========
    function stop() {
        // 停止 Web Audio
        if (currentSource) {
            try {
                currentSource.onended = null;
                currentSource.stop();
            } catch (e) {}
            currentSource = null;
        }
        
        // 停止 Audio 元素
        if (audioEl) {
            try {
                audioEl.pause();
                audioEl.currentTime = 0;
            } catch (e) {}
        }
        
        _isPlaying = false;
    }

    // ========== 暂停/恢复 ==========
    function pause() {
        if (playMode === 'webaudio' && audioCtx && audioCtx.state === 'running') {
            audioCtx.suspend().catch(() => {});
        }
        if (audioEl && !audioEl.paused) {
            audioEl.pause();
        }
    }

    function resume() {
        if (playMode === 'webaudio' && audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }
        if (audioEl && audioEl.paused) {
            audioEl.play().catch(() => {});
        }
    }

    // ========== 状态查询 ==========
    function isPlaying() {
        return _isPlaying;
    }

    function isSupported() {
        return !!(window.AudioContext || window.webkitAudioContext || window.Audio || window.HTMLAudioElement);
    }

    // ========== 清空缓存 ==========
    function clearCache() {
        audioCache.clear();
    }

    // ========== 暴露到全局 ==========
    window.onlineTTS = {
        speak,
        stop,
        pause,
        resume,
        setVolume,
        isPlaying,
        isSupported,
        clearCache,
        unlockAudio  // 暴露解锁方法，用户点击时调用
    };

})();
