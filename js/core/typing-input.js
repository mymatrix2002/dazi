// ========== 输入框事件：禁止粘贴 + 实时逐键准确率 ==========
// 拦截粘贴，禁止输入框粘贴
inputAreaEl.addEventListener('paste', function(e) {
    e.preventDefault();
});

// 输入核心逻辑（实时逐键准确率 + 全兼容空格朗读）
inputAreaEl.addEventListener('input',function(e){
    if(!typingRunning) return;
    const val = this.value;
    const activeChars = entryCharsList[currentEntryIndex];
    const entryLen = activeChars.length;
    // ===== 实时逐键准确率统计 =====
    // 仅新增字符时统计，退格删除不扣分
    if(val.length > prevInputValue.length) {
        const startIdx = prevInputValue.length;
        const endIdx = val.length;
        for(let i = startIdx; i < endIdx; i++) {
            // 超出本行长度的截断字符不计入统计
            if(i >= entryLen) break;
            totalInput++;
            if(val[i] === activeChars[i]) {
                correctCnt++;
            }
        }
    }
    // ===== 空格触发单词朗读（内容对比法，兼容所有输入法） =====
    const valLen = val.length;
    const prevLen = prevInputValue.length;
    if(wordSpeakEnable === 'true' && valLen > prevLen) {
        const lastChar = val.slice(-1);
        // 最后一个字符是空格（半角/全角空格都识别）
        if(lastChar === ' ' || lastChar === '　') {
            const currentInput = val.trim();
            const wordList = currentInput.split(/\s+/);
            const targetWord = wordList[wordList.length - 1];
            // 仅纯英文单词（含缩写'、连字符-）才朗读，过滤数字、符号、中文
            if(/^[a-zA-Z'-]+$/.test(targetWord) && targetWord.length > 0) {
                // 打断当前正在播放的语音，避免堆积
                speechSynthesis.cancel();
                const utter = createUtterance(targetWord, speechState.rate);
                speechSynthesis.speak(utter);
            }
        }
    }
    // 更新上一次输入值
    prevInputValue = val;
    // 换行进入下一行
    if(e.inputType === 'insertLineBreak' || val.includes('\n')){
        // 标记该行已完成，用于统计行数
        if(!finishedWordSet.has(currentEntryIndex)){
            finishedWordSet.add(currentEntryIndex);
        }
        // 进度累加，仅统计本行原文长度
        currentPos += entryLen;
        const currentSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
        currentSpans.forEach(s => {
            if (s.classList.contains('char-correct') || s.classList.contains('char-wrong')) {
                s.classList.add('char-done');
            }
            s.classList.remove('char-current');
        });
        if(currentEntryIndex < entryCharsList.length -1){
            currentEntryIndex++;
            this.value = '';
            // 换行后重置输入缓存
            prevInputValue = '';
            const newSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
            if(newSpans[0]) newSpans[0].className='char-current';
            const container = paragraphContainerEl;
            const firstSpan = newSpans[0];
            if(firstSpan){
                const containerRect = container.getBoundingClientRect();
                const spanRect = firstSpan.getBoundingClientRect();
                let offset = containerRect.height / 2;
                // 手机屏幕自动改为顶部偏移，避免软键盘遮挡光标
                if(window.innerWidth <= 768) {
                    offset = 20;
                }
                const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - offset;
                container.scrollTo({top: scrollTop, behavior: 'smooth'});
            }
        }else{
            showFinishModal();
            typingRunning=false;
            inputAreaEl.disabled=true;
            resetBtnEl.disabled=false;
        }
        updateStat();
        return;
    }
    // 限制输入长度不超过当前单词字符数
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
        // 连击解锁贴纸动画
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
    const container = paragraphContainerEl;
    const firstSpan = allSpans[0];
    if(firstSpan){
        const containerRect = container.getBoundingClientRect();
        const spanRect = firstSpan.getBoundingClientRect();
        let offset = containerRect.height / 2;
        // 手机屏幕自动改为顶部偏移，避免软键盘遮挡光标
        if(window.innerWidth <= 768) {
            offset = 20;
        }
        const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - offset;
        container.scrollTo({top: scrollTop, behavior: 'smooth'});
    }
    updateStat();
});

// 新增：手机软键盘回车键兼容兜底（解决移动端回车无响应）
inputAreaEl.addEventListener('keydown', function(e) {
    // 识别手机/电脑回车键
    if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        if (!typingRunning) return;
        const val = this.value;
        const activeChars = entryCharsList[currentEntryIndex];
        const entryLen = activeChars.length;
        // 标记本行完成
        if(!finishedWordSet.has(currentEntryIndex)){
            finishedWordSet.add(currentEntryIndex);
        }
        currentPos += entryLen;
        // 全部字符标为已完成
        const currentSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
        currentSpans.forEach(s => {
            if (s.classList.contains('char-correct') || s.classList.contains('char-wrong')) {
                s.classList.add('char-done');
            }
            s.classList.remove('char-current');
        });
        // 切换下一段 / 结束练习
        if(currentEntryIndex < entryCharsList.length - 1){
            currentEntryIndex++;
            this.value = '';
            prevInputValue = '';
            const newSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
            if(newSpans[0]) newSpans[0].className='char-current';
            // 滚动适配手机置顶
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
        }else{
            showFinishModal();
            typingRunning = false;
            inputAreaEl.disabled = true;
            resetBtnEl.disabled = false;
        }
        updateStat();
    }
});
