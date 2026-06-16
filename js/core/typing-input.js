// ========== 输入框核心逻辑 ==========
function bindInputEvent() {
    // 禁止粘贴
    inputAreaEl.addEventListener('paste', function(e) {
        e.preventDefault();
    });

    // 输入监听
    inputAreaEl.addEventListener('input',function(e){
        if(!typingRunning) return;
        const val = this.value;
        const activeChars = entryCharsList[currentEntryIndex];
        const entryLen = activeChars.length;

        // 统计有效击键
        if(val.length > prevInputValue.length) {
            const startIdx = prevInputValue.length;
            const endIdx = val.length;
            for(let i = startIdx; i < endIdx; i++) {
                if(i >= entryLen) break;
                totalInput++;
                if(val[i] === activeChars[i]) {
                    correctCnt++;
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

        // 换行切换行
        if(e.inputType === 'insertLineBreak' || val.includes('\n')){
            // 仅最后一行第一次回车执行朗读，第二次跳过（移除延迟，适配手机浏览器）
            if(wordSpeakEnable === 'true' && !(currentEntryIndex === entryCharsList.length - 1 && isLastLineEnter)) {
                const currentLineText = entryCharsList[currentEntryIndex].join('');
                if(/[a-zA-Z]/.test(currentLineText)) {
                    speechSynthesis.cancel();
                    const utter = createUtterance(currentLineText, speechState.rate);
                    speechSynthesis.speak(utter);
                }
            }

            if(!finishedWordSet.has(currentEntryIndex)){
                finishedWordSet.add(currentEntryIndex);
            }
            currentPos += entryLen;
            const currentSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
            currentSpans.forEach(s => {
                if (s.classList.contains('char-correct') || s.classList.contains('char-wrong')) {
                    s.classList.add('char-done');
                }
                s.classList.remove('char-current');
            });

            if(currentEntryIndex < entryCharsList.length - 1){
                // 还有下一行，正常切换行
                currentEntryIndex++;
                this.value = '';
                prevInputValue = '';
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
                // 已到最后一行
                if(!isLastLineEnter){
                    // 第一次回车
                    isLastLineEnter = true;
                    waitFinalEnter = true;
                    this.value = '';
                    prevInputValue = '';
                } else {
                    // 第二次回车：结束练习
                    speechSynthesis.cancel();
                    waitFinalEnter = false;
                    showFinishModal();
                    typingRunning = false;
                    inputAreaEl.disabled = true;
                    resetBtnEl.disabled = false;
                }
            }
            updateStat();
            return;
        }

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
        }

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
                batchStar(e.clientX,e.clientY,3);
                showComboTip('5连击！很棒',e.clientX,e.clientY-40);
            }else if(comboCount===10){
                unlockSticker(1);
                batchStar(e.clientX,e.clientY,5);
                showComboTip('10连击太厉害了！',e.clientX,e.clientY-40);
            }else if(comboCount===15){
                unlockSticker(2);
                batchStar(e.clientX,e.clientY,7);
                showComboTip('完美15连击🎉',e.clientX,e.clientY-40);
            }else if(comboCount>15){
                createStar(e.clientX,e.clientY);
            }
        }

        // 自动滚动
        const container = paragraphContainerEl;
        const firstSpan = allSpans[0];
        if(firstSpan){
            const containerRect = container.getBoundingClientRect();
            const spanRect = firstSpan.getBoundingClientRect();
            const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - containerRect.height / 2;
            container.scrollTo({top: scrollTop, behavior: 'smooth'});
        }
        updateStat();
    });
}