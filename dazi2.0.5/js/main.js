// js/main.js完整代码
// 程序全局入口，DOM加载完成后初始化全部逻辑
window.addEventListener('DOMContentLoaded', () => {
    // 初始化字号显示文字
    if(fontSizeText){
        let tip = "标准";
        if (fontScale <= 0.8) tip = "偏小";
        else if (fontScale <= 1.0) tip = "标准";
        else if (fontScale <= 1.2) tip = "偏大";
        else if (fontScale <= 1.4) tip = "很大";
        else tip = "超大";
        fontSizeText.textContent = tip;
    }

    // 绑定输入框打字核心逻辑
    bindInputEvent();
    // 绑定页面全部按钮、弹窗、朗读、主题切换等基础事件
    bindBaseEvents();

    // 页面加载自动聚焦文本输入框
    sourceTextEl.focus();
});