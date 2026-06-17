// js/core/typing-input.js完整代码
// 全局错误日志工具（写入localStorage持久保存，刷新不丢失）
const LogTool = {
    STORAGE_KEY: "typing_error_logs",
    MAX_LOG_COUNT: 200,

    getNowTime() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    },

    getLogs() {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        try {
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    },

    saveLog(logItem) {
        const logs = this.getLogs();
        logs.unshift(logItem);
        if (logs.length > this.MAX_LOG_COUNT) logs.splice(this.MAX_LOG_COUNT);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    },

    info(msg, data = null) {
        const time = this.getNowTime();
        const logItem = { time, level: "info", msg, data };
        console.log(`[INFO ${time}]`, msg, data ?? "");
        this.saveLog(logItem);
    },
    warn(msg, data = null) {
        const time = this.getNowTime();
        const logItem = { time, level: "warn", msg, data };
        console.warn(`[WARN ${time}]`, msg, data ?? "");
        this.saveLog(logItem);
    },
    error(msg, err = null) {
        const time = this.getNowTime();
        const errInfo = err ? { message: err.message, stack: err.stack || "无堆栈" } : null;
        const logItem = { time, level: "error", msg, error: errInfo };
        console.error(`[ERROR ${time}]`, msg, err ?? "");
        this.saveLog(logItem);
    },
    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
        LogTool.info("已清空全部本地日志");
    },
    getAll() {
        return this.getLogs();
    }
};
const Log = LogTool;

// 全局捕获页面同步JS崩溃、异步Promise报错，自动写入日志
window.addEventListener('error', e => Log.error("全局同步运行异常", e.error));
window.addEventListener('unhandledrejection', e => Log.error("异步Promise未捕获异常", e.reason));

// 统一回车切换行核心函数（手机blur失焦 / PC Enter共用）
function handleEnterComplete() {
    try {
        const val = inputAreaEl.value.trim();
        Log.info("执行切换下一行逻辑", { 当前行索引: currentEntryIndex, 输入内容: val });
        if (!typingRunning) {
            Log.warn("切换行拦截：当前未处于练习运行状态");
            return;
        }
        if (val === "") {
            Log.warn("切换行拦截：输入框内容为空");
            return;
        }

        // 切换行前安全终止语音，多层校验避免null.cancel报错
        if (typeof speechSynthesis !== "undefined" && speechSynthesis && typeof speechSynthesis.cancel === "function") {
            speechSynthesis.cancel();
        }

        const activeChars = entryCharsList[currentEntryIndex];
        const entryLen = activeChars.length;
        if (!finishedWordSet.has(currentEntryIndex)) finishedWordSet.add(currentEntryIndex);
        currentPos += entryLen;

        const currentSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
        currentSpans.forEach(s => {
            if (s.classList.contains('char-correct') || s.classList.contains('char-wrong')) s.classList.add('char-done');
            s.classList.remove('char-current');
        });

        if (currentEntryIndex < entryCharsList.length - 1) {
            currentEntryIndex++;
            inputAreaEl.value = "";
            prevInputValue = "";
            const newSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
            if (newSpans[0]) newSpans[0].className = "char-current";

            const container = paragraphContainerEl;
            const firstSpan = newSpans[0];
            if (firstSpan) {
                const containerRect = container.getBoundingClientRect();
                const spanRect = firstSpan.getBoundingClientRect();
                let offset = containerRect.height / 2;
                if (window.innerWidth <= 768) offset = 20;
                const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - offset;
                container.scrollTo({ top: scrollTop, behavior: "smooth" });
            }
            setTimeout(() => {
                inputAreaEl.focus();
                Log.info("切换行完成，自动重新聚焦输入框");
            }, 100);
        } else {
            Log.info("全部段落练习完成，弹出结束弹窗");
            showFinishModal();
            typingRunning = false;
            inputAreaEl.disabled = true;
            resetBtnEl.disabled = false;
        }
        updateStat();
    } catch (err) {
        Log.error("切换行函数handleEnterComplete执行报错", err);
    }
}

// PC实体键盘Enter回车监听
inputAreaEl.addEventListener('keydown', function (e) {
    try {
        if (e.key === "Enter" || e.keyCode === 13) {
            Log.info("PC键盘按下Enter回车", { key: e.key, keyCode: e.keyCode });
            e.preventDefault();
            handleEnterComplete();
        }
    } catch (err) {
        Log.error("keydown回车监听异常", err);
    }
});

// 手机软键盘「完成」核心监听：输入框失焦触发切换
inputAreaEl.addEventListener('blur', function () {
    try {
        Log.info("输入框失去焦点，判定手机点击软键盘完成键");
        handleEnterComplete();
    } catch (err) {
        Log.error("blur失焦切换监听异常", err);
    }
});

// 禁止粘贴
inputAreaEl.addEventListener('paste', function (e) {
    try {
        Log.info("拦截粘贴操作");
        e.preventDefault();
    } catch (err) {
        Log.error("paste粘贴监听异常", err);
    }
});

// 输入实时校验、字符上色、单词朗读主逻辑
inputAreaEl.addEventListener('input', function (e) {
    try {
        if (!typingRunning) return;
        const val = this.value;
        const activeChars = entryCharsList[currentEntryIndex];
        const entryLen = activeChars.length;

        // 逐键统计正确率
        if (val.length > prevInputValue.length) {
            const startIdx = prevInputValue.length;
            const endIdx = val.length;
            for (let i = startIdx; i < endIdx; i++) {
                if (i >= entryLen) break;
                totalInput++;
                if (val[i] === activeChars[i]) correctCnt++;
            }
        }

        // 空格触发单词朗读（多层语音对象校验，彻底杜绝null.cancel报错）
        const valLen = val.length;
        const prevLen = prevInputValue.length;
        if (wordSpeakEnable === "true" && valLen > prevLen) {
            const lastChar = val.slice(-1);
            if (lastChar === " " || lastChar === "　") {
                const currentInput = val.trim();
                const wordList = currentInput.split(/\s+/);
                const targetWord = wordList[wordList.length - 1];
                if (/^[a-zA-Z'-]+$/.test(targetWord) && targetWord.length > 0) {
                    Log.info("触发单词朗读", { 朗读单词: targetWord });
                    // 安全校验语音API对象与方法
                    if (typeof speechSynthesis !== "undefined" && speechSynthesis && typeof speechSynthesis.cancel === "function" && speechState) {
                        speechSynthesis.cancel();
                        const utter = createUtterance(targetWord, speechState.rate);
                        speechSynthesis.speak(utter);
                    } else {
                        Log.warn("当前浏览器无可用语音合成API，跳过单词朗读", { targetWord });
                    }
                }
            }
        }

        prevInputValue = val;

        // 输入超长截断警告
        if (val.length > entryLen) {
            Log.warn("输入字符超出本行上限，自动截断", { 输入长度: val.length, 标准长度: entryLen });
            this.value = val.slice(0, entryLen);
            prevInputValue = this.value;
        }

        // 字符上色渲染
        const allSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
        allSpans.forEach(s => s.className = "char-pending");
        let hasError = false;
        for (let i = 0; i < val.length; i++) {
            const span = allSpans[i];
            if (val[i] === activeChars[i]) span.className = "char-correct";
            else {
                span.className = "char-wrong";
                hasError = true;
            }
        }
        if (val.length < entryLen) allSpans[val.length].className = "char-current";

        // 连击、错误提示逻辑
        if (hasError) {
            comboCount = 0;
            revokeLastSticker();
            wrongContinuous++;
            if (wrongContinuous >= 3) {
                showErrorHint("放慢速度，仔细看清字符再输入😊");
                wrongContinuous = 0;
            }
        } else {
            wrongContinuous = 0;
            comboCount++;
            if (comboCount === 5) {
                unlockSticker(0);
                batchStar(e.clientX, e.clientY, 3);
                showComboTip("5连击！很棒", e.clientX, e.clientY - 40);
            } else if (comboCount === 10) {
                unlockSticker(1);
                batchStar(e.clientX, e.clientY, 5);
                showComboTip("10连击太厉害了！", e.clientX, e.clientY - 40);
            } else if (comboCount === 15) {
                unlockSticker(2);
                batchStar(e.clientX, e.clientY, 7);
                showComboTip("完美15连击🎉", e.clientX, e.clientY - 40);
            } else if (comboCount > 15) {
                createStar(e.clientX, e.clientY);
            }
        }

        // 滚动定位（手机置顶防键盘遮挡，沿用归档成熟逻辑）
        const container = paragraphContainerEl;
        const firstSpan = allSpans[0];
        if (firstSpan) {
            const containerRect = container.getBoundingClientRect();
            const spanRect = firstSpan.getBoundingClientRect();
            let offset = containerRect.height / 2;
            if (window.innerWidth <= 768) offset = 20;
            const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - offset;
            container.scrollTo({ top: scrollTop, behavior: "smooth" });
        }

        updateStat();
    } catch (err) {
        Log.error("输入主input事件执行异常", err);
    }
});

// 将绑定函数挂载至window全局，修复加载时序、作用域丢失问题
window.bindInputEvent = bindInputEvent;
window.bindBaseEvents = bindBaseEvents;
