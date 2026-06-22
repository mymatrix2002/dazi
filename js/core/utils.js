// js/core/utils.js 完整代码（已加音效开关 + 优化语音优选 + 修复语音选择加载中问题）

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

// ========== 音效开关 ==========
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false'; // 默认开启

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    
    const btn = document.getElementById('soundToggleBtn');
    if (btn) {
        if (soundEnabled) {
            btn.classList.add('btn-sound-active');
            btn.textContent = '🔊 音效：已开启';
        } else {
            btn.classList.remove('btn-sound-active');
            btn.textContent = '🔇 音效：已关闭';
        }
    }
}

// 初始化音效按钮状态
function initSoundToggleBtn() {
    const btn = document.getElementById('soundToggleBtn');
    if (!btn) return;
    if (soundEnabled) {
        btn.classList.add('btn-sound-active');
        btn.textContent = '🔊 音效：已开启';
    } else {
        btn.classList.remove('btn-sound-active');
        btn.textContent = '🔇 音效：已关闭';
    }
}

// 页面加载完成后自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSoundToggleBtn);
} else {
    initSoundToggleBtn();
}



// ========== 内置系统波形音效：按键音 / 错误音 / 完成音 ==========
/**
 * 正常按键清脆音效
 */
function playKeySound() {
    if (!soundEnabled) return;
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(680, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(speechState.volume * 0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
}

/**
 * 输入错误警示音效
 */
function playErrorSound() {
    if (!soundEnabled) return;
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(speechState.volume * 0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
}

/**
 * 练习完成欢庆提示音（两段音阶）
 */
function playFinishSound() {
    if (!soundEnabled) return;
    const ctx = getAudioCtx();
    const vol = speechState.volume * 0.3;
    // 第一段
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = 580;
    gain1.gain.setValueAtTime(vol, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.18);
    // 第二段延时高音
    setTimeout(()=>{
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.value = 820;
        gain2.gain.setValueAtTime(vol, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.22);
    }, 180);
}

function parseBilingualPairs(text) {
    // ========== 新增：紧凑单词表预处理 ==========
    let workingText = text;
    if ((text.match(/\[/g) || []).length >= 2) {
        // 只在「中文字符 + 可选音标 + 英文字母/★」的地方拆分，避免拆到音标内部
        workingText = text.replace(/([\u4e00-\u9fa5])(\[.*?\])?\s*([a-zA-Z★])/g, '$1$2\n$3');
    }
    
    // ========== 逐行解析逻辑 ==========
    const pairs = [];
    const processed = preprocessText(workingText);
    const cleanText = cleanMultiBlankLines(processed);
    const lines = cleanText.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;
        
        // 同一行既有英文又有中文 → 按第一个中文字符拆分（音标在哪边都能处理）
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
        
        // 跨行单词表（英文一行 + 音标+中文一行）
        const nextLine = lines[i + 1] ? lines[i + 1].trim() : '';
        if (nextLine && nextLine.indexOf('[') >= 0 && !hasCn && hasEn) {
            const en = extractEnglishText(line);
            const cnPart = nextLine.replace(/\[.*?\]/g, '').trim();
            if (en && !hasNoEnglishLetter(en)) {
                pairs.push({ en, cn: cnPart });
                i++;
                continue;
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
    // 超大数字兜底
    if (isNaN(num) || num < 0) return String(num);
    if(num < 20) return ones[num];
    if(num < 100){
        const t = Math.floor(num / 10), o = num % 10;
        return o > 0 ? `${tens[t]}-${ones[o]}` : tens[t];
    }
    // 百位以上统一简化处理
    const h = Math.floor(num / 100), rem = num % 100;
    let res = ones[h] + " hundred";
    if(rem > 0) res += " " + numberToEnglish(rem);
    return res;
}

function replaceDigitsToEnglish(s){
    return s.replace(/\d+/g,m=>numberToEnglish(+m));
}

function fixArticleRead(s){
    return s.replace(/\b a \b([bcdfghjklmnpqrstvwBCDFGHJKLMNPQRSTVW])/g," uh $1")
            .replace(/^\ba\s+([bcdfghjklmnpqrstvwBCDFGHJKLMNPQRSTVW])/gm,"uh $1");
}

// 优化分句：限制占位符、过滤空句子
function splitSentences(text){
    const map = new Map();
    let idx = 0;
    // 限制占位符长度，避免冲突
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

// ========== 语音选择相关 ==========
let selectedVoiceURI = localStorage.getItem('selectedVoiceURI') || '';

// 判断当前是否使用在线语音
function isUsingOnlineVoice() {
    return selectedVoiceURI === 'online';
}
window.isUsingOnlineVoice = isUsingOnlineVoice;

// 获取所有可用语音列表
function getVoiceList() {
    if(!window.speechSynthesis) return [];
    return window.speechSynthesis.getVoices() || [];
}

// 自动优选语音（优化版：优先选更响亮清晰的）
function getPreferredVoice(lang) {
    const voices = getVoiceList();
    if(voices.length === 0) return null;
    
    // 筛选对应语言的语音
    const langVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(lang.toLowerCase()));
    const candidates = langVoices.length > 0 ? langVoices : voices;
    
    // 按优先级排序
    const scored = candidates.map(voice => {
        let score = 0;
        const name = voice.name || '';
        const uri = voice.voiceURI || '';
        const full = name + ' ' + uri;
        const fullLower = full.toLowerCase();
        
        // ===== 音量优先的打分规则优化 =====
        // 第一梯队：Google 系列（质量好、音量稳定）
        if(fullLower.includes('google')) score += 100;
        
        // 第二梯队：微软自然语音（通常最响亮）
        if(fullLower.includes('microsoft') && fullLower.includes('natural')) score += 95;
        
        // 第三梯队：微软系统语音（普遍较大声）
        if(fullLower.includes('microsoft')) score += 80;
        
        // 第四梯队：女声 / 经典响亮语音
        if(full.includes('Female') || full.includes('女') 
            || full.includes('Xiaoxiao') || full.includes('Xiaoyi')
            || full.includes('Samantha') || full.includes('Victoria')) score += 50;
        
        // 减分项：默认语音（通常偏小）
        if(fullLower.includes('default')) score -= 30;
        
        // 加分项：高质量版本
        if(full.includes('Enhanced') || full.includes('高质量') 
            || full.includes('Premium') || full.includes('高级')) score += 15;
        
        return { voice, score };
    });
    
    // 按分数从高到低排序
    scored.sort((a, b) => b.score - a.score);
    
    return scored.length > 0 ? scored[0].voice : null;
}

// 初始化语音选择（页面加载时调用）
function initVoiceSelection() {  
    const loadVoices = () => {
        const voices = getVoiceList();
        const selectEl = document.getElementById('voiceSelect');
        if(!selectEl) return;
        
        // 清空下拉框
        selectEl.innerHTML = '';
        
        // ===== 1. 在线语音选项（放在最前面，推荐）=====
        const onlineOpt = document.createElement('option');
        onlineOpt.value = 'online';
        onlineOpt.textContent = '在线女声（推荐）';
        selectEl.appendChild(onlineOpt);
        
        // 分隔线（系统语音和在线语音分开）
        const separator = document.createElement('option');
        separator.disabled = true;
        separator.textContent = '———— 系统语音 ————';
        selectEl.appendChild(separator);
        
        // ===== 2. 系统语音列表（如果有的话）=====
        if (voices && voices.length > 0) {
            // 按语言分组
            const cnVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('zh'));
            const enVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
            const otherVoices = voices.filter(v => !v.lang || (!v.lang.toLowerCase().startsWith('zh') && !v.lang.toLowerCase().startsWith('en')));
            
            // 添加中文语音
            if(cnVoices.length > 0) {
                const cnGroup = document.createElement('optgroup');
                cnGroup.label = '中文语音';
                cnVoices.forEach(v => {
                    const opt = document.createElement('option');
                    opt.value = v.voiceURI;
                    opt.textContent = v.name;
                    cnGroup.appendChild(opt);
                });
                selectEl.appendChild(cnGroup);
            }
            
            // 添加英文语音
            if(enVoices.length > 0) {
                const enGroup = document.createElement('optgroup');
                enGroup.label = '英文语音';
                enVoices.forEach(v => {
                    const opt = document.createElement('option');
                    opt.value = v.voiceURI;
                    opt.textContent = v.name;
                    enGroup.appendChild(opt);
                });
                selectEl.appendChild(enGroup);
            }
            
            // 添加其他语音
            if(otherVoices.length > 0) {
                const otherGroup = document.createElement('optgroup');
                otherGroup.label = '其他语音';
                otherVoices.forEach(v => {
                    const opt = document.createElement('option');
                    opt.value = v.voiceURI;
                    opt.textContent = v.name + ' (' + v.lang + ')';
                    otherGroup.appendChild(opt);
                });
                selectEl.appendChild(otherGroup);
            }
        } // 系统语音列表 if 结束
        
        // ===== 3. 设置选中的语音（不管有没有系统语音都要设置）=====
        if(selectedVoiceURI) {
            // 如果是在线语音，直接选中
            if(selectedVoiceURI === 'online') {
                selectEl.value = 'online';
                return;
            }
            // 检查用户保存的系统语音是否还存在
            if (voices && voices.length > 0) {
                const exists = voices.find(v => v.voiceURI === selectedVoiceURI);
                if(exists) {
                    selectEl.value = selectedVoiceURI;
                    return;
                }
            }
        }
        
        // 用户没选过或语音不存在 → 默认选在线语音（推荐）
        selectEl.value = 'online';
        selectedVoiceURI = 'online';
        localStorage.setItem('selectedVoiceURI', selectedVoiceURI);
    };
    
    // 先尝试立即获取
    loadVoices();
    
    // 如果有系统语音且列表为空，等事件触发
    if(window.speechSynthesis && getVoiceList().length === 0) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }
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
    
    // 设置选中的语音
    if(selectedVoiceURI) {
        const voices = getVoiceList();
        const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
        if(voice) {
            ut.voice = voice;
        }
    }
    
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
        setTimeout(()=>createStar(posX + (i - 2) * 18, posY - 10), i * 80);
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
        speed = Math.round((correctCnt / 5) / (sec / 60));
    }
    speedEl.textContent = speed;
    speedBar.style.width = Math.min(speed / 300 * 100, 100) + "%";

    let acc = 0;
    if (totalInput > 0) {
        acc = Math.round((correctCnt / totalInput) * 100);
        if(acc > 100) acc = 100;
    }
    accuracyEl.textContent = acc + "%";
    accBar.style.width = acc + "%";

    let prog = 0;
    if(targetChars.length > 0){
        prog = Math.round(currentPos / targetChars.length * 100);
    }
    progressEl.textContent = prog + "%";
    progBar.style.width = prog + "%";

}

function showFinishModal(){
    // 空输入直接返回，不弹出成绩
    if(totalInput === 0) {
        alert('还没有输入任何内容哦～');
        return;
    }

    // 已经弹出了就不再重复弹
    if(document.getElementById('finishMask')) {
        return;
    }
    
    playFinishSound(); // 练习完成欢庆音效
    unlockSticker(3);
    const totalSec = Math.floor((Date.now() - startTime) / 1000);
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');
    const timeStr = `${min}:${sec}`;
    
    // 计算全文完成度
    let prog = 0;
    if(targetChars.length > 0){
        prog = Math.round(currentPos / targetChars.length * 100);
    }
    
    let finalAcc = 0;
    if (totalInput > 0) {
        finalAcc = Math.round((correctCnt / totalInput) * 100);
        if(finalAcc > 100) finalAcc = 100;
    }
    
    const wordCount = finishedWordSet.size;
    let tipText = '';
    if(finalAcc === 100 && prog === 100){
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
            <h2 class="finish-title">🎉 练习全部完成</h2>
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
                <span class="data-value">${wordCount} 行</span>
            </div>
            <div class="data-row">
                <span class="data-label">总击键次数</span>
                <span class="data-value">${totalInput}</span>
            </div>
            <div class="data-row">
                <span class="data-label">正确击键</span>
                <span class="data-value good">${correctCnt}</span>
            </div>
            <div class="data-row">
                <span class="data-label">输入准确率</span>
                <span class="data-value good">${finalAcc}%</span>
            </div>
            <p style="font-size: 12px; color: var(--text-light); text-align: center; margin-top: 12px; line-height: 1.5;">
                完成度 = 已练习内容占全文的比例<br>
                准确率 = 已输入内容的正确率
            </p>
            <div class="btn-wrap">
                <button class="btn-finish btn-secondary-finish" id="modalClear">清空文本</button>
                <button class="btn-finish btn-primary-finish" id="modalRestart">重新练习</button>
            </div>
        </div>
    `;
    document.body.appendChild(mask);
    mask.addEventListener('click', e=>{
        if(e.target === mask) mask.remove();
    });
    document.getElementById('modalRestart').onclick = ()=>{
        mask.remove();
        resetBtnEl.click();
    };
    document.getElementById('modalClear').onclick = ()=>{
        mask.remove();
        clearBtnEl.click();
    };
    
        // ========== 阻止回车键关闭弹窗 ==========
    const preventEnterClose = (e) => {
        if(e.key === 'Enter' || e.keyCode === 13 || e.code === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
        }
    };
    document.getElementById('modalRestart').addEventListener('keydown', preventEnterClose);
    document.getElementById('modalClear').addEventListener('keydown', preventEnterClose);
    
    // 确保按钮不会自动获得焦点
    if(document.activeElement) {
        document.activeElement.blur();
    }
}