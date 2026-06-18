// js/core/event-base.js 完整代码
// ========== 朗读滚动高亮逻辑 ==========
function nextSpeak(lastPause){
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

    pauseTimer = setTimeout(()=>{
        const ut = createUtterance(senText, speechState.rate);
        ut.onend = () => nextSpeak(senPause);
        ut.onerror = () => nextSpeak(senPause);
        speechSynthesis.speak(ut);
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

    // 单词朗读开关 - 增加空值判断，解决GitHub Pages加载慢时元素未就绪问题
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
    quickLinkBtns.forEach(btn=>btn.addEventListener('click',()=>openUrl(btn.dataset)));

    // 全文朗读/停止按钮
    readAllBtnEl.addEventListener('click',function(){
        let txt = targetFullText.trim();
        if(!txt){
            alert('展示区暂无文字，请先点击【开始练习】');
            return;
        }
        clearTimeout(pauseTimer);
        speechSynthesis.cancel();
        if(speechState.running){
            speechState.running=false;
            speechSynthesis.cancel();
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

        const ut = createUtterance(firstItem.text, speechState.rate);
        ut.onend = () => nextSpeak(firstItem.pauseType);
        ut.onerror = () => nextSpeak(firstItem.pauseType);
        speechSynthesis.speak(ut);
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

    // 清空全部内容按钮
    clearBtnEl.addEventListener('click',()=>{
        sourceTextEl.value=''; updateCharCount();
        clearTimeout(pauseTimer); speechSynthesis.cancel();
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
        if(hasChinese(pendingText)){
            modeModal.classList.remove('hidden');
            return;
        }
        runTypingFullMode(pendingText);
    });

    // 模式弹窗按钮
    modalOkBtn.addEventListener('click',()=>{
        modeModal.classList.add('hidden');
        runTypingFullMode(pendingText);
    });
    modalCancelBtn.addEventListener('click',()=>{
        modeModal.classList.add('hidden');
        runTypingBilingualMode(pendingText);
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
    });

    // 页面关闭前清理定时器与语音
    window.addEventListener('beforeunload',()=>{
        clearTimeout(pauseTimer); speechSynthesis.cancel();
        speechState.running=false; clearInterval(timerId);
    });

    // 帮助弹窗打开
    helpBtn.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
    });
    // 关闭帮助弹窗
    helpCloseBtn.addEventListener('click', () => {
        helpModal.classList.add('hidden');
    });
    helpModal.addEventListener('click', (e) => {
        if(e.target === helpModal){
            helpModal.classList.add('hidden');
        }
    });

    // 输入框聚焦自动滚动文本区域，延时延长至350ms适配手机输入法加载
    inputAreaEl.addEventListener('focus', function() {
        if (!typingRunning) return;
        setTimeout(() => {
            if(isBilingualMode && paragraphContainerEl){
                paragraphContainerEl.scrollIntoView({block: 'nearest', behavior: 'smooth'});
            }
        }, 350);
    });

    // 监听窗口resize（手机软键盘弹出/收起触发）自动滚动对照区
    window.addEventListener('resize', () => {
        if (!typingRunning || !inputAreaEl.matches(':focus')) return;
        setTimeout(() => {
            if(isBilingualMode && paragraphContainerEl){
                paragraphContainerEl.scrollIntoView({block: 'nearest', behavior: 'smooth'});
            }
        }, 200);
    });

    // 输入实时滚动至当前字符
    inputAreaEl.addEventListener('input', function() {
        if (!typingRunning) return;
        setTimeout(() => {
            let targetDom = null;
            if(isBilingualMode){
                targetDom = paragraphContainerEl.querySelector('.char-wrong') || paragraphContainerEl.querySelector('.char-current') || paragraphContainerEl.querySelector('.char-pending');
            }else{
                targetDom = displayAreaEl.querySelector('.char-wrong') || displayAreaEl.querySelector('.char-current') || displayAreaEl.querySelector('.char-pending');
            }
            if(targetDom){
                targetDom.scrollIntoView({block:'nearest', behavior:'smooth'});
            }
        }, 80);
    });

    // ========== 仅保留keydown单套回车监听，删除keyup避免重复执行 ==========
    function runEnterLogic() {
        console.log('=== 回车触发执行 handleTypingEnter ===');
        console.log('当前练习状态 typingRunning:', typingRunning);
        console.log('当前行下标 currentEntryIndex:', currentEntryIndex);
        console.log('总行数 entryCharsList.length:', entryCharsList.length);
        window.doHandleTypingEnter();
    }
    inputAreaEl.addEventListener('keydown', function(e) {
        if (!typingRunning) return;
        if(e.key === 'Enter' || e.keyCode === 13 || e.code === 'Enter'){
            e.preventDefault();
            runEnterLogic();
        }
    });
    
        // 设置面板展开/收起（从index.html移到这里，确保DOM就绪）
    const settingToggleBtn = document.getElementById('settingToggleBtn');
    const settingPanel = document.getElementById('settingPanel');
    if(settingToggleBtn && settingPanel) {
        settingToggleBtn.addEventListener('click', () => {
            settingPanel.classList.toggle('hidden');
            settingToggleBtn.textContent = settingPanel.classList.contains('hidden') ? '⚙️ 更多设置' : '⚙️ 收起设置';
        });
    }
}

// 页面加载初始化字号样式
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

// 更新单词朗读按钮文字样式
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

// 统一回车处理函数（仅保留调用入口，核心逻辑移至typing-input.js）
function handleTypingEnter() {
    window.doHandleTypingEnter();
}