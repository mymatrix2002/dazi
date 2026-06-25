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
        inputError: false,   // 当前输入是否有错误（显示粉红色）
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
        if (currentVoiceAudio) {
            currentVoiceAudio.pause();
            currentVoiceAudio = null;
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }
    // 清理语音缓存（退出战斗时调用，释放内存）
    function clearVoiceCache() {
        stopVoice();
        for (const blobUrl of voiceCache.values()) {
            URL.revokeObjectURL(blob);
        }
        voiceCache.clear();
    }
    // ========== DOM 元素缓存（修复：匹配新HTML class，删除不存在ID） ==========
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
            // 修复：用class匹配怒气条（无id）
            rageBarWrap: document.querySelector('.rage-bar-wrap'),
            rageBarInner: document.querySelector('.rage-bar-inner'),
            // 修复：buff常驻容器 class
            buffContainer: document.querySelector('.active-buff-container'),
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
        if (!source || !sourceText.value.trim()) {
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
            selectEnemy(enemyCharacters[0]);
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
    // ========== 更新战斗 UI（修复：动态渲染护盾/道具，匹配rage-bar-wrap） ==========
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
        
        // ===== 怒气条更新（修复class选择器） =====
        if (elements.rageBarWrap && elements.rageBarInner) {
            const ragePercent = (battleState.rage / battleState.maxRage) * 100;
            elements.rageBarInner.style.width = ragePercent + '%';
            // 怒气满脉冲发光
            if (battleState.rageSkillReady) {
                elements.rageBarWrap.classList.add('rage-full');
            } else {
                elements.rageBarWrap.classList.remove('rage-full');
            }
        }
        
        // ===== 动态渲染护盾 + 道具Buff到 .active-buff-container =====
        if (elements.buffContainer) {
            elements.buffContainer.innerHTML = '';
            // 渲染护盾
            if (battleState.shieldCount > 0) {
                const shieldDom = document.createElement('span');
                shieldDom.className = 'shield-buff-icon';
                shieldDom.textContent = `🛡️ ×${battleState.shieldCount}`;
                elements.buffContainer.appendChild(shieldDom);
            }
            // 渲染激活道具
            for (const item of battleState.activeItems) {
                const itemInfo = itemTypes.find(t => t.id === item.id);
                if (!itemInfo) continue;
                const itemDom = document.createElement('span');
                itemDom.className = 'active-item-icon';
                if (item.remaining <= 1) itemDom.classList.add('item-low-time');
                itemDom.title = `${itemInfo.name} 剩余${item.remaining}句`;
                itemDom.textContent = `${itemInfo.emoji}${item.remaining}`;
                elements.buffContainer.appendChild(itemDom);
            }
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
            // 英文逐字拆分为span，初始白色（未输入），第0个黄色
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
                html += `<div style="color: rgba(255,255,0.6); font-size: 15px; line-height: 1.4; text-align: center;">
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
                // 错误位：粉红色
                span.style.color = '#ff6b9d';
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
        
        // 更新当前字符索引
        if (hasError) {
            battleState.currentCharIndex = firstErrorIndex;
        } else {
            battleState.currentCharIndex = inputLen;
        }
        
        // 更新逐字颜色
        updateCharColors();
        
        // 全部输入正确，完成句子
        if (!hasError && inputLen === targetEnglish.length) {
            handleSentenceComplete();
        }
        
        // 记录本次输入长度
        battleState.lastInputLength = inputLen;
    }
    // 打错字符，不清空输入框（用户需求）
    function handleWrongInput() {
        battleState.wrongCount++;
        battleState.comboCount = 0;
        // 输入框短暂变红
        if (elements.battleInput) {
            elements.battleInput.classList.add('wrong');
            setTimeout(() => {
                if (elements.battleInput) {
                    elements.battleInput.classList.remove('wrong');
                }
            }, 300);
        }
        // 怪物攻击
        enemyAttack();
        updateBattleUI();
        checkBattleEnd();
    }
    // 完整答对一句
    function handleSentenceComplete() {
        battleState.correctCount++;
        battleState.comboCount++;
        if (elements.battleInput) {
            elements.battleInput.classList.add('correct');
        }
        // 玩家攻击怪物
        playerAttack();
        // 每10连击给护盾
        if (battleState.comboCount > 0 && battleState.comboCount % 10 === 0) {
            playComboSound();
            battleState.shieldCount++;
            showShieldGainEffect();
        }
        // 熊猫被动回血
        if (battleState.player.special === 'heal') {
            battleState.healCounter++;
            if (battleState.healCounter >= battleState.player.healInterval) {
                battleState.healCounter = 0;
                playerHeal(battleState.player.healAmount);
            }
        }
        // 尝试掉落道具
        tryDropItem();
        // 消耗道具持续回合
        consumeItemDuration();
        // 切换下一句
        setTimeout(() => {
            if (!battleState.battleOver) {
                battleState.currentSentenceIndex++;
                showCurrentSentence();
                if (elements.battleInput) {
                    elements.battleInput.focus();
                }
            }
        }, 800);
        updateBattleUI();
        checkBattleEnd();
    }
    // ========== 玩家攻击怪物 ==========
    function playerAttack() {
        let damage = battleState.player.attack;
        let isCrit = false;
        if (Math.random() < battleState.player.critRate) {
            damage *= 2;
            isCrit = true;
        }
        // 连击增伤
        const comboBonus = Math.floor(battleState.comboCount / 10) * 0.1;
        damage = Math.floor(damage * (1 + comboBonus));
        // 道具伤害倍率
        damage = Math.floor(damage * battleState.damageMultiplier);
        
        battleState.enemyHp -= damage;
        if (isCrit) playCritSound();
        else playAttackSound();
        
        if (elements.playerFighter) {
            elements.playerFighter.classList.add('attacking');
            setTimeout(()=>elements.playerFighter.classList.remove('attacking'),500);
        }
        setTimeout(()=>{
            if(elements.enemyFighter){
                elements.enemyFighter.classList.add('hurt');
                setTimeout(()=>elements.enemyFighter.classList.remove('hurt'),400);
            }
        },200);
        showDamageNumber(elements.enemyFighter, damage, isCrit ? 'crit' : 'normal');
        showAttackEffect(elements.enemyFighter, '💥');
        updateBattleUI();
    }
    // ========== 怪物攻击玩家 ==========
    function enemyAttack() {
        const damage = battleState.enemy.attack;
        // 无敌判断
        if (battleState.invincible) {
            showDamageNumber(elements.playerFighter, '免疫', 'heal');
            showAttackEffect(elements.playerFighter, '✨');
            updateBattleUI();
            return;
        }
        // 护盾抵挡
        if (battleState.shieldCount > 0) {
            battleState.shieldCount--;
            showShieldBreakEffect();
            showDamageNumber(elements.playerFighter, '护盾', 'heal');
            updateBattleUI();
            return;
        }
        // 正常扣血
        battleState.playerHp -= damage;
        // 增加怒气
        addRage(damage * 2);
        playHurtSound();
        if (elements.enemyFighter) {
            elements.enemyFighter.classList.add('attacking');
            setTimeout(()=>elements.enemyFighter.classList.remove('attacking'),500);
        }
        setTimeout(()=>{
            if(elements.playerFighter){
                elements.playerFighter.classList.add('hurt');
                setTimeout(()=>elements.playerFighter.classList.remove('hurt'),400);
            }
        },200);
        showDamageNumber(elements.playerFighter, damage, 'normal');
        showAttackEffect(elements.playerFighter, '💢');
        updateBattleUI();
    }
    // 玩家回血
    function playerHeal(amount) {
        const actualHeal = Math.min(amount, battleState.playerMaxHp - battleState.playerHp);
        battleState.playerHp += actualHeal;
        playHealSound();
        showDamageNumber(elements.playerFighter, '+' + actualHeal, 'heal');
        showAttackEffect(elements.playerFighter, '💚');
        updateBattleUI();
    }
    // 飘伤害数字
    function showDamageNumber(targetElement, damage, type) {
        if (!targetElement || !elements.battleScene) return;
        const targetRect = targetElement.getBoundingClientRect();
        const sceneRect = elements.battleScene.getBoundingClientRect();
        const el = document.createElement('div');
        el.className = 'damage-number';
        if (type === 'crit') el.classList.add('crit');
        if (type === 'heal') el.classList.add('heal');
        el.textContent = type === 'heal' ? damage : '-' + damage;
        el.style.left = (targetRect.left - sceneRect.left + targetRect.width / 2 - 20) + 'px';
        el.style.top = (targetRect.top - sceneRect.top) + 'px';
        elements.battleScene.appendChild(el);
        setTimeout(()=>el.remove(),1000);
    }
    // 攻击特效
    function showAttackEffect(targetElement, emoji) {
        if (!targetElement || !elements.battleScene) return;
        const targetRect = targetElement.getBoundingClientRect();
        const sceneRect = elements.battleScene.getBoundingClientRect();
        const el = document.createElement('div');
        el.className = 'attack-effect';
        el.textContent = emoji;
        el.style.left = (targetRect.left - sceneRect.left + targetRect.width / 2 - 30) + 'px';
        el.style.top = (targetRect.top - sceneRect.top + targetRect.height / 2 - 30) + 'px';
        elements.battleScene.appendChild(el);
        setTimeout(()=>el.remove(),500);
    }
    // 护盾获得特效
    function showShieldGainEffect() {
        if (!elements.playerFighter || !elements.battleScene) return;
        const t = elements.playerFighter.getBoundingClientRect();
        const s = elements.battleScene.getBoundingClientRect();
        const el = document.createElement('div');
        el.className = 'shield-gain-effect';
        el.textContent = '🛡️';
        el.style.left = (t.left - s.left + t.width / 2 - 25) + 'px';
        el.style.top = (t.top - s.top - 10) + 'px';
        elements.battleScene.appendChild(el);
        setTimeout(()=>el.remove(),1200);
    }
    // 护盾破碎特效
    function showShieldBreakEffect() {
        if (!elements.playerFighter || !elements.battleScene) return;
        const t = elements.playerFighter.getBoundingClientRect();
        const s = elements.battleScene.getBoundingClientRect();
        const el = document.createElement('div');
        el.className = 'shield-break-effect';
        el.style.left = (t.left - s.left + t.width / 2 - 60) + 'px';
        el.style.top = (t.top - s.top - 10) + 'px';
        elements.battleScene.appendChild(el);
        setTimeout(()=>el.remove(),800);
    }
    // 怒气系统：增加怒气
    function addRage(amount) {
        battleState.rage = Math.min(battleState.rage + amount, battleState.maxRage);
        if (battleState.rage >= battleState.maxRage && !battleState.rageSkillReady) {
            battleState.rageSkillReady = true;
            showRageFullEffect();
            // 自动释放怒气技能（方案C）
            setTimeout(()=>{
                if(!battleState.battleOver && battleState.rageSkillReady) useRageSkill();
            },800);
        }
        updateBattleUI();
    }
    // 怒气满提示
    function showRageFullEffect() {
        if (!elements.playerFighter || !elements.battleScene) return;
        const t = elements.playerFighter.getBoundingClientRect();
        const s = elements.battleScene.getBoundingClientRect();
        const el = document.createElement('div');
        el.className = 'rage-full-effect';
        el.textContent = '🔥 怒气满了！';
        el.style.left = (t.left - s.left + t.width / 2 - 40) + 'px';
        el.style.top = (t.top - s.top - 30) + 'px';
        elements.battleScene.appendChild(el);
        setTimeout(()=>el.remove(),1500);
    }
    // 释放怒气大招
    function useRageSkill() {
        if (!battleState.rageSkillReady) return;
        battleState.rageSkillReady = false;
        battleState.rage = 0;
        const dmg = Math.floor(battleState.player.attack * 3);
        const heal = Math.floor(battleState.playerMaxHp * 0.2);
        battleState.enemyHp -= dmg;
        const realHeal = Math.min(heal, battleState.playerMaxHp - battleState.playerHp);
        battleState.playerHp += realHeal;
        showRageSkillEffect();
        showDamageNumber(elements.enemyFighter, dmg, 'crit');
        showDamageNumber(elements.playerFighter, '+' + realHeal, 'heal');
        playCritSound();
        playHealSound();
        updateBattleUI();
        checkBattleEnd();
    }
    // 大招全屏爆发
    function showRageSkillEffect() {
        if (!elements.battleScene) return;
        const el = document.createElement('div');
        el.className = 'rage-skill-burst';
        elements.battleScene.appendChild(el);
        setTimeout(()=>el.remove(),600);
    }
    // 道具定义
    const itemTypes = [
        {id:'heal',name:'回血药水',emoji:'❤️',effect:()=>{
            const h = Math.floor(battleState.playerMaxHp*0.3);
            playerHeal(h);
        }},
        {id:'shield',name:'护盾道具',emoji:'🛡️',effect:()=>{
            battleState.shieldCount +=2; showShieldGainEffect();
        }},
        {id:'attack',name:'力量药水',emoji:'⚔️',duration:5,effect:()=>{
            battleState.damageMultiplier=2; addActiveItem('attack',5);
        }},
        {id:'invincible',name:'无敌星星',emoji:'⭐',duration:3,effect:()=>{
            battleState.invincible=true; addActiveItem('invincible',3);
        }},
        {id:'rage',name:'怒气药水',emoji:'🔥',effect:()=>{
            battleState.rage = battleState.maxRage;
            battleState.rageSkillReady = true;
            showRageFullEffect();
        }}
    ];
    // 添加持续道具
    function addActiveItem(id, dur) {
        battleState.activeItems.push({id, remaining:dur});
    }
    // 每完成一句消耗道具回合
    function consumeItemDuration() {
        const newList = [];
        for(let it of battleState.activeItems){
            it.remaining--;
            if(it.remaining>0){
                newList.push(it);
            }else{
                if(it.id === 'attack') battleState.damageMultiplier=1;
                if(it.id === 'invincible') battleState.invincible=false;
            }
        }
        battleState.activeItems = newList;
    }
    // 概率掉落道具
    function tryDropItem() {
        battleState.itemDropCounter++;
        if(battleState.itemDropCounter >=5){
            battleState.itemDropCounter=0;
            if(Math.random()<0.7) dropRandomItem();
        }
    }
    // 随机道具掉落弹窗
    function dropRandomItem() {
        const item = itemTypes[Math.floor(Math.random()*itemTypes.length)];
        const el = document.createElement('div');
        el.className = 'item-drop-popup';
        el.innerHTML = `<div class="item-drop-emoji">${item.emoji}</div><div class="item-drop-name">${item.name}</div>`;
        el.style.left = '50%'; el.style.top = '10%'; el.style.transform = 'translateX(-50%)';
        elements.battleScene.appendChild(el);
        setTimeout(()=>el.remove(),1200);
        setTimeout(()=>{item.effect(); updateBattleUI();},500);
    }
    // 检查战斗结束
    function checkBattleEnd() {
        if(battleState.battleOver) return;
        if(battleState.playerHp <=0){
            battleState.playerHp=0;
            endBattle('lose');
        }
    }
    // 结算弹窗
    function endBattle(result) {
        battleState.battleOver = true;
        battleState.active = false;
        const dur = Math.floor((Date.now()-battleState.startTime)/1000);
        const total = battleState.correctCount + battleState.wrong;
        const acc = total>0 ? Math.round(battleState.correctCount/total*100) :0;
        const win = result==='win' || result==='sentences_finished';
        if(win) playWinSound(); else playLoseSound();
        if(elements.resultIcon) elements.resultIcon.textContent = win ? '🏆' : '💔';
        if(elements.resultTitle){
            elements.resultTitle.textContent = win ? '胜利！' : '失败...';
            elements.resultTitle.className = 'battle-result-title ' + (win?'win':'lose');
        }
        if(elements.resultSubtitle){
            if(win) elements.resultSubtitle.textContent = `全部${battleState.sentences}句完成！`;
            else elements.resultSubtitle.textContent = `被${battleState.enemy.name}击败`;
        }
        if(elements.resultCorrect) elements.resultCorrect.textContent = battleState.correctCount;
        if(elements.resultWrong) elements.resultWrong.textContent = battleState.wrongCount;
        if(elements.resultAccuracy) elements.resultAccuracy.textContent = acc + '%';
        const m = Math.floor(dur/60), s = dur%10;
        if(elements.resultTime) elements.resultTime.textContent = `${m}:${s.toString().padStart(2,'0')}`;
        setTimeout(()=>{
            if(elements.battleResult) elements.battleResult.classList.add('active');
        },800);
    }
    // 再来一局
    function retryBattle() {
        playClickSound();
        if(elements.battleResult) elements.battleResult.classList.remove('active');
        startBattle();
    }
    // 返回角色选择
    function backToSelect() {
        playClickSound();
        if(elements.battleResult) elements.battleResult.classList.remove('active');
        if(elements.battleMode) elements.battleMode.classList.remove('active');
        if(elements.battleSelect) elements.battleSelect.classList.add('active');
    }
    // 退出战斗
    function exitBattle() {
        if(!confirm('退出将丢失进度，确定？')) return;
        battleState.active = false;
        battleState.battleOver = true;
        clearVoiceCache();
        if(elements.battleMode) elements.battleMode.classList.remove('active');
        if(elements.battleSelect) elements.battleSelect.classList.remove('active');
        if(elements.battleResult) elements.battleResult.classList.remove('active');
    }
    // 全局接口
    window.battleMode = { init, open, exit };
    // 页面初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();