// js/core/typing-input.js 修正后的完整代码（仅修改调用部分）

// ========== 输入框核心逻辑 ==========
function bindInputEvent() {
    // 禁止粘贴
    inputAreaEl.addEventListener('paste', function(e) {
        e.preventDefault();
    });

    // 新增：回车拦截监听（放在input事件外层，同级）
    inputAreaEl.addEventListener('keydown', function(e){
        if(e.key === 'Enter'){
            e.preventDefault(); // 阻止textarea自动换行
            doHandleTypingEnter(); // 执行切换行/结算逻辑
        }
    });

    // 输入监听
    inputAreaEl.addEventListener('input',function(e){
        if(!typingRunning) return;
        const val = this.value;
        const activeChars = entryCharsList[currentEntryIndex];
        const entryLen = activeChars.length;

        // 统计有效击键，过滤换行符，回车不触发按键/错误音效
        if(val.length > prevInputValue.length) {
            const startIdx = prevInputValue.length;
            const endIdx = val.length;
            for(let i = startIdx; i < endIdx; i++) {
                const char = val[i];
                // 换行/回车符直接跳过，不统计、不播放任何音效
                if(char === '\n' || char === '\r') continue;
                if(i >= entryLen) break;
                totalInput++;
                if(char === activeChars[i]) {
                    correctCnt++;
                    playKeySound(); // 正确按键音效
                }else{
                    playErrorSound(); // 输错警示音效
                }
            }
        }

        // 空格触发单词朗读
        if(wordSpeakEnable === 'true' && val.length > prevInputValue.length) {
            const lastChar = val.slice(-1);
            if(lastChar === ' ' || lastChar === '　') {
                const currentInput = val.trim();
                const wordList = currentInput.split(/\s+/);
                const targetWord = wordList[wordList.length - 1];
                if(/^[a-zA-Z'-]+$/.test(targetWord) && targetWord.length > 0) {
                    speechSynthesis.cancel();
                    const utter = createUtterance(targetWord, speechState.rate);
                    speechSynthesis.speak(utter);
                }
            }
        }

        prevInputValue = val;

        // 限制输入长度
        if(val.length > entryLen){
            this.value = val.slice(0, entryLen);
            prevInputValue = this.value;
            return;
        }

        // 逐字符样式渲染
        const allSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
        allSpans.forEach(s=>s.className='char-pending');
        let hasError = false;
        let currentSpan = null; // 新增：保存当前光标span

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
            currentSpan = allSpans[val.length]; // 新增：获取当前光标span
        }

        // ========== 兼容触屏设备：获取坐标 ==========
        let posX = e.clientX || window.innerWidth / 2;
        let posY = e.clientY || window.innerHeight / 2;

        // 错误/连击逻辑
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
            if(comboCount===5){
                unlockSticker(0);
                batchStar(posX, posY, 3);
                showComboTip('5连击！很棒', posX, posY-40);
            }else if(comboCount===10){
                unlockSticker(1);
                batchStar(posX, posY, 5);
                showComboTip('10连击太厉害了！', posX, posY-40);
            }else if(comboCount===15){
                unlockSticker(2);
                batchStar(posX, posY, 7);
                showComboTip('完美15连击🎉', posX, posY-40);
            }else if(comboCount>15){
                createStar(posX, posY);
            }
        }

        // 定位当前光标字符，滚动容器让字符可视
        function scrollToCurrentChar(span) {
          const container = document.querySelector('.paragraph-container');
          if (!container || !span) return;
          const containerRect = container.getBoundingClientRect();
          const spanRect = span.getBoundingClientRect();

          let offset = containerRect.height / 2;
          // 手机屏幕宽度小于768时，光标置顶，不居中，避开底部输入法键盘
          if(window.innerWidth <= 768) {
              offset = 20;
          }
          const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - offset;
          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        }

        // ✅ 新增：调用滚动函数，让当前输入位置始终可见
        scrollToCurrentChar(currentSpan);

        updateStat();
    });
}

// 【核心修复】挂载到window全局，event-base.js可跨文件调用，增加完整调试日志
window.doHandleTypingEnter = function() {
    console.log("进入全局回车处理函数 doHandleTypingEnter");
    console.log("typingRunning:", typingRunning, "currentEntryIndex:", currentEntryIndex);
    if (!typingRunning) {
        console.log("未开始练习，直接返回");
        return;
    }
    const val = inputAreaEl.value;
    const activeChars = entryCharsList[currentEntryIndex];
    const entryLen = activeChars.length;
    console.log("当前行字符长度", entryLen, "输入框内容：", val);

    // 朗读当前行文本
    if(wordSpeakEnable === 'true' && !(currentEntryIndex === entryCharsList.length - 1 && isLastLineEnter)) {
        if(val.trim() !== ''){
            const currentLineText = entryCharsList[currentEntryIndex].join('');
            if(/[a-zA-Z]/.test(currentLineText)) {
                speechSynthesis.cancel();
                const utter = createUtterance(currentLineText, speechState.rate);
                speechSynthesis.speak(utter);
            }
        }
    }

    // 标记本行完成，累加总字符进度
    if(!finishedWordSet.has(currentEntryIndex)){
        finishedWordSet.add(currentEntryIndex);
        currentPos += entryLen;
        console.log("标记本行完成，总进度字符：", currentPos);
    }
    
    // 渲染本行所有字符为已完成样式
    const currentSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
    currentSpans.forEach(s => {
        if (s.classList.contains('char-correct') || s.classList.contains('char-wrong')) {
            s.classList.add('char-done');
        }
        s.classList.remove('char-current');
    });

    if(currentEntryIndex < entryCharsList.length - 1){
        // 切换下一行
        currentEntryIndex++;
        inputAreaEl.value = '';
        prevInputValue = '';
        inputAreaEl.placeholder = "在这里打字...";
        const newSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
        if(newSpans[0]) newSpans[0].className='char-current';
        const container = paragraphContainerEl;
        const firstSpan = newSpans[0];
        if(firstSpan){
            const containerRect = container.getBoundingClientRect();
            const spanRect = firstSpan.getBoundingClientRect();
            const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - containerRect.height / 2;
            container.scrollTo({top: scrollTop, behavior: 'smooth'});
        }
        console.log("切换至下一行，新下标：", currentEntryIndex);
    } else {
        // 最后一行逻辑
        if(!isLastLineEnter){
            // 第一次回车：等待二次确认
            isLastLineEnter = true;
            waitFinalEnter = true;
            inputAreaEl.value = '';
            prevInputValue = '';
            currentPos = targetChars.length;
            clearInterval(timerId);
            inputAreaEl.placeholder = "已完成全部输入，请再次按下回车查看成绩";
            updateStat();
            console.log("最后一行首次回车，等待二次确认");
        } else {
            // 第二次回车：结束练习，重置所有状态
            speechSynthesis.cancel();
            waitFinalEnter = false;
            inputAreaEl.placeholder = "在这里打字...";
            showFinishModal();
            typingRunning = false;
            inputAreaEl.disabled = true;
            resetBtnEl.disabled = false;
            console.log("二次回车，练习结束，弹出成绩弹窗");
        }
    }
    updateStat();
    console.log("回车逻辑执行完毕\n");
}