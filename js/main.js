window.addEventListener('load', () => {
    setTimeout(() => {
        console.log('=== main.js 初始化完成 ===');

        // 1. 初始化字号UI
        if(fontSizeText){
            let tip = "标准";
            if (fontScale <= 0.8) tip = "偏小";
            else if (fontScale <= 1.0) tip = "标准";
            else if (fontScale <= 1.2) tip = "偏大";
            else if (fontScale <= 1.4) tip = "很大";
            else tip = "超大";
            fontSizeText.textContent = tip;
        }

        // 2. 绑定核心事件
        bindInputEvent();
        bindBaseEvents();

        // ========== 回车事件绑定（加调试日志，先去掉所有条件判断） ==========
        const inputArea = document.getElementById('inputArea');
        console.log('获取到的输入框元素：', inputArea);
        
        if(inputArea) {
            console.log('开始绑定回车事件');
            inputArea.addEventListener('keydown', function(e){
                console.log('按键按下：', e.key, 'keyCode:', e.keyCode, 'code:', e.code);
                
                // 【重点：先不判断typingRunning，只要按回车就打日志】
                if(e.key === 'Enter' || e.keyCode === 13 || e.code === 'Enter'){
                    console.log('========== 回车触发了！==========');
                    console.log('当前 typingRunning 状态：', typingRunning);
                    e.preventDefault();
                    
                    // 先不执行逻辑，先看日志能不能打印出来
                    alert('回车按到了！');
                }
            });
        } else {
            console.log('❌ 没找到输入框元素！');
        }

        // 在main.js的回车事件后面，再加这个兼容方案
        if(inputArea) {
            inputArea.addEventListener('input', function(e){
                const val = this.value;
                // 检测输入内容中有没有换行符
                if(val.includes('\n') || val.includes('\r')) {
                    console.log('检测到输入内容有换行，执行回车逻辑');
                    this.value = val.replace(/[\n\r]/g, ''); // 删除换行符
                    
                    // 在这里执行回车切换行逻辑
                    if (!typingRunning) return;
                    
                    // ...完整回车逻辑
                }
            });
        }
        
        // 3. 设置面板逻辑
        const settingToggleBtn = document.getElementById('settingToggleBtn');
        const settingPanel = document.getElementById('settingPanel');
        if(settingToggleBtn && settingPanel) {
            settingToggleBtn.addEventListener('click', () => {
                settingPanel.classList.toggle('hidden');
                settingToggleBtn.textContent = settingPanel.classList.contains('hidden') ? '⚙️ 更多设置' : '⚙️ 收起设置';
            });
        }

        // 4. 聚焦输入框
        if(sourceTextEl) sourceTextEl.focus();

    }, 500);
});