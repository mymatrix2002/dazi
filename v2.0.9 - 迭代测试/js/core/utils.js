function parseBilingualPairs(text) {
    const pairs = [];
    let workingText = text;
    
    // ========== 第一步：紧凑单词表 → 转换成三行格式 ==========
    // 每个单词占三行：单词、音标、中文释义
    const phoneticCount = (text.match(/\[/g) || []).length;
    if (phoneticCount >= 2) {
        // 1. 先把挤在一行的单词拆开，每行一个单词
        let onePerLine = text.replace(/([\u4e00-\u9fa5）])\s+([a-zA-Z])/g, '$1\n$2');
        let lines = onePerLine.split('\n');
        let threeLineFormat = [];
        
        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            
            // 2. 把每行单词拆成三行：单词、音标、中文
            const bracketStart = line.indexOf('[');
            const bracketEnd = line.indexOf(']', bracketStart);
            if (bracketStart > 0 && bracketEnd > bracketStart) {
                const word = line.slice(0, bracketStart).trim();
                const phonetic = line.slice(bracketStart, bracketEnd + 1).trim();
                const cn = line.slice(bracketEnd + 1).trim();
                threeLineFormat.push(word);    // 第一行：单词
                threeLineFormat.push(phonetic); // 第二行：音标
                threeLineFormat.push(cn);       // 第三行：中文
            } else {
                threeLineFormat.push(line);
            }
        }
        
        workingText = threeLineFormat.join('\n');
    }
    
    // ========== 第二步：逐行解析 ==========
    const processed = preprocessText(workingText);
    const cleanText = cleanMultiBlankLines(processed);
    const lines = cleanText.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;
        
        // 格式1：三行单词表（单词一行 + 音标一行 + 中文一行）
        const nextLine1 = lines[i + 1] ? lines[i + 1].trim() : '';
        const nextLine2 = lines[i + 2] ? lines[i + 2].trim() : '';
        if (nextLine1 && nextLine1.match(/^\[.*\]$/) && 
            nextLine2 && /[\u4e00-\u9fa5]/.test(nextLine2) &&
            !/[\u4e00-\u9fa5]/.test(line) && /[a-zA-Z]/.test(line)) {
            const en = extractEnglishText(line);
            if (en && !hasNoEnglishLetter(en)) {
                pairs.push({ en, cn: nextLine2 });
                i += 2; // 跳过后面两行
                continue;
            }
        }
        
        // 格式2：两行单词表（英文一行 + 音标+中文一行）
        if (nextLine1 && nextLine1.indexOf('[') >= 0 && 
            !/[\u4e00-\u9fa5]/.test(line) && /[a-zA-Z]/.test(line)) {
            const en = extractEnglishText(line);
            const cnPart = nextLine1.replace(/\[.*?\]/g, '').trim();
            if (en && !hasNoEnglishLetter(en)) {
                pairs.push({ en, cn: cnPart });
                i += 1;
                continue;
            }
        }
        
        // 格式3：同一行单词表（单词 + [音标] + 中文）
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
        
        // 格式4：同一行中英文混排（句子+翻译在同一行）
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
        
        // 格式5：原版逐行配对（英文一行 + 中文一行）
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
