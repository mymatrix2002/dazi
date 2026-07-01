// js/core/typing-input.js 完整代码（在线语音版：单词+行自动朗读，中文模式 + 数字智能识别 + 朗读模式适配）
// ========== 全局语音API兜底：彻底杜绝ReferenceError ==========
if (!window.speechSynthesis) window.speechSynthesis = null;
if (!window.SpeechSynthesisUtterance) window.SpeechSynthesisUtterance = null;
if (!window.onlineTTS) window.onlineTTS = null;
// ========== 自动朗读去重标记 ==========
if (typeof lastSpokenLineIndex === 'undefined') var lastSpokenLineIndex = -1;
if (typeof finishModalAutoShown === 'undefined') var finishModalAutoShown = false;
// ========== 获取当前朗读模式 ==========
function getReadMode() {
    return localStorage.getItem('readMode') || 'english';
}
// ========== 工具：提取纯英文（用于行朗读）==========
function getPureEnglishForLine(text) {
    if (!text) return '';
    // 改用智能提取：中文行整行跳过，包括中文里的数字
    return extractEnglishSmart(text);
}
// ========== 工具：停止所有语音（在线+系统）==========
function stopAllSpeech() {
    if(window.onlineTTS) {
        try {
            window.onlineTTS.stop();
        } catch(e) {}
    }
    if(window.speechSynthesis) {
        try {
            window.speechSynthesis.cancel();
        } catch(e) {}
    }
}
// ========== 工具：朗读文本（根据用户选择切换引擎 + 智能数字识别）==========
function speakText(text, lang) {
    if (!text || !text.trim()) return;
    
    const mode = getReadMode();
    
    // 根据朗读模式决定数字转换方式
    if (mode === 'english') {
        // 只读英文模式：所有数字转成英文单词
        text = replaceDigitsToEnglish(text);
    } else {
        // 中英文都读模式：数字智能识别
        text = replaceDigitsSmart(text);
    }
    
    // 先停止之前的
    stopAllSpeech();
    
    // 根据用户选择决定用哪个语音引擎
    if(window.isUsingOnlineVoice && window.isUsingOnlineVoice()) {
        // ===== 在线语音 =====
        if(window.onlineTTS) {
            try {
                window.onlineTTS.speak(
                    text,
                    lang || 'zh',  // 中文模式，支持中英文混合，人名更准
                    speechState.rate,
                    speechState.volume,
                    null, // 结束回调（不需要）
                    null  // 错误回调（静默失败）
                );
                return;
            } catch(e) {
                // 在线语音失败，静默
            }
        }
    } else {
        // ===== 系统语音 =====
        if(window.speechSynthesis && window.SpeechSynthesisUtterance) {
            try {
                const utter = window.createUtterance(text, speechState.rate);
                if(utter) window.speechSynthesis.speak(utter);
            } catch(e) {}
        }
    }
}
// ========== 【关键修复1】函数挂载提前到文件最顶部 ==========
window.doHandleTypingEnter = function() {
    if (!typingRunning) return;
    const val = inputAreaEl.value;
    const activeChars = entryCharsList[currentEntryIndex];
    const entryLen = activeChars.length;
    // 标记本行完成
    if(!finishedWordSet.has(currentEntryIndex)){
        finishedWordSet.add(currentEntryIndex);
        currentPos += entryLen;
    }
    
    // 渲染本行完成样式
    // ========== 修复：只选择 .char-span，排除说话人前缀 ==========
    const currentSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] .char-span`);
    currentSpans.forEach(s => {
        if (s.classList.contains('char-correct') || s.classList.contains('char-wrong')) {
            s.classList.add('char-done');
        }
        s.classList.remove('char-current');
    });
    if(currentEntryIndex < entryCharsList.length - 1){
        // 切换下一行
        currentEntryIndex++;
        inputAreaEl.value = '';
        prevInputValue = '';  // ← 必须加上！否则下一行输入统计会出错
        inputAreaEl.placeholder = "在这里打字...";
        // ========== 修复：只选择 .char-span，排除说话人前缀 ==========
        const newSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] .char-span`);
        // ========== 修复：保留 char-span 类，避免被覆盖 ==========
        if(newSpans[0]) newSpans[0].className = 'char-span char-current';
        // 虚拟键盘高亮更新
        if(window.virtualKeyboard && window.virtualKeyboard.isEnabled()) {
            const nextChars = entryCharsList[currentEntryIndex];
            if(nextChars && nextChars.length > 0) {
                window.virtualKeyboard.updateHighlight(nextChars[0]);
            }
        }
        const container = paragraphContainerEl;
        const firstSpan = newSpans[0];
        if(firstSpan){
            const containerRect = container.getBoundingClientRect();
            const spanRect = firstSpan.getBoundingClientRect();
            
            if(window.innerWidth > 768) {
                // 电脑端：滚动到中间，平滑动画
                const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - containerRect.height / 2;
                container.scrollTo({top: scrollTop, behavior: 'smooth'});
            } else {
                // 手机端：滚动到新行顶部，瞬间到位
                const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - 20;
                container.scrollTop = scrollTop;
            }
        }
    } else {  // 最后一行：按回车不做任何事（已经自动弹窗了）
        // 防止误按回车重复弹窗
        if(finishModalAutoShown) {
            return;
        }
    }
    updateStat();
}
// ========== 输入框核心逻辑 ==========
function bindInputEvent() {
    // 禁止粘贴
    inputAreaEl.addEventListener('paste', function(e) {
        e.preventDefault();
    });
    // 电脑键盘回车监听
    inputAreaEl.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.keyCode === 13 || e.code === 'Enter'){
            e.preventDefault();
            if(window.doHandleTypingEnter) {
                window.doHandleTypingEnter();
            } else {
                setTimeout(() => window.doHandleTypingEnter(), 100);
            }
        }
    });
    // 主输入监听（整合移动端换行兼容）
    inputAreaEl.addEventListener('input',function(e){
        const val = this.value;
        // 【手机软键盘回车兼容】
        if(val.includes('\n') || val.includes('\r')) {
            this.value = val.replace(/[\n\r]/g, '');
            prevInputValue = '';
            // 增加运行状态判断，避免误触发
            if(typingRunning && window.doHandleTypingEnter) {
                window.doHandleTypingEnter();
            }
            return;
        }
        if(!typingRunning) return;
        const activeChars = entryCharsList[currentEntryIndex];
        const entryLen = activeChars.length;
        // 统计有效击键，过滤换行符
        if(val.length > prevInputValue.length) {
            const startIdx = prevInputValue.length;
            const endIdx = val.length;
            for(let i = startIdx; i < endIdx; i++) {
                const char = val[i];
                if(char === '\n' || char === '\r') continue;
                if(i >= entryLen) break;
                totalInput++;
                if(char === activeChars[i]) {
                    correctCnt++;
                    playKeySound();
                    // 虚拟键盘正确反馈
                    if(window.virtualKeyboard && window.virtualKeyboard.isEnabled()) {
                        window.virtualKeyboard.setFeedback(true);
                    }
                }else{
                    playErrorSound();
                    // 虚拟键盘错误反馈
                    if(window.virtualKeyboard && window.virtualKeyboard.isEnabled()) {
                        window.virtualKeyboard.setFeedback(false);
                    }
                }
            }
        }
        
        // ========== 自动触发单词朗读（输到空格前最后一个字符时）==========
        if(wordSpeakEnable === 'true' && val.length > prevInputValue.length) {
            // 下一个字符是空格，说明这个单词刚输完
            if(val.length < entryLen && activeChars[val.length] === ' ') {
                // 往前找到单词开头
                let wordStart = val.length - 1;
                while(wordStart >= 0 && activeChars[wordStart] !== ' ') {
                    wordStart--;
                }
                wordStart++;
                const targetWord = activeChars.slice(wordStart, val.length).join('');
                
                if(/^[a-zA-Z'-]+$/.test(targetWord) && targetWord.length > 0) {
                    speakText(targetWord, 'zh'); // 中文模式
                }
            }
        }
        
        // ========== 自动触发行朗读（输完整行最后一个字符时）==========
        if(wordSpeakEnable === 'true' && val.length === entryLen) {
            const currentLineText = activeChars.join('');
            const mode = getReadMode();
            
            let lineSpeakText;
            if (mode === 'english') {
                // 只读英文模式：智能提取英文 + 数字转英文
                lineSpeakText = extractEnglishSmart(currentLineText);
                lineSpeakText = replaceDigitsToEnglish(lineSpeakText);
            } else {
                // 中英文都读模式：保留全部 + 数字智能识别
                lineSpeakText = replaceDigitsSmart(currentLineText);
            }
            
            if(lineSpeakText && lineSpeakText.trim()) {
                speakText(lineSpeakText, 'zh'); // 中文模式
            }
        }
        
        // ========== 最后一行输完自动弹出成绩弹窗 ==========
        if(val.length === entryLen && currentEntryIndex === entryCharsList.length - 1 && !finishModalAutoShown) {
            finishModalAutoShown = true;
            // 延迟500ms，让用户看到最后一个字符变绿
            setTimeout(() => {
                stopAllSpeech();
                currentPos = targetChars.length;
                clearInterval(timerId);
                showFinishModal();
                typingRunning = false;
                inputAreaEl.disabled = true;
                resetBtnEl.disabled = false;
            }, 500);
        }
        
        prevInputValue = val;
        // 限制输入长度
        if(val.length > entryLen){
            this.value = val.slice(0, entryLen);
            prevInputValue = this.value;
            return;
        }
        // 逐字符样式渲染
        // 1. 全局清除所有行的光标，彻底杜绝光标跑到其他行
        paragraphContainerEl.querySelectorAll('.char-current').forEach(el => {
            el.classList.remove('char-current');
        });
        // ========== 修复：只选择 .char-span，排除说话人前缀 ==========
        const allSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] .char-span`);
        // ========== 修复：保留 char-span 类，避免被覆盖 ==========
        allSpans.forEach(s => s.className = 'char-span char-pending');
        let hasError = false;
        let currentSpan = null;
        for(let i=0;i<val.length;i++){
            const span = allSpans[i];
            if(val[i] === activeChars[i]){
                // ========== 修复：保留 char-span 类 ==========
                span.className = 'char-span char-correct';
            }else{
                // ========== 修复：保留 char-span 类 ==========
                span.className = 'char-span char-wrong';
                hasError = true;
            }
        }
        // 2. 只有未输满时，才显示光标；输满后光标消失，等待回车
        if(val.length < entryLen){
            // ========== 修复：保留 char-span 类 ==========
            allSpans[val.length].className = 'char-span char-current';
            currentSpan = allSpans[val.length];
        } 
        
        // ========== 虚拟键盘高亮联动 ==========
        if(window.virtualKeyboard && window.virtualKeyboard.isEnabled()) {
            if(val.length < entryLen) {
                // 还有字符要输，高亮下一个字符
                window.virtualKeyboard.updateHighlight(activeChars[val.length]);
            } else {
                // 已经输满，高亮回车键
                window.virtualKeyboard.updateHighlight('\n');
            }
        }
        // 触屏坐标
        let posX = e.clientX || window.innerWidth / 2;
        let posY = e.clientY || window.innerHeight / 2;
        // 错误/连击逻辑
        if(hasError){
            comboCount = 0;
            revokeLastSticker();
            wrongContinuous++;
            if(wrongContinuous>=3){
                showErrorHint('放慢速度，仔细看清字符再输入😊');
                wrongContinuous=0;
            }
        }else{
            wrongContinuous = 0;
            comboCount++;
            if(comboCount===5){
                unlockSticker(0);
                batchStar(posX, posY, 3);
                showComboTip('5连击！很棒', posX, posY-40);
            }else if(comboCount===10){
                unlockSticker(1);
                batchStar(posX, posY, 5);
                showComboTip('10连击太厉害了！', posX, posY-40);
            }else if(comboCount===15){
                unlockSticker(2);
                batchStar(posX, posY, 7);
                showComboTip('完美15连击🎉', posX, posY-40);
            }else if(comboCount>15){
                createStar(posX, posY);
            }
        }
        // 滚动定位
        function scrollToCurrentChar(span) {
          const container = document.querySelector('.paragraph-container');
          if (!container || !span) return;
          
          const containerRect = container.getBoundingClientRect();
          const spanRect = span.getBoundingClientRect();
          const containerHeight = containerRect.height;
          const spanTop = spanRect.top - containerRect.top;
          const spanBottom = spanRect.bottom - containerRect.top;
          
          // ========== 电脑端：光标始终在视口中间，平滑滚动 ==========
          if(window.innerWidth > 768) {
              const offset = containerHeight / 2;
              const scrollTop = container.scrollTop + spanTop - offset;
              container.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
              });
              return;
          }
          
          // ========== 手机端：只有光标超出视口才滚动，避免频繁跳动 ==========
          const visibleTop = 10; // 顶部留10px余量
          const visibleBottom = containerHeight * 0.3; // 光标超过视口1/3时才滚动
          
          if(spanTop < visibleTop) {
              // 光标跑到上面了，滚动到视口顶部
              const scrollTop = container.scrollTop + spanTop - visibleTop;
              container.scrollTop = scrollTop;
          } else if(spanBottom > visibleBottom) {
              // 光标跑到下面了，滚动到让光标在视口1/3处
              const scrollTop = container.scrollTop + spanBottom - visibleBottom;
              container.scrollTop = scrollTop;
          }
          // 光标在可视范围内，不滚动，避免跳动
        }
        scrollToCurrentChar(currentSpan);
        updateStat();
    });
}
