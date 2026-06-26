/* ========== 战斗模式 - 打字对战 ========== */
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
            healInterval: 3,    // 每打对 3 个回一次
            description: '每打对3个单词回5点血'
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
        words: [],           // 单词列表
        currentWordIndex: 0,
        currentCharIndex: 0,
        correctCount: 0,
        wrongCount: 0,
        comboCount: 0,       // 连击数
        healCounter: 0,      // 回血计数器（熊猫用）
        startTime: 0,
        battleOver: false
    };

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
            wordProgress: document.getElementById('battleWordProgress'),
            battleInput: document.getElementById('battleInput'),
            statsCorrect: document.getElementById('battleStatsCorrect'),
            statsWrong: document.getElementById('battleStatsWrong'),
            statsCombo: document.getElementById('battleStatsCombo'),
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
                    <div class="character-card-name">${char.name}</div>
                    <div class="character-card-type">${char.type}</div>
                    <div class="character-card-stats">
                        <div class="character-card-stat">❤️ <span>${char.hp}</span></div>
                        <div class="character-card-stat">⚔️ <span>${char.attack}</span></div>
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
                    <div class="character-card-name">${char.name}</div>
                    <div class="difficulty-stars">${stars}</div>
                    <div class="character-card-stats">
                        <div class="character-card-stat">❤️ <span>${char.hp}</span></div>
                        <div class="character-card-stat">⚔️ <span>${char.attack}</span></div>
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
        // 重新获取元素（解决加载顺序问题）
        elements.battleMode = document.getElementById('battleMode');
        elements.battleSelect = document.getElementById('battleSelect');
        elements.battleResult = document.getElementById('battleResult');
        elements.playerAvatar = document.getElementById('battlePlayerAvatar');
        elements.playerName = document.getElementById('battlePlayerName');
        elements.playerHpFill = document.getElementById('battlePlayerHpFill');
        elements.playerHpText = document.getElementById('battlePlayerHpText');
        elements.enemyAvatar = document.getElementById('battleEnemyAvatar');
        elements.enemyName = document.getElementById('battleEnemyName');
        elements.enemyHpFill = document.getElementById('battleEnemyHpFill');
        elements.enemyHpText = document.getElementById('battleEnemyHpText');
        elements.playerFighter = document.getElementById('battlePlayerFighter');
        elements.enemyFighter = document.getElementById('battleEnemyFighter');
        elements.battleScene = document.getElementById('battleScene');
        elements.currentWord = document.getElementById('battleCurrentWord');
        elements.wordProgress = document.getElementById('battleWordProgress');
        elements.battleInput = document.getElementById('battleInput');
        elements.statsCorrect = document.getElementById('battleStatsCorrect');
        elements.statsWrong = document.getElementById('battleStatsWrong');
        elements.statsCombo = document.getElementById('battleStatsCombo');
        elements.exitBtn = document.getElementById('battleExitBtn');
        elements.startBtn = document.getElementById('startBattleBtn');
        elements.playerGrid = document.getElementById('playerCharacterGrid');
        elements.enemyGrid = document.getElementById('enemyCharacterGrid');
        elements.resultIcon = document.getElementById('battleResultIcon');
        elements.resultTitle = document.getElementById('battleResultTitle');
        elements.resultSubtitle = document.getElementById('battleResultSubtitle');
        elements.resultCorrect = document.getElementById('resultStatCorrect');
        elements.resultWrong = document.getElementById('resultStatWrong');
        elements.resultAccuracy = document.getElementById('resultStatAccuracy');
        elements.resultTime = document.getElementById('resultStatTime');
        elements.resultRetryBtn = document.getElementById('battleResultRetry');
        elements.resultBackBtn = document.getElementById('battleResultBack');
        
        // 获取当前练习内容作为单词列表
        const sourceText = document.getElementById('sourceText');
        if (!sourceText || !sourceText.value.trim()) {
            alert('请先选择练习内容（选择题库或粘贴文本）');
            return;
        }

        // 解析单词
        const text = sourceText.value;
        battleState.words = extractWords(text);
        
        if (battleState.words.length < 3) {
            alert('单词太少啦，至少需要 3 个单词才能开始战斗！');
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

    // 提取单词（从文本中提取英文单词）
    function extractWords(text) {
        // 匹配英文单词，忽略纯中文和纯数字
        const wordRegex = /[a-zA-Z]+/g;
        const matches = text.match(wordRegex);
        if (!matches) return [];
        
        // 去重并过滤太短的单词
        const uniqueWords = [...new Set(matches)];
        return uniqueWords.filter(w => w.length >= 2);
    }

    // ========== 开始战斗 ==========
    function startBattle() {
        if (!selectedPlayerId || !selectedEnemyId) return;

        const playerChar = playerCharacters.find(c => c.id === selectedPlayerId);
        const enemyChar = enemyCharacters.find(c => c.id === selectedEnemyId);

        // 初始化战斗状态
        battleState = {
            active: true,
            player: playerChar,
            enemy: enemyChar,
            playerHp: playerChar.hp,
            playerMaxHp: playerChar.hp,
            enemyHp: enemyChar.hp,
            enemyMaxHp: enemyChar.hp,
            words: shuffleArray([...battleState.words]), // 打乱顺序
            currentWordIndex: 0,
            currentCharIndex: 0,
            correctCount: 0,
            wrongCount: 0,
            comboCount: 0,
            healCounter: 0,
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

        // 显示第一个单词
        showCurrentWord();

        // 聚焦输入框
        setTimeout(() => {
            if (elements.battleInput) {
                elements.battleInput.value = '';
                elements.battleInput.focus();
            }
        }, 300);
    }

    // 打乱数组（Fisher-Yates 洗牌算法）
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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
    }

    // ========== 显示当前单词 ==========
    function showCurrentWord() {
        if (battleState.currentWordIndex >= battleState.words.length) {
            // 所有单词打完了
            endBattle('words_finished');
            return;
        }

        const word = battleState.words[battleState.currentWordIndex];
        battleState.currentCharIndex = 0;

        // 显示单词
        if (elements.currentWord) {
            elements.currentWord.textContent = word;
        }

        // 更新单词进度点
        updateWordProgress();

        // 清空输入框
        if (elements.battleInput) {
            elements.battleInput.value = '';
            elements.battleInput.classList.remove('correct', 'wrong');
        }
    }

    // 更新单词进度点
    function updateWordProgress() {
        if (!elements.wordProgress) return;
        
        const word = battleState.words[battleState.currentWordIndex];
        if (!word) return;

        let html = '';
        for (let i = 0; i < word.length; i++) {
            let className = 'battle-word-dot';
            if (i < battleState.currentCharIndex) {
                className += ' done';
            } else if (i === battleState.currentCharIndex) {
                className += ' current';
            }
            html += `<div class="${className}"></div>`;
        }
        elements.wordProgress.innerHTML = html;
    }

    // ========== 处理输入 ==========
    function handleInput(e) {
        if (battleState.battleOver) return;

        const input = elements.battleInput;
        const word = battleState.words[battleState.currentWordIndex];
        const inputValue = input.value.toLowerCase();
        const targetWord = word.toLowerCase();

        // 检查输入是否正确
        let isCorrect = true;
        for (let i = 0; i < inputValue.length; i++) {
            if (inputValue[i] !== targetWord[i]) {
                isCorrect = false;
                break;
            }
        }

        if (!isCorrect) {
            // 打错了 - 怪物攻击
            handleWrongInput();
            return;
        }

        // 输入正确，更新当前字符索引
        battleState.currentCharIndex = inputValue.length;
        updateWordProgress();

        // 检查是否打完整个单词
        if (inputValue.length === targetWord.length) {
            handleWordComplete();
        }
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

        // 重置输入
        setTimeout(() => {
            if (elements.battleInput && !battleState.battleOver) {
                elements.battleInput.value = '';
                battleState.currentCharIndex = 0;
                updateWordProgress();
                elements.battleInput.focus();
            }
        }, 400);

        updateBattleUI();
        checkBattleEnd();
    }

    // 单词完成
    function handleWordComplete() {
        battleState.correctCount++;
        battleState.comboCount++;

        // 输入框变绿
        if (elements.battleInput) {
            elements.battleInput.classList.add('correct');
        }

        // 玩家攻击怪物
        playerAttack();

        // 熊猫回血技能
        if (battleState.player.special === 'heal') {
            battleState.healCounter++;
            if (battleState.healCounter >= battleState.player.healInterval) {
                battleState.healCounter = 0;
                playerHeal(battleState.player.healAmount);
            }
        }

        // 下一个单词
        setTimeout(() => {
            if (!battleState.battleOver) {
                battleState.currentWordIndex++;
                showCurrentWord();
                if (elements.battleInput) {
                    elements.battleInput.focus();
                }
            }
        }, 500);

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

        // 扣血
        battleState.enemyHp -= damage;

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
        battleState.playerHp -= damage;

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

    // ========== 检查战斗是否结束 ==========
    function checkBattleEnd() {
        if (battleState.battleOver) return;

        if (battleState.playerHp <= 0) {
            battleState.playerHp = 0;
            endBattle('lose');
        } else if (battleState.enemyHp <= 0) {
            battleState.enemyHp = 0;
            endBattle('win');
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

        // 更新结果弹窗
        if (elements.resultIcon) {
            elements.resultIcon.textContent = result === 'win' ? '🏆' : '💔';
        }
        if (elements.resultTitle) {
            elements.resultTitle.textContent = result === 'win' ? '胜利！' : '失败...';
            elements.resultTitle.className = 'battle-result-title ' + (result === 'win' ? 'win' : 'lose');
        }
        if (elements.resultSubtitle) {
            if (result === 'win') {
                elements.resultSubtitle.textContent = `你击败了 ${battleState.enemy.name}！`;
            } else if (result === 'lose') {
                elements.resultSubtitle.textContent = `你被 ${battleState.enemy.name} 击败了...`;
            } else {
                elements.resultSubtitle.textContent = '所有单词都打完啦！';
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
        if (elements.battleResult) {
            elements.battleResult.classList.remove('active');
        }
        startBattle();
    }

    // ========== 返回选择界面 ==========
    function backToSelect() {
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
