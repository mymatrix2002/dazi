// js/core/typing-input.js v2.0.6 修复版

// ========== 【关键修复1】函数挂载提前到文件最顶部 ==========
window.doHandleTypingEnter = function() {
    if (!typingRunning) return;
    const val = inputAreaEl.value;
    const activeChars = entryCharsList[currentEntryIndex];
    const entryLen = activeChars.length;

        // 朗读当前行文本
        if(wordSpeakEnable === 'true' && !(currentEntryIndex === entryCharsList.length - 1 && isLastLineEnter)) {
            if(val.trim() !== ''){
                const currentLineText = entryCharsList[currentEntryIndex].join('');
                // 合并语音API存在性判断，统一用window.前缀访问，彻底规避引用错误
                if(/[a-zA-Z]/.test(currentLineText) && window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined') {
                    window.speechSynthesis.cancel();
                    const utter = createUtterance(currentLineText, speechState.rate);
                    window.speechSynthesis.speak(utter);
                }
            }
        }

    // 标记本行完成
    if(!finishedWordSet.has(currentEntryIndex)){
        finishedWordSet.add(currentEntryIndex);
        currentPos += entryLen;
    }
    
    // 渲染本行完成样式
    const currentSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
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
        prevInputValue = '';
        inputAreaEl.placeholder = "在这里打字...";
        const newSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
        if(newSpans[0]) newSpans[0].className='char-current';
        const container = paragraphContainerEl;
        const firstSpan = newSpans[0];
        if(firstSpan){
            // 仅电脑端执行切换行滚动，手机端保持界面不动
            if(window.innerWidth > 768) {
                const containerRect = container.getBoundingClientRect();
                const spanRect = firstSpan.getBoundingClientRect();
                const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - containerRect.height / 2;
                container.scrollTo({top: scrollTop, behavior: 'smooth'});
            }
        }
    } else {  // ← 正确：这个else跟if(currentEntryIndex < ...)配对
        // 最后一行逻辑
        if(!isLastLineEnter){
            isLastLineEnter = true;
            waitFinalEnter = true;
            inputAreaEl.value = '';
            prevInputValue = '';
            currentPos = targetChars.length;
            clearInterval(timerId);
            inputAreaEl.placeholder = "已完成全部输入，请再次按下回车查看成绩";
        } else {
            // 这里加判断
            if(window.speechSynthesis) window.speechSynthesis.cancel();
            waitFinalEnter = false;
            inputAreaEl.placeholder = "在这里打字...";
            showFinishModal();
            typingRunning = false;
            inputAreaEl.disabled = true;
            resetBtnEl.disabled = false;
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
                }else{
                    playErrorSound();
                }
            }
        }

        // 空格触发单词朗读
        if(wordSpeakEnable === 'true' && val.length > prevInputValue.length) {
            const lastChar = val.slice(-1);
            if(lastChar === ' ' || lastChar === '　') {
                const currentInput = val.trim();
                const wordList = currentInput.split(/\s+/);
                const targetWord = wordList[wordList.length - 1];
                if(/^[a-zA-Z'-]+$/.test(targetWord) && targetWord.length > 0) {
                    // 新增全局对象判断
                    if(window.speechSynthesis){
                        speechSynthesis.cancel();
                        const utter = createUtterance(targetWord, speechState.rate);
                        speechSynthesis.speak(utter);
                    }
                }
            }
        }

        prevInputValue = val;

        // 限制输入长度
        if(val.length > entryLen){
            this.value = val.slice(0, entryLen);
            prevInputValue = this.value;
            return;
        }

        // 逐字符样式渲染
        const allSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
        allSpans.forEach(s=>s.className='char-pending');
        let hasError = false;
        let currentSpan = null;

        for(let i=0;i<val.length;i++){
            const span = allSpans[i];
            if(val[i] === activeChars[i]){
                span.className = 'char-correct';
            }else{
                span.className = 'char-wrong';
                hasError = true;
            }
        }

        if(val.length < entryLen){
            allSpans[val.length].className = 'char-current';
            currentSpan = allSpans[val.length];
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
            wrongContinuous=0;
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
          // ========== 手机端禁用对照区自动滚动 ==========
          if(window.innerWidth <= 768) {
              return; // 移动端直接返回，对照区滚动条完全不动
          }
          
          const container = document.querySelector('.paragraph-container');
          if (!container || !span) return;
          const containerRect = container.getBoundingClientRect();
          const spanRect = span.getBoundingClientRect();
          let offset = containerRect.height / 2;
          const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - offset;
          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        }

        scrollToCurrentChar(currentSpan);

        updateStat();
    });
}