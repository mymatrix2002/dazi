// 用在线语音播放整段（通过 Cloudflare Workers 代理）
if(window.onlineTTS) {
    window.onlineTTS.speak(txt, 'en', speechState.rate, speechState.volume);
} else {
    alert('语音模块加载失败');
}
