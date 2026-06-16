// ========== 全文练习模式 ==========
function runTypingFullMode(text){
    isFullTextMode = true;
    isBilingualMode = true;
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

    fullLines.forEach((lineText, idx) => {
        const lineCol = document.createElement('div');
        lineCol.className = 'paragraph-full';
        lineCol.dataset.segmentIndex = idx;
        entryCharsList.push(lineText.split(''));
        const chars = lineText.split('');
        chars.forEach((ch, chIdx) => {
            const span = document.createElement('span');
            span.textContent = ch;
            span.className = (idx === currentEntryIndex && chIdx === 0) ? 'char-current' : 'char-pending';
            lineCol.appendChild(span);
        });
        paragraphContainerEl.appendChild(lineCol);
    });

    targetFullText = fullLines.join(' ').trim();
    targetChars = targetFullText.split('');
    currentPos=0; typingRunning=true;
    comboCount=0; wrongContinuous=0;
    startTime=Date.now();
    if(timerId) clearInterval(timerId);
    inputAreaEl.disabled=false;
    inputAreaEl.value='';
    inputAreaEl.focus();
    resetBtnEl.disabled=false;
    timerId=setInterval(updateStat,1000);
    accuracyEl.textContent = "100%";
    accBar.style.width = "100%";
    updateStat();
    paragraphContainerEl.scrollTop = 0;
}

// ========== 双语对照练习模式 ==========
function runTypingBilingualMode(text){
    isFullTextMode = false;
    isBilingualMode = true;
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
            span.textContent = ch;
            span.className = (idx === currentEntryIndex && chIdx === 0) ? 'char-current' : 'char-pending';
            enCol.appendChild(span);
        });
        paragraphContainerEl.appendChild(cnCol);
        paragraphContainerEl.appendChild(enCol);
    });

    targetFullText = pairs.map(p=>p.en).join(' ').trim();
    targetChars = targetFullText.split('');
    currentPos=0; typingRunning=true;
    comboCount=0; wrongContinuous=0;
    startTime=Date.now();
    if(timerId) clearInterval(timerId);
    inputAreaEl.disabled=false;
    inputAreaEl.value='';
    inputAreaEl.focus();
    resetBtnEl.disabled=false;
    timerId=setInterval(updateStat,1000);
    accuracyEl.textContent = "100%";
    accBar.style.width = "100%";
    updateStat();
    paragraphContainerEl.scrollTop = 0;
}