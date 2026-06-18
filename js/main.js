// js/main.js完整代码
// 程序入口主文件，初始化全部事件与配置
window.addEventListener('load', () => {
    // 等待所有资源加载完成，再初始化
    setTimeout(() => {
        // 初始化字号UI提示（config已执行变量初始化，此处仅同步UI）
        if(fontSizeText){
            let tip = "标准";
            if (fontScale <= 0.8) tip = "偏小";
            else if (fontScale <= 1.0) tip = "标准";
            else if (fontScale <= 1.2) tip = "偏大";
            else if (fontScale <= 1.4) tip = "很大";
            else tip = "超大";
            fontSizeText.textContent = tip;
        }

        // 绑定输入框打字核心事件
        bindInputEvent();
        // 绑定页面全部基础事件（主题、朗读、按钮、弹窗等）
        bindBaseEvents();

        // 页面加载完成自动聚焦文本输入框
        sourceTextEl.focus();
    }, 300);
});