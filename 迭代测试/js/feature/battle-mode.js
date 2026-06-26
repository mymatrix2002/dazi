/* ========== 战斗模式 - 打字对战（句子版） ========== */
/* js/feature/battle-mode.js */
(function() {
    'use strict';
    // ========== 角色数据 ==========
    
    // 玩家角色（6个）
    const playerCharacters = [
        {
            id: 'cat',
            name: '小猫咪',
            emoji: '🐱',
            type: '平衡型',
            hp: 100,
            attack: 10,
            critRate: 0.1,      // 暴击率 10%
            special: 'none',     // 无特殊技能
            description: '全能型，适合新手'
        },
        {
            id: 'dog',
            name: '小狗狗',
            emoji: '🐶',
            type: '攻击型',
            hp: 90,
            attack: 12,
            critRate: 0.1,
            special: 'none',
            description: '攻击高，血量稍低'
        },
        {
            id: 'tiger',
            name: '小老虎',
            emoji: '🐯',
            type: '高攻型',
            hp: 80,
            attack: 15,
            critRate: 0.15,
            special: 'none',
            description: '伤害爆炸，比较脆'
        },
        {
            id: 'fox',
            name: '小狐狸',
            emoji: '🦊',
            type: '暴击型',
            hp: 95,
            attack: 11,
            critRate: 0.25,     // 25% 暴击率
            special: 'crit',
            description: '25% 概率暴击双倍伤害'
        },
        {
            id: 'bear',
            name: '小熊熊',
            emoji: '🐻',
            type: '肉盾型',
            hp: 120,
            attack: 8,
            critRate: 0.05,
            special: 'none',
            description: '血厚耐打，攻击低'
        },
        {
            id: 'panda',
            name: '小熊猫',
            emoji: '🐼',
            type: '回复型',
            hp: 100,
            attack: 9,
            critRate: 0.1,
            special: 'heal',     // 回血技能
            healAmount: 5,      // 每次回 5 点血
            healInterval: 3,    // 每打对 3 个句子回一次
            description: '每打对3个句子回5点血'
        }
    ];
    // 怪物角色（6个，难度递增）
    const enemyCharacters = [
        {
            id: 'ghost',
            name: '小幽灵',
            emoji: '👻',
            difficulty: 1,
            difficultyText: '简单',
            hp: 80,
            attack: 8,
            description: '最菜的怪物，适合练手'
        },
        {
            id: 'ogre',
            name: '小妖怪',
            emoji: '👹',
            difficulty: 1,
            difficultyText: '简单',
            hp: 90,
            attack: 9,
            description: '有点凶，但伤害不高'
        },
        {
            id: 'zombie',
            name: '小僵尸',
            emoji: '🧟',
            difficulty: 2,
            difficultyText: '普通',
            hp: 100,
            attack: 10,
            description: '中规中矩的对手'
        },
        {
            id: 'tengu',
            name: '天狗怪',
            emoji: '👺',
            difficulty: 2,
            difficultyText: '普通',
            hp: 110,
            attack: 11,
            description: '速度快，攻击也不低'
        },
        {
            id: 'dragon',
            name: '小火龙',
            emoji: '🐲',
            difficulty: 3,
            difficultyText: '困难',
            hp: 130,
            attack: 13,
            description: '喷火龙，伤害很高'
        },
        {
            id: 'skeleton',
            name: '骷髅王',
            emoji: '💀',
            difficulty: 4,
            difficultyText: '地狱',
            hp: 150,
            attack: 15,
            description: '最终BOSS，非常难打'
        }
    ];
    // ========== 战斗状态 ==========
    let battleState = {
        active: false,
        player: null,
        enemy: null,
        playerHp: 0,
        playerMaxHp: 0,
        enemyHp: 0,
        enemyMaxHp: 0,
        sentences: [],       // 句子列表，每个元素：{ english: '...', display: '...' }
        currentSentenceIndex: 0,
        currentCharIndex: 0,
        correctCount: 0,
        wrongCount: 0,
        comboCount: 0,       // 连击数
        healCounter: 0,      // 回血计数器（熊猫用）
        lastInputLength: 0,  // 上次输入长度（用于判断是否新增错误）
        inputError: false,   // 当前输入是否有错误（显示浅红色）
        // ===== 新功能：连击护盾 =====
        shieldCount: 0,      // 护盾数量
        // ===== 新功能：怒气系统 =====
        rage: 0,             // 当前怒气值
        maxRage: 100,        // 最大怒气值
        rageSkillReady: false, // 怒气技能是否就绪
        // ===== 新功能：道具掉落 =====
        itemDropCounter: 0,  // 道具掉落计数器（每打对几个句子掉落一次）
        damageMultiplier: 1, // 伤害倍率（道具效果）
        invincible: false,   // 是否无敌
        activeItems: [],     // 当前激活的道具列表
        startTime: 0,
        battleOver: false
    };
    // ========== 战斗音效 ==========
    let audioCtx = null;
    
    // 初始化音频上下文（懒加载，第一次播放时创建）
    function initAudio() {
        if (!audioCtx) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('Web Audio API 不支持');
            }
        }
        // 恢复音频上下文（浏览器自动暂停策略）
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
    
    // 检查音效是否开启（和全局音效开关联动）
    function isSoundEnabled() {
        // 优先使用全局的 soundEnabled 变量
        if (typeof window.soundEnabled !== 'undefined') {
            return window.soundEnabled;
        }
        // 从 localStorage 读取
        return localStorage.getItem('soundEnabled') !== 'false';
    }
    
    // 播放基础音调
    // 参数：频率(Hz)、时长(秒)、波形、音量(0-1)
    function playTone(frequency, duration, type, volume) {
        if (!isSoundEnabled()) return;
        initAudio();
        if (!audioCtx) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = type || 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        
        // 音量包络：开始时渐强，结束时渐弱，避免爆音
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume || 0.3, audioCtx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + duration);
    }
    
    // ⚔️ 攻击音效 - 清脆的"叮"声
    function playAttackSound() {
        playTone(800, 0.1, 'sine', 0.2);
        setTimeout(() => playTone(1200, 0.08, 'sine', 0.15), 30);
    }
    
    // 💥 暴击音效 - 响亮震撼的"嘭"声
    function playCritSound() {
        playTone(400, 0.15, 'sawtooth', 0.25);
        setTimeout(() => playTone(600, 0.1, 'square', 0.2), 50);
        setTimeout(() => playTone(200, 0.2, 'sine', 0.3), 100);
    }
    
    // 😵 受击音效 - 低沉的"嗡"声
    function playHurtSound() {
        playTone(150, 0.2, 'sawtooth', 0.25);
        setTimeout(() => playTone(100, 0.15, 'sine', 0.2), 50);
    }
    
    // 💚 回血音效 - 柔和的上升三连音
    function playHealSound() {
        playTone(523, 0.1, 'sine', 0.2);   // C5
        setTimeout(() => playTone(659, 0.1, 'sine', 0.2), 80);   // E5
        setTimeout(() => playTone(784, 0.15, 'sine', 0.2), 160); // G5
    }
    
    // 🏆 胜利音效 - 欢快的上升音阶
    function playWinSound() {
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 0.2, 'sine', 0.25), i * 120);
        });
    }
    
    // 💀 失败音效 - 下降的低沉音阶
    function playLoseSound() {
        const notes = [400, 350, 300, 200];
        notes.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 0.25, 'sawtooth', 0.2), i * 150);
        });
    }
    
    // 🔥 连击音效 - 清脆的提示音（每10连击）
    function playComboSound() {
        playTone(1000, 0.08, 'sine', 0.15);
        setTimeout(() => playTone(1500, 0.08, 'sine', 0.15), 50);
    }
    
    // 🔘 点击音效 - 轻微的"哒"声（选择角色/按钮）
    function playClickSound() {
        playTone(600, 0.05, 'sine', 0.1);
    }

    // ========== 战斗语音系统 ==========
    const voiceCache = new Map();       // 语音缓存：key=文本，value=blob URL
    let currentVoiceAudio = null;       // 当前正在播放的语音
    const VOICE_PRELOAD_COUNT = 2;      // 预加载句子数量（保持2句缓冲）

    // 获取 TTS 语音 URL（用你的百度翻译代理）
    function getVoiceUrl(text) {
        const encodedText = encodeURIComponent(text);
        const speed = getVoiceSpeed();
        return `https://tts.841231.xyz/?text=${encodedText}&lan=zh&spd=${speed}`;
    }

    // 获取语速（优先用全局配置，没有就默认 1.0）
    function getVoiceSpeed() {
        if (typeof window.config !== 'undefined' && window.config.speechRate) {
            return window.config.speechRate;
        }
        return 1.0;
    }

    // 检查语音是否开启（默认开启）
    function isVoiceEnabled() {
        if (typeof window.battleVoiceEnabled !== 'undefined') {
            return window.battleVoiceEnabled;
        }
        return true;
    }

    // 预加载单句语音
    function preloadVoice(text) {
        if (!text || !text.trim()) return;
        if (voiceCache.has(text)) return; // 已缓存，跳过

        const url = getVoiceUrl(text);
        
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('语音加载失败');
                return response.blob();
            })
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                voiceCache.set(text, blobUrl);
            })
            .catch(err => {
                console.warn('语音预加载失败:', text.substring(0, 20));
            });
    }

    // 批量预加载语音（错开200ms，避免并发）
    function preloadVoices(sentences, startIndex) {
        for (let i = 0; i < VOICE_PRELOAD_COUNT; i++) {
            const idx = startIndex + i;
            if (idx >= sentences.length) break;
            const text = sentences[idx].english;
            setTimeout(() => preloadVoice(text), i * 200);
        }
    }

    // 播放语音
    function playVoice(text) {
        if (!isVoiceEnabled()) return;
        if (!text || !text.trim()) return;

        // 先停止之前的语音
        stopVoice();

        const doPlay = (url) => {
            const audio = new Audio(url);
            currentVoiceAudio = audio;
            audio.play().catch(err => {
                console.warn('语音播放失败，尝试系统语音兜底');
                playFallbackVoice(text);
            });
            audio.onended = () => {
                currentVoiceAudio = null;
            };
        };

        // 优先用缓存
        if (voiceCache.has(text)) {
            doPlay(voiceCache.get(text));
        } else {
            // 没缓存，直接播 URL，同时后台缓存
            const url = getVoiceUrl(text);
            doPlay(url);
            // 后台缓存
            fetch(url)
                .then(r => r.blob())
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    voiceCache.set(text, blobUrl);
                })
                .catch(() => {});
        }
    }

    // 系统语音兜底（在线语音失败时用）
    function playFallbackVoice(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = getVoiceSpeed();
            window.speechSynthesis.speak(utterance);
        }
    }

    // 停止播放语音
    function stopVoice() {
        // 在线语音实例安全停止
        if (currentVoiceAudio != null) {
            try {
                currentVoiceAudio.pause();
                currentVoiceAudio.currentTime = 0;
            } catch (e) {
                console.warn('停止在线语音异常', e);
            }
            currentVoiceAudio = null;
        }
        // 系统合成语音安全关闭
        if (typeof window.speechSynthesis !== 'undefined') {
            try {
                window.speechSynthesis.cancel();
            } catch (e) {
                console.warn('系统语音取消异常', e);
            }
        }
    }

    // 清理语音缓存（退出战斗时调用，释放内存）
    function clearVoiceCache() {
        stopVoice();
        try {
            for (const blobUrl of voiceCache.values()) {
                URL.revokeObjectURL(blobUrl);
            }
            voiceCache.clear();
        } catch (e) {
            console.warn('释放语音缓存blob失败', e);
        }
    }

    // ========== DOM 元素缓存 ==========
    let elements = {};
    // ========== 初始化 ==========
    function init() {
        // 缓存 DOM 元素
        elements = {
            battleMode: document.getElementById('battleMode'),
            battleSelect: document.getElementById('battleSelect'),
            battleResult: document.getElementById('battleResult'),
            playerAvatar: document.getElementById('battlePlayerAvatar'),
            playerName: document.getElementById('battlePlayerName'),
            playerHpFill: document.getElementById('battlePlayerHpFill'),
            playerHpText: document.getElementById('battlePlayerHpText'),
            enemyAvatar: document.getElementById('battleEnemyAvatar'),
            enemyName: document.getElementById('battleEnemyName'),
            enemyHpFill: document.getElementById('battleEnemyHpFill'),
            enemyHpText: document.getElementById('battleEnemyHpText'),
            playerFighter: document.getElementById('battlePlayerFighter'),
            enemyFighter: document.getElementById('battleEnemyFighter'),
            battleScene: document.getElementById('battleScene'),
            currentWord: document.getElementById('battleCurrentWord'),
            battleInput: document.getElementById('battleInput'),
            statsCorrect: document.getElementById('battleStatsCorrect'),
            statsWrong: document.getElementById('battleStatsWrong'),
            statsCombo: document.getElementById('battleStatsCombo'),
            // ===== 新功能 UI 元素 =====
            playerRageBar: document.getElementById('battlePlayerRageBar'),
            playerRageBarFill: document.getElementById('battlePlayerRageFill'),
            shieldCount: document.getElementById('battleShieldCount'),
            activeItems: document.getElementById('battleActiveItems'),
            exitBtn: document.getElementById('battleExitBtn'),
            startBtn: document.getElementById('startBattleBtn'),
            playerGrid: document.getElementById('playerCharacterGrid'),
            enemyGrid: document.getElementById('enemyCharacterGrid'),
            resultIcon: document.getElementById('battleResultIcon'),
            resultTitle: document.getElementById('battleResultTitle'),
            resultSubtitle: document.getElementById('battleResultSubtitle'),
            resultCorrect: document.getElementById('resultStatCorrect'),
            resultWrong: document.getElementById('resultStatWrong'),
            resultAccuracy: document.getElementById('resultStatAccuracy'),
            resultTime: document.getElementById('resultStatTime'),
            resultRetryBtn: document.getElementById('battleResultRetry'),
            resultBackBtn: document.getElementById('battleResultBack')
        };
        // 绑定事件
        if (elements.exitBtn) {
            elements.exitBtn.addEventListener('click', exitBattle);
        }
        if (elements.battleInput) {
            elements.battleInput.addEventListener('input', handleInput);
        }
        if (elements.startBtn) {
            elements.startBtn.addEventListener('click', startBattle);
        }
        if (elements.resultRetryBtn) {
            elements.resultRetryBtn.addEventListener('click', retryBattle);
        }
        if (elements.resultBackBtn) {
            elements.resultBackBtn.addEventListener('click', backToSelect);
        }
        // 渲染角色选择界面
        renderCharacterSelect();
    }
    // ========== 角色选择界面 ==========
    function renderCharacterSelect() {
        // 渲染玩家角色
        if (elements.playerGrid) {
            elements.playerGrid.innerHTML = '';
            playerCharacters.forEach((char, index) => {
                const card = document.createElement('div');
                card.className = 'character-card';
                card.dataset.id = char.id;
                card.innerHTML = `
                    <div class="character-card-emoji">${char.emoji}</div>
                    <div class="character-card-info">
                        <div class="character-card-name">${char.name}</div>
                        <div class="character-card-type">${char.type}</div>
                        <div class="character-card-stats">
                            <div class="character-card-stat">❤️ <span>${char.hp}</span></div>
                            <div class="character-card-stat">⚔️ <span>${char.attack}</span></div>
                        </div>
                    </div>
                `;
                card.addEventListener('click', () => selectPlayer(char.id));
                elements.playerGrid.appendChild(card);
            });
        }
        // 渲染怪物角色
        if (elements.enemyGrid) {
            elements.enemyGrid.innerHTML = '';
            enemyCharacters.forEach((char, index) => {
                const card = document.createElement('div');
                card.className = 'character-card enemy-card';
                card.dataset.id = char.id;
                const stars = '⭐'.repeat(char.difficulty);
                card.innerHTML = `
                    <div class="character-card-emoji">${char.emoji}</div>
                    <div class="character-card-info">
                        <div class="character-card-name">${char.name}</div>
                        <div class="difficulty-stars">${stars}</div>
                        <div class="character-card-stats">
                            <div class="character-card-stat">❤️ <span>${char.hp}</span></div>
                            <div class="character-card-stat">⚔️ <span>${char.attack}</span></div>
                        </div>
                    </div>
                `;
                card.addEventListener('click', () => selectEnemy(char.id));
                elements.enemyGrid.appendChild(card);
            });
        }
        updateStartButton();
    }
    // 选择玩家角色
    let selectedPlayerId = null;
    function selectPlayer(id) {
        selectedPlayerId = id;
        playClickSound();
        // 更新选中状态
        document.querySelectorAll('#playerCharacterGrid .character-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.id === id);
        });
        updateStartButton();
    }
    // 选择怪物角色
    let selectedEnemyId = null;
    function selectEnemy(id) {
        selectedEnemyId = id;
        playClickSound();
        // 更新选中状态
        document.querySelectorAll('#enemyCharacterGrid .character-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.id === id);
        });
        updateStartButton();
    }
    // 更新开始按钮状态
    function updateStartButton() {
        if (!elements.startBtn) return;
        const canStart = selectedPlayerId && selectedEnemyId;
        elements.startBtn.disabled = !canStart;
        elements.startBtn.textContent = canStart ? '⚔️ 开始战斗！' : '请先选择角色和对手';
    }
    // ========== 打开战斗模式选择界面 ==========
    function openBattleMode() {
        // 获取当前练习内容作为句子列表
        const sourceText = document.getElementById('sourceText');
        if (!sourceText || !sourceText.value.trim()) {
            alert('请先选择练习内容（选择题库或粘贴文本）');
            return;
        }
        // 解析句子
        const text = sourceText.value;
        battleState.sentences = extractSentences(text);
        
        if (battleState.sentences.length < 3) {
            alert('句子太少啦，至少需要 3 个句子才能开始战斗！');
            return;
        }
        // 显示选择界面
        if (elements.battleSelect) {
            elements.battleSelect.classList.add('active');
        }
        // 默认选中第一个玩家和第一个怪物
        if (!selectedPlayerId) {
            selectPlayer(playerCharacters[0].id);
        }
        if (!selectedEnemyId) {
            selectEnemy(enemyCharacters[0].id);
        }
    }
    // 提取句子（按行分割，支持双语对照格式：英文一行、中文一行交替）
    function extractSentences(text) {
        // 按行分割
        const lines = text.split('\n');
        const sentences = [];
        
        let i = 0;
        while (i < lines.length) {
            const trimmed = lines[i].trim();
            if (!trimmed) {
                i++;
                continue; // 跳过空行
            }
            
            // 提取英文部分
            const english = extractEnglishPart(trimmed);
            if (english.length < 2) {
                i++;
                continue; // 英文太短的跳过
            }
            
            // 先检查当前行是不是中英文混合（单词/短语/句子格式：中英文在同一行）
            let chinese = '';
            const chineseChars = trimmed.match(/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]+/g);
            if (chineseChars && chineseChars.length > 0) {
                // 同一行有中文，直接提取
                chinese = chineseChars.join('');
            }
            
            // 如果同一行没有中文，再检查下一行是不是中文翻译（课文格式：一行英文一行中文）
            if (!chinese && i + 1 < lines.length) {
                const nextLine = lines[i + 1].trim();
                const nextEnglish = extractEnglishPart(nextLine);
                // 如果下一行英文很短（小于总长度的30%），认为是中文翻译行
                if (nextLine && nextEnglish.length < nextLine.length * 0.3) {
                    chinese = nextLine;
                    i++; // 跳过中文行
                }
            }
            
            sentences.push({
                english: english,       // 打字目标（纯英文）
                display: trimmed,       // 英文原行（含角色名前缀）
                chinese: chinese        // 中文翻译（可能为空）
            });
            i++;
        }
        
        // 自动分句：把包含多个陈述句的长句拆分成单句
        const splitSentences = [];
        for (const s of sentences) {
            const parts = splitLongSentence(s.english);
            if (parts.length > 1) {
                // 长句拆分后，每个子句共享同一个中文翻译
                for (const part of parts) {
                    splitSentences.push({
                        english: part,
                        display: part,  // 拆分后就用纯英文显示
                        chinese: s.chinese
                    });
                }
            } else {
                splitSentences.push(s);
            }
        }
        
        return splitSentences;
    }
    
    // 自动拆分长句子（按句号、感叹号、问号拆分）
    function splitLongSentence(text) {
        if (!text || text.length < 15) return [text];
        
        // 匹配英文句末标点（. ! ?）后面跟空格
        const sentenceEndRegex = /([.!?]+)\s+/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        
        while ((match = sentenceEndRegex.exec(text)) !== null) {
            const endPos = match.index + match[1].length;
            const sentence = text.substring(lastIndex, endPos).trim();
            if (sentence.length > 3) {
                parts.push(sentence);
            }
            lastIndex = match.index + match[0].length;
        }
        
        // 最后一部分
        const lastPart = text.substring(lastIndex).trim();
        if (lastPart.length > 3) {
            parts.push(lastPart);
        }
        
        // 如果没拆分成多个，就返回原句
        return parts.length > 1 ? parts : [text];
    }
    // 从一行文本中提取英文部分（用于打字）
    function extractEnglishPart(line) {
        // 匹配英文字母、数字、空格、常见英文标点
        const englishRegex = /[a-zA-Z0-9\s.,!?'"-:;()]+/g;
        const matches = line.match(englishRegex);
        if (!matches) return '';
        
        // 拼接并去除首尾多余空格
        let result = matches.join('').trim();
        
        // 合并多个空格为一个
        result = result.replace(/\s+/g, ' ');
        
        return result;
    }
    // ========== 开始战斗 ==========
    function startBattle() {
        if (!selectedPlayerId || !selectedEnemyId) return;
        const playerChar = playerCharacters.find(c => c.id === selectedPlayerId);
        const enemyChar = enemyCharacters.find(c => c.id === selectedEnemyId);
        // 初始化战斗状态
        // 怪物血量 = 句子数量 × 玩家攻击力 × 2（确保打不死，必须打完所有句子才能胜利）
        const enemyMaxHp = battleState.sentences.length * playerChar.attack * 2;
        
        battleState = {
            active: true,
            player: playerChar,
            enemy: enemyChar,
            playerHp: playerChar.hp,
            playerMaxHp: playerChar.hp,
            enemyHp: enemyMaxHp,
            enemyMaxHp: enemyMaxHp,
            sentences: [...battleState.sentences], // 句子不打乱，保持原文顺序
            currentSentenceIndex: 0,
            currentCharIndex: 0,
            correctCount: 0,
            wrongCount: 0,
            comboCount: 0,
            healCounter: 0,
            lastInputLength: 0,
            inputError: false,
            // ===== 新功能初始化 =====
            shieldCount: 0,
            rage: 0,
            maxRage: 100,
            rageSkillReady: false,
            itemDropCounter: 0,
            damageMultiplier: 1,
            invincible: false,
            activeItems: [],
            startTime: Date.now(),
            battleOver: false
        };
        // 更新 UI
        updateBattleUI();
        // 隐藏选择界面，显示战斗界面
        if (elements.battleSelect) {
            elements.battleSelect.classList.remove('active');
        }
        if (elements.battleMode) {
            elements.battleMode.classList.add('active');
        }
        // 预加载前 2 句语音
        preloadVoices(battleState.sentences, 0);
        // 显示第一个句子
        showCurrentSentence();
        // 聚焦输入框
        setTimeout(() => {
            if (elements.battleInput) {
                elements.battleInput.value = '';
                elements.battleInput.focus();
            }
        }, 300);
    }
    // ========== 更新战斗 UI ==========
    function updateBattleUI() {
        if (!battleState.player || !battleState.enemy) return;
        // 玩家信息
        if (elements.playerAvatar) {
            elements.playerAvatar.textContent = battleState.player.emoji;
        }
        if (elements.playerName) {
            elements.playerName.textContent = battleState.player.name;
        }
        if (elements.playerHpFill) {
            const percent = Math.max(0, (battleState.playerHp / battleState.playerMaxHp) * 100);
            elements.playerHpFill.style.width = percent + '%';
        }
        if (elements.playerHpText) {
            elements.playerHpText.textContent = `${Math.max(0, Math.ceil(battleState.playerHp))} / ${battleState.playerMaxHp}`;
        }
        // 怪物信息
        if (elements.enemyAvatar) {
            elements.enemyAvatar.textContent = battleState.enemy.emoji;
        }
        if (elements.enemyName) {
            elements.enemyName.textContent = battleState.enemy.name;
        }
        if (elements.enemyHpFill) {
            const percent = Math.max(0, (battleState.enemyHp / battleState.enemyMaxHp) * 100);
            elements.enemyHpFill.style.width = percent + '%';
        }
        if (elements.enemyHpText) {
            elements.enemyHpText.textContent = `${Math.max(0, Math.ceil(battleState.enemyHp))} / ${battleState.enemyMaxHp}`;
        }
        // 战斗角色
        if (elements.playerFighter) {
            elements.playerFighter.textContent = battleState.player.emoji;
        }
        if (elements.enemyFighter) {
            elements.enemyFighter.textContent = battleState.enemy.emoji;
        }
        // 统计数据
        if (elements.statsCorrect) {
            elements.statsCorrect.textContent = battleState.correctCount;
        }
        if (elements.statsWrong) {
            elements.statsWrong.textContent = battleState.wrongCount;
        }
        if (elements.statsCombo) {
            elements.statsCombo.textContent = battleState.comboCount;
        }
        
        // ===== 新功能 UI 更新 =====
        // 怒气条
        if (elements.playerRageBarFill) {
            const ragePercent = (battleState.rage / battleState.maxRage) * 100;
            elements.playerRageBarFill.style.width = ragePercent + '%';
            
            // 怒气满了加发光效果
            if (battleState.rageSkillReady) {
                elements.playerRageBar.classList.add('rage-full');
            } else {
                elements.playerRageBar.classList.remove('rage-full');
            }
        }
        
        // 护盾数量
        if (elements.shieldCount) {
            if (battleState.shieldCount > 0) {
                elements.shieldCount.textContent = '🛡️ ' + battleState.shieldCount;
                elements.shieldCount.style.display = 'inline-block';
            } else {
                elements.shieldCount.style.display = 'none';
            }
        }
        
        // 激活的道具
        if (elements.activeItems) {
            let html = '';
            for (const item of battleState.activeItems) {
                const itemInfo = itemTypes.find(t => t.id === item.id);
                if (itemInfo) {
                    // 剩余时间 <= 1 时闪烁警告
                    const warningClass = item.remaining <= 1 ? 'item-warning' : '';
                    html += `<span class="active-item ${warningClass}" title="${itemInfo.name} 剩余 ${item.remaining} 句">${itemInfo.emoji}${item.remaining}</span>`;
                }
            }
            elements.activeItems.innerHTML = html;
        }
    }
    // ========== 显示当前句子 ==========
    function showCurrentSentence() {
        if (battleState.currentSentenceIndex >= battleState.sentences.length) {
            // 所有句子打完了
            endBattle('sentences_finished');
            return;
        }
        const sentence = battleState.sentences[battleState.currentSentenceIndex];
        battleState.currentCharIndex = 0;
        // 显示句子（英文逐字变色，中文在下）
        if (elements.currentWord) {
            const displayText = sentence.display;
            const englishText = sentence.english;
            const chineseText = sentence.chinese || '';
            
            // 找到英文在整行中的位置（提取角色名前缀）
            const lowerDisplay = displayText.toLowerCase();
            const lowerEnglish = englishText.toLowerCase();
            const index = lowerDisplay.indexOf(lowerEnglish);
            
            let speakerPrefix = '';
            if (index >= 0) {
                speakerPrefix = displayText.substring(0, index); // 英文前面的部分（角色名前缀）
            }
            
            // 构造显示内容：英文逐字span（初始白色），中文在下
            let html = `<div style="margin-bottom: 8px; line-height: 1.4; text-align: center;">`;
            if (speakerPrefix) {
                html += `<span style="color: rgba(255,255,255,0.5); font-size: 18px;">${speakerPrefix}</span>`;
            }
            // 英文逐字拆分为span，初始白色（未输入），第0个黄色（当前位）
            for (let i = 0; i < englishText.length; i++) {
                const ch = englishText[i];
                let color = '#fff'; // 未输入：白色
                if (i === 0) {
                    color = '#ffdd00'; // 当前位：黄色
                }
                // 空格也显示，保持字间距
                html += `<span class="battle-char" data-index="${i}" style="color: ${color}; font-weight: bold; font-size: 26px; letter-spacing: 1px;">${ch === ' ' ? '&nbsp;' : ch}</span>`;
            }
            html += `</div>`;
            
            // 中文翻译（如果有）
            if (chineseText) {
                html += `<div style="color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.4; text-align: center;">
                    ${chineseText}
                </div>`;
            }
            
            elements.currentWord.innerHTML = html;
        }
        // 清空输入框
        if (elements.battleInput) {
            elements.battleInput.value = '';
            elements.battleInput.classList.remove('correct', 'wrong');
        }
        // 重置输入长度记录和错误状态
        battleState.lastInputLength = 0;
        battleState.inputError = false;
        // 播放当前句子的语音
        playVoice(sentence.english);
        // 预加载下一句的语音
        const nextIndex = battleState.currentSentenceIndex + 1;
        if (nextIndex < battleState.sentences.length) {
            // 延迟一点预加载，避免和当前播放抢资源
            setTimeout(() => {
                preloadVoice(battleState.sentences[nextIndex].english);
            }, 500);
        }
    }
    
    // 更新逐字颜色（替代圆点进度条）
    function updateCharColors() {
        if (!elements.currentWord) return;
        const charSpans = elements.currentWord.querySelectorAll('.battle-char');
        if (!charSpans.length) return;
        
        const sentence = battleState.sentences[battleState.currentSentenceIndex];
        if (!sentence) return;
        
        const english = sentence.english;
        const input = elements.battleInput ? elements.battleInput.value.toLowerCase() : '';
        const target = english.toLowerCase();
        
        // 检查是否有错误
        let hasError = false;
        let errorIndex = -1;
        for (let i = 0; i < input.length; i++) {
            if (input[i] !== target[i]) {
                hasError = true;
                errorIndex = i;
                break;
            }
        }
        
        // 更新每个字符的颜色
        charSpans.forEach((span, i) => {
            if (hasError && i === errorIndex) {
                // 错误位：浅红色
                span.style.color = '#f87171';
            } else if (hasError && i < errorIndex) {
                // 错误之前的正确字符：绿色
                span.style.color = '#39d353';
            } else if (!hasError && i < input.length) {
                // 已输入正确：绿色
                span.style.color = '#39d353';
            } else if (!hasError && i === input.length) {
                // 当前输入位：黄色
                span.style.color = '#ffdd00';
            } else {
                // 未输入：白色
                span.style.color = '#fff';
            }
        });
    }
    // ========== 处理输入 ==========
    function handleInput(e) {
        if (battleState.battleOver) return;
        const input = elements.battleInput;
        const sentence = battleState.sentences[battleState.currentSentenceIndex];
        const inputValue = input.value.toLowerCase();
        const targetEnglish = sentence.english.toLowerCase();
        const inputLen = inputValue.length;
        
        // 检查输入是否有错误（找到第一个错误的位置）
        let hasError = false;
        let firstErrorIndex = -1;
        for (let i = 0; i < inputLen; i++) {
            if (inputValue[i] !== targetEnglish[i]) {
                hasError = true;
                firstErrorIndex = i;
                break;
            }
        }
        
        // 如果从正确状态变成错误状态 → 扣血（每个错误只扣一次）
        if (hasError && !battleState.inputError) {
            handleWrongInput();
        }
        // 更新错误状态
        battleState.inputError = hasError;
        
        // 更新当前字符索引（正确的字符数）
        if (hasError) {
            battleState.currentCharIndex = firstErrorIndex;
        } else {
            battleState.currentCharIndex = inputLen;
        }
        
        // 更新逐字颜色（不管对错都更新）
        updateCharColors();
        
        // 检查是否打完整个句子的英文部分（全部正确且长度相等）
        if (!hasError && inputLen === targetEnglish.length) {
            handleSentenceComplete();
        }
        
        // 更新上次输入长度
        battleState.lastInputLength = inputLen;
    }
    // 打错了
    function handleWrongInput() {
        battleState.wrongCount++;
        battleState.comboCount = 0;
        // 输入框变红
        if (elements.battleInput) {
            elements.battleInput.classList.add('wrong');
            setTimeout(() => {
                if (elements.battleInput) {
                    elements.battleInput.classList.remove('wrong');
                }
            }, 300);
        }
        // 怪物攻击玩家
        enemyAttack();
        updateBattleUI();
        checkBattleEnd();
    }
    // 句子完成
    function handleSentenceComplete() {
        battleState.correctCount++;
        battleState.comboCount++;
        // 输入框变绿
        if (elements.battleInput) {
            elements.battleInput.classList.add('correct');
        }
        // 玩家攻击怪物
        playerAttack();
        // 每 10 连击播放连击音效 + 获得一个护盾
        if (battleState.comboCount > 0 && battleState.comboCount % 10 === 0) {
            playComboSound();
            // ===== 新功能：连击护盾 =====
            battleState.shieldCount++;
            // 显示护盾获得特效
            showShieldGainEffect();
        }
        // 熊猫回血技能
        if (battleState.player.special === 'heal') {
            battleState.healCounter++;
            if (battleState.healCounter >= battleState.player.healInterval) {
                battleState.healCounter = 0;
                playerHeal(battleState.player.healAmount);
            }
        }
        
        // ===== 新功能：道具掉落 =====
        tryDropItem();
        
        // ===== 新功能：消耗道具持续时间 =====
        consumeItemDuration();
        // 下一个句子
        setTimeout(() => {
            if (!battleState.battleOver) {
                battleState.currentSentenceIndex++;
                showCurrentSentence();
                if (elements.battleInput) {
                    elements.battleInput.focus();
                }
            }
        }, 800); // 句子比单词长，多给一点时间看
        updateBattleUI();
        checkBattleEnd();
    }
    // ========== 玩家攻击 ==========
    function playerAttack() {
        let damage = battleState.player.attack;
        let isCrit = false;
        // 暴击判定
        if (Math.random() < battleState.player.critRate) {
            damage *= 2;
            isCrit = true;
        }
        // 连击加成（每10连击 +10% 伤害）
        const comboBonus = Math.floor(battleState.comboCount / 10) * 0.1;
        damage = Math.floor(damage * (1 + comboBonus));
        
        // ===== 新功能：伤害倍率（道具效果） =====
        damage = Math.floor(damage * battleState.damageMultiplier);
        // 扣血
        battleState.enemyHp -= damage;
        // 播放音效
        if (isCrit) {
            playCritSound();
        } else {
            playAttackSound();
        }
        // 攻击动画
        if (elements.playerFighter) {
            elements.playerFighter.classList.add('attacking');
            setTimeout(() => {
                elements.playerFighter.classList.remove('attacking');
            }, 500);
        }
        // 怪物受击动画
        setTimeout(() => {
            if (elements.enemyFighter) {
                elements.enemyFighter.classList.add('hurt');
                setTimeout(() => {
                    elements.enemyFighter.classList.remove('hurt');
                }, 400);
            }
        }, 200);
        // 显示伤害数字
        showDamageNumber(elements.enemyFighter, damage, isCrit ? 'crit' : 'normal');
        // 攻击特效
        showAttackEffect(elements.enemyFighter, '💥');
        updateBattleUI();
    }
    // ========== 怪物攻击 ==========
    function enemyAttack() {
        const damage = battleState.enemy.attack;
        
        // ===== 新功能：无敌判断（道具效果） =====
        if (battleState.invincible) {
            // 无敌状态，不扣血
            showDamageNumber(elements.playerFighter, '免疫', 'heal');
            showAttackEffect(elements.playerFighter, '✨');
            updateBattleUI();
            return;
        }
        
        // ===== 新功能：护盾抵挡 =====
        if (battleState.shieldCount > 0) {
            battleState.shieldCount--;
            // 显示护盾破碎特效
            showShieldBreakEffect();
            // 不扣血，只显示护盾抵挡
            showDamageNumber(elements.playerFighter, '护盾', 'heal');
            updateBattleUI();
            return;
        }
        
        // 正常扣血
        battleState.playerHp -= damage;
        
        // ===== 新功能：受到伤害增加怒气 =====
        addRage(damage * 2); // 每次受到伤害，怒气值 = 伤害 × 2
        
        // 播放受击音效
        playHurtSound();
        // 怪物攻击动画
        if (elements.enemyFighter) {
            elements.enemyFighter.classList.add('attacking');
            setTimeout(() => {
                elements.enemyFighter.classList.remove('attacking');
            }, 500);
        }
        // 玩家受击动画
        setTimeout(() => {
            if (elements.playerFighter) {
                elements.playerFighter.classList.add('hurt');
                setTimeout(() => {
                    elements.playerFighter.classList.remove('hurt');
                }, 400);
            }
        }, 200);
        // 显示伤害数字
        showDamageNumber(elements.playerFighter, damage, 'normal');
        // 攻击特效
        showAttackEffect(elements.playerFighter, '💢');
        updateBattleUI();
    }
    // ========== 玩家回血 ==========
    function playerHeal(amount) {
        const actualHeal = Math.min(amount, battleState.playerMaxHp - battleState.playerHp);
        battleState.playerHp += actualHeal;
        // 播放回血音效
        playHealSound();
        // 显示回血数字
        showDamageNumber(elements.playerFighter, '+' + actualHeal, 'heal');
        // 回血特效
        showAttackEffect(elements.playerFighter, '💚');
        updateBattleUI();
    }
    // ========== 显示伤害数字 ==========
    function showDamageNumber(targetElement, damage, type) {
        if (!targetElement || !elements.battleScene) return;
        const targetRect = targetElement.getBoundingClientRect();
        const sceneRect = elements.battleScene.getBoundingClientRect();
        const damageEl = document.createElement('div');
        damageEl.className = 'damage-number';
        if (type === 'crit') {
            damageEl.classList.add('crit');
            damageEl.textContent = damage + '!';
        } else if (type === 'heal') {
            damageEl.classList.add('heal');
            damageEl.textContent = damage;
        } else {
            damageEl.textContent = '-' + damage;
        }
        // 定位到目标元素上方
        damageEl.style.left = (targetRect.left - sceneRect.left + targetRect.width / 2 - 20) + 'px';
        damageEl.style.top = (targetRect.top - sceneRect.top) + 'px';
        elements.battleScene.appendChild(damageEl);
        // 动画结束后移除
        setTimeout(() => {
            if (damageEl.parentNode) {
                damageEl.parentNode.removeChild(damageEl);
            }
        }, 1000);
    }
    // ========== 显示攻击特效 ==========
    function showAttackEffect(targetElement, emoji) {
        if (!targetElement || !elements.battleScene) return;
        const targetRect = targetElement.getBoundingClientRect();
        const sceneRect = elements.battleScene.getBoundingClientRect();
        const effectEl = document.createElement('div');
        effectEl.className = 'attack-effect';
        effectEl.textContent = emoji;
        // 定位到目标元素位置
        effectEl.style.left = (targetRect.left - sceneRect.left + targetRect.width / 2 - 30) + 'px';
        effectEl.style.top = (targetRect.top - sceneRect.top + targetRect.height / 2 - 30) + 'px';
        elements.battleScene.appendChild(effectEl);
        // 动画结束后移除
        setTimeout(() => {
            if (effectEl.parentNode) {
                effectEl.parentNode.removeChild(effectEl);
            }
        }, 500);
    }

    // ========== 新功能：护盾特效 ==========
    // 护盾获得特效
    function showShieldGainEffect() {
        if (!elements.playerFighter || !elements.battleScene) return;
        const targetRect = elements.playerFighter.getBoundingClientRect();
        const sceneRect = elements.battleScene.getBoundingClientRect();
        const effectEl = document.createElement('div');
        effectEl.className = 'shield-gain-effect';
        effectEl.textContent = '🛡️';
        effectEl.style.left = (targetRect.left - sceneRect.left + targetRect.width / 2 - 25) + 'px';
        effectEl.style.top = (targetRect.top - sceneRect.top - 10) + 'px';
        elements.battleScene.appendChild(effectEl);
        setTimeout(() => {
            if (effectEl.parentNode) {
                effectEl.parentNode.removeChild(effectEl);
            }
        }, 800);
    }

    // 护盾破碎特效
    function showShieldBreakEffect() {
        if (!elements.playerFighter || !elements.battleScene) return;
        const targetRect = elements.playerFighter.getBoundingClientRect();
        const sceneRect = elements.battleScene.getBoundingClientRect();
        const effectEl = document.createElement('div');
        effectEl.className = 'shield-break-effect';
        effectEl.textContent = '💔';
        effectEl.style.left = (targetRect.left - sceneRect.left + targetRect.width / 2 - 25) + 'px';
        effectEl.style.top = (targetRect.top - sceneRect.top - 10) + 'px';
        elements.battleScene.appendChild(effectEl);
        setTimeout(() => {
            if (effectEl.parentNode) {
                effectEl.parentNode.removeChild(effectEl);
            }
        }, 600);
    }

    // ========== 新功能：怒气系统 ==========
    // 增加怒气（受到伤害时调用）
    function addRage(amount) {
        battleState.rage = Math.min(battleState.rage + amount, battleState.maxRage);
        if (battleState.rage >= battleState.maxRage && !battleState.rageSkillReady) {
            battleState.rageSkillReady = true;
            // 怒气满了，显示提示
            showRageFullEffect();
            
            // ===== 自动释放怒气技能（方案C：自动释放） =====
            // 延迟一点点释放，让玩家先看到"怒气满了"的提示
            setTimeout(() => {
                if (!battleState.battleOver && battleState.rageSkillReady) {
                    useRageSkill();
                }
            }, 800);
        }
        updateBattleUI();
    }

    // 怒气满特效
    function showRageFullEffect() {
        if (!elements.playerFighter || !elements.battleScene) return;
        const targetRect = elements.playerFighter.getBoundingClientRect();
        const sceneRect = elements.battleScene.getBoundingClientRect();
        const effectEl = document.createElement('div');
        effectEl.className = 'rage-full-effect';
        effectEl.textContent = '🔥 怒气满了！';
        effectEl.style.left = (targetRect.left - sceneRect.left + targetRect.width / 2 - 40) + 'px';
        effectEl.style.top = (targetRect.top - sceneRect.top - 30) + 'px';
        elements.battleScene.appendChild(effectEl);
        setTimeout(() => {
            if (effectEl.parentNode) {
                effectEl.parentNode.removeChild(effectEl);
            }
        }, 1500);
    }

    // 释放怒气技能
    function useRageSkill() {
        if (!battleState.rageSkillReady) return;
        
        battleState.rageSkillReady = false;
        battleState.rage = 0;
        
        // 怒气技能效果：对怪物造成大量伤害 + 玩家回血
        const rageDamage = Math.floor(battleState.player.attack * 3); // 3倍攻击力
        const rageHeal = Math.floor(battleState.playerMaxHp * 0.2); // 回20%血
        
        // 怪物掉血
        battleState.enemyHp -= rageDamage;
        
        // 玩家回血
        const actualHeal = Math.min(rageHeal, battleState.playerMaxHp - battleState.playerHp);
        battleState.playerHp += actualHeal;
        
        // 播放特效
        showRageSkillEffect();
        showDamageNumber(elements.enemyFighter, rageDamage, 'crit');
        showDamageNumber(elements.playerFighter, '+' + actualHeal, 'heal');
        
        // 播放音效（用暴击音效代替）
        playCritSound();
        playHealSound();
        
        updateBattleUI();
        checkBattleEnd();
    }

    // 怒气技能特效
    function showRageSkillEffect() {
        if (!elements.battleScene) return;
        const effectEl = document.createElement('div');
        effectEl.className = 'rage-skill-effect';
        effectEl.textContent = '💥🔥⚡';
        effectEl.style.left = '50%';
        effectEl.style.top = '50%';
        effectEl.style.transform = 'translate(-50%, -50%)';
        elements.battleScene.appendChild(effectEl);
        setTimeout(() => {
            if (effectEl.parentNode) {
                effectEl.parentNode.removeChild(effectEl);
            }
        }, 1000);
    }

    // ========== 新功能：道具掉落 ==========
    // 道具类型定义
    const itemTypes = [
        {
            id: 'heal',
            name: '回血药水',
            emoji: '❤️',
            description: '恢复 30% 生命值',
            effect: function() {
                const healAmount = Math.floor(battleState.playerMaxHp * 0.3);
                playerHeal(healAmount);
            }
        },
        {
            id: 'shield',
            name: '护盾道具',
            emoji: '🛡️',
            description: '获得 2 个护盾',
            effect: function() {
                battleState.shieldCount += 2;
                showShieldGainEffect();
            }
        },
        {
            id: 'attack',
            name: '力量药水',
            emoji: '⚔️',
            description: '接下来 5 个句子伤害翻倍',
            duration: 5,
            effect: function() {
                battleState.damageMultiplier = 2;
                addActiveItem('attack', 5);
            }
        },
        {
            id: 'invincible',
            name: '无敌星星',
            emoji: '⭐',
            description: '接下来 3 个句子无敌',
            duration: 3,
            effect: function() {
                battleState.invincible = true;
                addActiveItem('invincible', 3);
            }
        },
        {
            id: 'rage',
            name: '怒气药水',
            emoji: '🔥',
            description: '怒气直接充满',
            effect: function() {
                battleState.rage = battleState.maxRage;
                battleState.rageSkillReady = true;
                showRageFullEffect();
            }
        }
    ];

    // 添加激活的道具（有持续时间的）
    function addActiveItem(itemId, duration) {
        battleState.activeItems.push({
            id: itemId,
            remaining: duration
        });
    }

    // 消耗一个持续时间（每打完一个句子调用）
    function consumeItemDuration() {
        const newActiveItems = [];
        for (const item of battleState.activeItems) {
            item.remaining--;
            if (item.remaining > 0) {
                newActiveItems.push(item);
            } else {
                // 道具效果结束
                if (item.id === 'attack') {
                    battleState.damageMultiplier = 1;
                } else if (item.id === 'invincible') {
                    battleState.invincible = false;
                }
            }
        }
        battleState.activeItems = newActiveItems;
    }

    // 随机掉落道具
    function tryDropItem() {
        battleState.itemDropCounter++;
        
        // 每打对 5 个句子有概率掉落一个道具
        if (battleState.itemDropCounter >= 5) {
            battleState.itemDropCounter = 0;
            
            // 70% 概率掉落
            if (Math.random() < 0.7) {
                dropRandomItem();
            }
        }
    }

    // 掉落随机道具
    function dropRandomItem() {
        const randomIndex = Math.floor(Math.random() * itemTypes.length);
        const item = itemTypes[randomIndex];
        
        // 显示道具掉落特效
        showItemDropEffect(item);
        
        // 自动拾取（延迟一点生效，让玩家看到）
        setTimeout(() => {
            item.effect();
            updateBattleUI();
        }, 500);
    }

    // 道具掉落特效
    function showItemDropEffect(item) {
        if (!elements.battleScene) return;
        const effectEl = document.createElement('div');
        effectEl.className = 'item-drop-effect';
        effectEl.innerHTML = `
            <div class="item-drop-emoji">${item.emoji}</div>
            <div class="item-drop-name">${item.name}</div>
        `;
        effectEl.style.left = '50%';
        effectEl.style.top = '30%';
        effectEl.style.transform = 'translateX(-50%)';
        elements.battleScene.appendChild(effectEl);
        setTimeout(() => {
            if (effectEl.parentNode) {
                effectEl.parentNode.removeChild(effectEl);
            }
        }, 1200);
    }
    // ========== 检查战斗是否结束 ==========
    function checkBattleEnd() {
        if (battleState.battleOver) return;
        // 只有玩家血量归零才失败
        // 怪物血量不会归零（血很厚），必须打完所有句子才算胜利
        if (battleState.playerHp <= 0) {
            battleState.playerHp = 0;
            endBattle('lose');
        }
    }
    // ========== 战斗结束 ==========
    function endBattle(result) {
        battleState.battleOver = true;
        battleState.active = false;
        const endTime = Date.now();
        const duration = Math.floor((endTime - battleState.startTime) / 1000);
        const total = battleState.correctCount + battleState.wrongCount;
        const accuracy = total > 0 ? Math.round((battleState.correctCount / total) * 100) : 0;
        
        // 打完所有句子也算胜利
        const isWin = result === 'win' || result === 'sentences_finished';
        
        // 播放结果音效
        if (isWin) {
            playWinSound();
        } else if (result === 'lose') {
            playLoseSound();
        }
        // 更新结果弹窗
        if (elements.resultIcon) {
            elements.resultIcon.textContent = isWin ? '🏆' : '💔';
        }
        if (elements.resultTitle) {
            elements.resultTitle.textContent = isWin ? '胜利！' : '失败...';
            elements.resultTitle.className = 'battle-result-title ' + (isWin ? 'win' : 'lose');
        }
        if (elements.resultSubtitle) {
            if (isWin) {
                elements.resultSubtitle.textContent = `恭喜！全部 ${battleState.sentences.length} 个句子都打完啦！`;
            } else if (result === 'lose') {
                elements.resultSubtitle.textContent = `你被 ${battleState.enemy.name} 击败了...`;
            } else {
                elements.resultSubtitle.textContent = '所有句子都打完啦！';
            }
        }
        if (elements.resultCorrect) {
            elements.resultCorrect.textContent = battleState.correctCount;
        }
        if (elements.resultWrong) {
            elements.resultWrong.textContent = battleState.wrongCount;
        }
        if (elements.resultAccuracy) {
            elements.resultAccuracy.textContent = accuracy + '%';
        }
        if (elements.resultTime) {
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            elements.resultTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        // 显示结果弹窗
        setTimeout(() => {
            if (elements.battleResult) {
                elements.battleResult.classList.add('active');
            }
        }, 800);
    }
    // ========== 再来一局 ==========
    function retryBattle() {
        playClickSound();
        if (elements.battleResult) {
            elements.battleResult.classList.remove('active');
        }
        startBattle();
    }
    // ========== 返回选择界面 ==========
    function backToSelect() {
        playClickSound();
        if (elements.battleResult) {
            elements.battleResult.classList.remove('active');
        }
        if (elements.battleMode) {
            elements.battleMode.classList.remove('active');
        }
        if (elements.battleSelect) {
            elements.battleSelect.classList.add('active');
        }
    }
    // ========== 退出战斗 ==========
    function exitBattle() {
        if (confirm('确定要退出战斗吗？当前进度将丢失。')) {
            battleState.active = false;
            battleState.battleOver = true;
            // 清理语音缓存，增加异常捕获，防止阻断退出流程
            try {
                clearVoiceCache();
            } catch (voiceErr) {
                console.warn('退出时清理语音缓存失败，忽略异常', voiceErr);
            }
            
            // 以下界面关闭逻辑不受语音报错影响，一定会执行
            if (elements.battleMode) {
                elements.battleMode.classList.remove('active');
            }
            if (elements.battleSelect) {
                elements.battleSelect.classList.remove('active');
            }
            if (elements.battleResult) {
                elements.battleResult.classList.remove('active');
            }
        }
    }
    // ========== 对外接口 ==========
    window.battleMode = {
        init: init,
        open: openBattleMode,
        exit: exitBattle
    };
    // 页面加载完成后自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
