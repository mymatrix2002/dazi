// js/feature/online-tts.js
// 在线 TTS 语音引擎（百度翻译版）
// 兼容版：每次新建 Audio，移动端/电脑端都兼容，停止零报错
(function() {
    'use strict';

    let _isPlaying = false;
    let currentAudio = null;
    let _onEndCallback = null;
    let _onErrorCallback = null;

    // ========== 配置：你的 Cloudflare Worker 地址 ==========
    const WORKER_URL = 'https://green-forest-10ba.mymatrix2002-ae86.workers.dev/';
    // ======================================================

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
    function speak(text, lang, speed, volume, onEnd, onError) {
        if (!text || !text.trim()) {
            if (onEnd) setTimeout(onEnd, 100);
            return;
        }

        // 先停止之前的播放
        stop();
        
        _isPlaying = true;
        _onEndCallback = onEnd || null;
        _onErrorCallback = onError || null;

        try {
            // 每次都新建 Audio 元素，兼容性最好
            const audio = new Audio();
            audio.setAttribute('playsinline', '');
            audio.setAttribute('webkit-playsinline', '');
            audio.setAttribute('preload', 'auto');
            
            // 设置音量
            const vol = volume || 1;
            audio.volume = Math.min(1, Math.max(0, vol));

            // 播放结束
            audio.onended = () => {
                if (audio !== currentAudio) return; // 不是当前播放的，忽略
                _isPlaying = false;
                const cb = _onEndCallback;
                _onEndCallback = null;
                if (cb) cb();
            };

            // 播放错误
            audio.onerror = () => {
                if (audio !== currentAudio) return; // 不是当前播放的，忽略
                _isPlaying = false;
                const cb = _onErrorCallback;
                _onErrorCallback = null;
                if (cb) cb(new Error('播放失败'));
            };

            // 设置地址并播放
            const url = getTTSUrl(text, lang, speed);
            audio.src = url;
            
            currentAudio = audio;
            
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    if (audio !== currentAudio) return;
                    // 忽略被中断的情况
                    if (e.message && e.message.indexOf('interrupted by a call to pause') !== -1) {
                        return;
                    }
                    _isPlaying = false;
                    const cb = _onErrorCallback;
                    _onErrorCallback = null;
                    if (cb) cb(e);
                });
            }
        } catch (e) {
            _isPlaying = false;
            if (onError) onError(e);
        }
    }

    // 停止
    function stop() {
        _onEndCallback = null;
        _onErrorCallback = null;
        _isPlaying = false;
        
        if (currentAudio) {
            try {
                // 清空所有回调，避免停止后还触发事件
                currentAudio.onended = null;
                currentAudio.onerror = null;
                currentAudio.pause();
                currentAudio.src = '';
            } catch (e) {}
            currentAudio = null;
        }
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
