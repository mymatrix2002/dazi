// js/feature/online-tts.js
// 在线 TTS 语音引擎（调试版 - 带详细日志）
(function() {
    'use strict';

    let _isPlaying = false;
    let currentAudio = null;
    let _onEndCallback = null;
    let _onErrorCallback = null;
    let audioContainer = null;

    // ========== 配置：你的 Cloudflare Worker 地址 ==========
    const WORKER_URL = 'https://tts.841231.xyz/';
    // ======================================================

    function initContainer() {
        if (audioContainer) return;
        audioContainer = document.createElement('div');
        audioContainer.style.display = 'none';
        document.body.appendChild(audioContainer);
        console.log('[TTS] 容器已创建');
    }

    function convertRateToBaiduSpeed(rate) {
        const baseSpeed = 3;
        const speed = Math.round(baseSpeed * rate);
        return Math.max(1, Math.min(9, speed));
    }

    function getTTSUrl(text, lang, speed) {
        const baiduSpeed = convertRateToBaiduSpeed(speed);
        const encoded = encodeURIComponent(text);
        return `${WORKER_URL}?text=${encoded}&lang=${lang}&speed=${baiduSpeed}`;
    }

    async function speak(text, lang, speed, volume, onEnd, onError) {
        console.log('[TTS] 开始播放:', text.substring(0, 30) + '...');
        
        if (!text || !text.trim()) {
            console.log('[TTS] 文本为空，跳过');
            if (onEnd) setTimeout(onEnd, 100);
            return;
        }

        initContainer();
        stop();
        
        _isPlaying = true;
        _onEndCallback = onEnd || null;
        _onErrorCallback = onError || null;

        try {
            const url = getTTSUrl(text, lang, speed);
            console.log('[TTS] 请求地址:', url);
            
            // ===== 方案1：直接 Audio src（用户点击时同步播放，绕过自动播放限制）=====
            const audio = new Audio();
            audio.setAttribute('playsinline', '');
            audio.setAttribute('webkit-playsinline', '');
            audio.setAttribute('x5-playsinline', '');
            audio.preload = 'auto';
            
            const vol = volume || 1;
            audio.volume = Math.min(1, Math.max(0, vol));
            console.log('[TTS] 音量:', vol);
            
            audioContainer.appendChild(audio);
            currentAudio = audio;

            audio.onended = () => {
                console.log('[TTS] 播放结束');
                if (audio !== currentAudio) return;
                _isPlaying = false;
                const cb = _onEndCallback;
                _onEndCallback = null;
                if (audio.parentNode) audio.parentNode.removeChild(audio);
                if (cb) cb();
            };

            audio.onerror = (e) => {
                console.error('[TTS] 播放错误:', e, '错误代码:', audio.error ? audio.error.code : '未知');
                if (audio !== currentAudio) return;
                _isPlaying = false;
                const cb = _onErrorCallback;
                _onErrorCallback = null;
                if (audio.parentNode) audio.parentNode.removeChild(audio);
                if (cb) cb(new Error('播放失败'));
            };

            audio.onloadstart = () => console.log('[TTS] 开始加载');
            audio.oncanplay = () => console.log('[TTS] 可以播放了');
            audio.onplay = () => console.log('[TTS] 正式开始播放');
            audio.onpause = () => console.log('[TTS] 暂停');

            audio.src = url;
            console.log('[TTS] 已设置 src，准备播放');
            
            const playPromise = audio.play();
            console.log('[TTS] play() 返回值:', playPromise);
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('[TTS] play Promise 成功');
                }).catch(e => {
                    console.error('[TTS] play Promise 失败:', e.name, e.message);
                    if (audio !== currentAudio) return;
                    if (e.name === 'AbortError') return;
                    _isPlaying = false;
                    const cb = _onErrorCallback;
                    _onErrorCallback = null;
                    if (cb) cb(e);
                });
            }
        } catch (e) {
            console.error('[TTS] 异常:', e);
            _isPlaying = false;
            if (onError) onError(e);
        }
    }

    function stop() {
        console.log('[TTS] 停止播放');
        _onEndCallback = null;
        _onErrorCallback = null;
        _isPlaying = false;
        
        if (currentAudio) {
            const oldAudio = currentAudio;
            currentAudio = null;
            try {
                oldAudio.onended = null;
                oldAudio.onerror = null;
                oldAudio.onloadstart = null;
                oldAudio.oncanplay = null;
                oldAudio.onplay = null;
                oldAudio.onpause = null;
                oldAudio.pause();
                oldAudio.src = '';
                oldAudio.load();
            } catch (e) {
                console.warn('[TTS] 停止时出错:', e);
            }
            setTimeout(() => {
                if (oldAudio.parentNode) {
                    try {
                        oldAudio.parentNode.removeChild(oldAudio);
                    } catch (e) {}
                }
            }, 50);
        }
    }

    function isPlaying() {
        return _isPlaying;
    }

    function isSupported() {
        return !!window.Audio;
    }

    window.onlineTTS = {
        speak,
        stop,
        isPlaying,
        isSupported
    };

    console.log('[TTS] 模块已加载');
})();
