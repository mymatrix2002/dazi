// js/core/typing-input.js 最终版（无回车绑定）

// ========== 输入框核心逻辑 ==========
function bindInputEvent() {
    // 禁止粘贴
    inputAreaEl.addEventListener('paste', function(e) {
        e.preventDefault();
    });

    // 输入监听（回车逻辑已移至main.js，此处只处理打字逻辑）
    inputAreaEl.addEventListener('input',function(e){
        if(!typingRunning) return;
        const val = this.value;
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
                    speechSynthesis.cancel();
                    const utter = createUtterance(targetWord, speechState.rate);
                    speechSynthesis.speak(utter);
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
          const container = document.querySelector('.paragraph-container');
          if (!container || !span) return;
          const containerRect = container.getBoundingClientRect();
          const spanRect = span.getBoundingClientRect();

          let offset = containerRect.height / 2;
          if(window.innerWidth <= 768) {
              offset = 20;
          }
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

// 兼容保留，不主动调用
window.doHandleTypingEnter = function() {
    if (!typingRunning) return;
    const val = inputAreaEl.value;
    const activeChars = entryCharsList[currentEntryIndex];
    const entryLen = activeChars.length;

    if(wordSpeakEnable === 'true' && !(currentEntryIndex === entryCharsList.length - 1 && isLastLineEnter)) {
        if(val.trim() !== ''){
            const currentLineText = entryCharsList[currentEntryIndex].join('');
            if(/[a-zA-Z]/.test(currentLineText)) {
                speechSynthesis.cancel();
                const utter = createUtterance(currentLineText, speechState.rate);
                speechSynthesis.speak(utter);
            }
        }
    }

    if(!finishedWordSet.has(currentEntryIndex)){
        finishedWordSet.add(currentEntryIndex);
        currentPos += entryLen;
    }
    
    const currentSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
    currentSpans.forEach(s => {
        if (s.classList.contains('char-correct') || s.classList.contains('char-wrong')) {
            s.classList.add('char-done');
        }
        s.classList.remove('char-current');
    });

    if(currentEntryIndex < entryCharsList.length - 1){
        currentEntryIndex++;
        inputAreaEl.value = '';
        prevInputValue = '';
        inputAreaEl.placeholder = "在这里打字...";
        const newSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
        if(newSpans[0]) newSpans[0].className='char-current';
        const container = paragraphContainerEl;
        const firstSpan = newSpans[0];
        if(firstSpan){
            const containerRect = container.getBoundingClientRect();
            const spanRect = firstSpan.getBoundingClientRect();
            const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - containerRect.height / 2;
            container.scrollTo({top: scrollTop, behavior: 'smooth'});
        }
    } else {
        if(!isLastLineEnter){
            isLastLineEnter = true;
            waitFinalEnter = true;
            inputAreaEl.value = '';
            prevInputValue = '';
            currentPos = targetChars.length;
            clearInterval(timerId);
            inputAreaEl.placeholder = "已完成全部输入，请再次按下回车查看成绩";
        } else {
            speechSynthesis.cancel();
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