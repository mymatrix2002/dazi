// ===================== 全局错误日志工具 =====================
const LogTool = {
    // 日志存储key，最多保存200条旧日志防止占空间
    STORAGE_KEY: "typing_error_logs",
    MAX_LOG_COUNT: 200,

    // 日志等级：info正常 / warn警告 / error错误
    getNowTime() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    },

    // 读取本地存储日志数组
    getLogs() {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        try {
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    },

    // 写入日志到本地存储
    saveLog(logItem) {
        const logs = this.getLogs();
        logs.unshift(logItem);
        // 超出上限截断旧日志
        if (logs.length > this.MAX_LOG_COUNT) {
            logs.splice(this.MAX_LOG_COUNT);
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    },

    // 打印+保存普通信息日志
    info(msg, data = null) {
        const time = this.getNowTime();
        const logItem = { time, level: "info", msg, data };
        console.log(`[INFO ${time}]`, msg, data ?? "");
        this.saveLog(logItem);
    },

    // 打印+保存警告日志
    warn(msg, data = null) {
        const time = this.getNowTime();
        const logItem = { time, level: "warn", msg, data };
        console.warn(`[WARN ${time}]`, msg, data ?? "");
        this.saveLog(logItem);
    },

    // 打印+保存错误日志（核心捕获程序崩溃）
    error(msg, err = null) {
        const time = this.getNowTime();
        const errInfo = err ? {
            message: err.message,
            stack: err.stack || "无堆栈信息"
        } : null;
        const logItem = { time, level: "error", msg, error: errInfo };
        console.error(`[ERROR ${time}]`, msg, err ?? "");
        this.saveLog(logItem);
    },

    // 清空全部本地日志
    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
        LogTool.info("已清空所有本地日志");
    },

    // 获取全部日志用于查看
    getAll() {
        return this.getLogs();
    }
};

// 全局简写，直接 Log.info / Log.warn / Log.error 使用
const Log = LogTool;

// 全局捕获页面JS同步未捕获异常（全局程序报错自动记录）
window.addEventListener('error', function (e) {
    Log.error("全局页面同步运行异常", e.error);
});

// 捕获Promise异步报错（定时器、语音、异步逻辑崩溃）
window.addEventListener('unhandledrejection', function (e) {
    Log.error("异步Promise未捕获错误", e.reason);
});

// ========== 输入框事件：禁止粘贴 + 实时逐键准确率 ==========
// 统一回车/切换行核心函数（PC回车、手机点完成失焦共用）
function handleEnterComplete() {
    try {
        const val = inputAreaEl.value.trim();
        Log.info("执行切换行逻辑", {输入文本: val, 当前行索引: currentEntryIndex});
        if (!typingRunning) {
            Log.warn("切换行失败：未处于练习运行状态");
            return;
        }
        // 空白不执行切换
        if (val === '') {
            Log.warn("切换行拦截：输入内容为空");
            return;
        }

        const activeChars = entryCharsList[currentEntryIndex];
        const entryLen = activeChars.length;

        if (!finishedWordSet.has(currentEntryIndex)) {
            finishedWordSet.add(currentEntryIndex);
        }
        currentPos += entryLen;

        const currentSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
        currentSpans.forEach(s => {
            if (s.classList.contains('char-correct') || s.classList.contains('char-wrong')) {
                s.classList.add('char-done');
            }
            s.classList.remove('char-current');
        });

        if (currentEntryIndex < entryCharsList.length - 1) {
            currentEntryIndex++;
            inputAreaEl.value = '';
            prevInputValue = '';
            const newSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
            if (newSpans[0]) newSpans[0].className = 'char-current';

            const container = paragraphContainerEl;
            const firstSpan = newSpans[0];
            if (firstSpan) {
                const containerRect = container.getBoundingClientRect();
                const spanRect = firstSpan.getBoundingClientRect();
                let offset = containerRect.height / 2;
                if (window.innerWidth <= 768) {
                    offset = 20;
                }
                const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - offset;
                container.scrollTo({ top: scrollTop, behavior: 'smooth' });
            }
            // 切换后自动重新聚焦输入框，无需手动点击
            setTimeout(() => {
                inputAreaEl.focus();
                Log.info("切换行完成，自动聚焦输入框");
            }, 100);
        } else {
            Log.info("所有段落练习完毕，弹出完成弹窗");
            showFinishModal();
            typingRunning = false;
            inputAreaEl.disabled = true;
            resetBtnEl.disabled = false;
        }
        updateStat();
    } catch (err) {
        Log.error("handleEnterComplete切换行函数发生异常", err);
    }
}

// ========== PC实体键盘回车监听 ==========
inputAreaEl.addEventListener('keydown', function (e) {
    try {
        if (e.key === 'Enter' || e.keyCode === 13) {
            Log.info("PC键盘按下Enter回车", {key: e.key, keyCode: e.keyCode});
            e.preventDefault();
            handleEnterComplete();
        }
    } catch (err) {
        Log.error("keydown回车监听异常", err);
    }
});

// ========== 手机软键盘完成键核心：失焦触发切换 ==========
inputAreaEl.addEventListener('blur', function () {
    try {
        Log.info("输入框失去焦点，判定手机点击完成键");
        handleEnterComplete();
    } catch (err) {
        Log.error("blur失焦监听异常", err);
    }
});

// ========== 禁止粘贴 ==========
inputAreaEl.addEventListener('paste', function (e) {
    try {
        Log.info("拦截粘贴操作");
        e.preventDefault();
    } catch (err) {
        Log.error("paste粘贴监听异常", err);
    }
});

// ========== 输入实时校验、单词朗读、字符上色主逻辑 ==========
inputAreaEl.addEventListener('input', function (e) {
    try {
        if (!typingRunning) return;
        const val = this.value;
        const activeChars = entryCharsList[currentEntryIndex];
        const entryLen = activeChars.length;

        // 逐键统计正确率，退格不扣分
        if (val.length > prevInputValue.length) {
            const startIdx = prevInputValue.length;
            const endIdx = val.length;
            for (let i = startIdx; i < endIdx; i++) {
                if (i >= entryLen) break;
                totalInput++;
                if (val[i] === activeChars[i]) {
                    correctCnt++;
                }
            }
        }

        // 空格朗读单词
        const valLen = val.length;
        const prevLen = prevInputValue.length;
        if (wordSpeakEnable === 'true' && valLen > prevLen) {
            const lastChar = val.slice(-1);
            if (lastChar === ' ' || lastChar === '　') {
                const currentInput = val.trim();
                const wordList = currentInput.split(/\s+/);
                const targetWord = wordList[wordList.length - 1];
                if (/^[a-zA-Z'-]+$/.test(targetWord) && targetWord.length > 0) {
                    Log.info("触发单词朗读", {单词: targetWord});
                    speechSynthesis.cancel();
                    const utter = createUtterance(targetWord, speechState.rate);
                    speechSynthesis.speak(utter);
                }
            }
        }

        prevInputValue = val;

        // 超长输入警告
        if (val.length > entryLen) {
            Log.warn("输入超出本行字符上限", {输入长度: val.length, 标准长度: entryLen});
            this.value = val.slice(0, entryLen);
            prevInputValue = this.value;
        }

        const allSpans = paragraphContainerEl.querySelectorAll(`[data-segment-index="${currentEntryIndex}"] span`);
        allSpans.forEach(s => s.className = 'char-pending');
        let hasError = false;
        for (let i = 0; i < val.length; i++) {
            const span = allSpans[i];
            if (val[i] === activeChars[i]) {
                span.className = 'char-correct';
            } else {
                span.className = 'char-wrong';
                hasError = true;
            }
        }
        if (val.length < entryLen) {
            allSpans[val.length].className = 'char-current';
        }

        // 连击/错误逻辑
        if (hasError) {
            comboCount = 0;
            revokeLastSticker();
            wrongContinuous++;
            if (wrongContinuous >= 3) {
                showErrorHint('放慢速度，仔细看清字符再输入😊');
                wrongContinuous = 0;
            }
        } else {
            wrongContinuous = 0;
            comboCount++;
            if (comboCount === 5) {
                unlockSticker(0);
                batchStar(e.clientX, e.clientY, 3);
                showComboTip('5连击！很棒', e.clientX, e.clientY - 40);
            } else if (comboCount === 10) {
                unlockSticker(1);
                batchStar(e.clientX, e.clientY, 5);
                showComboTip('10连击太厉害了！', e.clientX, e.clientY - 40);
            } else if (comboCount === 15) {
                unlockSticker(2);
                batchStar(e.clientX, e.clientY, 7);
                showComboTip('完美15连击🎉', e.clientX, e.clientY - 40);
            } else if (comboCount > 15) {
                createStar(e.clientX, e.clientY);
            }
        }

        // 滚动适配：手机置顶，电脑居中
        const container = paragraphContainerEl;
        const firstSpan = allSpans[0];
        if (firstSpan) {
            const containerRect = container.getBoundingClientRect();
            const spanRect = firstSpan.getBoundingClientRect();
            let offset = containerRect.height / 2;
            if (window.innerWidth <= 768) offset = 20;
            const scrollTop = container.scrollTop + (spanRect.top - containerRect.top) - offset;
            container.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }

        updateStat();
    } catch (err) {
        Log.error("input输入主逻辑异常", err);
    }
});
