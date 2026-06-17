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

        // 统计有效击键，过滤换行符，回车不触发按键/错误音效
        if(val.length > prevInputValue.length) {
            const startIdx = prevInputValue.length;
            const endIdx = val.length;
            for(let i = startIdx; i < endIdx; i++) {
                const char = val[i];
                // 换行/回车符直接跳过，不统计、不播放任何音效
                if(char === '\n' || char === '\r') continue;
                if(i >= entryLen) break;
                totalInput++;
                if(char === activeChars[i]) {
                    correctCnt++;
                    playKeySound(); // 正确按键音效
                }else{
                    playErrorSound(); // 输错警示音效
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
            // 换行前置同步，避免换行字符再次进入上层音效循环
            prevInputValue = val;

            // 回车朗读逻辑
            if(wordSpeakEnable === 'true' && !(currentEntryIndex === entryCharsList.length - 1 && isLastLineEnter)) {
                // 新增判断：输入框当前有输入内容才朗读，空输入直接跳过
                if(val.trim() !== ''){
                    const currentLineText = entryCharsList[currentEntryIndex].join('');
                    if(/[a-zA-Z]/.test(currentLineText)) {
                        speechSynthesis.cancel();
                        const utter = createUtterance(currentLineText, speechState.rate);
                        speechSynthesis.speak(utter);
                    }
                }
            }

            // 隐患优化：仅首次换行标记完成行，避免重复add、重复累加字符长度
            if(!finishedWordSet.has(currentEntryIndex)){
                finishedWordSet.add(currentEntryIndex);
                currentPos += entryLen; // 仅首次换行累加行长度
            }
            
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
                // 切回普通行，恢复原始占位
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
                // 已到最后一行
                if(!isLastLineEnter){
                    // 第一次回车
                    isLastLineEnter = true;
                    waitFinalEnter = true;
                    this.value = '';
                    prevInputValue = '';
                    currentPos = targetChars.length;
                    // 新增：暂停计时，用时不再上涨
                    clearInterval(timerId);
                    // 新增：修改输入框提示文字，提醒二次回车
                    inputAreaEl.placeholder = "已完成全部输入，请再次按下回车查看成绩";
                    updateStat();
                } else {
                    // 第二次回车：结束练习，阻断所有按键/错误音效
                    speechSynthesis.cancel();
                    waitFinalEnter = false;
                    // 恢复默认占位文字
                    inputAreaEl.placeholder = "在这里打字...";
                    // 无任何playKeySound / playErrorSound调用
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

        // ========== 兼容触屏设备：获取坐标 ==========
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

        // 仅普通输入时滚动，换行不再重复滚动，解决移动端抖动
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