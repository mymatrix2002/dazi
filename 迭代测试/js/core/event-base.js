// js/core/event-base.js 优化版（智能批量预加载 + 在线语音兜底 + 预览模式）
// ========== 停顿时间配置 ==========
window.PAUSE_CONFIG = window.PAUSE_CONFIG || {
    period: 700,    // 句号 / 行尾长停顿（0.7秒）
    mark: 400,       // 问号 / 感叹号
    newline: 700,   // 换行 / 短语之间（0.7秒）
    comma: 350,      // 逗号
    semicolon: 450,  // 分号
    colon: 450,      // 冒号
    none: 150        // 其他短停顿
};
// ========== 全局语音API兜底 ==========
if (!window.speechSynthesis) window.speechSynthesis = null;
if (!window.SpeechSynthesisUtterance) window.SpeechSynthesisUtterance = null;
// ========== 预加载相关 ==========
let preloadTimer = null;
let lastTextLength = 0; // 上一次的文本长度，用于判断输入类型
// 预加载数量配置
const PRELOAD_CONFIG = {
    batch: 5,       // 批量输入时预加载前 5 句
    manual: 1,      // 手动输入时只预加载第 1 句
    threshold: 5,   // 字符变化阈值，超过算批量输入
    debounce: 1000  // 防抖时间（毫秒）
};
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
    
    const rate = speechState.rate || 0.75;
    let loadedCount = 0;
    
    for (let i = 0; i < sentences.length && loadedCount < count; i++) {
        const sen = sentences[i];
        if (!sen || !sen.text || !sen.text.trim()) continue;
        
        const enText = getPureEnglish(sen.text);
        if (!enText || enText.length < 2) continue;
        
        window.onlineTTS.preload(enText, 'zh', rate);
        loadedCount++;
    }
}
function isChineseChar(ch) {
    if (!ch || ch.length === 0) return false;
    return /[\u4e00-\u9fa5]/.test(ch);
}
function forceStopSpeech() {
    clearTimeout(pauseTimer);
    speechState.running = false;
    speechState.idx = 0;
    speechState.fallbackToSystem = false;
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
    // 清除所有高亮
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
// ========== 朗读滚动高亮逻辑 ==========
function nextSpeak(lastPause){
    if(!speechState.running) return;
    
    // 先清除所有旧高亮
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
        
        // 朗读结束，滚动条回到顶部
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
    
    // 获取所有字符 span
    let allSpans = [];
    if (isBilingualMode) {
        allSpans = paragraphContainerEl.querySelectorAll('.char-span');
    } else {
        allSpans = displayAreaEl.querySelectorAll('.char-span');
    }
    
    // 只高亮英文/数字/英文标点
    const safeEnd = Math.min(endIdx, allSpans.length - 1);
    for(let i = startIdx; i <= safeEnd; i++){
        const span = allSpans[i];
        if (!span) continue;
        const ch = span.textContent;
        const code = ch.charCodeAt(0);
        if(code >= 33 && code <= 126) {
            span.classList.add('sentence-read-highlight');
        }
    }
    
    // 滚动到第一个高亮
    let firstHighlight = null;
    if (isBilingualMode) {
        firstHighlight = paragraphContainerEl.querySelector('.sentence-read-highlight');
    } else {
        firstHighlight = displayAreaEl.querySelector('.sentence-read-highlight');
    }
    if(firstHighlight){
        firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // 延迟后播放
    setTimeout(() => {
        if(!speechState.running) return;
        
        const enText = getPureEnglish(senText);
        
        if(window.isUsingOnlineVoice && window.isUsingOnlineVoice() && !speechState.fallbackToSystem) {
            // ===== 在线语音 =====
            if(window.onlineTTS) {
                window.onlineTTS.speak(
                    enText,
                    'zh',  // 改成中文模式，支持中英文混合，人名更准
                    speechState.rate,
                    speechState.volume,
                    // 播放成功结束 → 继续下一句
                    () => {
                        if(speechState.running) {
                            nextSpeak(senPause);
                        }
                    },
                    // 播放失败 → 切换到系统语音兜底
                    () => {
                        console.warn('在线语音播放失败，切换到系统语音兜底');
                        speechState.fallbackToSystem = true;
                        
                        if(window.speechSynthesis && window.SpeechSynthesisUtterance) {
                            const utter = window.createUtterance(enText, speechState.rate);
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
                
                // ===== 修改：播放当前句的同时，预加载后面第 5 句（保持 5 句缓冲）=====
                const preloadTargetIdx = speechState.idx + 5;
                if (preloadTargetIdx < speechSentenceMap.length) {
                    const nextItem = speechSentenceMap[preloadTargetIdx];
                    if (nextItem && nextItem.text && nextItem.text.trim()) {
                        const nextEnText = getPureEnglish(nextItem.text);
                        if (window.onlineTTS && typeof window.onlineTTS.preload === 'function') {
                            window.onlineTTS.preload(nextEnText, 'zh', speechState.rate);
                        }
                    }
                }
                // ===== 修改结束 =====
                
            } else {
                setTimeout(() => nextSpeak(senPause), 100);
            }
        } else {
            // ===== 系统语音 =====
            if(window.speechSynthesis && window.SpeechSynthesisUtterance) {
                const utter = window.createUtterance(enText, speechState.rate);
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
    }, PAUSE_CONFIG[lastPause]);
}
// ========== 全局所有交互事件绑定入口 ==========
function bindBaseEvents() {
    // 主题切换
    updateThemeButtonText();
    themeToggleBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlRoot.setAttribute('data-theme', currentTheme);
        localStorage.setItem('pageTheme', currentTheme);
        updateThemeButtonText();
    });
    // 单词朗读开关
    if(wordSpeakToggleBtn) {
        updateWordSpeakBtnText();
        wordSpeakToggleBtn.addEventListener('click', () => {
            wordSpeakEnable = wordSpeakEnable === 'true' ? 'false' : 'true';
            localStorage.setItem('wordSpeakEnable', wordSpeakEnable);
            updateWordSpeakBtnText();
        });
    }
    // 文本字符实时计数 + 智能预加载
    function updateCharCount(){ 
        const currentLength = sourceTextEl.value.length;
        charCountEl.textContent = currentLength;
        
        // 计算字符变化量
        const diff = Math.abs(currentLength - lastTextLength);
        lastTextLength = currentLength;
        
        // 判断预加载数量
        let preloadCount = PRELOAD_CONFIG.manual; // 默认手动输入，只预加载 1 句
        if (diff >= PRELOAD_CONFIG.threshold) {
            preloadCount = PRELOAD_CONFIG.batch; // 批量输入，预加载 5 句
        }
        
        // 防抖预加载
        if (preloadTimer) clearTimeout(preloadTimer);
        preloadTimer = setTimeout(() => {
            preloadSentences(preloadCount);
        }, PRELOAD_CONFIG.debounce);
    }
    sourceTextEl.addEventListener('input',updateCharCount);
    // TXT文件上传读取
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
    // 顶部快捷链接新标签打开
    function openUrl(u){
        let url=u.trim();
        if(!/^https?:\/\//i.test(url)) url='https://'+url;
        window.open(url,'_blank');
    }
    quickLinkBtns.forEach(btn=>btn.addEventListener('click',()=>openUrl(btn.dataset.url)));
    // 全文朗读/停止按钮
    readAllBtnEl.addEventListener('click',function(){
        let txt = targetFullText.trim();
        
        // 如果还没开始练习，先进入预览模式
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
        speechState.rate = +speechRateEl.value;
        speechState.idx = -1;
        speechState.running = true;
        speechState.fallbackToSystem = false;
        this.classList.add('btn-speaking');
        this.textContent = '⏹ 停止朗读';
        nextSpeak('period');
    });
    // 朗读语速切换
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
    // 字号滑块调节
    fontSizeSlider.addEventListener('input', function () {
        fontScale = parseFloat(this.value);
        localStorage.setItem('fontScale', fontScale);
        document.documentElement.style.setProperty('--practice-font-scale', fontScale);
        let tip = "标准";
        if (fontScale <= 0.8) tip = "偏小";
        else if (fontScale <= 1.0) tip = "标准";
        else if (fontScale <= 1.2) tip = "偏大";
        else if (fontScale <= 1.4) tip = "很大";
        else tip = "超大";
        if(fontSizeText) fontSizeText.textContent = tip;
    });
    // 虚拟键盘开关
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
    // 语音选择
    const voiceSelect = document.getElementById('voiceSelect');
    if(voiceSelect) {
        initVoiceSelection();
        voiceSelect.addEventListener('change', function() {
            selectedVoiceURI = this.value;
            localStorage.setItem('selectedVoiceURI', selectedVoiceURI);
        });
    }
    
    // 清空全部内容按钮
    clearBtnEl.addEventListener('click',()=>{
        forceStopSpeech();
        sourceTextEl.value=''; 
        lastTextLength = 0; // 重置长度记录
        updateCharCount();
        bilingualAreaEl.classList.add('hidden');
        displayAreaEl.classList.remove('hidden');
        displayAreaEl.style.display = 'flex';
        isBilingualMode = false;
        isFullTextMode = false;
        finishedWordSet.clear();
        totalInput = 0;
        correctCnt = 0;
        currentPos = 0;
        isLastLineEnter = false;
        waitFinalEnter = false;
        accuracyEl.textContent = "0%";
        accBar.style.width = "0%";
        inputAreaEl.placeholder = "在这里打字...";
    });
    // 双语对照 展开/收起中文翻译
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
    // 开始练习按钮
    startBtnEl.addEventListener('click',()=>{
        forceStopSpeech();
        pendingText=sourceTextEl.value.trim();
        if(!pendingText){ alert('请粘贴练习内容'); return; }
        
        const needReset = typingRunning || entryCharsList.length > 0;
        if(needReset) {
            resetBtnEl.click();
        }
        if(hasChinese(pendingText)){
            modeModal.classList.remove('hidden');
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
    // 模式弹窗按钮
    modalOkBtn.addEventListener('click',()=>{
        modeModal.classList.add('hidden');
        if(typingRunning || entryCharsList.length > 0) {
            resetBtnEl.click();
        }
        setTimeout(() => {
            runTypingFullMode(pendingText);
        }, 50);
    });
    modalCancelBtn.addEventListener('click',()=>{
        modeModal.classList.add('hidden');
        if(typingRunning || entryCharsList.length > 0) {
            resetBtnEl.click();
        }
        setTimeout(() => {
            runTypingBilingualMode(pendingText);
        }, 50);
    });
    // 重新开始练习按钮
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
        
        // 重置虚拟键盘
        if (window.virtualKeyboard && typeof window.virtualKeyboard.reset === 'function') {
            try {
                window.virtualKeyboard.reset();
            } catch(e) {}
        }
        
        lastSpokenLineIndex = -1;
        finishModalAutoShown = false;
    });
    // 页面关闭前清理
    window.addEventListener('beforeunload',()=>{
        forceStopSpeech();
        clearInterval(timerId);
    });
    // 帮助弹窗
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
    // 输入框聚焦自动滚动
    inputAreaEl.addEventListener('focus', function() {
        if (!typingRunning) return;
        setTimeout(() => {
            if(isBilingualMode && paragraphContainerEl){
                paragraphContainerEl.scrollIntoView({block: 'nearest', behavior: 'smooth'});
            }
        }, 350);
    });
    // 窗口resize自动滚动
    window.addEventListener('resize', () => {
        if (!typingRunning || !inputAreaEl.matches(':focus')) return;
        setTimeout(() => {
            if(isBilingualMode && paragraphContainerEl){
                paragraphContainerEl.scrollIntoView({block: 'nearest', behavior: 'smooth'});
            }
        }, 200);
    });
}
// 页面加载初始化字号
document.documentElement.style.setProperty('--practice-font-scale', fontScale);
fontSizeSlider.value = fontScale;
let initTip = "标准";
if (fontScale <= 0.8) initTip = "偏小";
else if (fontScale <= 1.0) initTip = "标准";
else if (fontScale <= 1.2) initTip = "偏大";
else if (fontScale <= 1.4) initTip = "很大";
else initTip = "超大";
if(fontSizeText) fontSizeText.textContent = initTip;
// 更新主题按钮文字
function updateThemeButtonText(){
    if(currentTheme === 'dark'){
        themeToggleBtn.textContent = '切换日间模式';
    }else{
        themeToggleBtn.textContent = '切换夜间模式';
    }
}
// 更新单词朗读按钮
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