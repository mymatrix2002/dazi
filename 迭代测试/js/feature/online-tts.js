// js/feature/online-tts.js
// 在线 TTS 语音引擎（百度翻译版）
// 移动端优化版：DOM 挂载 + 自动播放解锁 + 零日志
(function() {
    'use strict';

    let _isPlaying = false;
    let currentAudio = null;
    let _onEndCallback = null;
    let _onErrorCallback = null;
    let audioContainer = null;

    // ========== 配置：你的 Cloudflare Worker 地址 ==========
    const WORKER_URL = 'https://green-forest-10ba.mymatrix2002-ae86.workers.dev/';
    // ======================================================

    // 初始化音频容器（放到 DOM 里，移动端兼容性更好）
    function initContainer() {
        if (audioContainer) return;
        audioContainer = document.createElement('div');
        audioContainer.style.display = 'none';
        audioContainer.style.position = 'absolute';
        audioContainer.style.left = '-9999px';
        audioContainer.style.top = '-9999px';
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
    function speak(text, lang, speed, volume, onEnd, onError) {
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
            const audio = new Audio();
            audio.setAttribute('playsinline', '');
            audio.setAttribute('webkit-playsinline', '');
            audio.setAttribute('x5-playsinline', ''); // 腾讯 X5 内核
            audio.setAttribute('preload', 'auto');
            
            // 放到 DOM 容器里，移动端兼容性更好
            audioContainer.appendChild(audio);
            
            // 设置音量
            const vol = volume || 1;
            audio.volume = Math.min(1, Math.max(0, vol));

            // 播放结束
            audio.onended = () => {
                if (audio !== currentAudio) return;
                _isPlaying = false;
                const cb = _onEndCallback;
                _onEndCallback = null;
                // 清理 DOM
                if (audio.parentNode) {
                    audio.parentNode.removeChild(audio);
                }
                if (cb) cb();
            };

            // 播放错误
            audio.onerror = () => {
                if (audio !== currentAudio) return;
                _isPlaying = false;
                const cb = _onErrorCallback;
                _onErrorCallback = null;
                // 清理 DOM
                if (audio.parentNode) {
                    audio.parentNode.removeChild(audio);
                }
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
                    if (e.message && (
                        e.message.indexOf('interrupted by a call to pause') !== -1 ||
                        e.message.indexOf('The play() request was interrupted') !== -1
                    )) {
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
            const oldAudio = currentAudio;
            currentAudio = null;
            try {
                // 清空所有回调
                oldAudio.onended = null;
                oldAudio.onerror = null;
                oldAudio.pause();
                oldAudio.src = '';
                oldAudio.load(); // 强制停止加载
            } catch (e) {}
            // 延迟清理 DOM，避免触发事件
            setTimeout(() => {
                if (oldAudio.parentNode) {
                    try {
                        oldAudio.parentNode.removeChild(oldAudio);
                    } catch (e) {}
                }
            }, 100);
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
