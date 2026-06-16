// ========== 朗读回调 ==========
function nextSpeak(lastPause){
    if(!speechState.running) return;
    document.querySelectorAll('.sentence-read-highlight').forEach(el=>{
        el.classList.remove('sentence-read-highlight');
    });
    speechState.idx++;
    if(speechState.idx>=speechState.sentences.length){
        speechState.running=false;
        readAllBtnEl.classList.remove('btn-speaking');
        readAllBtnEl.textContent='🔊 朗读全文';
        return;
    }
    const sen=speechState.sentences[speechState.idx];
    if(!sen.text.trim()){ nextSpeak(sen.pauseType); return; }
    let charOffset = 0;
    const allSent = speechState.sentences.slice(0,speechState.idx);
    allSent.forEach(s=>charOffset += s.text.length);
    const endOffset = charOffset + sen.text.length;
    if (isBilingualMode) {
        const allEnSpans = paragraphContainerEl.querySelectorAll('.paragraph-full span, .paragraph-en span');
        for(let i=charOffset;i<endOffset && i<allEnSpans.length;i++){
            allEnSpans[i].classList.add('sentence-read-highlight');
        }
    } else {
        const spans = displayAreaEl.querySelectorAll('span');
        for(let i=charOffset;i<endOffset && i<spans.length;i++){
            spans[i].classList.add('sentence-read-highlight');
        }
    }
    pauseTimer=setTimeout(()=>{
        const ut=createUtterance(sen.text,speechState.rate);
        ut.onend=()=>nextSpeak(sen.pauseType);
        ut.onerror=()=>nextSpeak(sen.pauseType);
        speechSynthesis.speak(ut);
    },PAUSE_CONFIG[lastPause]);
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
            this.classList.remove('btn-speaking');
            this.textContent='🔊 朗读全文';
            return;
        }
        speechState.rate=+speechRateEl.value;
        speechState.sentences=splitSentences(txt);
        speechState.idx=0;
        speechState.running=true;
        this.classList.add('btn-speaking');
        this.textContent='⏹ 停止朗读';
        const first=speechState.sentences[0];
        const ut=createUtterance(first.text,speechState.rate);
        ut.onend=()=>nextSpeak(first.pauseType);
        ut.onerror=()=>nextSpeak(first.pauseType);
        speechSynthesis.speak(ut);
    });

    // 语速切换
    speechRateEl.addEventListener('change',()=>speechState.rate=+this.value);

    // 音量切换
    const volumeText = document.getElementById('volumeText');
    speechVolumeEl.addEventListener('input', function(){
        speechState.volume = parseFloat(this.value);
        localStorage.setItem('speechVolume', this.value);
        volumeText.textContent = Math.round(this.value * 100) + '%';
    });
    volumeText.textContent = Math.round(speechState.volume * 100) + '%';
    
    // ========== 新增：字号调节事件 ==========
    fontSizeSlider.addEventListener('input', function () {
        fontScale = parseFloat(this.value);
        // 写入本地存储
        localStorage.setItem('fontScale', fontScale);
        // 设置CSS根变量，实时生效
        document.documentElement.style.setProperty('--practice-font-scale', fontScale);
        // 切换文字提示
        let tip = "标准";
        if (fontScale <= 0.8) tip = "偏小";
        else if (fontScale <= 1.0) tip = "标准";
        else if (fontScale <= 1.3) tip = "偏大";
        else tip = "超大";
        fontSizeText.textContent = tip;
    });

// 页面初始化：加载保存的字号
document.documentElement.style.setProperty('--practice-font-scale', fontScale);
// 初始化滑块位置 + 文字
fontSizeSlider.value = fontScale;
let initTip = "标准";
if (fontScale <= 0.8) initTip = "偏小";
else if (fontScale <= 1.0) initTip = "标准";
else if (fontScale <= 1.3) initTip = "偏大";
else initTip = "超大";
fontSizeText.textContent = initTip;

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
    });

    // 页面卸载清理
    window.addEventListener('beforeunload',()=>{
        clearTimeout(pauseTimer); speechSynthesis.cancel();
        speechState.running=false; clearInterval(timerId);
    });
}