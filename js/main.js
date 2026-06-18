// js/main.js 最终完整版
window.addEventListener('load', () => {
    setTimeout(() => {
        // 1. 初始化字号UI
        if(fontSizeText){
            let tip = "标准";
            if (fontScale <= 0.8) tip = "偏小";
            else if (fontScale <= 1.0) tip = "标准";
            else if (fontScale <= 1.2) tip = "偏大";
            else if (fontScale <= 1.4) tip = "很大";
            else tip = "超大";
            fontSizeText.textContent = tip;
        }

        // 2. 绑定核心事件
        bindInputEvent();
        bindBaseEvents();

        // ========== 【重点：直接在这里绑定回车事件，100%生效】 ==========
        const inputArea = document.getElementById('inputArea');
        if(inputArea) {
            inputArea.addEventListener('keydown', function(e){
                if(e.key === 'Enter'){
                    e.preventDefault();
                    
                    if (!typingRunning) return;
                    
                    const val = inputArea.value;
                    const activeChars = entryCharsList[currentEntryIndex];
                    const entryLen = activeChars.length;

                    // 朗读当前行
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

                    // 标记完成
                    if(!finishedWordSet.has(currentEntryIndex)){
                        finishedWordSet.add(currentEntryIndex);
                        currentPos += entryLen;
                    }
                    
                    // 样式渲染
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
                        inputArea.value = '';
                        prevInputValue = '';
                        inputArea.placeholder = "在这里打字...";
                        const newSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
                        if(newSpans[0]) newSpans[0].className='char-current';
                    } else {
                        // 最后一行
                        if(!isLastLineEnter){
                            isLastLineEnter = true;
                            waitFinalEnter = true;
                            inputArea.value = '';
                            prevInputValue = '';
                            currentPos = targetChars.length;
                            clearInterval(timerId);
                            inputArea.placeholder = "已完成全部输入，请再次按下回车查看成绩";
                        } else {
                            speechSynthesis.cancel();
                            waitFinalEnter = false;
                            inputArea.placeholder = "在这里打字...";
                            showFinishModal();
                            typingRunning = false;
                            inputArea.disabled = true;
                            resetBtnEl.disabled = false;
                        }
                    }
                    updateStat();
                }
            });
        }

        // 3. 设置面板逻辑
        const settingToggleBtn = document.getElementById('settingToggleBtn');
        const settingPanel = document.getElementById('settingPanel');
        if(settingToggleBtn && settingPanel) {
            settingToggleBtn.addEventListener('click', () => {
                settingPanel.classList.toggle('hidden');
                settingToggleBtn.textContent = settingPanel.classList.contains('hidden') ? '⚙️ 更多设置' : '⚙️ 收起设置';
            });
        }

        // 4. 聚焦输入框
        if(sourceTextEl) sourceTextEl.focus();

    }, 500);
});