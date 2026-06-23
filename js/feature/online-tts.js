// js/feature/online-tts.js 优化版（支持多句预加载缓存）
(function() {
    'use strict';
    const TTS_BASE_URL = 'https://tts.841231.xyz/';
    let currentAudio = null;
    let isPlaying = false;
    let currentVolume = 1.0;
    
    // ===== 修改：预加载缓存数组，最多 5 个 =====
    const MAX_PRELOAD_COUNT = 5;
    let preloadCacheList = [];
    
    // 生成缓存唯一标识
    function getCacheKey(text, lang, rate) {
        return text + '|' + lang + '|' + rate;
    }
    
    function convertRateToSpeed(rate) {
        const speed = Math.round(rate * 3);
        return Math.max(1, Math.min(9, speed));
    }
    function setVolume(vol) {
        currentVolume = Math.max(0, Math.min(1.0, vol));
        if (currentAudio) {
            currentAudio.volume = currentVolume;
        }
    }
    
    // ===== 修改：预加载语音（支持多句）=====
    function preload(text, lang, rate) {
        if (!text || !text.trim()) return;
        
        const speed = convertRateToSpeed(rate || 1.0);
        const langCode = lang || 'en';
        const key = getCacheKey(text, langCode, rate);
        
        // 已经在缓存里了，不用重复加载
        for (let i = 0; i < preloadCacheList.length; i++) {
            if (preloadCacheList[i].key === key) return;
        }
        
        const url = TTS_BASE_URL + '?text=' + encodeURIComponent(text) 
                  + '&lang=' + encodeURIComponent(langCode)
                  + '&speed=' + speed;
        
        const audio = new Audio();
        audio.preload = 'auto';
        audio.setAttribute('playsinline', '');
        audio.setAttribute('webkit-playsinline', '');
        audio.src = url;
        
        // 触发加载
        audio.load();
        
        preloadCacheList.push({
            key: key,
            audio: audio,
            text: text,
            lang: langCode,
            rate: rate
        });
        
        // 超过最大数量，删掉最早的（FIFO）
        if (preloadCacheList.length > MAX_PRELOAD_COUNT) {
            const removed = preloadCacheList.shift();
            try {
                removed.audio.pause();
                removed.audio.src = '';
            } catch (e) {}
        }
    }
    
    // ===== 修改：清除所有预加载缓存 =====
    function clearPreload() {
        for (let i = 0; i < preloadCacheList.length; i++) {
            try {
                preloadCacheList[i].audio.pause();
                preloadCacheList[i].audio.src = '';
            } catch (e) {}
        }
        preloadCacheList = [];
    }
    
    function speak(text, lang, rate, volume, onEnd, onError) {
        if (!text || !text.trim()) {
            if (onEnd) setTimeout(onEnd, 100);
            return;
        }
        stop();
        if (volume !== undefined && volume !== null) {
            currentVolume = Math.max(0, Math.min(1.0, volume));
        }
        isPlaying = true;
        const speed = convertRateToSpeed(rate || 1.0);
        const langCode = lang || 'en';
        const key = getCacheKey(text, langCode, rate);
        
        let audio;
        let cacheIndex = -1;
        
        // ===== 修改：从缓存数组里查找 =====
        for (let i = 0; i < preloadCacheList.length; i++) {
            if (preloadCacheList[i].key === key) {
                audio = preloadCacheList[i].audio;
                cacheIndex = i;
                break;
            }
        }
        
        if (audio && cacheIndex >= 0) {
            // 命中预加载缓存，从缓存里移除
            preloadCacheList.splice(cacheIndex, 1);
        } else {
            // 没有缓存，新建音频
            const url = TTS_BASE_URL + '?text=' + encodeURIComponent(text) 
                      + '&lang=' + encodeURIComponent(langCode)
                      + '&speed=' + speed;
            audio = new Audio(url);
            audio.setAttribute('playsinline', '');
            audio.setAttribute('webkit-playsinline', '');
        }
        
        audio.volume = currentVolume;
        currentAudio = audio;
        audio.addEventListener('ended', function() {
            isPlaying = false;
            if (currentAudio === audio) {
                currentAudio = null;
            }
            if (onEnd) {
                const cb = onEnd;
                onEnd = null;
                cb();
            }
        });
        audio.addEventListener('error', function() {
            isPlaying = false;
            if (currentAudio === audio) {
                currentAudio = null;
            }
            console.warn('在线语音播放失败');
            if (onError) {
                const cb = onError;
                onError = null;
                cb();
            }
        });
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
    function stop() {
        clearPreload(); // 停止时清除所有预加载
        if (currentAudio) {
            try {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            } catch (e) {}
            currentAudio = null;
        }
        isPlaying = false;
    }
    function isPlayingNow() { return isPlaying; }
    function isSupported() { return typeof Audio !== 'undefined'; }
    window.onlineTTS = {
        speak: speak,
        stop: stop,
        isPlaying: isPlayingNow,
        isSupported: isSupported,
        setVolume: setVolume,
        preload: preload
    };
})();