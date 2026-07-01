// js/core/event-base.js

// ========== 停顿时间配置 ==========
window.PAUSE_CONFIG = window.PAUSE_CONFIG || {
    period: 700,
    mark: 400,
    newline: 700,
    comma: 350,
    semicolon: 450,
    colon: 450,
    none: 150
};

// ========== 全局语音API兜底 ==========
if (!window.speechSynthesis) window.speechSynthesis = null;
if (!window.SpeechSynthesisUtterance) window.SpeechSynthesisUtterance = null;

// ========== 预加载相关 ==========
let preloadTimer = null;
let charSpanCache = null;
let lastTextLength = 0;
let onlineFailCount = 0;

// 预加载数量配置（可调节）
const PRELOAD_CONFIG = {
    batch: 2,
    manual: 1,
    threshold: 5,
    debounce: 1000
};

// ========== 朗读模式配置 ==========
let readMode = localStorage.getItem('readMode') || 'english';

// ========== 工具函数 ==========
function getPureEnglish(text) {
    if (!text) return '';
    return text.replace(/[\u4e00-\u9fa5]/g, '').replace(/\s+/g, ' ').trim();
}

// ========== 批量预加载语音 ==========
function preloadSentences(count) {
    if (!window.onlineTTS || typeof window.onlineTTS.preload !== 'function') return;
    if (!window.isUsingOnlineVoice || !window.isUsingOnlineVoice()) return;
    
    const text = sourceTextEl.value.trim();
    if (!text || text.length < 10) return;
    
    const sentences = splitSentences(text);
    if (!sentences || sentences.length === 0) return;
    
    const rate = speechState.rate || 1.0;
    let loadedCount = 0;
    
    for (let i = 0; i < sentences.length && loadedCount < count; i++) {
        const sen = sentences[i];
        if (!sen || !sen.text || !sen.text.trim()) continue;
        
        let preloadText;
        if (readMode === 'english') {
            preloadText = extractEnglishSmart(sen.text);
            preloadText = replaceDigitsToEnglish(preloadText);
        } else {
            preloadText = replaceDigitsSmart(sen.text);
        }
        
        if (!preloadText || preloadText.length < 2) continue;
        
        window.onlineTTS.preload(preloadText, 'zh', rate);
        loadedCount++;
    }
}

function isChineseChar(ch) {
    if (!ch || ch.length === 0) return false;
    return /[\u4e00-\u9fa5]/.test(ch);
}

function forceStopSpeech() {
    charSpanCache = null;
    clearTimeout(pauseTimer);
    speechState.running = false;
    speechState.idx = 0;
    speechState.fallbackToSystem = false;
    onlineFailCount = 0;
    
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
    
    try {
        const highlights = document.querySelectorAll('.sentence-read-highlight');
        for (let i = 0; i < highlights.length; i++) {
            highlights[i].classList.remove('sentence-read-highlight');
        }
    } catch(e) {}
    
    if(readAllBtnEl) {
        readAllBtnEl.classList.remove('btn-speaking');
        readAllBtnEl.textContent = '🔊 朗读全文';
    }
}

// ========== 练习模式选择弹窗 ==========
function showPracticeModeModal(text, callback) {
    const modal = document.createElement('div');
    modal.id = 'practiceModeModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-80 max-w-[90%]">
            <h3 class="text-lg font-bold text-center mb-4 dark:text-white">选择练习模式</h3>
            <div class="space-y-3">
                <div class="mode-card p-4 border-2 rounded-xl cursor-pointer hover:border-blue-500 transition-colors" data-mode="full">
                    <div class="text-2xl mb-1">🌐</div>
                    <div class="font-bold dark:text-white">全文练习</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">整篇文章连续打字练习</div>
                </div>
                <div class="mode-card p-4 border-2 rounded-xl cursor-pointer hover:border-blue-500 transition-colors" data-mode="bilingual">
                    <div class="text-2xl mb-1">📖</div>
                    <div class="font-bold dark:text-white">双语对照</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">左右对照，边看中文边练英文</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const cards = modal.querySelectorAll('.mode-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.dataset.mode;
            document.body.removeChild(modal);
            if (callback) callback(mode);
        });
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// ========== 朗读模式选择弹窗 ==========
function showReadModeModal(callback) {
    const modal = document.createElement('div');
    modal.id = 'readModeModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-80 max-w-[90%]">
            <h3 class="text-lg font-bold text-center mb-4 dark:text-white">选择朗读模式</h3>
            <div class="space-y-3">
                <div class="mode-card p-4 border-2 rounded-xl cursor-pointer hover:border-blue-500 transition-colors ${readMode === 'both' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}" data-mode="both">
                    <div class="text-2xl mb-1">🌐</div>
                    <div class="font-bold dark:text-white">中英文朗读</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">中英文都朗读，数字智能识别</div>
                </div>
                <div class="mode-card p-4 border-2 rounded-xl cursor-pointer hover:border-blue-500 transition-colors ${readMode === 'english' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}" data-mode="english">
                    <div class="text-2xl mb-1">📖</div>
                    <div class="font-bold dark:text-white">英文朗读</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">只朗读英文部分，中文自动跳过</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const cards = modal.querySelectorAll('.mode-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.dataset.mode;
            readMode = mode;
            localStorage.setItem('readMode', mode);
            document.body.removeChild(modal);
            if (callback) callback(mode);
        });
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// ========== 朗读滚动高亮逻辑 ==========
function nextSpeak(lastPause){
    if(!speechState.running) return;
    
    try {
        const oldHighlights = document.querySelectorAll('.sentence-read-highlight');
        for (let i = 0; i < oldHighlights.length; i++) {
            oldHighlights[i].classList.remove('sentence-read-highlight');
        }
    } catch(e) {}
    
    speechState.idx++;
    if(speechState.idx >= speechSentenceMap.length){
        speechState.running = false;
        readAllBtnEl.classList.remove('btn-speaking');
        readAllBtnEl.textContent = '🔊 朗读全文';
        
        if (isBilingualMode && paragraphContainerEl) {
            paragraphContainerEl.scrollTop = 0;
        }
        if (displayAreaEl) {
            displayAreaEl.scrollTop = 0;
        }
        
        return;
    }
    
    const currentItem = speechSentenceMap[speechState.idx];
    if(!currentItem) return;
    
    const senText = currentItem.text;
    const senPause = currentItem.pauseType;
    const startIdx = currentItem.startNode;
    const endIdx = currentItem.endNode;
    
    if(!senText.trim()){
        setTimeout(() => nextSpeak(senPause), 0);
        return;
    }
    
    let allSpans = charSpanCache;
    if (!allSpans || allSpans.length === 0) {
        if (isBilingualMode && paragraphContainerEl) {
            allSpans = paragraphContainerEl.querySelectorAll('.char-span');
        } else if (displayAreaEl) {
            allSpans = displayAreaEl.querySelectorAll('.char-span');
        } else {
            allSpans = [];
        }
        charSpanCache = allSpans;
    }
    
    const safeEnd = Math.min(endIdx, allSpans.length - 1);
    
    if (readMode === 'english') {
        let firstCnIndex = -1;
        for(let i = startIdx; i <= safeEnd; i++){
            const span = allSpans[i];
            if (!span) continue;
            const ch = span.textContent;
            if(/[\u4e00-\u9fa5]/.test(ch)) {
                firstCnIndex = i;
                break;
            }
        }
        
        for(let i = startIdx; i <= safeEnd; i++){
            const span = allSpans[i];
            if (!span) continue;
            const ch = span.textContent;
            const code = ch.charCodeAt(0);
            
            if(/[\u4e00-\u9fa5]/.test(ch)) {
                continue;
            }
            
            if(code >= 48 && code <= 57) {
                if(firstCnIndex > 0 && i > firstCnIndex) {
                    continue;
                }
            }
            
            if(code >= 33 && code <= 126) {
                span.classList.add('sentence-read-highlight');
            }
        }
    } else {
        for(let i = startIdx; i <= safeEnd; i++){
            const span = allSpans[i];
            if (!span) continue;
            span.classList.add('sentence-read-highlight');
        }
    }
    
    let firstHighlight = null;
    if (isBilingualMode) {
        firstHighlight = paragraphContainerEl.querySelector('.sentence-read-highlight');
    } else {
        firstHighlight = displayAreaEl.querySelector('.sentence-read-highlight');
    }
    if(firstHighlight){
        firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    let pauseTime = PAUSE_CONFIG[lastPause];
    if (window.isUsingOnlineVoice && window.isUsingOnlineVoice() && !speechState.fallbackToSystem) {
        pauseTime += 200;
    }
    
    setTimeout(() => {
        if(!speechState.running) return;
        
        let speakText;
        
        if (readMode === 'english') {
            speakText = extractEnglishSmart(senText);
            speakText = replaceDigitsToEnglish(speakText);
        } else {
            speakText = replaceDigitsSmart(senText);
        }
        
        if (!speakText || !speakText.trim()) {
            nextSpeak(senPause);
            return;
        }
        
        if(window.isUsingOnlineVoice && window.isUsingOnlineVoice() && !speechState.fallbackToSystem) {
            if(window.onlineTTS) {
                window.onlineTTS.speak(
                    speakText,
                    'zh',
                    speechState.rate,
                    speechState.volume,
                    () => {
                        onlineFailCount = 0;
                        if(speechState.running) {
                            nextSpeak(senPause);
                        }
                    },
                    () => {
                        onlineFailCount++;
                        console.warn('在线语音播放失败（第 ' + onlineFailCount + ' 次）');
                        
                        if (onlineFailCount < 2) {
                            if(speechState.running) {
                                nextSpeak(senPause);
                            }
                            return;
                        }
                        
                        console.warn('在线语音连续失败，切换到系统语音兜底');
                        speechState.fallbackToSystem = true;
                        
                        if(window.speechSynthesis && window.SpeechSynthesisUtterance) {
                            const utter = window.createUtterance(speakText, speechState.rate);
                            if(utter) {
                                utter.onend = function() {
                                    if(speechState.running) {
                                        nextSpeak(senPause);
                                    }
                                };
                                utter.onerror = function() {
                                    console.warn('系统语音也播放失败，已停止');
                                    forceStopSpeech();
                                };
                                window.speechSynthesis.speak(utter);
                            } else {
                                forceStopSpeech();
                            }
                        } else {
                            forceStopSpeech();
                        }
                    }
                );
                
                const PRELOAD_COUNT = 2;
                for (let i = 1; i <= PRELOAD_COUNT; i++) {
                    setTimeout(() => {
                        const preloadTargetIdx = speechState.idx + i;
                        if (preloadTargetIdx < speechSentenceMap.length) {
                            const nextItem = speechSentenceMap[preloadTargetIdx];
                            if (nextItem && nextItem.text && nextItem.text.trim()) {
                                let nextPreloadText;
                                if (readMode === 'english') {
                                    nextPreloadText = extractEnglishSmart(nextItem.text);
                                    nextPreloadText = replaceDigitsToEnglish(nextPreloadText);
                                } else {
                                    nextPreloadText = replaceDigitsSmart(nextItem.text);
                                }
                                if (nextPreloadText && nextPreloadText.trim()) {
                                    if (window.onlineTTS && typeof window.onlineTTS.preload === 'function') {
                                        window.onlineTTS.preload(nextPreloadText, 'zh', speechState.rate);
                                    }
                                }
                            }
                        }
                    }, 200 * i);
                }
                
            } else {
                setTimeout(() => nextSpeak(senPause), 100);
            }
        } else {
            if(window.speechSynthesis && window.SpeechSynthesisUtterance) {
                const utter = window.createUtterance(speakText, speechState.rate);
                if(utter) {
                    utter.onend = function() {
                        if(speechState.running) {
                            nextSpeak(senPause);
                        }
                    };
                    utter.onerror = function() {
                        console.warn('系统语音播放失败，已停止');
                        forceStopSpeech();
                    };
                    window.speechSynthesis.speak(utter);
                } else {
                    setTimeout(() => nextSpeak(senPause), 100);
                }
            } else {
                setTimeout(() => nextSpeak(senPause), 100);
            }
        }
    }, pauseTime);
}

// ========== 全局所有交互事件绑定入口 ==========
function bindBaseEvents() {
    updateThemeButtonText();
    themeToggleBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlRoot.setAttribute('data-theme', currentTheme);
        localStorage.setItem('pageTheme', currentTheme);
        updateThemeButtonText();
    });
    
    if(wordSpeakToggleBtn) {
        updateWordSpeakBtnText();
        wordSpeakToggleBtn.addEventListener('click', () => {
            wordSpeakEnable = wordSpeakEnable === 'true' ? 'false' : 'true';
            localStorage.setItem('wordSpeakEnable', wordSpeakEnable);
            updateWordSpeakBtnText();
        });
    }
    
    function updateCharCount(){ 
        const currentLength = sourceTextEl.value.length;
        charCountEl.textContent = currentLength;
        
        const diff = Math.abs(currentLength - lastTextLength);
        lastTextLength = currentLength;
        
        let preloadCount = PRELOAD_CONFIG.manual;
        if (diff >= PRELOAD_CONFIG.threshold) {
            preloadCount = PRELOAD_CONFIG.batch;
        }
        
        if (preloadTimer) clearTimeout(preloadTimer);
        preloadTimer = setTimeout(() => {
            preloadSentences(preloadCount);
        }, PRELOAD_CONFIG.debounce);
    }
    sourceTextEl.addEventListener('input',updateCharCount);
    
    fileInputEl.addEventListener('change',e=>{
        const f=e.target.files[0];
        if(!f) return;
        const r=new FileReader();
        r.onload=evt=>{
            sourceTextEl.value=evt.target.result;
            updateCharCount();
        };
        r.readAsText(f);
    });
    
    function openUrl(u){
        let url=u.trim();
        if(!/^https?:\/\//i.test(url)) url='https://'+url;
        window.open(url,'_blank');
    }
    quickLinkBtns.forEach(btn=>btn.addEventListener('click',()=>openUrl(btn.dataset.url)));
    
    readAllBtnEl.addEventListener('click',function(){
        let txt = targetFullText.trim();
        
        if(!typingRunning){
            const sourceTxt = sourceTextEl.value.trim();
            if(!sourceTxt){
                alert('请先粘贴练习内容或选择题库');
                return;
            }
            runTypingFullMode(sourceTxt, false);
            txt = targetFullText.trim();
        }
        if(!txt){
            alert('暂无内容可朗读');
            return;
        }
        
        if(speechState.running){
            forceStopSpeech();
            return;
        }
        
        const btn = this;
        showReadModeModal(function(mode) {
            speechState.rate = +speechRateEl.value;
            speechState.idx = -1;
            speechState.running = true;
            speechState.fallbackToSystem = false;
            onlineFailCount = 0;
            btn.classList.add('btn-speaking');
            btn.textContent = '⏹ 停止朗读';
            nextSpeak('period');
        });
    });
    
    speechRateEl.addEventListener('change',()=>speechState.rate=+speechRateEl.value);
    
    // ========== 3 档音量按钮 ==========
    const VOLUME_LEVELS = {
        soft:   { value: 0.4, icon: '🔈', label: '轻柔' },
        normal: { value: 0.7, icon: '🔉', label: '标准' },
        loud:   { value: 1.0, icon: '🔊', label: '响亮' }
    };
    const VOLUME_ORDER = ['soft', 'normal', 'loud'];
        
    let currentVolumeLevel = localStorage.getItem('volumeLevel') || 'loud';
    
    function updateVolumeUI() {
        const btn = document.getElementById('volumeBtn');
        if (!btn) return;
        
        const level = VOLUME_LEVELS[currentVolumeLevel];
        const idx = VOLUME_ORDER.indexOf(currentVolumeLevel);
        let dots = '';
        for (let i = 0; i < 3; i++) {
            dots += i <= idx ? '●' : '○';
        }
        
        btn.textContent = level.icon + ' ' + level.label + ' ' + dots;
    }
    
    function setVolumeLevel(levelKey) {
        if (!VOLUME_LEVELS[levelKey]) return;
        currentVolumeLevel = levelKey;
        localStorage.setItem('volumeLevel', levelKey);
        
        const level = VOLUME_LEVELS[levelKey];
        speechState.volume = level.value;
        
        if (window.onlineTTS && typeof window.onlineTTS.setVolume === 'function') {
            window.onlineTTS.setVolume(level.value);
        }
        
        updateVolumeUI();
    }
    
    const volumeBtn = document.getElementById('volumeBtn');
    if (volumeBtn) {
        volumeBtn.addEventListener('click', function() {
            const currentIdx = VOLUME_ORDER.indexOf(currentVolumeLevel);
            const nextIdx = (currentIdx + 1) % VOLUME_ORDER.length;
            setVolumeLevel(VOLUME_ORDER[nextIdx]);
        });
    }
    
    setVolumeLevel(currentVolumeLevel);
    
    let fontScaleTimer = null;
    fontSizeSlider.addEventListener('input', function () {
        fontScale = parseFloat(this.value);
        document.documentElement.style.setProperty('--practice-font-scale', fontScale);
        let tip = "标准";
        if (fontScale <= 0.8) tip = "偏小";
        else if (fontScale <= 1.0) tip = "标准";
        else if (fontScale <= 1.2) tip = "偏大";
        else if (fontScale <= 1.4) tip = "很大";
        else tip = "超大";
        if(fontSizeText) fontSizeText.textContent = tip;
        
        if (fontScaleTimer) clearTimeout(fontScaleTimer);
        fontScaleTimer = setTimeout(() => {
            localStorage.setItem('fontScale', fontScale);
        }, 300);
    });
    
    const vkToggleBtn = document.getElementById('vkToggleBtn');
    if(vkToggleBtn) {
        const vkEnabled = localStorage.getItem('virtualKeyboardEnabled') === 'true';
        vkToggleBtn.textContent = vkEnabled ? '虚拟键盘：已开启' : '虚拟键盘：已关闭';
            
        vkToggleBtn.addEventListener('click', () => {
            if(window.virtualKeyboard) {
                window.virtualKeyboard.toggle();
                const isOn = window.virtualKeyboard.isEnabled();
                vkToggleBtn.textContent = isOn ? '虚拟键盘：已开启' : '虚拟键盘：已关闭';                
            }
        });
    }
    
    const voiceSelect = document.getElementById('voiceSelect');
    if(voiceSelect) {
        initVoiceSelection();
        voiceSelect.addEventListener('change', function() {
            selectedVoiceURI = this.value;
            localStorage.setItem('selectedVoiceURI', selectedVoiceURI);
        });
    }
    
    clearBtnEl.addEventListener('click',()=>{
        forceStopSpeech();
        sourceTextEl.value=''; 
        lastTextLength = 0;
        updateCharCount();
    });
    
    toggleTranslationBtnEl.addEventListener('click', () => {
        const cnCols = paragraphContainerEl.querySelectorAll('.paragraph-cn');
        if (cnCols.length === 0) return;
        if (cnCols[0].classList.contains('hidden')) {
            cnCols.forEach(el => el.classList.remove('hidden'));
            toggleTranslationBtnEl.textContent = '收起';
        } else {
            cnCols.forEach(el => el.classList.add('hidden'));
            toggleTranslationBtnEl.textContent = '展开';
        }
    });
    
    startBtnEl.addEventListener('click',()=>{
        forceStopSpeech();
        pendingText=sourceTextEl.value.trim();
        if(!pendingText){ alert('请粘贴练习内容'); return; }
        
        const needReset = typingRunning || entryCharsList.length > 0;
        if(needReset) {
            resetBtnEl.click();
        }
        
        if(hasChinese(pendingText)){
            const text = pendingText;
            setTimeout(() => {
                showPracticeModeModal(text, function(mode) {
                    if(mode === 'full') {
                        runTypingFullMode(text);
                    } else {
                        runTypingBilingualMode(text);
                    }
                });
            }, 50);
            return;
        }
        
        if(needReset) {
            setTimeout(() => {
                runTypingFullMode(pendingText);
            }, 50);
        } else {
            runTypingFullMode(pendingText);
        }
    });
    
    resetBtnEl.addEventListener('click',()=>{
        forceStopSpeech();
        typingRunning=false; clearInterval(timerId);
        speechSentenceMap = [];
        startTime=null; speedEl.textContent="0"; accuracyEl.textContent="0%";
        timeUsedEl.textContent="00:00"; progressEl.textContent="0%";
        speedBar.style.width="0%"; accBar.style.width="0%"; progBar.style.width="0%";
        inputAreaEl.value=''; inputAreaEl.disabled=true; resetBtnEl.disabled=true;
        prevInputValue = '';
        totalInput = 0;
        correctCnt = 0;
        displayAreaEl.innerHTML='<span class="text-slate-400">✨ 请先粘贴练习内容，点击「开始练习」✨</span>';
        displayAreaEl.style.display = 'flex';
        displayAreaEl.classList.remove('hidden');
        bilingualAreaEl.classList.add('hidden');
        isBilingualMode = false;
        isFullTextMode = false;
        comboCount=0; wrongContinuous=0;
        stickerUnlock=[false,false,false,false];
        currentEntryIndex = 0;
        entryCharsList = [];
        finishedWordSet.clear();
        currentPos = 0;
        isLastLineEnter = false;
        waitFinalEnter = false;
        document.querySelectorAll('.sticker-item').forEach(item=>item.classList.remove('unlock'));
        const mask = document.getElementById('finishMask');
        if(mask) mask.remove();
        inputAreaEl.placeholder = "在这里打字...";
        
        if (window.virtualKeyboard && typeof window.virtualKeyboard.reset === 'function') {
            try {
                window.virtualKeyboard.reset();
            } catch(e) {}
        }
        
        lastSpokenLineIndex = -1;
        finishModalAutoShown = false;
    });
    
    window.addEventListener('beforeunload',()=>{
        forceStopSpeech();
        clearInterval(timerId);
    });
    
    helpBtn.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
    });
    helpCloseBtn.addEventListener('click', () => {
        helpModal.classList.add('hidden');
    });
    helpModal.addEventListener('click', (e) => {
        if(e.target === helpModal){
            helpModal.classList.add('hidden');
        }
    });
    
    inputAreaEl.addEventListener('focus', function() {
        if (!typingRunning) return;
        setTimeout(() => {
            if(isBilingualMode && paragraphContainerEl){
                paragraphContainerEl.scrollIntoView({block: 'nearest', behavior: 'smooth'});
            }
        }, 350);
    });
    
    window.addEventListener('resize', () => {
        if (!typingRunning || !inputAreaEl.matches(':focus')) return;
        setTimeout(() => {
            if(isBilingualMode && paragraphContainerEl){
                paragraphContainerEl.scrollIntoView({block: 'nearest', behavior: 'smooth'});
            }
        }, 200);
    });
}

// ========== 页面加载初始化字号 ==========
document.documentElement.style.setProperty('--practice-font-scale', fontScale);
fontSizeSlider.value = fontScale;
let initTip = "标准";
if (fontScale <= 0.8) initTip = "偏小";
else if (fontScale <= 1.0) initTip = "标准";
else if (fontScale <= 1.2) initTip = "偏大";
else if (fontScale <= 1.4) initTip = "很大";
else initTip = "超大";
if(fontSizeText) fontSizeText.textContent = initTip;

// ========== 更新主题按钮文字 ==========
function updateThemeButtonText(){
    if(currentTheme === 'dark'){
        themeToggleBtn.textContent = '切换日间模式';
    }else{
        themeToggleBtn.textContent = '切换夜间模式';
    }
}

// ========== 更新单词朗读按钮 ==========
function updateWordSpeakBtnText() {
    if(wordSpeakEnable === 'true') {
        wordSpeakToggleBtn.textContent = '单词朗读：已开启';
        wordSpeakToggleBtn.classList.remove('btn-normal');
        wordSpeakToggleBtn.classList.add('btn-success');
    } else {
        wordSpeakToggleBtn.textContent = '单词朗读：已关闭';
        wordSpeakToggleBtn.classList.remove('btn-success');
        wordSpeakToggleBtn.classList.add('btn-normal');
    }
}
