// js/main.js完整代码
// 程序入口主文件，初始化全部事件与配置
window.addEventListener('load', () => {
    setTimeout(() => {
        // ========== 1. 初始化字号UI ==========
        const fontSizeText = document.getElementById('fontSizeText');
        if(fontSizeText){
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

        // ========== 3. 设置面板逻辑（移到这里，100%确保DOM就绪） ==========
        const settingToggleBtn = document.getElementById('settingToggleBtn');
        const settingPanel = document.getElementById('settingPanel');
        if(settingToggleBtn && settingPanel) {
            settingToggleBtn.addEventListener('click', () => {
                settingPanel.classList.toggle('hidden');
                settingToggleBtn.textContent = settingPanel.classList.contains('hidden') ? '⚙️ 更多设置' : '⚙️ 收起设置';
            });
        }

        // ========== 4. 聚焦输入框 ==========
        const sourceTextEl = document.getElementById('sourceText');
        if(sourceTextEl) sourceTextEl.focus();

    }, 500); // GitHub增加到500ms，确保所有资源100%加载完成
});