// ========== 重构后：朗读回调（DOM映射版，无字符偏移错位） ==========
function nextSpeak(lastPause){
    if(!speechState.running) return;

    // 1. 清除所有旧高亮
    document.querySelectorAll('.sentence-read-highlight').forEach(el=>{
        el.classList.remove('sentence-read-highlight');
    });

    speechState.idx++;
    // 遍历完毕，结束朗读
    if(speechState.idx >= speechSentenceMap.length){
        speechState.running = false;
        readAllBtnEl.classList.remove('btn-speaking');
        readAllBtnEl.textContent = '🔊 朗读全文';
        return;
    }

    // 容错：防止映射表数据异常
    const currentItem = speechSentenceMap[speechState.idx];
    if(!currentItem) return;

    const senText = currentItem.text;
    const senPause = currentItem.pauseType;
    const startIdx = currentItem.startNode;
    const endIdx = currentItem.endNode;

    // 空句子直接跳过
    if(!senText.trim()){
        setTimeout(() => nextSpeak(senPause), PAUSE_CONFIG[senPause]);
        return;
    }

    // 3. 获取当前页面所有字符span（区分两种模式）
    let allSpans = [];
    if (isBilingualMode) {
        allSpans = paragraphContainerEl.querySelectorAll('.paragraph-full span, .paragraph-en span');
    } else {
        allSpans = displayAreaEl.querySelectorAll('span');
    }

    // 4. 给区间内节点添加高亮
    for(let i = startIdx; i <= endIdx && i < allSpans.length; i++){
        allSpans[i].classList.add('sentence-read-highlight');
    }

    // 5. 自动滚动到高亮区域
    let firstHighlight = null;
    if (isBilingualMode) {
        firstHighlight = paragraphContainerEl.querySelector('.sentence-read-highlight');
    } else {
        firstHighlight = displayAreaEl.querySelector('.sentence-read-highlight');
    }
    if(firstHighlight){
        firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 6. 延时后朗读音频（时序：先高亮、再发声，视听同步）
    pauseTimer = setTimeout(()=>{
        const ut = createUtterance(senText, speechState.rate);
        ut.onend = () => nextSpeak(senPause);
        ut.onerror = () => nextSpeak(senPause);
        speechSynthesis.speak(ut);
    }, PAUSE_CONFIG[lastPause]);
}

// ========== 绑定所有基础事件 ==========
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
    updateWordSpeakBtnText();
    wordSpeakToggleBtn.addEventListener('click', () => {
        wordSpeakEnable = wordSpeakEnable === 'true' ? 'false' : 'true';
        localStorage.setItem('wordSpeakEnable', wordSpeakEnable);
        updateWordSpeakBtnText();
    });

    // 字符数统计
    function updateCharCount(){ charCountEl.textContent=sourceTextEl.value.length; }
    sourceTextEl.addEventListener('input',updateCharCount);

    // TXT文件上传
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

    // 快捷链接
    function openUrl(u){
        let url=u.trim();
        if(!/^https?:\/\//i.test(url)) url='https://'+url;
        window.open(url,'_blank');
    }
    quickLinkBtns.forEach(btn=>btn.addEventListener('click',()=>openUrl(btn.dataset.url)));

    // 全文朗读
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
            // 停止时清空高亮
            document.querySelectorAll('.sentence-read-highlight').forEach(el=>{
                el.classList.remove('sentence-read-highlight');
            });
            readAllBtnEl.classList.remove('btn-speaking');
            this.textContent='🔊 朗读全文';
            return;
        }

        speechState.rate = +speechRateEl.value;
        speechState.sentences = []; // 弃用原句子数组，使用speechSentenceMap
        speechState.idx = 0;
        speechState.running = true;
        this.classList.add('btn-speaking');
        this.textContent = '⏹ 停止朗读';

        // 读取映射表第一句，开始朗读
        const firstItem = speechSentenceMap[0];
        if(!firstItem) return;

        // 初始高亮第一句
        let allSpans = [];
        if (isBilingualMode) {
            allSpans = paragraphContainerEl.querySelectorAll('.paragraph-full span, .paragraph-en span');
        } else {
            allSpans = displayAreaEl.querySelectorAll('span');
        }
        for(let i = firstItem.startNode; i <= firstItem.endNode && i < allSpans.length; i++){
            allSpans[i].classList.add('sentence-read-highlight');
        }

        // 初始滚动
        let firstHighlight = null;
        if (isBilingualMode) {
            firstHighlight = paragraphContainerEl.querySelector('.sentence-read-highlight');
        } else {
            firstHighlight = displayAreaEl.querySelector('.sentence-read-highlight');
        }
        if(firstHighlight){
            firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // 播放第一句音频
        const ut = createUtterance(firstItem.text, speechState.rate);
        ut.onend = () => nextSpeak(firstItem.pauseType);
        ut.onerror = () => nextSpeak(firstItem.pauseType);
        speechSynthesis.speak(ut);
    });

    // 语速切换
    speechRateEl.addEventListener('change',()=>speechState.rate=+this.value);

    // 音量切换（已删除volumeText相关逻辑）
    speechVolumeEl.addEventListener('input', function(){
        speechState.volume = parseFloat(this.value);
        localStorage.setItem('speechVolume', this.value);
    });
    
    // ========== 字号调节事件（移除fontSizeText文字更新逻辑） ==========
    fontSizeSlider.addEventListener('input', function () {
        fontScale = parseFloat(this.value);
        // 写入本地存储
        localStorage.setItem('fontScale', fontScale);
        // 设置CSS根变量，实时生效
        document.documentElement.style.setProperty('--practice-font-scale', fontScale);
    });

    // 清空按钮
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
        // 新增恢复占位
        inputAreaEl.placeholder = "在这里打字...";
    });

    // 对照栏展开/收起
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

    // 重新开始按钮
    resetBtnEl.addEventListener('click',()=>{
        typingRunning=false; clearInterval(timerId);
        speechSentenceMap = []; // 清空朗读映射表
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
        // 新增：重置输入框提示文字
        inputAreaEl.placeholder = "在这里打字...";
    });

    // 页面卸载清理
    window.addEventListener('beforeunload',()=>{
        clearTimeout(pauseTimer); speechSynthesis.cancel();
        speechState.running=false; clearInterval(timerId);
    });
    
    // ========== 使用提醒弹窗事件 ==========
    // 打开提醒弹窗
    helpBtn.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
    });

    // 关闭按钮关闭弹窗
    helpCloseBtn.addEventListener('click', () => {
        helpModal.classList.add('hidden');
    });

    // 点击弹窗遮罩空白处关闭
    helpModal.addEventListener('click', (e) => {
        if(e.target === helpModal){
            helpModal.classList.add('hidden');
        }
    });
}

// ========== 字号初始化【移至函数外部，解决刷新字体闪烁】 ==========
document.documentElement.style.setProperty('--practice-font-scale', fontScale);
fontSizeSlider.value = fontScale;

// ========== 单词朗读按钮文字&样式更新（已改为统一蓝色主按钮色系，移除btn-success绿色） ==========
function updateWordSpeakBtnText() {
    if(wordSpeakEnable === 'true') {
        wordSpeakToggleBtn.textContent = '单词朗读：已开启';
        wordSpeakToggleBtn.classList.remove('btn-normal');
        wordSpeakToggleBtn.classList.add('btn-primary');
    } else {
        wordSpeakToggleBtn.textContent = '单词朗读：已关闭';
        wordSpeakToggleBtn.classList.remove('btn-primary');
        wordSpeakToggleBtn.classList.add('btn-normal');
    }
}