// js/feature/online-tts.js
// 极简版在线 TTS（百度翻译接口）
// 移动端兼容优化版
(function() {
    'use strict';

    let _isPlaying = false;
    let currentAudio = null;

    // 生成 TTS 地址
    function getTTSUrl(text, lang, speed) {
        const lan = (lang === 'zh' || lang === 'zh-CN') ? 'zh' : 'en';
        const spd = Math.max(0.5, Math.min(9, speed * 3));
        const encoded = encodeURIComponent(text);
        return `https://fanyi.baidu.com/gettts?lan=${lan}&text=${encoded}&spd=${spd}&source=web`;
    }

    // 播放
    function speak(text, lang, speed, volume) {
        if (!text || !text.trim()) return;

        stop();

        const url = getTTSUrl(text, lang, speed);
        
        // 每次都创建新的 Audio 元素（移动端兼容性更好）
        const audio = new Audio();
        currentAudio = audio;
        
        // 移动端兼容属性
        audio.setAttribute('playsinline', '');
        audio.setAttribute('webkit-playsinline', '');
        audio.setAttribute('preload', 'auto');
        
        // 音量（确保有默认值）
        const vol = volume || 1;
        audio.volume = Math.min(1, Math.max(0, vol));

        audio.src = url;
        
        // 播放
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                _isPlaying = true;
            }).catch(e => {
                console.warn('[OnlineTTS] 播放失败:', e.message);
                _isPlaying = false;
                // 调试：弹出错误信息
                alert('播放失败: ' + e.message);
            });
        } else {
            _isPlaying = true;
        }

        // 播放结束
        audio.onended = () => {
            _isPlaying = false;
            if (currentAudio === audio) {
                currentAudio = null;
            }
        };

        // 加载错误
        audio.onerror = () => {
            console.warn('[OnlineTTS] 加载失败');
            _isPlaying = false;
            // 调试：弹出错误信息
            alert('音频加载失败');
            if (currentAudio === audio) {
                currentAudio = null;
            }
        };
    }

    // 停止
    function stop() {
        if (currentAudio) {
            try {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            } catch (e) {}
            currentAudio = null;
        }
        _isPlaying = false;
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
