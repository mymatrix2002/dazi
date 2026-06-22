// js/main.js 完整代码
window.addEventListener('load', () => {
    setTimeout(() => {
        if(fontSizeText){
            let tip = "标准";
            if (fontScale <= 0.8) tip = "偏小";
            else if (fontScale <= 1.0) tip = "标准";
            else if (fontScale <= 1.2) tip = "偏大";
            else if (fontScale <= 1.4) tip = "很大";
            else tip = "超大";
            fontSizeText.textContent = tip;
        }
        bindInputEvent();
        bindBaseEvents();
        
        // 【新增】设置面板逻辑移到这里，确保DOM就绪
        const settingToggleBtn = document.getElementById('settingToggleBtn');
        const settingPanel = document.getElementById('settingPanel');
        if(settingToggleBtn && settingPanel) {
            settingToggleBtn.addEventListener('click', () => {
                settingPanel.classList.toggle('hidden');
                settingToggleBtn.textContent = settingPanel.classList.contains('hidden') ? '⚙️ 更多设置' : '⚙️ 收起设置';
            });
        }
        
        // ========== 新增：初始化虚拟键盘 ==========
        if(window.virtualKeyboard) {
            window.virtualKeyboard.init();
        }
        
        sourceTextEl.focus();
    }, 500);
});