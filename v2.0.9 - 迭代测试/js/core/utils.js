// js/core/utils 完整代码

// ========== 文本预处理函数 ==========
function preprocessText(text) {
    let processed = text.replace(/[ \t]{3,}/g, '\n');
    return processed;
}

function removePhoneticSymbols(str) {
    return str.replace(/\[.*?\]/g, '');
}

function hasNoEnglishLetter(s) {
    return !/[a-zA-Z]/.test(s);
}

function isChineseDominant(line) {
    const cnCount = (line.match(/[\u4e00-\u9fa5]/g) || []).length;
    const total = line.trim().length;
    return total > 0 && cnCount / total > 0.2;
}

function extractFullText(str) {
    let clean = removePhoneticSymbols(str).trim();
    clean = clean.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
    return clean;
}

function extractEnglishText(str) {
    let clean = removePhoneticSymbols(str);
    clean = clean.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
    clean = clean.replace(/[^"'a-zA-Z0-9\s\.,!?;:\-()\/]/g, '');
    clean = clean.replace(/\s+/g, ' ').trim();
    return clean;
}

function extractChineseText(str) {
    return removePhoneticSymbols(str).trim();
}

function hasChinese(str) {
    return /[\u4e00-\u9fa5]/.test(str);
}

function cleanMultiBlankLines(text) {
    return text.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
}

// ========== 文本解析 ==========
function parseFullTextLines(text) {
    const processed = preprocessText(text);
    const fullText = extractFullText(processed);
    const lines = fullText.split('\n').map(l => l.trim()).filter(l => l);
    return lines;
}

// ========== 内置系统波形音效：按键音 / 错误音 / 完成音 ==========
/**
 * 正常按键清脆音效
 */
function playKeySound() {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(speechState.volume * 0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
}

/**
 * 输入错误警示音效
 */
function playErrorSound() {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 200;
    gain.gain.setValueAtTime(speechState.volume * 0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
}

/**
 * 练习完成欢庆提示音（两段音阶）
 */
function playFinishSound() {
    const ctx = getAudioCtx();
    const vol = speechState.volume * 0.3;
    // 第一段
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = 523;
    gain1.gain.setValueAtTime(vol, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.18);
    // 第二段延时高音
    setTimeout(()=>{
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.value = 784;
        gain2.gain.setValueAtTime(vol, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.22);
    }, 180);
}

function parseBilingualPairs(text) {
    // ========== 新增：紧凑单词表预处理 ==========
    let workingText = text;
    if ((text.match(/\[/g) || []).length >= 2) {
        workingText = text.replace(/([\u4e00-\u9fa5\uff09\u0029\u005d])\s*([a-zA-Z★])/g, '$1\n$2');
    }
    
    // ========== 逐行解析逻辑 ==========
    const pairs = [];
    const processed = preprocessText(workingText);
    const cleanText = cleanMultiBlankLines(processed);
    const lines = cleanText.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;
        
        // 跨行单词表（英文一行 + 音标+中文一行）
        const nextLine = lines[i + 1] ? lines[i + 1].trim() : '';
        if (nextLine && nextLine.indexOf('[') >= 0 && !/[\u4e00-\u9fa5]/.test(line) && /[a-zA-Z]/.test(line)) {
            const en = extractEnglishText(line);
            const cnPart = nextLine.replace(/\[.*?\]/g, '').trim();
            if (en && !hasNoEnglishLetter(en)) {
                pairs.push({ en, cn: cnPart });
                i++;
                continue;
            }
        }
        
        // 同一行单词表（单词 + [音标] + 中文）
        if (line.indexOf('[') >= 0) {
            const phoneticStart = line.indexOf('[');
            const phoneticEnd = line.indexOf(']', phoneticStart);
            if (phoneticStart > 0 && phoneticEnd > phoneticStart) {
                const enPart = line.slice(0, phoneticStart).trim();
                const cnPart = line.slice(phoneticEnd + 1).trim();
                const en = extractEnglishText(enPart);
                if (en && !hasNoEnglishLetter(en)) {
                    pairs.push({ en, cn: cnPart });
                    continue;
                }
            }
        }
        
        // 同一行中英文混排（句子+翻译在同一行）
        const hasCn = /[\u4e00-\u9fa5]/.test(line);
        const hasEn = /[a-zA-Z]/.test(line);
        if (hasCn && hasEn) {
            const firstCnIdx = line.search(/[\u4e00-\u9fa5]/);
            if (firstCnIdx > 0) {
                const enPart = line.slice(0, firstCnIdx).trim();
                const cnPart = line.slice(firstCnIdx).trim();
                const en = extractEnglishText(enPart);
                const cn = extractChineseText(cnPart);
                if (en && !hasNoEnglishLetter(en)) {
                    pairs.push({ en, cn });
                    continue;
                }
            }
        }
        
        // 原来的逐行判断（英文一行 + 中文一行）
        if (isChineseDominant(line)) {
            const cn = extractChineseText(line);
            if (pairs.length > 0 && !pairs[pairs.length - 1].cn) {
                pairs[pairs.length - 1].cn = cn;
            }
        } else {
            const en = extractEnglishText(line);
            if (en && !hasNoEnglishLetter(en)) {
                pairs.push({ en, cn: '' });
            }
        }
    }
    
    // 兜底方案
    if (pairs.length === 0) {
        const rawLines = cleanText.split('\n').map(l=>l.trim()).filter(l=>l);
        for (let line of rawLines) {
            const en = extractEnglishText(line);
            const cn = extractChineseText(line);
            if (en && !hasNoEnglishLetter(en) && cn) {
                pairs.push({ en, cn });
            }
        }
    }
    
    return pairs;
}

// ========== 语音朗读工具 ==========
function numberToEnglish(num) {
    const ones = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
    const tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
    if (isNaN(num) || num < 0) return String(num);
    if (num < 20) return ones[num];
    if (num < 100) {
        const t = Math.floor(num / 10);
        const o = num % 10;
        return o > 0 ? tens[t] + '-' + ones[o] : tens[t];
    }
    if (num < 1000) {
        const h = Math.floor(num / 100);
        const rest = num % 100;
        return rest > 0 ? ones[h] + ' hundred ' + numberToEnglish(rest) : ones[h] + ' hundred';
    }
    return String(num);
}

function replaceDigitsToEnglish(s){
    return s.replace(/\d+/g, m => numberToEnglish(parseInt(m)));
}

function fixArticleRead(s){
    return s.replace(/\b a \b([bcdfghjklmnpqrstvwBCDFGHJKLMNPQRSTVW])/g," uh $1")
            .replace(/^\ba\s+([bcdfghjklmnpqrstvwBCDFGHJKLMNPQRSTVW])/gm,"uh $1");
}

// 优化分句：限制占位符、过滤空句子
function splitSentences(text){
    const map = new Map();
    let idx = 0;
    const tempPrefix = '__SENT_TMP_';
    text = text.replace(/\w+'(ll|re|s|t|ve|d)/g,m=>{
        const k = `${tempPrefix}${idx}__`;
        map.set(k, m);
        idx++;
        return k;
    });
    const reg = /[^.!?\n]+[.!?]+(?=\s|$|\n)|[^.!?\n]+\n|.+$/g;
    let match, arr = [];
    while((match = reg.exec(text)) !== null){
        let seg = match[0];
        // 还原缩写
        for(let [k,v] of map) seg = seg.replace(k, v);
        const trimSeg = seg.trim();
        // 过滤空句子
        if(!trimSeg) continue;

        let ptype = "newline";
        const last = trimSeg.slice(-1);
        if(last === ".") ptype = "period";
        else if(last === "!" || last === "?") ptype = "mark";
        arr.push({text: trimSeg, pauseType: ptype});
    }
    if(arr.length === 0 && text.trim()){
        arr.push({text: text.trim(), pauseType:"newline"});
    }
    return arr;
}

window.createUtterance = function(rawTxt, rate){
    // 先判断语音API是否存在，不存在直接返回null，不报错
    if(!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
        return null;
    }
    const ut = new window.SpeechSynthesisUtterance();
    ut.rate = rate;
    ut.pitch = 1;
    ut.volume = speechState.volume;
    const isCN = hasChinese(rawTxt);
    if(isCN){
        ut.lang = "zh-CN";
        ut.text = rawTxt;
    }else{
        ut.lang = "en-US";
        let t = replaceDigitsToEnglish(rawTxt);
        t = fixArticleRead(t);
        ut.text = t;
    }
    return ut;
}

// ========== 动画、提示、贴纸（增强触屏坐标兼容 + 缓存DOM） ==========
// 缓存贴纸DOM，避免重复查询
const stickerItems = document.querySelectorAll('.sticker-item');

function createStar(x = 0, y = 0){
    // 触屏兜底：无坐标默认屏幕中心
    const posX = x || window.innerWidth / 2;
    const posY = y || window.innerHeight / 2;
    const star = document.createElement('div');
    star.className = "float-star";
    star.textContent = "⭐";
    star.style.left = posX + "px";
    star.style.top = posY + "px";
    document.body.appendChild(star);
    setTimeout(()=>{
        star.style.opacity = "0";
        star.style.transform = "translateY(-90px) scale(1.4)";
    },10);
    setTimeout(()=>star.remove(),1000);
}

function batchStar(x = 0, y = 0, num) {
    const posX = x || window.innerWidth / 2;
    const posY = y || window.innerHeight / 2;
    for(let i = 0; i < num; i++){
        setTimeout(()=>createStar(posX + (i - Math.floor(num/2)) * 18, posY - 10), i * 80);
    }
}

function showComboTip(text, x = 0, y = 0) {
    const posX = x || window.innerWidth / 2;
    const posY = y || window.innerHeight / 2;
    const tip = document.createElement('div');
    tip.className = 'combo-tip';
    tip.textContent = text;
    tip.style.left = posX + "px";
    tip.style.top = posY + "px";
    document.body.appendChild(tip);
    setTimeout(()=>tip.remove(),1200);
}

function showErrorHint(text) {
    const hint = document.createElement('div');
    hint.className = 'error-hint';
    hint.textContent = text;
    document.body.appendChild(hint);
    setTimeout(()=>hint.remove(),3000);
}

function unlockSticker(idx) {
    if(stickerUnlock[idx]) return;
    stickerUnlock[idx] = true;
    if(stickerItems[idx]) stickerItems[idx].classList.add('unlock');
}

function revokeLastSticker() {
    let lastIdx = -1;
    for(let i = 2; i >= 0; i--){
        if(stickerUnlock[i]){
            lastIdx = i;
            break;
        }
    }
    if(lastIdx === -1) return;
    stickerUnlock[lastIdx] = false;
    if(stickerItems[lastIdx]) stickerItems[lastIdx].classList.remove('unlock');
}

// ========== 统计 & 完成弹窗 ==========
function updateStat(){
    if(!typingRunning) return;
    const now = Date.now();
    const sec = Math.floor((now - startTime) / 1000);
    const m = String(Math.floor(sec / 60)).padStart(2,'0');
    const s = String(sec % 60).padStart(2,'0');
    timeUsedEl.textContent = `${m}:${s}`;

    let speed = 0;
    if(sec > 0){
        speed = Math.round((correctCount / 5) / (sec / 60));
    }
    speedEl.textContent = speed;
    speedBar.style.width = Math.min(speed / 300 * 100, 100) + "%";

    let acc = 0;
    if (totalInput > 0) {
        acc = Math.round((correctCount / totalInput) * 100);
        if(acc > 100) acc = 100;
    }
    accuracyEl.textContent = acc + "%";
    accBar.style.width = acc + "%";

    let prog = 0;
    if(targetChars.length > 0){
        prog = Math.round(currentPos / targetChars.length * 100);
    }
    progressEl.textContent = prog + "%";
    progressBar.style.width = prog + "%";

    // 增强判断：兼容收尾回车逻辑，双重兜底
    if(targetChars.length > 0 && currentPos >= targetChars.length) {
        // 无需等待二次回车也可兜底结束，保留原有 waitFinalEnter 交互
        if(!waitFinalEnter){
            typingRunning = false;
            clearInterval(timerId);
            inputAreaEl.disabled = true;
            showFinishModal();
        }
    }
}

function showFinishModal(){
    // 空输入直接返回，不弹出成绩
    if(totalInput === 0) {
        alert('还没有输入任何内容哦～');
        return;
    }
    
    playFinishSound(); // 练习完成欢庆音效
    unlockSticker(3);
    const totalSec = Math.floor((Date.now() - startTime) / 1000);
    const min = String(Math.floor(totalSec / 60)).padStart(2,'0');
    const sec = String(totalSec % 60).padStart(2,'0');
    const timeStr = `${min}:${sec}`;
    
    // 计算全文完成度
    let prog = 0;
    if(targetChars.length > 0){
        prog = Math.round(currentPos / targetChars.length * 100);
    }
    
    let finalAcc = 0;
    if (totalInput > 0) {
        finalAcc = Math.round((correctCount / totalInput) * 100);
        if(finalAcc > 100) finalAcc = 100;
    }
    
    const wordCnt = finishedWordSet.size;
    let tipText = '';
    if(prog === 100 && finalAcc === 100){
        tipText = '太棒啦！全部正确且全部完成，打字基本功非常扎实🎉';
    }else if(finalAcc >= 80 && prog >= 80){
        tipText = '表现不错！完成度和准确率都很好，继续加油✨';
    }else if(prog < 50){
        tipText = '这次只做了一小部分，下次争取多做几行哦～';
    }else if(finalAcc >= 80){
        tipText = '正确率很高！放慢速度，争取完成更多内容';
    }else{
        tipText = '正确率偏低，建议放慢输入速度，看清单词再敲击';
    }
    
    const mask = document.createElement('div');
    mask.className = 'modal-mask-finish';
    mask.id = 'finishMask';
    mask.innerHTML = `
        <div class="modal-card-finish">
            <h2 class="finish-title">🎉 练习完成</h2>
            <p class="finish-desc">${tipText}</p>
            <div class="data-row">
                <span class="data-label">总用时</span>
                <span class="data-value">${timeStr}</span>
            </div>
            <div class="data-row">
                <span class="data-label">全文完成度</span>
                <span class="data-value">${prog}%</span>
            </div>
            <div class="data-row">
                <span class="data-label">完成单词行数</span>
                <span class="data-value">${wordCnt} 行</span>
            </div>
            <div class="data-row">
                <span class="data-label">总击键次数</span>
                <span class="data-value">${totalInput}</span>
            </div>
            <div class="data-row">
                <span class="data-label">正确击键</span>
                <span class="data-value good">${correctCount}</span>
            </div>
            <div class="data-row">
                <span class="data-label">输入准确率</span>
                <span class="data-value good">${finalAcc}%</span>
            </div>
            <p style="font-size: 12px; color: var(--text-sub); text-align: center; margin-top: 12px; line-height: 1.5;">
                完成度 = 已完成字符数 ÷ 总字符数<br>
                准确率 = 正确击键数 ÷ 总击键数
            </p>
            <div class="btn-wrap">
                <button class="btn-finish btn-secondary-finish" id="finishCloseBtn">关闭</button>
                <button class="btn-finish btn-primary-finish" id="finishRestartBtn">重新开始</button>
            </div>
        </div>
    `;
    document.body.appendChild(mask);
    mask.addEventListener('click', e=>{
        if(e.target === mask) mask.remove();
    });
    document.getElementById('finishCloseBtn').onclick = ()=> mask.remove();
    document.getElementById('finishRestartBtn').onclick = ()=>{
        mask.remove();
        resetBtnEl.click();
    };
}
