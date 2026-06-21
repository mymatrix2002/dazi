// js/core/typing-mode.js 完整代码（短语停顿加长版）
// ========== 工具函数：提取说话人前缀和正文 ==========
function extractSpeakerAndContent(line) {
    if (!line || typeof line !== 'string' || line.length === 0) {
        return { speaker: '', content: line, hasSpeaker: false };
    }
    
    const searchEnd = Math.min(line.length, 30);
    let colonIndex = -1;
    
    for (let i = 0; i < searchEnd; i++) {
        const ch = line[i];
        if (ch === ':' || ch === '：') {
            colonIndex = i;
            break;
        }
    }
    
    if (colonIndex <= 0) {
        return { speaker: '', content: line, hasSpeaker: false };
    }
    
    const beforeColon = line.substring(0, colonIndex);
    const beforeTrimmed = beforeColon.trim();
    
    if (beforeTrimmed.length === 0) {
        return { speaker: '', content: line, hasSpeaker: false };
    }
    
    const validPattern = /^[A-Za-z0-9\s_.']+$/;
    if (!validPattern.test(beforeTrimmed)) {
        return { speaker: '', content: line, hasSpeaker: false };
    }
    
    const afterColon = line.substring(colonIndex + 1);
    const afterTrimmed = afterColon.trimStart();
    
    if (afterTrimmed.length === 0) {
        return { speaker: '', content: line, hasSpeaker: false };
    }
    
    let contentStart = colonIndex + 1;
    while (contentStart < line.length) {
        const ch = line[contentStart];
        if (ch === ' ' || ch === '\t') {
            contentStart++;
        } else {
            break;
        }
    }
    
    return {
        speaker: line.substring(0, contentStart),
        content: line.substring(contentStart),
        hasSpeaker: true
    };
}
// ========== 全文练习模式 ========== 
function runTypingFullMode(text){
    lastSpokenLineIndex = -1;
    finishModalAutoShown = false;
    
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
    speechSentenceMap = [];
    const allCharSpans = [];
    const allContentLines = [];
    fullLines.forEach((lineText, idx) => {
        const lineCol = document.createElement('div');
        lineCol.className = 'paragraph-full';
        lineCol.dataset.segmentIndex = idx;
        
        const extracted = extractSpeakerAndContent(lineText);
        const speaker = extracted.speaker;
        const content = extracted.content;
        const hasSpeaker = extracted.hasSpeaker;
        
        allContentLines.push(content);
        entryCharsList.push(content.split(''));
        
        if (hasSpeaker) {
            const speakerSpan = document.createElement('span');
            speakerSpan.className = 'speaker-prefix';
            speakerSpan.textContent = speaker;
            speakerSpan.style.color = '#94a3b8';
            speakerSpan.style.fontWeight = '500';
            speakerSpan.style.fontStyle = 'italic';
            speakerSpan.style.userSelect = 'none';
            speakerSpan.style.pointerEvents = 'none';
            lineCol.appendChild(speakerSpan);
        }
        
        const chars = content.split('');
        chars.forEach((ch, chIdx) => {
            const span = document.createElement('span');
            span.className = 'char-span';
            
            if(ch === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = ch;
            }
            span.style.whiteSpace = 'pre';
            
            if (idx === currentEntryIndex && chIdx === 0) {
                span.classList.add('char-current');
            } else {
                span.classList.add('char-pending');
            }
            
            lineCol.appendChild(span);
            allCharSpans.push(span);
        });
        
        paragraphContainerEl.appendChild(lineCol);
    });
    const combinedText = allContentLines.join(' ').trim();
    targetFullText = combinedText;
    targetChars = targetFullText.split('');
    
    // ========== 短语/单词行尾加长停顿 ==========
    if (allContentLines.length > 0 && allCharSpans.length > 0) {
        let currentNodeIndex = 0;
        allContentLines.forEach((lineText) => {
            if (!lineText || lineText.trim() === '') return;
            const lineSentences = splitSentences(lineText);
            lineSentences.forEach((sent, sIdx) => {
                const sentenceText = sent.text;
                const nodeCount = sentenceText.length;
                const start = currentNodeIndex;
                const end = currentNodeIndex + nodeCount - 1;
                const realEnd = Math.min(end, allCharSpans.length - 1);
                // 行尾句子 → 用句号级长停顿（约800ms）
                const isLastInLine = sIdx === lineSentences.length - 1;
                const pauseType = isLastInLine ? 'period' : sent.pauseType;
                speechSentenceMap.push({
                    text: sent.text,
                    pauseType: pauseType,
                    startNode: start,
                    endNode: realEnd
                });
                currentNodeIndex = realEnd + 1;
            });
        });
    }
    
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
    
    if (window.virtualKeyboard && window.virtualKeyboard.isEnabled()) {
        window.virtualKeyboard.reset();
        if (allContentLines.length > 0 && allContentLines[0].length > 0) {
            window.virtualKeyboard.updateHighlight(allContentLines[0][0]);
        }
    }
}
// ========== 双语对照练习模式 ==========    
function runTypingBilingualMode(text){
    lastSpokenLineIndex = -1;
    finishModalAutoShown = false;
    
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
    speechSentenceMap = [];
    const allCharSpans = [];
    const allContentLines = [];
    pairs.forEach((pair, idx) => {
        const cnCol = document.createElement('div');
        cnCol.className = 'paragraph-cn';
        cnCol.textContent = pair.cn || '';
        
        const enCol = document.createElement('div');
        enCol.className = 'paragraph-en';
        enCol.dataset.segmentIndex = idx;
        
        const extracted = extractSpeakerAndContent(pair.en);
        const speaker = extracted.speaker;
        const content = extracted.content;
        const hasSpeaker = extracted.hasSpeaker;
        
        allContentLines.push(content);
        entryCharsList.push(content.split(''));
        
        if (hasSpeaker) {
            const speakerSpan = document.createElement('span');
            speakerSpan.className = 'speaker-prefix';
            speakerSpan.textContent = speaker;
            speakerSpan.style.color = '#94a3b8';
            speakerSpan.style.fontWeight = '500';
            speakerSpan.style.fontStyle = 'italic';
            speakerSpan.style.userSelect = 'none';
            speakerSpan.style.pointerEvents = 'none';
            enCol.appendChild(speakerSpan);
        }
        
        const chars = content.split('');
        chars.forEach((ch, chIdx) => {
            const span = document.createElement('span');
            span.className = 'char-span';
            
            if(ch === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = ch;
            }
            span.style.whiteSpace = 'pre';
            
            if (idx === currentEntryIndex && chIdx === 0) {
                span.classList.add('char-current');
            } else {
                span.classList.add('char-pending');
            }
            
            enCol.appendChild(span);
            allCharSpans.push(span);
        });
        
        paragraphContainerEl.appendChild(cnCol);
        paragraphContainerEl.appendChild(enCol);
    });
    const enCombinedText = allContentLines.join(' ').trim();
    targetFullText = enCombinedText;
    targetChars = targetFullText.split('');
    
    // ========== 短语/单词行尾加长停顿 ==========
    if (allContentLines.length > 0 && allCharSpans.length > 0) {
        let currentNodeIndex = 0;
        allContentLines.forEach((lineText) => {
            if (!lineText || lineText.trim() === '') return;
            const lineSentences = splitSentences(lineText);
            lineSentences.forEach((sent, sIdx) => {
                const sentenceText = sent.text;
                const nodeCount = sentenceText.length;
                const start = currentNodeIndex;
                const end = currentNodeIndex + nodeCount - 1;
                const realEnd = Math.min(end, allCharSpans.length - 1);
                // 行尾句子 → 用句号级长停顿（约800ms）
                const isLastInLine = sIdx === lineSentences.length - 1;
                const pauseType = isLastInLine ? 'period' : sent.pauseType;
                speechSentenceMap.push({
                    text: sent.text,
                    pauseType: pauseType,
                    startNode: start,
                    endNode: realEnd
                });
                currentNodeIndex = realEnd + 1;
            });
        });
    }
    
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
    if (window.virtualKeyboard && window.virtualKeyboard.isEnabled()) {
        window.virtualKeyboard.reset();
        if (allContentLines.length > 0 && allContentLines[0].length > 0) {
            window.virtualKeyboard.updateHighlight(allContentLines[0][0]);
        }
    }
}
