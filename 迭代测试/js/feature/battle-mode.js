/* ========== 战斗模式 - 打字对战 v2.5.0 ========== */
/* js/feature/battle-mode.js */
(function() {
    'use strict';
    
    // ========== 战斗数值枚举 & 平衡常量 ==========
    const HP_TARGET = {
        PLAYER: 'player',
        ENEMY: 'enemy'
    };
    
    const BATTLE_END_TYPE = {
        PLAYER_DEAD: 'lose',
        ALL_SENTENCE_CLEAR: 'win',
        ENEMY_HP_EMPTY: 'enemy_dead',
        TIME_OUT: 'timeout'
    };
    
    // 全局数值平衡配置（可调节）
    const BATTLE_BALANCE = {
        sentenceBaseHpCoeff: 2,                // 单句基础血量系数
        enemyDifficultyHpMulti: { 1: 1.0, 2: 1.3, 3: 1.7, 4: 2.2 }, // 难度血量倍率
        playerBaseHpMulti: 1,                  // 玩家基础血量总倍率
        enemyRageHpThreshold: 0.3,             // 怪物狂暴血量阈值
        playerMaxHpLimitMulti: 10              // 玩家血量上限保护倍率
    };
    
    const BATTLE_STAGE = {
        HIGH: 0,
        MID: 1,
        LOW: 2
    };
    
    // 难度对应攻击间隔（可调节，单位毫秒）
    const DIFF_ATTACK_CD = {
        easy: 16000,    // 简单：16秒（低年级/新手）
        normal: 12000,  // 普通：12秒（五年级正常练习）
        hard: 8000      // 困难：8秒（熟练提速）
    };
    
    const STAGE_LABEL = {
        [BATTLE_STAGE.HIGH]: "常规",
        [BATTLE_STAGE.MID]: "狂怒",
        [BATTLE_STAGE.LOW]: "狂暴绝境"
    };
    // ========== 方案6 场景互动随机事件配置 ==========
    const SCENE_EVENT_CONFIG = {
        eventInterval: 12000,    // 每12秒判定一次是否触发事件
        eventChance: 0.35,       // 单次触发概率35%
        healStarHealRatio: 0.2,  // 星星回血比例20%最大生命值
        meteorDmgRatio: 0.1,     // 陨石双方扣血10%最大生命值
        energyBuffSentence: 3    // 能量球增伤持续3个句子
    };
    // 事件类型枚举
    const SCENE_EVENT_TYPE = {
        HEAL_STAR: "star",
        METEOR: "meteor",
        ENERGY_BALL: "energy"
    };
    // 随机大写字母池（能量球匹配字符）
    const ENERGY_CHAR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // 提取英文专用正则，全局复用避免重复创建
    const ENGLISH_MATCH_REG = /[a-zA-Z0-9\s.,!?'"-:;()]+/g;
    
    // ========== 玩家角色（6个） ==========
    const playerCharacters = [
        {
            id: 'cat',
            name: '小猫咪',
            emoji: '🐱',
            type: '平衡型',
            hp: 100,
            baseHp: 100,
            attack: 10,
            baseAtk: 10,
            hpGrowth: 5,
            atkGrowth: 1,
            aiFriendlyBuff: 1.0,
            critRate: 0.1,
            special: 'none',
            description: '全能型，适合新手'
        },
        {
            id: 'dog',
            name: '小狗狗',
            emoji: '🐶',
            type: '攻击型',
            hp: 95,
            baseHp: 95,
            attack: 12,
            baseAtk: 12,
            hpGrowth: 5,
            atkGrowth: 1,
            aiFriendlyBuff: 1.0,
            critRate: 0.1,
            special: 'none',
            description: '攻击高，血量稍低'
        },
        {
            id: 'tiger',
            name: '小老虎',
            emoji: '🐯',
            type: '高攻型',
            hp: 85,
            baseHp: 85,
            attack: 14,
            baseAtk: 14,
            hpGrowth: 5,
            atkGrowth: 1,
            aiFriendlyBuff: 1.0,
            critRate: 0.14,
            special: 'none',
            description: '伤害爆炸，比较脆'
        },
        {
            id: 'fox',
            name: '小狐狸',
            emoji: '🦊',
            type: '暴击型',
            hp: 95,
            baseHp: 95,
            attack: 11,
            baseAtk: 11,
            hpGrowth: 5,
            atkGrowth: 1,
            aiFriendlyBuff: 1.0,
            critRate: 0.22, //原0.25小幅削弱暴击
            special: 'crit',
            description: '25% 概率暴击双倍伤害'
        },
        {
            id: 'bear',
            name: '小熊熊',
            emoji: '🐻',
            type: '肉盾型',
            hp: 110,
            baseHp: 110,
            attack: 9,
            baseAtk: 9,
            hpGrowth: 5,
            atkGrowth: 1,
            aiFriendlyBuff: 1.0,
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
            baseHp: 100,
            attack: 9,
            baseAtk: 9,
            hpGrowth: 5,
            atkGrowth: 1,
            aiFriendlyBuff: 1.0,
            critRate: 0.1,
            special: 'heal',
            healAmount: 6, //原5小幅提升
            healInterval: 2, //原3，回血频率提升
            description: '每打对3个句子回5点血'
        }
    ];
    
    // ========== 怪物角色（6个，难度递增） ==========
    const enemyCharacters = [
        {
            id: 'ghost',
            name: '小幽灵',
            emoji: '👻',
            difficulty: 1,
            difficultyText: '简单',
            hp: 80,
            baseHp: 80,
            attack: 8,
            baseAtk: 8,
            aiEnable: false,
            aiRageThreshold: 0.3,
            aiRageAtkMulti: 1.5,
            aiStageHp: [],
            aiSpecialCooldown: 3,
            description: '最菜的怪物，适合练手'
        },
        {
            id: 'ogre',
            name: '小妖怪',
            emoji: '👹',
            difficulty: 1,
            difficultyText: '简单',
            hp: 90,
            baseHp: 90,
            attack: 9,
            baseAtk: 9,
            aiEnable: false,
            aiRageThreshold: 0.3,
            aiRageAtkMulti: 1.5,
            aiStageHp: [],
            aiSpecialCooldown: 3,
            description: '有点凶，但伤害不高'
        },
        {
            id: 'zombie',
            name: '小僵尸',
            emoji: '🧟',
            difficulty: 2,
            difficultyText: '普通',
            hp: 100,
            baseHp: 100,
            attack: 10,
            baseAtk: 10,
            aiEnable: false,
            aiRageThreshold: 0.3,
            aiRageAtkMulti: 1.5,
            aiStageHp: [],
            aiSpecialCooldown: 3,
            description: '中规中矩的对手'
        },
        {
            id: 'tengu',
            name: '天狗怪',
            emoji: '👺',
            difficulty: 2,
            difficultyText: '普通',
            hp: 110,
            baseHp: 110,
            attack: 11,
            baseAtk: 11,
            aiEnable: false,
            aiRageThreshold: 0.3,
            aiRageAtkMulti: 1.5,
            aiStageHp: [],
            aiSpecialCooldown: 3,
            description: '速度快，攻击也不低'
        },
        {
            id: 'dragon',
            name: '小火龙',
            emoji: '🐲',
            difficulty: 3,
            difficultyText: '困难',
            hp: 130,
            baseHp: 130,
            attack: 13,
            baseAtk: 13,
            aiEnable: true,
            aiRageThreshold: 0.3,
            aiRageAtkMulti: 1.5,
            aiStageHp: [0.7, 0.4],
            aiSpecialCooldown: 3,
            description: '喷火龙，伤害很高'
        },
        {
            id: 'skeleton',
            name: '骷髅王',
            emoji: '💀',
            difficulty: 4,
            difficultyText: '地狱',
            hp: 150,
            baseHp: 150,
            attack: 15,
            baseAtk: 15,
            aiEnable: true,
            aiRageThreshold: 0.3,
            aiRageAtkMulti: 1.5,
            aiStageHp: [0.7, 0.4, 0.2],
            aiSpecialCooldown: 3,
            description: '最终BOSS，非常难打'
        }
    ];
    
    // ========== 战斗状态（已更新统计相关变量，移除旧comboCount） ==========
    let battleState = {
        active: false,
        player: null,
        enemy: null,
        playerHp: 0,
        playerMaxHp: 0,
        enemyHp: 0,
        enemyMaxHp: 0,
        sentences: [],
        currentSentenceIndex: 0,
        currentCharIndex: 0,
        correctCount: 0,        // 通关短句总数（中途改错也计数）
        wrongCount: 0,          // 输入错误总次数
        perfectSentence: 0,     // 界面【完美】连续无错短句
        letterCombo: 0,         // 字母连击（仅用于伤害、护盾，UI不展示）
        letterComboBase: 0,     // 新增：连续输入基准长度
        currentSentenceHasError: false, // 当前句子是否出过错误
        healCounter: 0,
        lastInputLength: 0,
        inputError: false,
        shieldCount: 0,
        rage: 0,
        maxRage: 100,
        rageSkillReady: false,
        rageAutoTimer: null,
        itemDropCounter: 0,
        damageMultiplier: 1,
        invincible: false,
        activeItems: [],
        startTime: 0,
        battleOver: false,
        // ====== 方案6 场景互动状态 ======
        sceneInteract: {
            eventTimer: null,         // 随机事件循环定时器
            eventLock: false,         // 事件冷却锁，防止连续刷事件
            hasStar: false,           // 当前是否存在治疗星星
            hasEnergyBall: false,     // 当前是否存在能量球
            targetEnergyChar: "",     // 能量球需要匹配的大写字母
            starDom: null,            // 星星DOM元素缓存
            energyDom: null           // 能量球DOM元素缓存
        }
    };
    
    // ========== 战斗音效（WebAudio合成） ==========
    let audioCtx = null;
    let lastCharSoundTime = 0;
    
    function initAudio() {
        if (!audioCtx) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('Web Audio API 不支持');
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
    
    function isSoundEnabled() {
        if (typeof window.soundEnabled !== 'undefined') {
            return window.soundEnabled;
        }
        return localStorage.getItem('soundEnabled') !== 'false';
    }
    
    // 核心发声函数（可调节参数：音调、时长、波形、音量、随机偏移、低频叠加）
    function playTone(baseFreq, duration, type, volume, detune = 60, addSubLayer = false) {
        if (!isSoundEnabled()) return;
        initAudio();
        if (!audioCtx) return;
        
        baseFreq = isFinite(Number(baseFreq)) ? Math.max(20, Math.min(20000, Number(baseFreq))) : 440;
        duration = isFinite(Number(duration)) ? Math.max(0.01, Number(duration)) : 0.1;
        volume = isFinite(Number(volume)) ? Math.max(0, Math.min(1, Number(volume))) : 0.2;
        detune = isFinite(Number(detune)) ? Math.max(0, Math.min(200, Number(detune))) : 60;
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        const now = audioCtx.currentTime;
        const randFreq = baseFreq + (Math.random() - 0.5) * detune;
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(randFreq, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + duration + 0.02);
        
        if (addSubLayer) {
            const subOsc = audioCtx.createOscillator();
            const subGain = audioCtx.createGain();
            subOsc.type = 'sawtooth';
            const subFreq = randFreq * 0.4;
            subOsc.frequency.setValueAtTime(subFreq, now);
            subGain.gain.setValueAtTime(0, now);
            subGain.gain.linearRampToValueAtTime(volume * 0.4, now + 0.006);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
            subOsc.connect(subGain);
            subGain.connect(audioCtx.destination);
            subOsc.start(now);
            subOsc.stop(now + duration + 0.02);
        }
    }
    
    function playCharCorrectSound() {
        const now = Date.now();
        if (now - lastCharSoundTime < 80) return;
        lastCharSoundTime = now;
        //输入正确字母音效
        playTone(1150, 0.05, 'sine', 0.16, 30, false);
    }
    
    function playAttackSound() {
        const playerId = battleState.player?.id;
        if (!playerId) return;
        
        switch (playerId) {
            case 'tiger':
                playTone(680, 0.13, 'sawtooth', 0.22, 70, true);
                setTimeout(() => playTone(1100, 0.09, 'triangle', 0.14, 50, false), 35);
                break;
            case 'fox':
                playTone(1100, 0.09, 'square', 0.16, 40, false);
                setTimeout(() => playTone(1500, 0.06, 'sine', 0.1, 30, false), 25);
                break;
            case 'bear':
                playTone(520, 0.16, 'sawtooth', 0.24, 60, true);
                setTimeout(() => playTone(800, 0.11, 'triangle', 0.13, 50, false), 40);
                break;
            case 'panda':
                playTone(780, 0.11, 'sine', 0.18, 50, false);
                setTimeout(() => playTone(1050, 0.08, 'triangle', 0.12, 40, false), 30);
                break;
            default:
                playTone(820, 0.11, 'triangle', 0.19, 60, true);
                setTimeout(() => playTone(1250, 0.07, 'sine', 0.13, 40, false), 30);
        }
    }
    
    function playCritSound() {
        playTone(380, 0.18, 'sawtooth', 0.28, 80, true);
        setTimeout(() => playTone(620, 0.14, 'square', 0.23, 60, true), 45);
        setTimeout(() => playTone(1800, 0.1, 'sine', 0.18, 40, false), 90);
    }
    
    function playHurtSound() {
        playTone(160, 0.22, 'sawtooth', 0.26, 50, true);
        setTimeout(() => playTone(110, 0.17, 'triangle', 0.1, 40, false), 60);
    }
    
    function playHealSound() {
        const notes = [523, 659, 784, 988];
        notes.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 0.11, 'sine', 0.17, 30, false), i * 75);
        });
    }
    
    function playWinSound() {
        const notes = [523, 659, 784, 1047, 1318];
        notes.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 0.2, 'sine', 0.24, 40, false), i * 110);
        });
    }
    
    function playLoseSound() {
        const notes = [420, 360, 300, 210];
        notes.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 0.26, 'sawtooth', 0.21, 50, false), i * 140);
        });
    }
    
    function playComboSound(comboNum) {
        const safeCombo = Math.max(1, isFinite(Number(comboNum)) ? Number(comboNum) : 1);
        const level = Math.floor(safeCombo / 10);
        const baseFreq = 1000 + level * 180;
        const vol = 0.15 + level * 0.04;
        playTone(baseFreq, 0.09, 'triangle', vol, 40, false);
        setTimeout(() => playTone(baseFreq * 1.4, 0.07, 'sine', vol * 0.8, 30, false), 45);
    }
    
    function playClickSound() {
        playTone(640, 0.05, 'sine', 0.11, 30, false);
    }
    
    function playLowHpWarning() {
        playTone(130, 0.22, 'sawtooth', 0.12, 20, false);
    }
    
    // ========== 战斗语音系统 ==========
    const voiceCache = new Map();
    let currentVoiceAudio = null;
    const VOICE_PRELOAD_COUNT = 2;
    
    function getVoiceUrl(text) {
        const encodedText = encodeURIComponent(text);
        const speed = getVoiceSpeed();
        return `https://tts.841231.xyz/?text=${encodedText}&lan=zh&spd=${speed}`;
    }
    
    function getVoiceSpeed() {
        if (typeof window.config !== 'undefined' && window.config.speechRate) {
            return window.config.speechRate;
        }
        return 1.0;
    }
    
    function isVoiceEnabled() {
        if (typeof window.battleVoiceEnabled !== 'undefined') {
            return window.battleVoiceEnabled;
        }
        return true;
    }
    
    function preloadVoice(text) {
        if (!text || !text.trim()) return;
        if (voiceCache.has(text)) return;
        
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
    
    function preloadVoices(sentences, startIndex) {
        for (let i = 0; i < VOICE_PRELOAD_COUNT; i++) {
            const idx = startIndex + i;
            if (idx >= sentences.length) break;
            setTimeout(() => preloadVoice(sentences[idx].english), i * 200);
        }
    }
    
    function playVoice(text) {
        if (!isVoiceEnabled()) return;
        if (!text || !text.trim()) return;
        
        stopVoice();
        
        const doPlay = (url) => {
            const audio = new Audio(url);
            audio.play().catch(err => {
                console.warn('语音播放失败，尝试系统语音兜底');
                playFallbackVoice(text);
            });
            audio.onended = () => {
                currentVoiceAudio = null;
            };
        };
        
        if (voiceCache.has(text)) {
            doPlay(voiceCache.get(text));
        } else {
            const url = getVoiceUrl(text);
            doPlay(url);
            fetch(url)
                .then(r => r.blob())
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    voiceCache.set(text, blobUrl);
                })
                .catch(() => {});
        }
    }
    
    function playFallbackVoice(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = getVoiceSpeed();
            window.speechSynthesis.speak(utterance);
        }
    }
    
    function stopVoice() {
        if (currentVoiceAudio != null) {
            try {
                currentVoiceAudio.pause();
                currentVoiceAudio.currentTime = 0;
            } catch (e) {
                console.warn('停止在线语音异常', e);
            }
            currentVoiceAudio = null;
        }
        if (typeof window.speechSynthesis !== 'undefined') {
            try {
                window.speechSynthesis.cancel();
            } catch (e) {
                console.warn('系统语音取消异常', e);
            }
        }
    }
    
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
    
    function clearMonsterWarningBar() {
        const oldBar = document.querySelector('.monster-warning-bar-wrap');
        if (oldBar) oldBar.remove();
    }
    
    function showBattleAlert(text, type = "info", duration = 2500) {
        const oldTip = document.querySelector('div[style*="top:30%"]');
        if(oldTip) oldTip.remove();
        
        const tip = document.createElement('div');
        tip.style.cssText = `position:fixed;top:30%;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:#fff;padding:12px 24px;border-radius:12px;z-index:9999;font-size:16px`;
        if(type === "warning") tip.style.boxShadow = "0 0 12px #f87171";
        tip.textContent = text;
        document.body.appendChild(tip);
        
        setTimeout(() => {
            if(tip.parentNode) tip.remove();
        }, duration);
    }
    
    // 统一清理战斗所有定时器、场景元素，消除多函数重复代码
    function clearBattleTimers() {
        const ctx = battleState.battleCtx;
        if (ctx?.bgTimerId) clearInterval(ctx.bgTimerId);
        if (battleState.rageAutoTimer) clearTimeout(battleState.rageAutoTimer);
        clearAllSceneInteract();
        clearMonsterWarningBar();
    }
    
    // ========== DOM 元素缓存 ==========
    let elements = {};
    
    // ========== 刷新战斗UI（血量、怒气、统计栏） ==========
    function updateBattleUI() {
        if (!battleState.active && !battleState.battleOver) return;
        // 玩家血量
        if (elements.playerHpFill) {
            const pct = battleState.playerHp / battleState.playerMaxHp;
            elements.playerHpFill.style.width = (pct * 100) + '%';
        }
        if (elements.playerHpText) {
            elements.playerHpText.textContent = `${battleState.playerHp}/${battleState.playerMaxHp}`;
        }
        // 怪物血量
        if (elements.enemyHpFill) {
            const pct = battleState.enemyHp / battleState.enemyMaxHp;
            elements.enemyHpFill.style.width = (pct * 100) + '%';
        }
        if (elements.enemyHpText) {
            elements.enemyHpText.textContent = `${battleState.enemyHp}/${battleState.enemyMaxHp}`;
        }
        // 怒气条
        if (elements.playerRageBar && elements.playerRageBarFill) {
            const ragePercent = (battleState.rage / battleState.maxRage) * 100;
            elements.playerRageBarFill.style.width = ragePercent + '%';
            if (battleState.rage >= battleState.maxRage) {
                elements.playerRageBar.classList.add('rage-full');
                battleState.rageSkillReady = true;
                // 重置30秒自动释放倒计时
                if(battleState.rageAutoTimer) clearTimeout(battleState.rageAutoTimer);
                battleState.rageAutoTimer = setTimeout(() => {
                    if (battleState.battleOver || battleState.battleCtx.rageSkillCooldown || !battleState.rageSkillReady) return;
                    useRageSkill();
                }, 20000);
            } else {
                elements.playerRageBar.classList.remove('rage-full');
                battleState.rageSkillReady = false;
                // 怒气不满直接清除自动计时
                if(battleState.rageAutoTimer) clearTimeout(battleState.rageAutoTimer);
            }
        }
        
        // 护盾数量
        if (elements.shieldCount) {
            elements.shieldCount.textContent = battleState.shieldCount;
        }
        // 统计栏：通关 / 失误 / 连打 / 完美
        if (elements.statsCorrect) elements.statsCorrect.textContent = battleState.correctCount;
        if (elements.statsWrong) elements.statsWrong.textContent = battleState.wrongCount;
        if (elements.statsLetterCombo) elements.statsLetterCombo.textContent = battleState.letterCombo;
        if (elements.statsPerfect) elements.statsPerfect.textContent = battleState.perfectSentence;
        // 激活道具图标
        if (elements.activeItems) {
            elements.activeItems.innerHTML = '';
            battleState.activeItems.forEach(item => {
                const itemDom = document.createElement('span');
                itemDom.className = 'active-item-tag';
                let icon = '';
                let num = '';
                switch(item.id) {
                    case 'attack': 
                        icon = '⚔️'; 
                        num = item.remaining;
                        break;
                    case 'invincible': 
                        icon = '⭐'; 
                        num = item.remaining;
                        break;
                    case 'doubleDmg':
                        icon = '⚡'; 
                        num = item.remaining;
                        break;
                    case 'shield': 
                        icon = '🛡️'; 
                        num = battleState.shieldCount;
                        break;
                    default: 
                        icon = '?';
                        num = '';
                }
                itemDom.textContent = `${icon}${num}`;
                // 区分护盾与其他道具的悬浮提示
                if(item.id === 'shield'){
                    itemDom.title = `当前护盾层数：${num}`;
                }else{
                    itemDom.title = `剩余${num}句`;
                }
                elements.activeItems.appendChild(itemDom);
            });
        }
    }

    // ========== 初始化 ==========
    function init() {
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
            statsLetterCombo: document.getElementById('battleStatsLetterCombo'),
            statsPerfect: document.getElementById('battleStatsCombo'),
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
        
        // 一次性解锁音频
        function unlockAudioOnce() {
            initAudio();
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            document.removeEventListener('click', unlockAudioOnce);
            document.removeEventListener('touchend', unlockAudioOnce);
        }
        document.addEventListener('click', unlockAudioOnce);
        document.addEventListener('touchend', unlockAudioOnce);
        
        // 绑定事件
        if (elements.exitBtn) {
            elements.exitBtn.addEventListener('click', exitBattle);
        }
        if (elements.battleInput) {
            elements.battleInput.addEventListener('input', handleInput);
            elements.battleInput.addEventListener('touchend', () => {
                initAudio();
                if (audioCtx?.state === 'suspended') {
                    audioCtx.resume();
                }
            });
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
        
        // 读取本地保存的选中角色
        const savedPlayer = localStorage.getItem('battle_select_player');
        const savedEnemy = localStorage.getItem('battle_select_enemy');
        if(savedPlayer) selectedPlayerId = savedPlayer;
        if(savedEnemy) selectedEnemyId = savedEnemy;
        renderCharacterSelect();
    }
    
    // ========== 角色选择界面 ==========
    function renderCharacterSelect() {
        if (elements.playerGrid) {
            elements.playerGrid.innerHTML = '';
            playerCharacters.forEach((char) => {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.dataset.id = char.id;
            // 新增选中高亮判断
            if(char.id === selectedPlayerId) card.classList.add('selected');
                const showHp = calcPlayerMaxHp(char, { level: 1, hpBuff: 1 });
                card.innerHTML = `
                    <div class="character-card-emoji">${char.emoji}</div>
                    <div class="character-card-info">
                        <div class="character-card-name">${char.name}</div>
                        <div class="character-card-type">${char.type}</div>
                        <div class="character-card-stats">
                            <div class="character-card-stat">❤️ <span>${showHp}</span></div>
                            <div class="character-card-stat">⚔️ <span>${char.attack}</span></div>
                        </div>
                    </div>
                `;
                card.addEventListener('click', () => selectPlayer(char.id));
                elements.playerGrid.appendChild(card);
            });
        }
        
        if (elements.enemyGrid) {
            elements.enemyGrid.innerHTML = '';
            enemyCharacters.forEach((char) => {
            const card = document.createElement('div');
            card.className = 'character-card enemy-card';
            card.dataset.id = char.id;
            // 新增选中高亮判断
            if(char.id === selectedEnemyId) card.classList.add('selected');
                const stars = '⭐'.repeat(char.difficulty);
                const showEnemyHp = calcEnemyShowHp(char);
                card.innerHTML = `
                    <div class="character-card-emoji">${char.emoji}</div>
                    <div class="character-card-info">
                        <div class="character-card-name">${char.name}</div>
                        <div class="difficulty-stars">${stars}</div>
                        <div class="character-card-stats">
                            <div class="character-card-stat">❤️ <span>${showEnemyHp}</span></div>
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
    
    let selectedPlayerId = null;
    function selectPlayer(id) {
        selectedPlayerId = id;
        localStorage.setItem('battle_select_player', id); // 持久化保存
        playClickSound();
        document.querySelectorAll('#playerCharacterGrid .character-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.id === id);
        });
        updateStartButton();
    }
    
    let selectedEnemyId = null;
    function selectEnemy(id) {
        selectedEnemyId = id;
        localStorage.setItem('battle_select_enemy', id); // 持久化保存
        playClickSound();
        document.querySelectorAll('#enemyCharacterGrid .character-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.id === id);
        });
        updateStartButton();
    }
    
    function updateStartButton() {
        if (!elements.startBtn) return;
        const canStart = selectedPlayerId && selectedEnemyId;
        elements.startBtn.disabled = !canStart;
        elements.startBtn.textContent = canStart ? '⚔️ 开始战斗！' : '请先选择角色和对手';
    }
    
    // ========== 打开战斗模式 ==========
    function openBattleMode() {
        const sourceText = document.getElementById('sourceText');
        if (!sourceText || !sourceText.value.trim()) {
            alert('请先选择练习内容（选择题库或粘贴文本）');
            return;
        }
        
        const text = sourceText.value;
        battleState.sentences = extractSentences(text);
        
        if (battleState.sentences.length < 3) {
            alert('句子太少啦，至少需要 3 个句子才能开始战斗！');
            return;
        }
        
        if (elements.battleSelect) {
            elements.battleSelect.classList.add('active');
        }
        // 恢复兜底逻辑，无选中时自动默认小猫+幽灵
        if (!selectedPlayerId) {
            selectPlayer(playerCharacters[0].id);
        }
        if (!selectedEnemyId) {
            selectEnemy(enemyCharacters[0].id);
        }
    }
    
    // 提取句子（支持双语对照格式：英文一行、中文一行交替）
    function extractSentences(text) {
        const lines = text.split('\n');
        const sentences = [];
        
        let i = 0;
        while (i < lines.length) {
            const trimmed = lines[i].trim();
            if (!trimmed) {
                i++;
                continue;
            }
            
            const english = extractEnglishPart(trimmed);
            if (english.length < 2) {
                i++;
                continue;
            }
            
            let chinese = '';
            const chineseChars = trimmed.match(/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]+/g);
            if (chineseChars && chineseChars.length > 0) {
                chinese = chineseChars.join('');
            }
            
            if (!chinese && i + 1 < lines.length) {
                const nextLine = lines[i + 1].trim();
                const nextEnglish = extractEnglishPart(nextLine);
                if (nextEnglish.length < nextLine.length * 0.3) {
                    chinese = nextLine;
                    i++;
                }
            }
            
            sentences.push({
                english: english,
                display: trimmed,
                chinese: chinese
            });
            i++;
        }
        
        // 自动拆分长句
        const splitSentences = [];
        for (const s of sentences) {
            const parts = splitLongSentence(s.english);
            if (parts.length > 1) {
                for (const part of parts) {
                    splitSentences.push({
                        english: part,
                        display: part,
                        chinese: s.chinese
                    });
                }
            } else {
                splitSentences.push(s);
            }
        }
        
        return splitSentences;
    }
    
    function splitLongSentence(text) {
        if (!text || text.length < 15) return [text];
        
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
        
        const lastPart = text.substring(lastIndex).trim();
        if (lastPart.length > 3) {
            parts.push(lastPart);
        }
        
        return parts.length > 1 ? parts : [text];
    }
    
    function extractEnglishPart(line) {
        const matches = line.match(ENGLISH_MATCH_REG);
        if (!matches) return '';
        
        let result = matches.join('').trim();
        result = result.replace(/\s+/g, ' ');
        return result;
    }
    
    // ========== 开始战斗 ==========
    function startBattle() {
        if (!selectedPlayerId || !selectedEnemyId) return;

        const playerChar = playerCharacters.find(item => item.id === selectedPlayerId) || playerCharacters[0];
        const enemyChar = enemyCharacters.find(item => item.id === selectedEnemyId) || enemyCharacters[0];

        // 修复头像、角色名
        if(elements.playerAvatar) elements.playerAvatar.textContent = playerChar.emoji;
        if(elements.playerName) elements.playerName.textContent = playerChar.name;
        if(elements.enemyAvatar) elements.enemyAvatar.textContent = enemyChar.emoji;
        if(elements.enemyName) elements.enemyName.textContent = enemyChar.name;
        // 修复中央战斗角色大图
        if(elements.playerFighter) elements.playerFighter.textContent = playerChar.emoji;
        if(elements.enemyFighter) elements.enemyFighter.textContent = enemyChar.emoji;
        const diffKey = enemyChar.difficulty === 1 ? 'easy' : enemyChar.difficulty === 2 ? 'normal' : 'hard';
        
        // 战斗上下文（可调节参数集中在这里）
        const battleCtx = {
            level: 1,
            hpBuff: 1,
            enemyAiMulti: 1,
            baseAtkMulti: 1,
            isRaging: false,
            attackTimer: 0,
            attackInterval: DIFF_ATTACK_CD[diffKey],
            attackLock: false,
            inInterruptWindow: false,
            continuousCorrect: 0,
            stageNotified: {},
            interruptTimer: 0,
            rageSkillCooldown: false,
            bgTimerId: null,
            
            // 自适应难度AI参数（可调节）
            aiEnabled: true,                   // AI总开关
            baseInterval: DIFF_ATTACK_CD[diffKey], // 基准攻击间隔
            minInterval: DIFF_ATTACK_CD[diffKey] * 0.5,  // 最快间隔（基准的50%）
            maxInterval: DIFF_ATTACK_CD[diffKey] * 1.8,  // 最慢间隔（基准的180%）
            adjustStep: 500,                   // 每次调整步长（毫秒）
            consecutiveHits: 0,                // 连续被击中次数
            consecutiveInterrupts: 0,          // 连续成功打断次数
            aiAdjustCooldown: false            // AI调整冷却
        };
        
        const playerMaxHp = calcPlayerMaxHp(playerChar, battleCtx);
        const enemyMaxHp = calcEnemyMaxHp(enemyChar, battleState.sentences.length, battleCtx);
        
        // 复用全局battleState对象，逐字段重置，消除重复结构冗余
        battleState.active = true;
        battleState.player = playerChar;
        battleState.enemy = enemyChar;
        battleState.playerHp = playerMaxHp;
        battleState.playerMaxHp = playerMaxHp;
        battleState.enemyHp = enemyMaxHp;
        battleState.enemyMaxHp = enemyMaxHp;
        battleState.battleCtx = battleCtx;
        battleState.sentences = [...battleState.sentences];
        battleState.currentCharIndex = 0;
        battleState.wrongCount = 0;
        battleState.perfectSentence = 0;
        battleState.currentSentenceHasError = false;
        battleState.healCounter = 0;
        battleState.lastInputTime = Date.now();
        battleState.inputError = false;
        battleState.letterCombo = 0;
        battleState.letterComboBase = 0;
        battleState.lastInputLength = 0;
        battleState.shieldCount = 0;
        battleState.rage = 0;
        battleState.maxRage = 100;
        battleState.rageSkillReady = false;
        battleState.rageAutoTimer = null;
        battleState.itemDropCounter = 0;
        battleState.damageMultiplier = 1;
        battleState.invincible = false;
        battleState.activeItems = [];
        battleState.startTime = Date.now();
        battleState.battleOver = false;
        battleState.correctCount = 0;
        battleState.fullSentenceRoundComplete = false;
        battleState.currentSentenceIndex = 0;
        

        // 场景互动子对象单独重置，不重建对象避免内存冗余
        const inter = battleState.sceneInteract;
        inter.eventTimer = null;
        inter.eventLock = false;
        inter.hasStar = false;
        inter.hasEnergyBall = false;
        inter.targetEnergyChar = "";
        inter.starDom = null;
        inter.energyDom = null;
        
        updateBattleUI();
        
        if (elements.battleSelect) {
            elements.battleSelect.classList.remove('active');
        }
        if (elements.battleMode) {
            elements.battleMode.classList.add('active');
        }
        
        preloadVoices(battleState.sentences, 0);
        showCurrentSentence();
        
        setTimeout(() => {
            if (elements.battleInput) {
                elements.battleInput.value = '';
                elements.battleInput.focus();
                initAudio();
                if (audioCtx && audioCtx.state === 'suspended') {
                    audioCtx.resume();
                    playTone(800, 0.01, 'sine', 0.01, 0, false);
                }
            }
        }, 300);
        // 启动方案6 场景随机事件循环
        clearAllSceneInteract();
        startSceneEventLoop();
        
        // 后台持续计时（锁定期间暂停累加）
        battleCtx.bgTimerId = setInterval(() => {
            if(battleState.battleOver) {
                clearInterval(battleCtx.bgTimerId);
                return;
            }
            if (!battleCtx.attackLock) {
                battleCtx.attackTimer += 100;
            }
            checkMonsterAutoAttack();
        }, 100);
    }

    // ========== 显示当前句子 ==========
    function showCurrentSentence() {  
        // 兜底修复下标越界
        if (battleState.currentSentenceIndex >= battleState.sentences.length) {
            battleState.currentSentenceIndex = 0;
        }
        if (battleState.battleOver) return;
        if (battleState.currentSentenceIndex >= battleState.sentences.length) {
            checkBattleEnd();
            return;
        }
        
        const sentence = battleState.sentences[battleState.currentSentenceIndex];
        battleState.currentCharIndex = 0;
        battleState.currentSentenceHasError = false; // 切换新句重置错误标记
        
        if (elements.currentWord) {
            const displayText = sentence.display;
            const englishText = sentence.english;
            const chineseText = sentence.chinese || '';
            
            const lowerDisplay = displayText.toLowerCase();
            const lowerEnglish = englishText.toLowerCase();
            const index = lowerDisplay.indexOf(lowerEnglish);
            
            let speakerPrefix = '';
            if (index >= 0) {
                speakerPrefix = displayText.substring(0, index);
            }
            
            let html = `<div style="margin-bottom: 8px; line-height: 1.4; text-align: center;">`;
            if (speakerPrefix) {
                html += `<span style="color: rgba(255,255,0.5); font-size: 18px;">${speakerPrefix}</span>`;
            }
            
            for (let i = 0; i < englishText.length; i++) {
                const ch = englishText[i];
                let color = '#fff'; // 未输入：白色
                let extraStyle = '';
                if (i === 0) {
                    color = '#ffdd00'; // 当前位：黄色
                }
                // 高亮能量球目标字母
                const interState = battleState.sceneInteract;
                if (interState.hasEnergyBall && ch.toUpperCase() === interState.targetEnergyChar) {
                    extraStyle = 'background:#ffd000;color:#000;padding:0 2px;border-radius:3px;';
                }
                html += `<span class="battle-char" data-index="${i}" style="color: ${color};${extraStyle} font-weight: bold; font-size: 26px; letter-spacing: 1px;">${ch === ' ' ? '&nbsp;' : ch}</span>`;
            }
            html += `</div>`;
            
            // 中文翻译（如果有）
            if (chineseText) {
                html += `<div style="color: rgba(255,255,255,0.6); font-size: 16px; line-height: 1.3; text-align: center;">
                    ${chineseText}
                </div>`;
            }
            
            elements.currentWord.innerHTML = html;
        }
        
        if (elements.battleInput) {
            elements.battleInput.value = '';
            elements.battleInput.classList.remove('correct', 'wrong');
        }
        
        playVoice(sentence.english);
        
        const nextIndex = battleState.currentSentenceIndex + 1;
        if (nextIndex < battleState.sentences.length) {
            setTimeout(() => {
                preloadVoice(battleState.sentences[nextIndex].english);
            }, 500);
        }
        
        battleState.lastInputTime = Date.now();
        checkMonsterAutoAttack();
        
        battleState.lastInputLength = 0;
        battleState.inputError = false;
        battleState.battleCtx.continuousCorrect = 0;
        battleState.battleCtx.inInterruptWindow = false;
        battleState.battleCtx.interruptTimer = 0;
        battleState.currentSentenceHasError = false;
        // 仅重置输入基准，连击数值全程保留，跨句子持续累计
        battleState.letterComboBase = 0;
        
        refreshSentenceHighlight();
        
    }
    
    function refreshSentenceHighlight() {
        if (battleState.currentSentenceIndex >= battleState.sentences.length) return;
        const sentence = battleState.sentences[battleState.currentSentenceIndex];
        if (!elements.currentWord) return;
        const displayText = sentence.display;
        const englishText = sentence.english;
        const chineseText = sentence.chinese || '';
        const userInput = elements.battleInput.value;
        const lowerUserInput = userInput.toLowerCase();
        const lowerEnglish = englishText.toLowerCase();
        const inputLen = lowerUserInput.length;
        const targetLen = lowerEnglish.length;
        const index = displayText.toLowerCase().indexOf(lowerEnglish);
        let speakerPrefix = '';
        if (index >= 0) speakerPrefix = displayText.substring(0, index);
        let html = `<div style="margin-bottom: 8px; line-height: 1.4; text-align: center;">`;
        if (speakerPrefix) html += `<span style="color: rgba(255,255,0.5); font-size: 18px;">${speakerPrefix}</span>`;
        for (let i = 0; i < targetLen; i++) {
            const ch = englishText[i];
            let color = '#fff';
            let extraStyle = '';
            // 仅当当前位已经有输入内容时判断对错
            if (i < inputLen) {
                if (lowerUserInput[i] === lowerEnglish[i]) {
                    color = '#39ff14'; // 正确绿色
                } else {
                    color = '#f87171'; // 错误浅红
                }
            }
            // 光标位置高亮（未输入的下一位）
            if (i === battleState.currentCharIndex && i >= inputLen) {
                color = '#ffdd00';
            }
            // 能量球高亮最高优先级
            const interState = battleState.sceneInteract;
            if (interState.hasEnergyBall && ch.toUpperCase() === interState.targetEnergyChar) {
                extraStyle = 'background:#ffd000;color:#000;padding:0 2px;border-radius:3px;';
            }
            html += `<span class="battle-char" data-index="${i}" style="color: ${color};${extraStyle} font-weight: bold; font-size: 26px; letter-spacing: 1px;">${ch === ' ' ? '&nbsp;' : ch}</span>`;
        }
        html += `</div>`;
        if (chineseText) {
            html += `<div style="color: rgba(255,255,255,0.6); font-size: 16px; line-height: 1.3; text-align: center;">${chineseText}</div>`;
        }
        elements.currentWord.innerHTML = html;
    }
    
    function updateCharColors() {
        if (!elements.currentWord) return;
        const charSpans = elements.currentWord.querySelectorAll('.battle-char');
        if (!charSpans.length) return;
        
        const sentence = battleState.sentences[battleState.currentSentenceIndex];
        if (!sentence) return;
        
        const english = sentence.english;
        const input = elements.battleInput ? elements.battleInput.value.toLowerCase() : '';
        const target = english.toLowerCase();
        
        let hasError = false;
        let errorIndex = -1;
        for (let i = 0; i < input.length; i++) {
            if (input[i] !== target[i]) {
                hasError = true;
                errorIndex = i;
                break;
            }
        }
        
        charSpans.forEach((span, i) => {
            if (hasError && i === errorIndex) {
                span.style.color = '#f87171';
            } else if (hasError && i < errorIndex) {
                span.style.color = '#39d353';
            } else if (!hasError && i < input.length) {
                span.style.color = '#39d353';
            } else if (!hasError && i === input.length) {
                span.style.color = '#ffdd00';
            } else {
                span.style.color = '#fff';
            }
        });
    }
    
    // ========== 处理输入 ==========
    function handleInput(e) {
        // 核心拦截：战斗未激活/已结束，直接终止所有输入逻辑
        if (!battleState.active || battleState.battleOver) {
            return;
        }
        // 闲置超过5秒清空连击
        const idleMs = Date.now() - battleState.lastInputTime;
        if (idleMs > 5000 && battleState.letterCombo > 0) {
            battleState.letterCombo = 0;
            battleState.letterComboBase = 0;
            updateBattleUI();
        }

        if (battleState.battleOver) return;
        const ctx = battleState.battleCtx;
        let skipMonsterTimer = false;
        
        // 打断窗口：末尾连续3个正确字母即可打断
        if (ctx.inInterruptWindow && !battleState.battleOver) {
            const input = elements.battleInput;
            const sentence = battleState.sentences[battleState.currentSentenceIndex];
            const targetEnglish = sentence.english.toLowerCase();
            const inputValue = input.value.toLowerCase();
            let currentContinuous = 0;
            
            // 倒序统计末尾有效字母（空格跳过不中断）
            for (let i = inputValue.length - 1; i >= 0; i--) {
                const char = inputValue[i];
                if ([' ','\t','\n','\r'].includes(char)) {
                    continue;
                }
                if (char === targetEnglish[i]) {
                    currentContinuous++;
                    if (currentContinuous >= 3) {
                        currentContinuous = 3;
                        break;
                    }
                } else {
                    break;
                }
            }
            
            ctx.continuousCorrect = currentContinuous;
            
            // 打断成功
            if (ctx.continuousCorrect >= 3) {
                ctx.attackTimer = 0;
                ctx.inInterruptWindow = false;
                ctx.continuousCorrect = 0;
                ctx.interruptTimer = 0; 
                ctx.attackLock = true;
                setTimeout(() => { ctx.attackLock = false; }, 700);
                
                if (battleState.rageAutoTimer) clearTimeout(battleState.rageAutoTimer);
                battleState.rageAutoTimer = null;
                
                const oldTip = document.querySelector('div[style*="top:30%"]');
                if(oldTip) oldTip.remove();
                
                clearMonsterWarningBar();
                elements.enemyFighter.classList.remove('warn-flash');
                showAttackEffect(elements.enemyFighter, "✨");
                playComboSound(20);
                skipMonsterTimer = true;
                
                adjustDifficultyAI('interrupt_success');
            }
        }
        
        const input = elements.battleInput;
        const sentence = battleState.sentences[battleState.currentSentenceIndex];
        const targetEnglish = sentence.english.toLowerCase();
        const inputValue = input.value.toLowerCase();
        const inputLen = inputValue.length;
        
        let hasError = false;
        let firstErrorIndex = -1;
        for (let i = 0; i < inputLen; i++) {
            if (inputValue[i] !== targetEnglish[i]) {
                hasError = true;
                firstErrorIndex = i;
                break;
            }
        }
        
        if (hasError && !battleState.inputError) {
            handleWrongInput();
        }
        battleState.inputError = hasError;
        
        // 原有光标定位逻辑保留
        if (hasError) {
            battleState.currentCharIndex = firstErrorIndex;
        } else {
            battleState.currentCharIndex = inputLen;
        }
        
        // 输入无错误时，清除本句错误标记（修复退格后完美不计数BUG）
        if (!hasError) {
            battleState.currentSentenceHasError = false;
            updateBattleUI(); // 退格删除错误字符后同步刷新
        }
        updateCharColors();
        // ====== 方案：修复互动字符匹配BUG ======
        // 提取最后有效字符，剔除空格、空白
        let lastChar = inputValue.slice(-1).trim();
        if (lastChar) {
            checkInteractPickup(lastChar);
        }
        if (!hasError && inputLen === targetEnglish.length) {
            handleSentenceComplete();
        }
        
        battleState.lastInputLength = inputLen;
        
        if (!hasError && inputLen > 0) {
            playCharCorrectSound();
            // 两种情况不清零：
            // 1、当前输入 = 上一次长度+1（同句连续打字）
            // 2、当前输入从头开始，但上一句已完成（跨句子继续连击）
            const isContinueInput = inputLen === battleState.letterComboBase + 1;
            // 跨句子首字符直接累加，无需重置
            const isNewSentenceStart = battleState.letterComboBase === 0 && inputLen === 1;
            // 新增：上一句打完直接打下一句，无停顿，强制叠加连击
            if (isContinueInput || isNewSentenceStart) {
                battleState.letterCombo += 1;
            }
            // 仅手动回退/退格才清空连击
            else if (inputLen < battleState.letterComboBase) {
                battleState.letterCombo = 0;
            }
            // 补充：正常切句无操作、中途停5秒不会进else，连击保留
            battleState.letterComboBase = inputLen;
            updateBattleUI();
            // 新增：输入正确字母生成魔法飞弹攻击怪物
            const charAtk = getSingleCharDamage(battleState.player, battleState.letterCombo, battleState.damageMulti);   
            // 字母命中轻魔法音效
            playTone(1400, 0.04, 'sine', 0.05, 20, false);
            
            spawnMagicBullet(charAtk.dmg, charAtk.isCrit);
        }
        
        if(!skipMonsterTimer){
            const nowTime = Date.now();
            const delta = nowTime - battleState.lastInputTime || 0;
            // 固定单次最多累加4000ms，避开不存在的battleCfg
            const maxAddTime = 4000;
            const realAdd = Math.min(delta, maxAddTime);
            battleState.battleCtx.attackTimer += realAdd;
            battleState.lastInputTime = nowTime;
            checkMonsterAutoAttack();
        }
        // 删除重复的 updateCharColors(); 只保留一次刷新
        refreshSentenceHighlight();
    }
    
        function handleWrongInput() {
            if (battleState.battleOver) return;
            battleState.wrongCount++;
            battleState.perfectSentence = 0;
            battleState.letterCombo = 0;     // 字母连击清零
            battleState.letterComboBase = 0; // 同步重置连续基准
            battleState.currentSentenceHasError = true; // 标记本句存在错误
            
            if (elements.battleInput) {
                elements.battleInput.classList.add('wrong');
                setTimeout(() => {
                    if (elements.battleInput) {
                        elements.battleInput.classList.remove('wrong');
                    }
                }, 300);
            }

            updateBattleUI(); // 新增：输错立刻刷新UI，连打瞬间归零显示
            enemyAttack();
            checkBattleEnd();
        }
    
    function handleSentenceComplete() {
        if (battleState.battleOver) return;
        
        // 所有完整通关句子都计入总数，无上限限制
        battleState.correctCount++;

        // 只有当前句子全程没有任何错误，才叠加完美短句
        if (!battleState.currentSentenceHasError) {
            battleState.perfectSentence++;
        }
        
        if (elements.battleInput) {
            elements.battleInput.classList.add('correct');
        }
        
        playerAttack();
        
        // 每10个字母连击获得护盾
        if (battleState.letterCombo > 0 && battleState.letterCombo % 10 === 0) {
            playComboSound(battleState.letterCombo);
            battleState.shieldCount++;
            showShieldGainEffect();
            // 新增：护盾同步存入activeItems，永久2层护盾
            addActiveItem('shield', 999);
            updateBattleUI();
        }      
        
        adjustDifficultyAI('sentence_clear');
        
        // 熊猫回血
        if (battleState.player.special === 'heal') {
            battleState.healCounter++;
            if (battleState.healCounter >= battleState.player.healInterval) {
                battleState.healCounter = 0;
                playerHeal(battleState.player.healAmount);
            }
        }
        
        tryDropItem();
        consumeItemDuration();
        // 整句完全打完，检测治愈星星拾取
        const starState = battleState.sceneInteract;
        if (starState.hasStar) {
            const sentence = battleState.sentences[battleState.currentSentenceIndex];
            const fullInput = elements.battleInput.value.toLowerCase();
            const targetTxt = sentence.english.toLowerCase();
            if (fullInput === targetTxt) {
                if (starState.starDom?.parentNode) starState.starDom.remove();
                starState.hasStar = false;
                starState.starDom = null;
                const healVal = Math.floor(battleState.playerMaxHp * SCENE_EVENT_CONFIG.healStarHealRatio);
                playerHeal(healVal);
                showInteractGetEffect("⭐", elements.battleScene);
            }
        }
        setTimeout(() => {
            if (!battleState.battleOver) {
                battleState.currentSentenceIndex++;
                battleState.battleCtx.attackTimer = 0;
                showCurrentSentence();
                if (elements.battleInput) {
                    elements.battleInput.focus();
                }
            }
        }, 800);
        
        checkBattleEnd();
    }
    
    // ========== 血量计算工具函数 ==========
    
    function calcPlayerMaxHp(playerChar, ctx = {}) {
        // 基础角色血量
        let hp = playerChar.baseHp * BATTLE_BALANCE.playerBaseHpMulti;
        if (ctx.level > 1) {
            hp += playerChar.hpGrowth * (ctx.level - 1);
        }
        if (ctx.hpBuff) hp *= ctx.hpBuff;

        // ========== 新增：句子数量动态加血逻辑 ==========
        const sentenceTotal = battleState.sentences.length;
        const sentenceBaseAdd = 4; // 每句基础加血4点（可微调）
        let sentenceAdd = 0;
        // 和怪物同梯度衰减，避免长文本血量爆炸
        if (sentenceTotal <= 10) {
            sentenceAdd = sentenceTotal * sentenceBaseAdd;
        } else if (sentenceTotal <= 30) {
            sentenceAdd = 10 * sentenceBaseAdd + (sentenceTotal - 10) * 2.5;
        } else {
            sentenceAdd = 10 * sentenceBaseAdd + 20 * 2.5 + (sentenceTotal - 30) * 1;
        }
        hp += Math.floor(sentenceAdd);
        // ==============================================

        const maxLimit = playerChar.baseHp * BATTLE_BALANCE.playerMaxHpLimitMulti;
        // 新增最低血量兜底，防止1-2句短文血量过低
        const minPlayerHp = playerChar.baseHp * 0.8;
        hp = Math.min(Math.floor(hp), maxLimit);
        return Math.max(hp, Math.floor(minPlayerHp));
    }
    
    function calcEnemyMaxHp(enemyChar, sentenceCount, ctx = {}) {
        const baseSingle = enemyChar.baseAtk * BATTLE_BALANCE.sentenceBaseHpCoeff;
        let totalHp;
        // 分区间梯度衰减
        if(sentenceCount <= 10){
            totalHp = baseSingle * sentenceCount;
        }else if(sentenceCount <= 30){
            totalHp = baseSingle * 10 + baseSingle * 0.6 * (sentenceCount - 10);
        }else{
            totalHp = baseSingle * 10 + baseSingle * 0.6 * 20 + baseSingle * 0.3 * (sentenceCount - 30);
        }
        const diffMulti = BATTLE_BALANCE.enemyDifficultyHpMulti[enemyChar.difficulty] || 1;
        totalHp *= diffMulti;
        if (ctx.enemyAiMulti) totalHp *= ctx.enemyAiMulti;
        const minHp = enemyChar.baseHp * 1.2;
        // 原35倍下调至28倍，长文本更容易击杀
        const maxHpCap = enemyChar.baseHp * 28;
        totalHp = Math.min(Math.floor(totalHp), maxHpCap);
        return Math.max(totalHp, minHp);
    }
    
    function calcEnemyShowHp(enemyChar) {
        const diffMulti = BATTLE_BALANCE.enemyDifficultyHpMulti[enemyChar.difficulty] || 1;
        return Math.floor(enemyChar.baseHp * diffMulti);
    }
    
    function getEnemyAttackValue(enemyChar, ctx) {
        const baseAtk = enemyChar.baseAtk;
        const stageCount = Array.isArray(ctx.activeStageList) ? ctx.activeStageList.length : 0;
        const stageAtkMulti = Math.pow(1.2, stageCount);
        let totalMulti = ctx.baseAtkMulti * stageAtkMulti;
        if (ctx.isRaging) totalMulti *= enemyChar.aiRageAtkMulti;
        // 全局伤害上限，最高2.8倍，防止多层叠加秒玩家
        totalMulti = Math.min(totalMulti, 2.8);
        return Math.floor(baseAtk * totalMulti);
    }
    
    function getPlayerAttackValue(playerChar, comboCount, damageMulti) {
        let base = playerChar.baseAtk;
        const comboBonus = Math.floor(battleState.letterCombo / 10) * 0.1;
        base *= (1 + comboBonus);
        // 统计当前拥有的双倍buff数量：attack力量药水 / doubleDmg能量球 各算一层
        let buffLayer = 1;
        const hasAttack = battleState.activeItems.some(i => i.id === 'attack');
        const hasDoubleDmg = battleState.activeItems.some(i => i.id === 'doubleDmg');
        if (hasAttack) buffLayer *= 2;
        if (hasDoubleDmg) buffLayer *= 2;
        base *= buffLayer;
        return Math.floor(base);
    }
    
    // 单个正确字母魔法小额伤害
    function getSingleCharDamage(playerChar, comboCount, damageMulti) {
        let base = Math.floor(playerChar.attack * 0.14);
        // 长文本单字母伤害衰减，避免碾压怪物
        const sentenceTotal = battleState.sentences.length;
        let sentenceDecay = 1;
        if(sentenceTotal > 20) sentenceDecay = 0.85;
        if(sentenceTotal > 40) sentenceDecay = 0.65;
        base *= sentenceDecay;

        const comboBonus = Math.floor(comboCount / 10) * 0.1;
        base *= (1 + comboBonus);
        let buffLayer = 1;
        const hasAttack = battleState.activeItems.some(i => i.id === 'attack');
        const hasDoubleDmg = battleState.activeItems.some(i => i.id === 'doubleDmg');
        if (hasAttack) buffLayer *= 2;
        if (hasDoubleDmg) buffLayer *= 2;
        // 双层buff叠加上限锁定3倍，杜绝4倍超模
        buffLayer = Math.min(buffLayer, 3);
        base *= buffLayer;
        const isCrit = Math.random() < 0.05;
        if(isCrit) base *= 2;
        return {
            dmg: Math.floor(base),
            isCrit: isCrit
        };
    }
    
    /** 生成魔法飞弹：玩家→怪物飞行动画 */
    function spawnMagicBullet(damage, isCrit) {
        if(!elements.battleScene || !elements.playerFighter || !elements.enemyFighter) return;

        const sceneRect = elements.battleScene.getBoundingClientRect();
        const playerRect = elements.playerFighter.getBoundingClientRect();
        const enemyRect = elements.enemyFighter.getBoundingClientRect();

        // 创建飞弹DOM
        const bullet = document.createElement('div');
        bullet.className = 'magic-bullet';
        if(isCrit) bullet.classList.add('crit-bullet');

        // 随机偏移（X左右，Y仅头像小范围）
        const randomOffsetX = (Math.random() - 0.5) * 60;
        const randomOffsetY = (Math.random() - 0.5) * 60;

        // 起点：玩家头像中心±小范围垂直偏移
        const startX = playerRect.left - sceneRect.left + playerRect.width / 2 + randomOffsetX;
        const startY = playerRect.top - sceneRect.top + playerRect.height / 2 + randomOffsetY;
        // 终点同步偏移
        const endX = enemyRect.left - sceneRect.left + enemyRect.width / 2 + randomOffsetX * 0.5;
        const endY = enemyRect.top - sceneRect.top + enemyRect.height / 2 + randomOffsetY * 0.5;

        bullet.style.left = startX + 'px';
        bullet.style.top = startY + 'px';
        elements.battleScene.appendChild(bullet);

        // 弹道动画，移除 composite: "accumulate"
        bullet.animate([
            { left: startX + 'px', top: startY + 'px', opacity: 1, scale: 1 },
            { left: endX + 'px', top: endY + 'px', opacity: 0.8, scale: 0.6 }
        ], {
            duration: 450,
            easing: 'ease-out'
        });

        // 根据连击等级放大飞弹
        const comboLevel = Math.floor(battleState.letterCombo / 10);
        const bulletSize = 18 + comboLevel * 4;
        bullet.style.width = bulletSize + 'px';
        bullet.style.height = bulletSize + 'px';
        bullet.style.boxShadow = `0 0 ${8 + comboLevel * 6}px currentColor`;

        // 角色专属弹道颜色
        const charId = battleState.player.id;
        if(charId === 'tiger'){ //老虎 火焰红
            bullet.style.background = 'radial-gradient(#ffb380, #ff4400)';
        }else if(charId === 'fox'){ //狐狸 紫暴击
            bullet.style.background = 'radial-gradient(#e0b3ff, #9922ff)';
        }else if(charId === 'bear'){ //小熊土黄
            bullet.style.background = 'radial-gradient(#ffe0b3, #bb7722)';
        }else if(charId === 'panda'){ //熊猫绿色
            bullet.style.background = 'radial(#b3ffb3, #22bb44)';
        }

        // 0.3秒弹道动画
        bullet.animate([
            { left: startX + 'px', top: startY + 'px', opacity: 1, scale: 1 },
            { left: endX + 'px', top: endY + 'px', opacity: 0.8, scale: 0.6 }
        ], {
            duration: 450, // 原300→450，飞行变慢，多颗同时存在更明显
            easing: 'ease-out'
        });

        // 飞弹命中后逻辑
        setTimeout(() => {
            if(bullet.parentNode) bullet.remove();
            // 爆炸粒子
            const sceneRect = elements.battleScene.getBoundingClientRect();
            const enemyRect = elements.enemyFighter.getBoundingClientRect();
            const hitX = enemyRect.left - sceneRect.left + enemyRect.width / 2;
            const hitY = enemyRect.top - sceneRect.top + enemyRect.height / 2;
            spawnHitParticle(hitX, hitY, isCrit);
            // 怪物扣血
            onHpChange(HP_TARGET.ENEMY, -damage);
            // 单字母飞弹：仅震动，无高光闪烁
            elements.enemyFighter.classList.add('enemy-shake-only');
            setTimeout(()=>elements.enemyFighter.classList.remove('enemy-shake-only'), 300);
            // 飘伤害数字
            showDamageNumber(elements.enemyFighter, damage, isCrit ? 'crit' : 'normal');
            // 轻微屏幕震动增强打击感
            //elements.battleScene.style.transform = 'translateX(-4px)';
            setTimeout(()=>elements.battleScene.style.transform = '', 80);
        }, 300);
    }

        /** 飞命中爆炸粒子 */
        function spawnHitParticle(targetX, targetY, isCrit) {
            if(!elements.battleScene) return;
            const particleCount = isCrit ? 12 : 6; // 暴击更多粒子
            for(let i = 0; i < particleCount; i++){
                const p = document.createElement('div');
                p.className = 'hit-particle';
                if(isCrit) p.classList.add('crit-particle');
                // 随机扩散角度
                const angle = Math.PI * 2 / particleCount * i;
                const dist = 30 + Math.random() * 40;
                const endX = targetX + Math.cos(angle) * dist;
                const endY = targetY + Math.sin(angle) * dist;

                p.style.left = targetX + 'px';
                p.style.top = targetY + 'px';
                elements.battleScene.appendChild(p);

                p.animate([
                    { left: targetX + 'px', top: targetY + 'px', opacity: 1, transform: 'scale(1)' },
                    { left: endX + 'px', top: endY + 'px', opacity: 0, transform: 'scale(0)' }
                ], { duration: 400, easing: 'ease-out' });

                setTimeout(()=>{
                    if(p.parentNode) p.remove();
                }, 400);
            }
        }

    // 浮点数安全比较（消除JS浮点精度误差）
    const EPS = 1e-6;
    
    function floatLess(val, target) {
        return val < target - EPS;
    }
    
    function floatGte(val, target) {
        return val >= target - EPS;
    }
    
    function getCurrentStage(hp, maxHp) {
        const pct = hp / maxHp;
        if (floatLess(pct, 0.3)) return BATTLE_STAGE.LOW;
        if (floatLess(pct, 0.7)) return BATTLE_STAGE.MID;
        return BATTLE_STAGE.HIGH;
    }
    
    function getHpPercent(target) {
        const current = target === HP_TARGET.PLAYER ? battleState.playerHp : battleState.enemyHp;
        const max = target === HP_TARGET.PLAYER ? battleState.playerMaxHp : battleState.enemyMaxHp;
        if (max <= 0) {
            endBattle(BATTLE_END_TYPE.TIME_OUT);
            return 0;
        }
        return current / max;
    }
    
    // 统一血量变更钩子（AI监听唯一入口，所有扣血/回血走这里）
    function onHpChange(target, delta) {
        const isPlayer = target === HP_TARGET.PLAYER;
        const current = isPlayer ? battleState.playerHp : battleState.enemyHp;
        const max = isPlayer ? battleState.playerMaxHp : battleState.enemyMaxHp;
        
        let newHp = Math.min(max, Math.max(0, current + delta));
        
        if (isPlayer) {
            battleState.playerHp = newHp;
        } else {
            battleState.enemyHp = newHp;
        }
        
        // 怪物AI血量阶段监听
        if (!isPlayer && battleState.enemy.aiEnable) {
            const enemy = battleState.enemy;
            const oldPercent = current / max;
            const newPercent = newHp / max;
            const rageThreshold = enemy.aiRageThreshold;
            
            // 狂暴状态切换
            if (floatLess(newPercent, rageThreshold) && floatGte(oldPercent, rageThreshold)) {
                battleState.battleCtx.isRaging = true;
            }
            if (floatGte(newPercent, rageThreshold) && floatLess(oldPercent, rageThreshold)) {
                battleState.battleCtx.isRaging = false;
            }
            
            // 阶段切换提示
            const oldStage = getCurrentStage(current, max);
            const nowStage = getCurrentStage(newHp, max);
            if (nowStage !== oldStage && !battleState.battleCtx.stageNotified[nowStage]) {
                battleState.battleCtx.stageNotified[nowStage] = true;
                showBattleAlert(`⚠️ 怪物进入${STAGE_LABEL[nowStage]}阶段，伤害提升！`, "warning", 2500);
            }
            
            // 刷新分段激活列表
            if (Array.isArray(enemy.aiStageHp)) {
                battleState.battleCtx.activeStageList = [];
                const newPercent = newHp / max;
                for (const stage of enemy.aiStageHp) {
                    if (floatLess(newPercent, stage)) {
                        battleState.battleCtx.activeStageList.push(stage);
                    }
                }
            }
        }
        
        updateBattleUI();
        checkBattleEnd();
    }
    
    // ========== 玩家攻击 ==========
    function playerAttack() {
        let damage = getPlayerAttackValue(
            battleState.player,
            battleState.letterCombo,
            battleState.damageMultiplier
        );
        let isCrit = false;
        
        if (Math.random() < battleState.player.critRate) {
            damage *= 2;
            isCrit = true;
        }
        
        onHpChange(HP_TARGET.ENEMY, -damage);
        
        if (isCrit) {
            playCritSound();
        } else {
            playAttackSound();
        }
        
        if (elements.playerFighter) {
            elements.playerFighter.classList.add('attacking');
            setTimeout(() => {
                elements.playerFighter.classList.remove('attacking');
            }, 500);
        }
        
        setTimeout(() => {
            if (elements.enemyFighter) {
                elements.enemyFighter.classList.add('hurt');
                setTimeout(() => {
                    elements.enemyFighter.classList.remove('hurt');
                }, 400);
            }
        }, 200);
        
        showDamageNumber(elements.enemyFighter, damage, isCrit ? 'crit' : 'normal');
        showAttackEffect(elements.enemyFighter, '💥');
    }
    
    // ========== 怪物自动攻击检测 ==========
    function checkMonsterAutoAttack() {
        const ctx = battleState.battleCtx;
        if (battleState.battleOver || ctx.attackLock) return;
        
        const remain = ctx.attackInterval - ctx.attackTimer;
        
        // 剩余4秒进入打断预警窗口
        if (remain <= 4000 && !ctx.inInterruptWindow) {
            ctx.inInterruptWindow = true;
            ctx.interruptTimer = Date.now();
            
            elements.enemyFighter.classList.add('warn-flash');
            
            // 创建进度条
            clearMonsterWarningBar();
            const monsterWrap = elements.enemyFighter;
            const monsterRect = monsterWrap.getBoundingClientRect();
            const parentBox = monsterWrap.parentElement;
            
            const barWrap = document.createElement('div');
            barWrap.className = 'monster-warning-bar-wrap';
            barWrap.style.cssText = `
                position:absolute;
                left:${monsterRect.left - parentBox.getBoundingClientRect().left}px;
                top:${monsterRect.top - parentBox.getBoundingClientRect().top + monsterRect.height + 6}px;
                width:${monsterRect.width}px;
                height: 8px;
                background: #222;
                border-radius: 4px;
                overflow: hidden;
                z-index:11;
                pointer-events:none;
                outline: none;
                box-shadow: none;
                -webkit-backface-visibility: hidden;
                transform: scaleX(-1);
            `;
            
            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                height: 100%;
                width: 100%;
                background: linear-gradient(90deg, #fb923c, #ef4444);
                border-radius: 4px;
                transition: transform 4s linear;
                transform-origin: right center;
                transform: scaleX(1);
            `;
            
            barWrap.appendChild(progressBar);
            parentBox.appendChild(barWrap);
            
            setTimeout(() => {
                progressBar.style.transform = 'scaleX(0)';
            }, 30);
        }
        
        // 计时达到，执行攻击
        if (ctx.attackTimer >= ctx.attackInterval) {
            ctx.attackLock = true;
            enemyAttack();
            
            ctx.attackTimer = 0;
            ctx.inInterruptWindow = false;
            ctx.continuousCorrect = 0;
            ctx.interruptTimer = 0;
            clearMonsterWarningBar();
            elements.enemyFighter.classList.remove('warn-flash');
            ctx.aiAdjustCooldown = false;
            
            setTimeout(() => {
                ctx.attackLock = false;
            }, 700);
        }
    }
    
    // ========== 自适应难度AI ==========
    function adjustDifficultyAI(triggerType) {
        const ctx = battleState.battleCtx;
        if (!ctx.aiEnabled || ctx.aiAdjustCooldown) return;
        let changed = false;
        let newInterval = ctx.attackInterval;
        const totalSent = battleState.sentences.length;
        // 长文本怪物攻击间隔基础缩短，提升压迫
        const longSentPenalty = totalSent > 25 ? 0.8 : 1;
        // 玩家挨打
        if (triggerType === 'player_hit') {
            ctx.consecutiveHits++;
            ctx.consecutiveInterrupts = 0;
            const step = ctx.adjustStep * longSentPenalty;
            if (ctx.consecutiveHits >= 2) {
                newInterval = Math.min(ctx.attackInterval + step * 2, ctx.maxInterval);
            } else {
                newInterval = Math.min(ctx.attackInterval + step, ctx.maxInterval);
            }
            if (Math.abs(newInterval - ctx.attackInterval) > 10) {
                ctx.attackInterval = newInterval;
                changed = true;
            }
        }
        // 打断成功缩短间隔（逻辑不变）
        else if (triggerType === 'interrupt_success') {
            ctx.consecutiveInterrupts++;
            ctx.consecutiveHits = 0;
            const step = ctx.adjustStep * longSentPenalty;
            if (ctx.consecutiveInterrupts >= 3) {
                newInterval = Math.max(ctx.attackInterval - step * 2, ctx.minInterval);
            } else {
                newInterval = Math.max(ctx.attackInterval - step, ctx.minInterval);
            }
            if (Math.abs(newInterval - ctx.attackInterval) > 10) {
                ctx.attackInterval = newInterval;
                changed = true;
            }
        }
        // 高准确率小幅加难度
        else if (triggerType === 'sentence_clear') {
            const total = battleState.correctCount + battleState.wrongCount;
            const accuracy = total > 0 ? battleState.correctCount / total : 1;
            if (accuracy > 0.9) {
                const step = ctx.adjustStep * longSentPenalty * 0.5;
                newInterval = Math.max(ctx.attackInterval - step, ctx.minInterval);
                if (Math.abs(newInterval - ctx.attackInterval) > 10) {
                    ctx.attackInterval = newInterval;
                    changed = true;
                }
            }
        }
        if (changed && ctx.attackTimer > ctx.attackInterval * 0.8) {
            ctx.attackTimer = ctx.attackInterval * 0.8;
        }
        if (changed) {
            ctx.aiAdjustCooldown = true;
            setTimeout(()=>ctx.aiAdjustCooldown = false,1500); // 延长AI冷却，防止频繁波动
        }
    }
    
    // ========== 怪物攻击 ==========
    function enemyAttack() {
        // 全局基础伤害
        let damage = getEnemyAttackValue(battleState.enemy, battleState.battleCtx) ;
        damage = Math.floor(damage);
        
        // 儿童保护：长时间不输入，伤害再减半
        const idleTime = Date.now() - battleState.lastInputTime;
        if (idleTime > 5000) {
            damage = Math.floor(damage * 0.5);
        }
        
        // 无敌状态
        if (battleState.invincible) {
            showDamageNumber(elements.playerFighter, '免疫', 'heal');
            showAttackEffect(elements.playerFighter, '✨');
            updateBattleUI();
            checkBattleEnd();
            return;
        }
        
        // 护盾抵挡
        if (battleState.shieldCount > 0) {
            battleState.shieldCount--;
            showShieldBreakEffect();
            showDamageNumber(elements.playerFighter, '护盾', 'heal');
            // 护盾归零，移除activeItems里的shield
            if(battleState.shieldCount <= 0){
                battleState.activeItems = battleState.activeItems.filter(item => item.id !== 'shield');
            }
            updateBattleUI();
            checkBattleEnd();
            return;
        }
        
        // 正常扣血
        onHpChange(HP_TARGET.PLAYER, -damage);
        addRage(damage * 2);
        playHurtSound();
        
        if (elements.enemyFighter) {
            elements.enemyFighter.classList.add('attacking');
            setTimeout(() => {
                elements.enemyFighter.classList.remove('attacking');
            }, 500);
        }
        
        setTimeout(() => {
            if (elements.playerFighter) {
                elements.playerFighter.classList.add('hurt');
                setTimeout(() => {
                    elements.playerFighter.classList.remove('hurt');
                }, 400);
            }
        }, 200);
        
        showDamageNumber(elements.playerFighter, damage, 'normal');
        showAttackEffect(elements.playerFighter, '💢');
        
        adjustDifficultyAI('player_hit');
        checkBattleEnd();
    }
    
    // ========== 玩家回血 ==========
    function playerHeal(amount) {
        const actualHeal = Math.min(amount, battleState.playerMaxHp - battleState.playerHp);
        onHpChange(HP_TARGET.PLAYER, actualHeal);
        playHealSound();
        showDamageNumber(elements.playerFighter, '+' + actualHeal, 'heal');
        showAttackEffect(elements.playerFighter, '💚');
    }
    
    // ========== 伤害数字 ==========
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
        
        damageEl.style.left = (targetRect.left - sceneRect.left + targetRect.width / 2 - 20) + 'px';
        damageEl.style.top = (targetRect.top - sceneRect.top) + 'px';
        elements.battleScene.appendChild(damageEl);
        
        setTimeout(() => {
            if (damageEl.parentNode) {
                damageEl.parentNode.removeChild(damageEl);
            }
        }, 1000);
    }
    
    // ========== 攻击特效 ==========
    function showAttackEffect(targetElement, emoji) {
        if (!targetElement || !elements.battleScene) return;
        
        const targetRect = targetElement.getBoundingClientRect();
        const sceneRect = elements.battleScene.getBoundingClientRect();
        
        const effectEl = document.createElement('div');
        effectEl.className = 'attack-effect';
        effectEl.textContent = emoji;
        effectEl.style.left = (targetRect.left - sceneRect.left + targetRect.width / 2 - 30) + 'px';
        effectEl.style.top = (targetRect.top - sceneRect.top + targetRect.height / 2 - 30) + 'px';
        elements.battleScene.appendChild(effectEl);
        
        setTimeout(() => {
            if (effectEl.parentNode) {
                effectEl.parentNode.removeChild(effectEl);
            }
        }, 500);
    }
    
    // ========== 护盾特效 ==========
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
    
    // ========== 怒气系统 ==========
    function addRage(amount) {
        battleState.rage = Math.min(battleState.rage + amount, battleState.maxRage);
        
        if (battleState.rage >= battleState.maxRage && !battleState.rageSkillReady) {
            battleState.rageSkillReady = true;
            showRageFullEffect();
            
            if(battleState.rageAutoTimer) clearTimeout(battleState.rageAutoTimer);
            battleState.rageAutoTimer = setTimeout(() => {
                if (battleState.battleOver || battleState.battleCtx.rageSkillCooldown || !battleState.rageSkillReady) return;
                useRageSkill();
            }, 60000);
        }
        
        updateBattleUI();
    }
    
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
    
    function useRageSkill() {
        const ctx = battleState.battleCtx;
        if (!battleState.rageSkillReady || ctx.rageSkillCooldown || battleState.battleOver) return;
        
        ctx.rageSkillCooldown = true;
        battleState.rageSkillReady = false;
        battleState.rage = 0;
        
        if(battleState.rageAutoTimer) clearTimeout(battleState.rageAutoTimer);
        
        setTimeout(() => {
            ctx.rageSkillCooldown = false;
        }, 3000);
        
        // 怒气技能效果：3倍攻击 + 回20%血
        const rageDamage = Math.floor(battleState.player.attack * 3);
        const rageHeal = Math.floor(battleState.playerMaxHp * 0.2);
        
        onHpChange(HP_TARGET.ENEMY, -rageDamage);
        
        const actualHeal = Math.min(rageHeal, battleState.playerMaxHp - battleState.playerHp);
        onHpChange(HP_TARGET.PLAYER, actualHeal);
        
        showRageSkillEffect();
        showDamageNumber(elements.enemyFighter, rageDamage, 'crit');
        showDamageNumber(elements.playerFighter, '+' + actualHeal);
        
        playCritSound();
        playHealSound();
        
        updateBattleUI();
        checkBattleEnd();
        
        setTimeout(() => {
            if(elements.battleInput && !battleState.battleOver){
                elements.battleInput.focus();
            }
        }, 300);
    }
    
    function showRageSkillEffect() {
        if (!elements.battleScene) return;
        
        const effectEl = document.createElement('div');
        effectEl.className = 'rage-skill-effect';
        effectEl.textContent = '💥🔥⚡';
        effectEl.style.left = '50%';
        effectEl.style.top = '50%';
        effectEl.style.transform = 'translate(-50%)';
        elements.battleScene.appendChild(effectEl);
        
        setTimeout(() => {
            if (effectEl.parentNode) {
                effectEl.parentNode.removeChild(effectEl);
            }
        }, 1000);
    }


    
    // ========== 道具系统 ==========
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
                // 力量药水自身buff叠加
                const existBuff = battleState.activeItems.find(item => item.id === "attack");
                if (existBuff) {
                    existBuff.remaining += 5;
                } else {
                    addActiveItem('attack', 5);
                }
                // 存在任意增伤buff，基础倍率设2，后续计算相乘
                battleState.damageMultiplier = 2;
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
            id: 'doubleDmg',
            name: '能量增幅',
            emoji: '⚡',
            description: '接下来N个句子伤害翻倍',
            // 补充空effect，因为能量球是场景互动生成，不会道具掉落触发
            effect: function() {}
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
                setTimeout(() => {
                    if (!battleState.battleOver && battleState.rageSkillReady) {
                        useRageSkill();
                    }
                }, 800);
            }
        }
    ];
    
    function addActiveItem(itemId, duration) {
        battleState.activeItems.push({
            id: itemId,
            remaining: duration
        });
    }
    
    function consumeItemDuration() {
        const newActiveItems = [];
        for (const item of battleState.activeItems) {
            item.remaining--;
            if (item.remaining > 0) {
                newActiveItems.push(item);
            } else {
                if (item.id === 'attack' || item.id === 'doubleDmg') {
                    // 移除当前过期buff后，检查是否还存在其他增伤buff
                    const stillHasAttack = battleState.activeItems.some(x => x.id === 'attack' && x.remaining > 0);
                    const stillHasDouble = battleState.activeItems.some(x => x.id === 'doubleDmg' && x.remaining > 0);
                    if (!stillHasAttack && !stillHasDouble) {
                        // 两种buff全部清空，倍率恢复正常1倍
                        battleState.damageMultiplier = 1;
                    } else {
                        // 仍有任意一种双倍buff，保持基础倍率2
                        battleState.damageMultiplier = 2;
                    }
                } else if (item.id === 'invincible') {
                    battleState.invincible = false;
                }
            }
        }
        battleState.activeItems = newActiveItems;
    }
    
    function tryDropItem() {
        battleState.itemDropCounter++;
        
        // 每5个句子70%概率掉落
        if (battleState.itemDropCounter >= 5) {
            battleState.itemDropCounter = 0;
            if (Math.random() < 0.7) {
                dropRandomItem();
            }
        }
    }
    
    function dropRandomItem() {
        const randomIndex = Math.floor(Math.random() * itemTypes.length);
        const item = itemTypes[randomIndex];
        
        showItemDropEffect(item);
        
        setTimeout(() => {
            item.effect();
            playComboSound();
            updateBattleUI();
        }, 500);
    }
    
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
    
    // ====================== 方案6 场景互动核心函数 ======================
/**
 * 启动随机事件循环
 */
function startSceneEventLoop() {
    const state = battleState.sceneInteract;
    // 关键：启动前先销毁旧定时器，防止多定时器叠加
    if (state.eventTimer) {
        clearInterval(state.eventTimer);
        state.eventTimer = null;
    }
    state.eventTimer = setInterval(() => {
        if (battleState.battleOver || !battleState.active) return;
        if (state.eventLock) return;
        if (Math.random() < SCENE_EVENT_CONFIG.eventChance) {
            triggerRandomSceneEvent();
            state.eventLock = true;
            setTimeout(() => {
                state.eventLock = false;
            }, 8000);
        }
    }, SCENE_EVENT_CONFIG.eventInterval);
}
/**
 * 随机抽取并生成一种场景事件
 */
function triggerRandomSceneEvent() {
    // 前置强制兜底：下标超出直接重置，杜绝读取undefined句子
    if (battleState.currentSentenceIndex >= battleState.sentences.length) {
        battleState.currentSentenceIndex = 0;
    }
    // 战斗结束不再生成事件，避免后台循环干扰
    if (battleState.battleOver || !battleState.active) return;
    const eventTypes = [SCENE_EVENT_TYPE.HEAL_STAR, SCENE_EVENT_TYPE.METEOR, SCENE_EVENT_TYPE.ENERGY_BALL];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    switch(randomType) {
        case SCENE_EVENT_TYPE.HEAL_STAR:
            spawnHealStar();
            break;
        case SCENE_EVENT_TYPE.METEOR:
            spawnMeteorRain();
            break;
        case SCENE_EVENT_TYPE.ENERGY_BALL:
            spawnEnergyBall();
            break;
    }
}
/**
 * 生成治疗星星⭐
 */
function spawnHealStar() {
    const state = battleState.sceneInteract;
    if (state.hasStar) return;
    state.hasStar = true;
    const starEl = document.createElement('div');
    starEl.className = "scene-interact-item heal-star";
    starEl.textContent = "⭐";
    elements.battleScene.appendChild(starEl);
    state.starDom = starEl;
    createSceneTip("天上掉落治愈星星！输入完整当前句子即可拾取回血");
    setTimeout(() => {
        if (state.starDom && state.starDom.parentNode) {
            state.starDom.remove();
        }
        state.hasStar = false;
        state.starDom = null;
    }, 7000);
}
/**
 * 生成陨石雨☄️ 天罚机制
 */
function spawnMeteorRain() {
    const state = battleState.sceneInteract;
    if(battleState.battleOver || state.eventLock) return;
    for(let i = 0; i < 5; i++) {
        setTimeout(() => {
            const meteor = document.createElement('div');
            meteor.className = "scene-interact-item meteor";
            meteor.textContent = "☄️";
            meteor.style.left = (10 + Math.random() * 80) + "%";
            elements.battleScene.appendChild(meteor);
            setTimeout(() => {
                if(meteor.parentNode) meteor.remove();
            }, 1200);
        }, i * 120);
    }
    createSceneTip("陨石来袭！双方损失10%最大生命值", "warning");
    playHurtSound();
    const playerDmg = Math.floor(battleState.playerMaxHp * SCENE_EVENT_CONFIG.meteorDmgRatio);
    const enemyDmg = Math.floor(battleState.enemyMaxHp * SCENE_EVENT_CONFIG.meteorDmgRatio);
    onHpChange(HP_TARGET.PLAYER, -playerDmg);
    onHpChange(HP_TARGET.ENEMY, -enemyDmg);
    showDamageNumber(elements.playerFighter, "-" + playerDmg, "normal");
    showDamageNumber(elements.enemyFighter, "-" + enemyDmg, "normal");
    checkBattleEnd();
}
/**
 * 生成能量球⚡
 */
function spawnEnergyBall() {
    const state = battleState.sceneInteract;
    if(state.hasEnergyBall) return;
    state.hasEnergyBall = true;
    const currentSentence = battleState.sentences[battleState.currentSentenceIndex];
    const sentenceText = currentSentence.english.toUpperCase();
    let validChars = [];
    for (const ch of sentenceText) {
        if (/[A-Z]/.test(ch) && !validChars.includes(ch)) {
            validChars.push(ch);
        }
    }
    let randomChar;
    if (validChars.length > 0) {
        randomChar = validChars[Math.floor(Math.random() * validChars.length)];
    } else {
        randomChar = ENERGY_CHAR_POOL[Math.floor(Math.random() * ENERGY_CHAR_POOL.length)];
    }
    state.targetEnergyChar = randomChar;
    const ballEl = document.createElement('div');
    ballEl.className = "scene-interact-item energy-ball";
    ballEl.textContent = "⚡";
    elements.battleScene.appendChild(ballEl);
    state.energyDom = ballEl;
    createSceneTip(`能量球出现！顺着句子正确打出字母【${randomChar}】即可拾取，3句伤害翻倍`);
    refreshSentenceHighlight();
    setTimeout(() => {
        if(state.energyDom && state.energyDom.parentNode) {
            state.energyDom.remove();
        }
        state.hasEnergyBall = false;
        state.targetEnergyChar = "";
        state.energyDom = null;
        refreshSentenceHighlight();
    }, 9000);
}
/**
 * 检测拾取交互
 * @param rawInputChar 输入末尾字符
 */
function checkInteractPickup(rawInputChar) {
    const state = battleState.sceneInteract;
    const sentence = battleState.sentences[battleState.currentSentenceIndex];
    const targetFull = sentence.english.toUpperCase();
    const userInput = elements.battleInput.value.toUpperCase();
    const inputChar = rawInputChar?.toUpperCase().trim() || '';
    if (state.hasEnergyBall && state.targetEnergyChar) {
        const targetC = state.targetEnergyChar;
        const isCorrectPrefix = targetFull.startsWith(userInput);
        const hasTargetLetter = userInput.includes(targetC);
        if (isCorrectPrefix && hasTargetLetter) {
            if (state.energyDom?.parentNode) state.energyDom.remove();
            state.hasEnergyBall = false;
            state.targetEnergyChar = "";
            state.energyDom = null;
            battleState.damageMultiplier = 2;
            const existBuff = battleState.activeItems.find(item => item.id === "doubleDmg");
            if (existBuff) {
                existBuff.remaining += SCENE_EVENT_CONFIG.energyBuffSentence;
            } else {
                addActiveItem("doubleDmg", SCENE_EVENT_CONFIG.energyBuffSentence);
            }
            showInteractGetEffect("⚡", elements.battleScene);
            playComboSound(15);
            return;
        }
    }
    if(state.hasStar) {
        const targetTxt = sentence.english.toLowerCase();
        const inputVal = elements.battleInput.value.toLowerCase();
        if(inputVal === targetTxt) {
            if (state.starDom?.parentNode) state.starDom.remove();
            state.hasStar = false;
            state.starDom = null;
            const healVal = Math.floor(battleState.playerMaxHp * SCENE_EVENT_CONFIG.healStarHealRatio);
            playerHeal(healVal);
            showInteractGetEffect("⭐", elements.battleScene);
        }
    }
}
/**
 * 创建场景提示文字
 */
function createSceneTip(text, type = "info") {
    const oldTip = document.querySelector(".scene-event-tip");
    if(oldTip) oldTip.remove();
    const tip = document.createElement("div");
    tip.className = "scene-event-tip";
    tip.textContent = text;
    if(type === "warning") tip.style.color = "#f87171";
    elements.battleScene.appendChild(tip);
    setTimeout(() => {
        if(tip.parentNode) tip.remove();
    }, 3000);
}
/**
 * 拾取成功上浮特效
 */
function showInteractGetEffect(emoji, parent) {
    const eff = document.createElement("div");
    eff.className = "interact-get-effect";
    eff.textContent = emoji;
    eff.style.left = "50%";
    eff.style.top = "40%";
    eff.style.transform = "translateX(-50%)";
    parent.appendChild(eff);
    setTimeout(() => {
        if(eff.parentNode) eff.remove();
    }, 600);
}
/**
 * 清空所有场景互动元素与定时器
 */
function clearAllSceneInteract() {
    const state = battleState.sceneInteract;
    if(state.eventTimer) {
        clearInterval(state.eventTimer);
        state.eventTimer = null;
    }
    if(state.starDom?.parentNode) state.starDom.remove();
    if(state.energyDom?.parentNode) state.energyDom.remove();
    document.querySelectorAll(".scene-event-tip, .scene-interact-item").forEach(el => {
        if(el.parentNode) el.remove();
    });
    state.hasStar = false;
    state.hasEnergyBall = false;
    state.targetEnergyChar = "";
    state.eventLock = false;
    state.starDom = null;
    state.energyDom = null;
}
    // ========== 战斗结束判定 ==========
    function checkBattleEnd() {
        if (battleState.battleOver) return;
        // 条件1：怪物血量清空 → 提前胜利（游戏核心爽点）
        if (battleState.enemyHp <= 0) {
            endBattle(BATTLE_END_TYPE.ENEMY_HP_EMPTY);
            return;
        }
        // 条件2：全部句子完成，循环从头再来，不结束战斗，直到打死怪物
        if (battleState.currentSentenceIndex >= battleState.sentences.length) {
            // 标记：已经完整打完一轮全部句子
            battleState.fullSentenceRoundComplete = true;
            // 狂暴小幅提速
            battleState.battleCtx.minInterval *= 0.9;
            battleState.battleCtx.attackInterval = battleState.battleCtx.minInterval;
            // 仅重置句子索引，不再清空打字统计correctCount
            battleState.currentSentenceIndex = 0;
            showBattleAlert("全部练习完成，怪物狂暴！重复单词继续击败它！", "warning", 2000);
            showCurrentSentence();
            return;
        }
        // 玩家死亡判定
        if (battleState.playerHp <= 0 && !battleState.invincible) {
            endBattle(BATTLE_END_TYPE.PLAYER_DEAD);
        }
    }
    function endBattle(result) {
        if(battleState.rageAutoTimer) clearTimeout(battleState.rageAutoTimer);
        battleState.battleOver = true;
        battleState.active = false;
        const endTime = Date.now();
        const duration = Math.floor((endTime - battleState.startTime) / 1000);
        const total = battleState.correctCount + battleState.wrongCount;
        const accuracy = total > 0 ? Math.round((battleState.correctCount / total) * 100) : 0;
        const isWin = result === BATTLE_END_TYPE.ENEMY_HP_EMPTY;

        // 音效
        if (isWin) {
            playWinSound();
        } else if (result === BATTLE_END_TYPE.PLAYER_DEAD) {
            playLoseSound();
        }

        // 1. 顶部图标区分三种场景
        if (elements.resultIcon) {
            if (isWin) {
                if (battleState.fullSentenceRoundComplete) {
                    // 场景A：打完完整一轮再杀怪
                    elements.resultIcon.textContent = '🏆';
                } else {
                    // 场景B：中途没打完就杀怪
                    elements.resultIcon.textContent = '⚔️';
                }
            } else {
                // 失败
                elements.resultIcon.textContent = '💔';
            }
        }

        // 2. 大标题
        if (elements.resultTitle) {
            elements.resultTitle.textContent = isWin ? '胜利！' : '失败...';
            elements.resultTitle.className = 'battle-result-title ' + (isWin ? 'win' : 'lose');
        }

        // 3. 副标题文案（核心区分）
        if (elements.resultSubtitle) {
            if (result === BATTLE_END_TYPE.ENEMY_HP_EMPTY) {
                if (battleState.fullSentenceRoundComplete) {
                    // 场景A
                    elements.resultSubtitle.textContent = `太棒了！完整练习全部句子后，击败${battleState.enemy.name}！`;
                } else {
                    // 场景B
                    elements.resultSubtitle.textContent = `太棒了！成功击败${battleState.enemy.name}，无需打完所有句子`;
                }
            } else if (result === BATTLE_END_TYPE.PLAYER_DEAD) {
                elements.resultSubtitle.textContent = `你被 ${battleState.enemy.name} 击败了...`;
            } else {
                elements.resultSubtitle.textContent = '战斗结束';
            }
        }

        // 统计数据渲染（不变）
        if (elements.resultCorrect) elements.resultCorrect.textContent = battleState.correctCount;
        if (elements.resultWrong) elements.resultWrong.textContent = battleState.wrongCount;
        if (elements.resultAccuracy) elements.resultAccuracy.textContent = accuracy + '%';
        if (elements.resultTime) {
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            elements.resultTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        setTimeout(() => {
            if (elements.battleResult) elements.battleResult.classList.add('active');
        }, 800);
        clearBattleTimers();
    }
    // ========== 再来一局 ==========
    function retryBattle() {
        clearBattleTimers();
        clearAllSceneInteract();
        stopVoice();
        clearVoiceCache();
        // 强制清空输入框、解除残留输入状态
        if(elements.battleInput){
            elements.battleInput.value = "";
            elements.battleInput.blur();
            elements.battleInput.classList.remove('correct','wrong');
        }
        playClickSound();
        if (elements.battleResult) {
            elements.battleResult.classList.remove('active');
        }
        startBattle();
    }
    // ========== 返回角色选择界面 ==========
    function backToSelect() {
        playClickSound();
        clearBattleTimers();
        clearAllSceneInteract();
        stopVoice();
        clearVoiceCache();
        // 清空输入框残留样式与内容
        if(elements.battleInput){
            elements.battleInput.value = "";
            elements.battleInput.classList.remove('correct','wrong');
        }
        // 关闭弹窗与战斗页面
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
    // ========== 退出战斗模块 ==========
    function exitBattle() {
        if (!confirm('确定要退出战斗吗？当前进度将丢失。')) return;
        clearBattleTimers();
        clearAllSceneInteract();
        stopVoice();
        try {
            clearVoiceCache();
        } catch (e) {
            console.warn('语音缓存释放异常');
        }
        battleState.active = false;
        battleState.battleOver = true;
        // 清空输入框
        if(elements.battleInput){
            elements.battleInput.value = "";
            elements.battleInput.classList.remove('correct','wrong');
        }
        if (elements.battleMode) elements.battleMode.classList.remove('active');
        if (elements.battleSelect) elements.battleSelect.classList.remove('active');
        if (elements.battleResult) elements.battleResult.classList.remove('active');
    }
    
    // 全局怒气手动释放入口
    window.triggerRageSkill = function() {
        if(battleState && !battleState.battleOver) useRageSkill();
    }

    // 全局对外挂载接口
    window.battleMode = {
        init: init,
        open: openBattleMode,
        exit: exitBattle
    };
    // 页面加载完成自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
