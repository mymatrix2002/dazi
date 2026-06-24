// js/feature/online-tts.js 优化版（支持多句预加载缓存 + 本地自动降级 + 播放自动重试）
(function() {
    'use strict';
    const TTS_BASE_URL = 'https://tts.841231.xyz/';
    const IS_LOCAL_FILE = location.protocol === 'file:';  // 是否是本地文件模式
    const MAX_RETRY = 2;  // 播放失败最多重试次数，可根据需要调整
    
    // ========== 语音缓存（LRU 最近最少使用）==========
    const audioCache = new Map();
    const MAX_CACHE_SIZE = 50;  // 最多缓存 50 条语音，可根据需要调整
    // 生成缓存 key（同样的文本+语言+语速 = 同样的语音）
    function getCacheKey(text, lang, speed) {
        return lang + '_' + speed + '_' + text;
    }
    // 从缓存获取（同时刷新位置，放到最后，表示最近用过）
    function getFromCache(key) {
        if (audioCache.has(key)) {
            const blob = audioCache.get(key);
            audioCache.delete(key);
            audioCache.set(key, blob);
            return blob;
        }
        return null;
    }
    // 存入缓存（超过上限删掉最久没用的）
    function addToCache(key, blob) {
        if (audioCache.size >= MAX_CACHE_SIZE) {
            const firstKey = audioCache.keys().next().value;
            audioCache.delete(firstKey);
        }
        audioCache.set(key, blob);
    }
    
    let currentAudio = null;
    let isPlaying = false;
    let currentVolume = 1.0;
    let isStoppedByUser = false;  // 是否是用户主动停止的（用于区分正常停止和错误）
    
    function convertRateToSpeed(rate) {
        const speed = Math.round(rate * 5);  // ← 把 3 改成 5，让1.0x对应百度默认速度
        return Math.max(1, Math.min(9, speed));
    }
    function setVolume(vol) {
        currentVolume = Math.max(0, Math.min(1.0, vol));
        if (currentAudio) {
            currentAudio.volume = currentVolume;
        }
    }
    
    // ===== 预加载语音（支持多句）- 本地文件模式下自动跳过 =====
    function preload(text, lang, rate) {
        if (!text || !text.trim()) return;
        if (IS_LOCAL_FILE) return;  // 本地文件模式下不预加载，避免 CORS 报错
        
        const speed = convertRateToSpeed(rate || 1.0);
        const langCode = lang || 'en';
        const cacheKey = getCacheKey(text, langCode, speed);
        
        // 已经在缓存里了，不用重复下载
        if (audioCache.has(cacheKey)) return;
        
        const url = TTS_BASE_URL + '?text=' + encodeURIComponent(text) 
                  + '&lang=' + encodeURIComponent(langCode)
                  + '&speed=' + speed;
        
        // 后台下载并存入缓存
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('下载失败');
                return response.blob();
            })
            .then(blob => {
                addToCache(cacheKey, blob);
            })
            .catch(() => {
                // 预加载失败不影响使用，静默忽略
            });
    }
    
    function speak(text, lang, rate, volume, onEnd, onError) {
        if (!text || !text.trim()) {
            if (onEnd) setTimeout(onEnd, 100);
            return;
        }
        stop();
        isStoppedByUser = false;  // 重置停止标记
        if (volume !== undefined && volume !== null) {
            currentVolume = Math.max(0, Math.min(1.0, volume));
        }
        isPlaying = true;
        const speed = convertRateToSpeed(rate || 1.0);
        const langCode = lang || 'en';
        
        const cacheKey = getCacheKey(text, langCode, speed);
        const cachedBlob = getFromCache(cacheKey);
        
        // 生成 URL
        const url = TTS_BASE_URL + '?text=' + encodeURIComponent(text) 
                  + '&lang=' + encodeURIComponent(langCode)
                  + '&speed=' + speed;
        
        let retryCount = 0;
        
        // 播放函数（带自动重试）
        function tryPlay(audioUrl) {
            // 如果用户已经停止了，就不播放了
            if (isStoppedByUser) {
                isPlaying = false;
                return;
            }
            
            const audio = new Audio(audioUrl);
            audio.volume = currentVolume;
            audio.setAttribute('playsinline', '');
            audio.setAttribute('webkit-playsinline', '');
            currentAudio = audio;
            
            let hasEnded = false;
            let hasError = false;
            
            audio.addEventListener('ended', function() {
                if (hasError) return;
                hasEnded = true;
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
                if (hasEnded) return;
                hasError = true;
                isPlaying = false;
                if (currentAudio === audio) {
                    currentAudio = null;
                }
                
                // 用户主动停止的，不重试也不报错
                if (isStoppedByUser) {
                    return;
                }
                
                // 失败了，看看还能不能重试
                if (retryCount < MAX_RETRY) {
                    retryCount++;
                    // 延迟 500ms 再重试，给服务端恢复时间
                    setTimeout(function() {
                        tryPlay(audioUrl);
                    }, 500);
                } else {
                    // 重试也失败了，调用错误回调
                    console.warn('在线语音播放失败（已重试' + MAX_RETRY + '次）');
                    if (onError) {
                        const cb = onError;
                        onError = null;
                        cb();
                    }
                }
            });
            
            const playPromise = audio.play();
            if (playPromise && playPromise.catch) {
                playPromise.catch(function(e) {
                    if (hasEnded) return;
                    hasError = true;
                    isPlaying = false;
                    
                    // 用户主动停止的，不重试也不报错
                    if (isStoppedByUser) {
                        return;
                    }
                    
                    // 失败了，看看还能不能重试
                    if (retryCount < MAX_RETRY) {
                        retryCount++;
                        setTimeout(function() {
                            tryPlay(audioUrl);
                        }, 500);
                    } else {
                        console.warn('在线语音播放失败:', e.message);
                        if (onError) {
                            const cb = onError;
                            onError = null;
                            cb();
                        }
                    }
                });
            }
        }
        
        // 有缓存 → 直接用缓存，秒播
        if (cachedBlob) {
            const blobUrl = URL.createObjectURL(cachedBlob);
            tryPlay(blobUrl);
            return;
        }
        
        // 本地文件模式 → 直接播放，不走缓存下载（避免 CORS 报错）
        if (IS_LOCAL_FILE) {
            tryPlay(url);
            return;
        }
        
        // 线上模式 → 先下载，再缓存，再播放（下载阶段也带重试）
        let downloadRetry = 0;
        
        function tryDownload() {
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    return response.blob();
                })
                .then(blob => {
                    addToCache(cacheKey, blob); // 存入缓存
                    const blobUrl = URL.createObjectURL(blob);
                    tryPlay(blobUrl);
                })
                .catch(function(e) {
                    // 下载失败了，看看还能不能重试
                    if (downloadRetry < MAX_RETRY) {
                        downloadRetry++;
                        setTimeout(tryDownload, 500);
                    } else {
                        // 下载重试也失败了，降级为直接播放 URL
                        console.warn('语音下载失败，降级为直接播放:', e.message);
                        tryPlay(url);
                    }
                });
        }
        
        tryDownload();
    }
    
    function stop() {
        isStoppedByUser = true;  // 标记为用户主动停止
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
