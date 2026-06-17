// 统一回车/切换下一行逻辑
function handleEnterComplete() {
    if (!typingRunning) return;
    const val = inputAreaEl.value.trim();
    const activeChars = entryCharsList[currentEntryIndex];
    const entryLen = activeChars.length;
    // 空白不执行切换
    if(val === '') return;

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
        currentEntryIndex++;
        inputAreaEl.value = '';
        prevInputValue = '';
        const newSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
        if(newSpans[0]) newSpans[0].className='char-current';

        const container = paragraphContainerEl;
        const firstSpan = newSpans[0];
        if(firstSpan){
            const containerRect = container.getBoundingClientRect();
            const spanRect = firstSpan.getBoundingClientRect();
            let offset = containerRect.height / 2;
            if(window.innerWidth <= 768) offset = 20;
            const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - offset;
            container.scrollTo({top: scrollTop, behavior: 'smooth'});
        }
        // 切换后自动重新聚焦输入框，不用重复点
        setTimeout(()=>inputAreaEl.focus(),100);
    }else{
        showFinishModal();
        typingRunning = false;
        inputAreaEl.disabled = true;
        resetBtnEl.disabled = false;
    }
    updateStat();
}

// PC电脑实体回车监听
inputAreaEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        handleEnterComplete();
    }
});

// 【手机端核心修复】软键盘点完成 → 失去焦点触发切换
inputAreaEl.addEventListener('blur', function() {
    handleEnterComplete();
});

// 禁止粘贴
inputAreaEl.addEventListener('paste', function(e) {
    e.preventDefault();
});

// 输入主逻辑不变，只保留原input内文字校验、单词朗读、滚动逻辑
inputAreaEl.addEventListener('input',function(e){
    if(!typingRunning) return;
    const val = this.value;
    const activeChars = entryCharsList[currentEntryIndex];
    const entryLen = activeChars.length;

    // ===== 实时逐键准确率统计 =====
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

    // ===== 空格触发单词朗读 =====
    const valLen = val.length;
    const prevLen = prevInputValue.length;
    if(wordSpeakEnable === 'true' && valLen > prevLen) {
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

    // 更新上一次输入值
    prevInputValue = val;

    // 限制输入长度不超过当前本行字符总数
    if(val.length > entryLen){
        this.value = val.slice(0, entryLen);
        prevInputValue = this.value;
    }

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

    // 错误连击处理
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
            showComboTip('完美15连击🎉',e.clientY-40);
        }else if(comboCount>15){
            createStar(e.clientX,e.clientY);
        }
    }

    // 滚动到当前输入字符（手机自动置顶防遮挡）
    const container = paragraphContainerEl;
    const firstSpan = allSpans[0];
    if(firstSpan){
        const containerRect = container.getBoundingClientRect();
        const spanRect = firstSpan.getBoundingClientRect();
        let offset = containerRect.height / 2;
        if(window.innerWidth <= 768) {
            offset = 20;
        }
        const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - offset;
        container.scrollTo({top: scrollTop, behavior: 'smooth'});
    }

    updateStat();
});
