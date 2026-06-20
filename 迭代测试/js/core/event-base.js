// js/core/event-base.js 完整代码
// 彻底删除所有回车相关代码，回车逻辑完全由 typing-input.js 处理

// ========== 全局语音API兜底 ==========
if (!window.speechSynthesis) window.speechSynthesis = null;
if (!window.SpeechSynthesisUtterance) window.SpeechSynthesisUtterance = null;

// ========== 朗读滚动高亮逻辑 ==========
async function nextSpeak(lastPause){
    if(!speechState.running) return;
    
    document.querySelectorAll('.sentence-read-highlight').forEach(el=>{
        el.classList.remove('sentence-read-highlight');
    });
    
    speechState.idx++;
    if(speechState.idx >= speechSentenceMap.length){
        speechState.running = false;
        readAllBtnEl.classList.remove('btn-speaking');
        readAllBtnEl.textContent = '🔊 朗读全文';
        return;
    }
    
    const currentItem = speechSentenceMap[speechState.idx];
    if(!currentItem) return;
    
    const senText = currentItem.text;
    const senPause = currentItem.pauseType;
    const startIdx = currentItem.startNode;
    const endIdx = currentItem.endNode;
    
    if(!senText.trim()){
        setTimeout(() => nextSpeak(senPause), PAUSE_CONFIG[senPause]);
        return;
    }
    
    // 高亮当前句子
    let allSpans = [];
    if (isBilingualMode) {
        allSpans = paragraphContainerEl.querySelectorAll('.paragraph-full span, .paragraph-en span');
    } else {
        allSpans = displayAreaEl.querySelectorAll('span');
    }
    for(let i = startIdx; i <= endIdx && i < allSpans.length; i++){
        allSpans[i].classList.add('sentence-read-highlight');
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
    
    // 延迟后播放，等播放完再继续下一句
    setTimeout(async () => {
        await speakSingle(senText, speechState.rate);
        nextSpeak(senPause);
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

    // 文本字符实时计数
    function updateCharCount(){ charCountEl.textContent=sourceTextEl.value.length; }
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
        // 解锁移动端音频
        if(window.onlineTTS) window.onlineTTS.unlockAudio();
        
        let txt = targetFullText.trim();
        if(!txt){
            alert('展示区暂无文字，请先点击【开始练习】');
            return;
        }
        clearTimeout(pauseTimer);
        stopAllSpeech();
        if(speechState.running){
            speechState.running=false;
            stopAllSpeech();
            document.querySelectorAll('.sentence-read-highlight').forEach(el=>{
                el.classList.remove('sentence-read-highlight');
            });
            readAllBtnEl.classList.remove('btn-speaking');
            this.textContent='🔊 朗读全文';
            return;
        }

        speechState.rate = +speechRateEl.value;
        speechState.idx = 0;
        speechState.running = true;
        this.classList.add('btn-speaking');
        this.textContent = '⏹ 停止朗读';

        const firstItem = speechSentenceMap[0];
        if(!firstItem) return;

        let allSpans = [];
        if (isBilingualMode) {
            allSpans = paragraphContainerEl.querySelectorAll('.paragraph-full span, .paragraph-en span');
        } else {
            allSpans = displayAreaEl.querySelectorAll('span');
        }
        for(let i = firstItem.startNode; i <= firstItem.endNode && i < allSpans.length; i++){
            allSpans[i].classList.add('sentence-read-highlight');
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

        // 用统一接口播放第一句，播完再继续下一句
        (async () => {
            await speakSingle(firstItem.text, speechState.rate);
            nextSpeak(firstItem.pauseType);
        })();
    });

    // 朗读语速切换
    speechRateEl.addEventListener('change',()=>speechState.rate=+speechRateEl.value);

    // 音量调节
    speechVolumeEl.addEventListener('input', function(){
        speechState.volume = parseFloat(this.value);
        localStorage.setItem('speechVolume', this.value);
    });

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
        // 初始化按钮文字
        const vkEnabled = localStorage.getItem('virtualKeyboardEnabled') === 'true';
        vkToggleBtn.textContent = vkEnabled ? '虚拟键盘：已开启' : '虚拟键盘：已关闭';
        if(vkEnabled) vkToggleBtn.classList.add('btn-success');
        
        vkToggleBtn.addEventListener('click', () => {
            if(window.virtualKeyboard) {
                window.virtualKeyboard.toggle();
                const isOn = window.virtualKeyboard.isEnabled();
                vkToggleBtn.textContent = isOn ? '虚拟键盘：已开启' : '虚拟键盘：已关闭';
                if(isOn) {
                    vkToggleBtn.classList.add('btn-success');
                } else {
                    vkToggleBtn.classList.remove('btn-success');
                }
            }
        });
    }

    // 语音选择
     const voiceSelect = document.getElementById('voiceSelect');
     if(voiceSelect && window.speechSynthesis) {
         // 初始化语音列表
         initVoiceSelection();
         
         // 语音选择变化
         voiceSelect.addEventListener('change', function() {
             selectedVoiceURI = this.value;
             localStorage.setItem('selectedVoiceURI', selectedVoiceURI);
         });
     }
    
    // 语音引擎选择
    const engineSelect = document.getElementById('engineSelect');
    if(engineSelect) {
        // 初始化
        const savedEngine = getSpeechEngine();
        engineSelect.value = savedEngine;
        
        // 切换事件
        engineSelect.addEventListener('change', function() {
            setSpeechEngine(this.value);
            // 切换时停止当前播放
            stopAllSpeech();
            speechState.running = false;
            readAllBtnEl.classList.remove('btn-speaking');
            readAllBtnEl.textContent = '🔊 朗读全文';
            document.querySelectorAll('.sentence-read-highlight').forEach(el=>{
                el.classList.remove('sentence-read-highlight');
            });
        });
    }

    
    // 清空全部内容按钮
    clearBtnEl.addEventListener('click',()=>{
        sourceTextEl.value=''; updateCharCount();
        clearTimeout(pauseTimer); 
        stopAllSpeech();
        speechState.running=false;

        readAllBtnEl.classList.remove('btn-speaking');
        readAllBtnEl.textContent='🔊 朗读全文';
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
        pendingText=sourceTextEl.value.trim();
        if(!pendingText){ alert('请粘贴练习内容'); return; }
        
        // 先重置所有状态，确保每次开始都是干净的
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
        // 先重置再开始
        if(typingRunning || entryCharsList.length > 0) {
            resetBtnEl.click();
        }
        setTimeout(() => {
            runTypingFullMode(pendingText);
        }, 50);
    });
    modalCancelBtn.addEventListener('click',()=>{
        modeModal.classList.add('hidden');
        // 先重置再开始
        if(typingRunning || entryCharsList.length > 0) {
            resetBtnEl.click();
        }
        setTimeout(() => {
            runTypingBilingualMode(pendingText);
        }, 50);
    });

    // 重新开始练习按钮
    resetBtnEl.addEventListener('click',()=>{
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
        document.querySelectorAll('.sentence-read-highlight').forEach(el=>el.classList.remove('sentence-read-highlight'));
        const mask = document.getElementById('finishMask');
        if(mask) mask.remove();
        inputAreaEl.placeholder = "在这里打字...";
        
        // 重置虚拟键盘
        if (window.virtualKeyboard) {
            window.virtualKeyboard.reset();
        }
        
        // 重置自动朗读去重标记
        lastSpokenLineIndex = -1;
        finishModalAutoShown = false;
    });

    // 页面关闭前清理
    window.addEventListener('beforeunload',()=>{
        clearTimeout(pauseTimer); 
        stopAllSpeech();
        speechState.running=false; clearInterval(timerId);
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