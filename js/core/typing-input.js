// 全局打字状态变量（外部依赖）
let typingRunning = false;
let currentPos = 0;
let prevInputValue = "";
let entryCharsList = [];
let finishedWordSet = new Set();
let comboCount = 0;
let wrongContinuous = 0;
let totalInput = 0;
let correctCnt = 0;
let startTime = null;
let timerId = null;
let isLastLineEnter = false;
let waitFinalEnter = false;

// DOM元素引用（由event-base注入）
let inputAreaEl, displayAreaEl, paragraphContainerEl;
let speedEl, accuracyEl, timeUsedEl, progressEl;
let speedBar, accBar, progBar;

// 初始化DOM引用
function initTypingDomRefs(domRefs) {
    inputAreaEl = domRefs.inputAreaEl;
    displayAreaEl = domRefs.displayAreaEl;
    paragraphContainerEl = domRefs.paragraphContainerEl;
    speedEl = domRefs.speedEl;
    accuracyEl = domRefs.accuracyEl;
    timeUsedEl = domRefs.timeUsedEl;
    progressEl = domRefs.progressEl;
    speedBar = domRefs.speedBar;
    accBar = domRefs.accBar;
    progBar = domRefs.progBar;
}

// 处理输入字符核心逻辑（修复：空格必须手动输入才允许前进光标）
function handleTypingInput(inputVal) {
    if (!typingRunning) return;
    if (!startTime) startTime = Date.now();
    totalInput++;
    const inputLen = inputVal.length;
    prevInputValue = inputVal;

    // 边界保护
    if (inputLen > entryCharsList.length) {
        inputAreaEl.value = inputVal.slice(0, entryCharsList.length);
        return;
    }

    // 逐字符校验，阻断未输入空格自动跳转
    let newPos = 0;
    let allCorrect = true;
    for (; newPos < inputLen; newPos++) {
        const targetChar = entryCharsList[newPos];
        const inputChar = inputVal[newPos];

        // 关键修复：目标是空格，但用户当前输入不是空格，停止光标前进
        if (targetChar === " " && inputChar !== " ") {
            break;
        }

        if (inputChar !== targetChar) {
            allCorrect = false;
            wrongContinuous++;
            comboCount = 0;
        } else {
            wrongContinuous = 0;
            comboCount++;
            if (newPos >= currentPos) correctCnt++;
        }
    }
    currentPos = newPos;

    // 刷新高亮视图
    refreshTypingHighlight(inputVal);
    // 更新统计面板
    updateTypingStats();
    // 判断是否整行完成
    checkLineFinish(inputVal);
}

// 刷新对照区字符高亮
function refreshTypingHighlight(inputVal) {
    const inputLen = inputVal.length;
    const allSpans = (isBilingualMode ? paragraphContainerEl : displayAreaEl).querySelectorAll("span");
    allSpans.forEach((span, idx) => {
        span.classList.remove("typing-correct", "typing-wrong", "typing-cursor");
        const char = entryCharsList[idx];
        if (idx < inputLen) {
            if (inputVal[idx] === char) {
                span.classList.add("typing-correct");
            } else {
                span.classList.add("typing-wrong");
            }
        } else if (idx === inputLen) {
            span.classList.add("typing-cursor");
        }
    });
}

// 校验当前行是否全部输入完成
function checkLineFinish(inputVal) {
    if (currentPos >= entryCharsList.length) {
        waitFinalEnter = true;
        isLastLineEnter = true;
    } else {
        waitFinalEnter = false;
        isLastLineEnter = false;
    }
}

// 处理回车Enter按键逻辑
function handleTypingEnter() {
    if (!typingRunning) return;
    // 未完成当前单词，禁止回车跳转
    if (currentPos < entryCharsList.length && !waitFinalEnter) return;
    if (waitFinalEnter) {
        finishAllTyping();
        return;
    }
    // 切换下一组文本
    nextParagraphItem();
}

// 切换下一段单词文本
function nextParagraphItem() {
    currentEntryIndex++;
    if (currentEntryIndex >= paragraphEntryList.length) {
        waitFinalEnter = true;
        isLastLineEnter = true;
        return;
    }
    // 重置输入框与光标
    inputAreaEl.value = "";
    prevInputValue = "";
    currentPos = 0;
    loadSingleParagraphEntry(paragraphEntryList[currentEntryIndex]);
}

// 加载单组中英对照文本
function loadSingleParagraphEntry(entry) {
    entryCharsList = entry.charList;
    renderSingleParagraph(entry);
    refreshTypingHighlight("");
    // 自动滚动到当前练习段落
    setTimeout(() => {
        const cursorSpan = (isBilingualMode ? paragraphContainerEl : displayAreaEl).querySelector(".typing-cursor");
        if (cursorSpan) cursorSpan.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 30);
}

// 更新打字速度、准确率、进度统计
function updateTypingStats() {
    const usedMs = Date.now() - startTime;
    const usedMin = usedMs / 60000;
    const speed = usedMin === 0 ? 0 : Math.round(correctCnt / usedMin);
    const accuracy = totalInput === 0 ? 0 : Math.round((correctCnt / totalInput) * 100);
    const progressRate = Math.round((currentPos / entryCharsList.length) * 100);

    speedEl.textContent = speed;
    accuracyEl.textContent = accuracy + "%";
    progressEl.textContent = progressRate + "%";
    speedBar.style.width = Math.min(speed / 200, 100) + "%";
    accBar.style.width = accuracy + "%";
    progBar.style.width = progressRate + "%";

    // 时间格式化 mm:ss
    const sec = Math.floor(usedMs / 1000) % 60;
    const min = Math.floor(usedMs / 60000);
    timeUsedEl.textContent = String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
}

// 全部文本练习结束，弹出成绩面板
function finishAllTyping() {
    typingRunning = false;
    clearInterval(timerId);
    inputAreaEl.disabled = true;
    resetBtnEl.disabled = false;
    // 渲染成绩弹窗逻辑省略（保持原有业务逻辑不变）
}

// 重置打字全部状态
function resetTypingState() {
    typingRunning = false;
    currentPos = 0;
    prevInputValue = "";
    totalInput = 0;
    correctCnt = 0;
    comboCount = 0;
    wrongContinuous = 0;
    startTime = null;
    timerId = null;
    waitFinalEnter = false;
    isLastLineEnter = false;
    entryCharsList = [];
    finishedWordSet.clear();
    currentEntryIndex = 0;
}
