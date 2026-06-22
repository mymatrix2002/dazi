// js/feature/online-tts.js 稳定版（无音量增强，移动端兼容）
(function() {
    'use strict';

    const TTS_BASE_URL = 'https://tts.841231.xyz/';

    let currentAudio = null;
    let isPlaying = false;
    let currentVolume = 1.0;

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
        
        const url = TTS_BASE_URL + '?text=' + encodeURIComponent(text) 
                  + '&lang=' + encodeURIComponent(langCode)
                  + '&speed=' + speed;

        const audio = new Audio(url);
        audio.volume = currentVolume;
        audio.setAttribute('playsinline', '');
        audio.setAttribute('webkit-playsinline', '');
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
        setVolume: setVolume
    };

})();