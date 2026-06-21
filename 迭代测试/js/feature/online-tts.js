// js/feature/online-tts.js
// 在线 TTS 语音引擎（百度翻译版）
// 终极兼容版：fetch + Blob URL，移动端/电脑端都能播
(function() {
    'use strict';

    let _isPlaying = false;
    let currentAudio = null;
    let _onEndCallback = null;
    let _onErrorCallback = null;
    let audioContainer = null;
    let abortController = null;

    // ========== 配置：你的 Cloudflare Worker 地址 ==========
    const WORKER_URL = 'https://green-forest-10ba.mymatrix2002-ae86.workers.dev/';
    // ======================================================

    // 初始化容器
    function initContainer() {
        if (audioContainer) return;
        audioContainer = document.createElement('div');
        audioContainer.style.display = 'none';
        document.body.appendChild(audioContainer);
    }

    // 语速转换
    function convertRateToBaiduSpeed(rate) {
        const baseSpeed = 3;
        const speed = Math.round(baseSpeed * rate);
        return Math.max(1, Math.min(9, speed));
    }

    // 生成 TTS 地址
    function getTTSUrl(text, lang, speed) {
        const baiduSpeed = convertRateToBaiduSpeed(speed);
        const encoded = encodeURIComponent(text);
        return `${WORKER_URL}?text=${encoded}&lang=${lang}&speed=${baiduSpeed}`;
    }

    // 播放
    async function speak(text, lang, speed, volume, onEnd, onError) {
        if (!text || !text.trim()) {
            if (onEnd) setTimeout(onEnd, 100);
            return;
        }

        initContainer();
        
        // 先停止之前的
        stop();
        
        _isPlaying = true;
        _onEndCallback = onEnd || null;
        _onErrorCallback = onError || null;

        try {
            const url = getTTSUrl(text, lang, speed);
            
            // 用 fetch 下载音频，转成 Blob URL（同源，移动端兼容好）
            abortController = new AbortController();
            
            const response = await fetch(url, {
                signal: abortController.signal,
                mode: 'cors'
            });
            
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            // 创建 Audio 播放
            const audio = new Audio();
            audio.setAttribute('playsinline', '');
            audio.setAttribute('webkit-playsinline', '');
            audio.setAttribute('x5-playsinline', '');
            audio.src = blobUrl;
            
            // 设置音量
            const vol = volume || 1;
            audio.volume = Math.min(1, Math.max(0, vol));
            
            audioContainer.appendChild(audio);
            currentAudio = audio;

            // 播放结束
            audio.onended = () => {
                if (audio !== currentAudio) return;
                _isPlaying = false;
                const cb = _onEndCallback;
                _onEndCallback = null;
                // 清理
                if (audio.parentNode) audio.parentNode.removeChild(audio);
                URL.revokeObjectURL(blobUrl);
                if (cb) cb();
            };

            // 播放错误
            audio.onerror = () => {
                if (audio !== currentAudio) return;
                _isPlaying = false;
                const cb = _onErrorCallback;
                _onErrorCallback = null;
                // 清理
                if (audio.parentNode) audio.parentNode.removeChild(audio);
                URL.revokeObjectURL(blobUrl);
                if (cb) cb(new Error('播放失败'));
            };

            // 开始播放
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    if (audio !== currentAudio) return;
                    if (e.name === 'AbortError') return;
                    _isPlaying = false;
                    const cb = _onErrorCallback;
                    _onErrorCallback = null;
                    if (cb) cb(e);
                });
            }
        } catch (e) {
            if (e.name === 'AbortError') return; // 主动取消的，忽略
            _isPlaying = false;
            if (onError) onError(e);
        }
    }

    // 停止
    function stop() {
        _onEndCallback = null;
        _onErrorCallback = null;
        _isPlaying = false;
        
        // 取消正在进行的 fetch
        if (abortController) {
            try {
                abortController.abort();
            } catch (e) {}
            abortController = null;
        }
        
        if (currentAudio) {
            const oldAudio = currentAudio;
            currentAudio = null;
            try {
                oldAudio.onended = null;
                oldAudio.onerror = null;
                oldAudio.pause();
                oldAudio.src = '';
                oldAudio.load();
            } catch (e) {}
            // 延迟清理
            setTimeout(() => {
                if (oldAudio.parentNode) {
                    try {
                        oldAudio.parentNode.removeChild(oldAudio);
                    } catch (e) {}
                }
            }, 50);
        }
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
