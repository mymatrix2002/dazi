// js/core/typing-mode.js 修复版

// ========== 全文练习模式 ==========
function runTypingFullMode(text){
    isFullTextMode = true;
    isBilingualMode = true;

    // 统一布局显隐
    displayAreaEl.innerHTML = '';
    displayAreaEl.classList.add('hidden');
    displayAreaEl.style.display = 'none';
    bilingualAreaEl.classList.remove('hidden');
    areaTitleEl.textContent = '全文练习';
    toggleTranslationBtnEl.classList.add('hidden');
    paragraphContainerEl.className = 'paragraph-container one-col';

    const fullLines = parseFullTextLines(text);
    paragraphContainerEl.innerHTML = '';
    entryCharsList = [];
    currentEntryIndex = 0;
    finishedWordSet.clear();
    prevInputValue = '';
    totalInput = 0;
    correctCnt = 0;
    isLastLineEnter = false;
    waitFinalEnter = false;

    // 重构：收集节点 + 构建朗读映射表
    speechSentenceMap = [];
    const allCharSpans = [];

    fullLines.forEach((lineText, idx) => {
        const lineCol = document.createElement('div');
        lineCol.className = 'paragraph-full';
        lineCol.dataset.segmentIndex = idx;
        entryCharsList.push(lineText.split(''));
        const chars = lineText.split('');
        chars.forEach((ch, chIdx) => {
            const span = document.createElement('span');
            // ========== 【修复1】空格字符处理 ==========
            if(ch === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = ch;
            }
            // ========== 【修复2】强制保留空格样式 ==========
            span.style.whiteSpace = 'pre';
            // 光标样式兜底
            span.className = (idx === currentEntryIndex && chIdx === 0) ? 'char-current' : 'char-pending';
            lineCol.appendChild(span);
            allCharSpans.push(span);
        });
        paragraphContainerEl.appendChild(lineCol);
    });

    // 缓存拼接结果，避免重复计算
    const combinedText = fullLines.join(' ').trim();
    targetFullText = combinedText;
    targetChars = targetFullText.split('');

    // 仅非空文本才构建句子映射
    if (combinedText && allCharSpans.length > 0) {
        const sentences = splitSentences(combinedText);
        let currentNodeIndex = 0;
        sentences.forEach(sent => {
            const sentenceText = sent.text;
            const nodeCount = sentenceText.length;
            const start = currentNodeIndex;
            const end = currentNodeIndex + nodeCount - 1;
            const realEnd = Math.min(end, allCharSpans.length - 1);

            speechSentenceMap.push({
                text: sent.text,
                pauseType: sent.pauseType,
                startNode: start,
                endNode: realEnd
            });
            currentNodeIndex = realEnd + 1;
        });
    }

    // 初始化运行状态
    currentPos = 0;
    typingRunning = true;
    comboCount = 0;
    wrongContinuous = 0;
    startTime = Date.now();
    if(timerId) clearInterval(timerId);

    inputAreaEl.disabled = false;
    inputAreaEl.value = '';
    inputAreaEl.focus();
    resetBtnEl.disabled = false;

    timerId = setInterval(updateStat, 1000);
    accuracyEl.textContent = "0%";
    accBar.style.width = "0%";
    updateStat();
    paragraphContainerEl.scrollTop = 0;
    // 自动滚动到练习区标题，确保手机端能看到"全文练习"文字
    setTimeout(() => {
        areaTitleEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 50);
}

// ========== 双语对照练习模式 ==========
function runTypingBilingualMode(text){
    isFullTextMode = false;
    isBilingualMode = true;

    // 统一布局显隐
    displayAreaEl.innerHTML = '';
    displayAreaEl.classList.add('hidden');
    displayAreaEl.style.display = 'none';
    bilingualAreaEl.classList.remove('hidden');
    areaTitleEl.textContent = '中文对照';
    toggleTranslationBtnEl.classList.remove('hidden');
    toggleTranslationBtnEl.textContent = '收起';
    paragraphContainerEl.className = 'paragraph-container two-col';

    const pairs = parseBilingualPairs(text);
    paragraphContainerEl.innerHTML = '';
    entryCharsList = [];
    currentEntryIndex = 0;
    finishedWordSet.clear();
    prevInputValue = '';
    totalInput = 0;
    correctCnt = 0;
    isLastLineEnter = false;
    waitFinalEnter = false;

    // 重构：收集节点 + 构建朗读映射表
    speechSentenceMap = [];
    const allCharSpans = [];

    pairs.forEach((pair, idx) => {
        const cnCol = document.createElement('div');
        cnCol.className = 'paragraph-cn';
        cnCol.textContent = pair.cn || '';
        const enCol = document.createElement('div');
        enCol.className = 'paragraph-en';
        enCol.dataset.segmentIndex = idx;
        entryCharsList.push(pair.en.split(''));
        const chars = pair.en.split('');
        chars.forEach((ch, chIdx) => {
            const span = document.createElement('span');
            // ========== 【修复1】空格字符处理 ==========
            if(ch === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = ch;
            }
            // ========== 【修复2】强制保留空格样式 ==========
            span.style.whiteSpace = 'pre';
            span.className = (idx === currentEntryIndex && chIdx === 0) ? 'char-current' : 'char-pending';
            enCol.appendChild(span);
            allCharSpans.push(span);
        });
        paragraphContainerEl.appendChild(cnCol);
        paragraphContainerEl.appendChild(enCol);
    });

    // 缓存拼接文本，去重计算
    const enCombinedText = pairs.map(p=>p.en).join(' ').trim();
    targetFullText = enCombinedText;
    targetChars = targetFullText.split('');

    // 非空才构建句子映射，防无效数据
    if (enCombinedText && allCharSpans.length > 0) {
        const sentences = splitSentences(enCombinedText);
        let currentNodeIndex = 0;
        sentences.forEach(sent => {
            const sentenceText = sent.text;
            const nodeCount = sentenceText.length;
            const start = currentNodeIndex;
            const end = currentNodeIndex + nodeCount - 1;
            const realEnd = Math.min(end, allCharSpans.length - 1);

            speechSentenceMap.push({
                text: sent.text,
                pauseType: sent.pauseType,
                startNode: start,
                endNode: realEnd
            });
            currentNodeIndex = realEnd + 1;
        });
    }

    // 初始化运行状态
    currentPos = 0;
    typingRunning = true;
    comboCount = 0;
    wrongContinuous = 0;
    startTime = Date.now();
    if(timerId) clearInterval(timerId);

    inputAreaEl.disabled = false;
    inputAreaEl.value = '';
    inputAreaEl.focus();
    resetBtnEl.disabled = false;

    timerId = setInterval(updateStat, 1000);
    accuracyEl.textContent = "0%";
    accBar.style.width = "0%";
    updateStat();
    paragraphContainerEl.scrollTop = 0;
    // 自动滚动到练习区标题，确保手机端能看到"中文对照"文字
    setTimeout(() => {
        areaTitleEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 50);
}