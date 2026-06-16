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
function parseBilingualPairs(text) {
    const processed = preprocessText(text);
    const cleanText = cleanMultiBlankLines(processed);
    const lines = cleanText.split('\n');
    const lineInfos = [];
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        if (isChineseDominant(line)) {
            lineInfos.push({
                type: 'cn',
                cn: extractChineseText(line),
                en: ''
            });
        } else {
            const en = extractEnglishText(line);
            if (en && !hasNoEnglishLetter(en)) {
                lineInfos.push({
                    type: 'en',
                    en: en,
                    cn: ''
                });
            }
        }
    }
    const pairs = [];
    let i = 0;
    while (i < lineInfos.length) {
        const curr = lineInfos[i];
        if (curr.type === 'en' && i + 1 < lineInfos.length && lineInfos[i+1].type === 'cn') {
            pairs.push({ en: curr.en, cn: lineInfos[i+1].cn });
            i += 2;
            continue;
        }
        if (curr.type === 'en') {
            pairs.push({ en: curr.en, cn: '' });
            i++;
            continue;
        }
        i++;
    }
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
    if(num<20) return ones[num];
    if(num<100){
        const t=Math.floor(num/10), o=num%10;
        return o>0 ? `${tens[t]}-${ones[o]}` : tens[t];
    }
    const h=Math.floor(num/100), rem=num%100;
    let res=ones[h]+" hundred";
    if(rem>0) res+=" "+numberToEnglish(rem);
    return res;
}
function replaceDigitsToEnglish(s){
    return s.replace(/\d+/g,m=>numberToEnglish(+m));
}
function fixArticleRead(s){
    return s.replace(/\b a \b([bcdfghjklmnpqrstvwBCDFGHJKLMNPQRSTVW])/g," uh $1")
            .replace(/^\ba\s+([bcdfghjklmnpqrstvwBCDFGHJKLMNPQRSTVW])/gm,"uh $1");
}
function splitSentences(text){
    const map=new Map();
    let idx=0;
    text=text.replace(/\w+'(ll|re|s|t|ve|d)/g,m=>{
        const k=`__TMP${idx}__`; map.set(k,m); idx++; return k;
    });
    const reg=/[^.!?\n]+[.!?]+(?=\s|$|\n)|[^.!?\n]+\n|.+$/g;
    let match, arr=[];
    while((match=reg.exec(text))!==null){
        let seg=match[0];
        for(let [k,v] of map) seg=seg.replace(k,v);
        let ptype="newline";
        const last=seg.trimEnd().slice(-1);
        if(last===".") ptype="period";
        else if(last==="!"||last==="?") ptype="mark";
        arr.push({text:seg, pauseType:ptype});
    }
    if(arr.length===0 && text.trim()) arr.push({text, pauseType:"newline"});
    return arr;
}
function createUtterance(rawTxt, rate){
    const ut=new SpeechSynthesisUtterance();
    ut.rate=rate;
    ut.pitch=1;
    ut.volume = speechState.volume;
    const isCN=hasChinese(rawTxt);
    if(isCN){
        ut.lang="zh-CN"; ut.text=rawTxt;
    }else{
        ut.lang="en-US";
        let t=replaceDigitsToEnglish(rawTxt);
        t=fixArticleRead(t);
        ut.text=t;
    }
    return ut;
}

// ========== 动画、提示、贴纸 ==========
function createStar(x,y){
    const star=document.createElement('div');
    star.className="float-star";
    star.textContent="⭐";
    star.style.left=x+"px";
    star.style.top=y+"px";
    document.body.appendChild(star);
    setTimeout(()=>{
        star.style.opacity="0";
        star.style.transform="translateY(-90px) scale(1.4)";
    },10);
    setTimeout(()=>star.remove(),1000);
}
function batchStar(x,y,num) {
    for(let i=0;i<num;i++){
        setTimeout(()=>createStar(x+(i-2)*18,y-10),i*80);
    }
}
function showComboTip(text, x, y) {
    const tip = document.createElement('div');
    tip.className = 'combo-tip';
    tip.textContent = text;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
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
    document.querySelector(`.sticker-item[data-id="${idx}"]`).classList.add('unlock');
}
function revokeLastSticker() {
    let lastIdx = -1;
    for(let i=2;i>=0;i--){
        if(stickerUnlock[i]){
            lastIdx = i;
            break;
        }
    }
    if(lastIdx === -1) return;
    stickerUnlock[lastIdx] = false;
    document.querySelector(`.sticker-item[data-id="${lastIdx}"]`).classList.remove('unlock');
}

// ========== 统计 & 完成弹窗 ==========
function updateStat(){
    if(!typingRunning) return;
    const now=Date.now();
    const sec=Math.floor((now-startTime)/1000);
    const m=String(Math.floor(sec/60)).padStart(2,'0');
    const s=String(sec%60).padStart(2,'0');
    timeUsedEl.textContent=`${m}:${s}`;

    let speed = 0;
    if(sec > 0){
        speed = Math.round((correctCnt/5) / (sec/60));
    }
    speedEl.textContent=speed;
    speedBar.style.width=Math.min(speed/300*100,100)+"%";

    let acc = 100;
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
    progressEl.textContent=prog+"%";
    progBar.style.width=prog+"%";

    // 增加等待二次回车拦截
    if(targetChars.length > 0 && currentPos >= targetChars.length && !waitFinalEnter){
        typingRunning=false; clearInterval(timerId);
        inputAreaEl.disabled=true;
        showFinishModal();
    }
}
function showFinishModal(){
    unlockSticker(3);
    const totalSec = Math.floor((Date.now() - startTime) / 1000);
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');
    const timeStr = `${min}:${sec}`;

    let finalAcc = 100;
    if (totalInput > 0) {
        finalAcc = Math.round((correctCnt / totalInput) * 100);
        if(finalAcc > 100) finalAcc = 100;
    }
    const wordCount = finishedWordSet.size;
    let tipText = '';
    if(finalAcc === 100){
        tipText = '太棒啦！全部正确，打字基本功非常扎实🎉';
    }else if(finalAcc >= 80){
        tipText = '表现不错！少量失误，多加练习就能满分✨';
    }else if(finalAcc >= 60){
        tipText = '刚好及格，注意区分易混淆字母，放慢速度减少错误';
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
                <span class="data-label">最终准确率</span>
                <span class="data-value good">${finalAcc}%</span>
            </div>
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
}