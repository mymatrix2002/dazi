// js/main.js完整代码
// 程序入口主文件，初始化全部事件与配置
// 最顶部增加：兜底所有DOM元素变量，彻底消除未定义错误
let fontSizeText, sourceTextEl, settingToggleBtn, settingPanel, wordSpeakToggleBtn;
window.addEventListener('load', () => {
    setTimeout(() => {
        // ========== 1. 初始化字号UI（直接用config.js已声明的fontSizeText，不要重新声明！） ==========
        if(fontSizeText){  // 直接用，不要加const
            let tip = "标准";
            if (fontScale <= 0.8) tip = "偏小";
            else if (fontScale <= 1.0) tip = "标准";
            else if (fontScale <= 1.2) tip = "偏大";
            else if (fontScale <= 1.4) tip = "很大";
            else tip = "超大";
            fontSizeText.textContent = tip;
        }

        // ========== 2. 绑定核心事件 ==========
        bindInputEvent();
        bindBaseEvents();

        // ========== 3. 设置面板逻辑 ==========
        const settingToggleBtn = document.getElementById('settingToggleBtn');
        const settingPanel = document.getElementById('settingPanel');
        if(settingToggleBtn && settingPanel) {
            settingToggleBtn.addEventListener('click', () => {
                settingPanel.classList.toggle('hidden');
                settingToggleBtn.textContent = settingPanel.classList.contains('hidden') ? '⚙️ 更多设置' : '⚙️ 收起设置';
            });
        }

        // ========== 4. 聚焦输入框（直接用config.js已声明的sourceTextEl） ==========
        if(sourceTextEl) sourceTextEl.focus();

    }, 500);
});