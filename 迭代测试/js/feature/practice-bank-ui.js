// js/feature/practice-bank-ui.js
// 内置题库选择 UI 功能

(function() {
    'use strict';

    // ========== 配置 ==========
    const CONFIG = {
        defaultStage: 'primary',
        defaultGrade: 5,
        defaultVolume: 'lower',  // 默认显示下册
        version: 'guangzhou'
    };

    // ========== 状态 ==========
    let currentState = {
        stage: CONFIG.defaultStage,
        grade: CONFIG.defaultGrade,
        volume: CONFIG.defaultVolume,
        moduleId: null,
        unitId: null
    };

    let modalEl = null;
    let isOpen = false;

    // ========== 初始化 ==========
    function init() {
        createButton();
        createModal();
        bindEvents();
    }

    // ========== 创建按钮 ==========
    function createButton() {
        const btn = document.createElement('button');
        btn.id = 'practiceBankBtn';
        btn.className = 'bank-btn';
        btn.innerHTML = '📚 选择题库';
        btn.onclick = openModal;

        // 插入到练习内容区的按钮组里
        const contentArea = document.getElementById('contentArea');
        if (contentArea) {
            const btnGroup = contentArea.querySelector('.btn-group') || contentArea;
            btnGroup.appendChild(btn);
        }
    }

    // ========== 创建弹窗 ==========
    function createModal() {
        modalEl = document.createElement('div');
        modalEl.id = 'practiceBankModal';
        modalEl.className = 'bank-modal';
        modalEl.innerHTML = `
            <div class="bank-modal-overlay"></div>
            <div class="bank-modal-content">
                <div class="bank-modal-header">
                    <h3>📚 内置题库</h3>
                    <button class="bank-close-btn" onclick="closePracticeBank()">✕</button>
                </div>
                <div class="bank-modal-body">
                    <!-- 册别切换 Tab -->
                    <div class="bank-tabs">
                        <button class="bank-tab active" data-volume="upper">五年级上册</button>
                        <button class="bank-tab" data-volume="lower">五年级下册</button>
                    </div>
                    <!-- 主内容区 -->
                    <div class="bank-main">
                        <!-- 左侧：模块/单元列表 -->
                        <div class="bank-sidebar">
                            <div class="bank-module-list" id="moduleList"></div>
                        </div>
                        <!-- 右侧：练习内容 -->
                        <div class="bank-content">
                            <div class="bank-unit-info" id="unitInfo"></div>
                            <div class="bank-practice-list" id="practiceList"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalEl);
    }

    // ========== 绑定事件 ==========
    function bindEvents() {
        // 点击遮罩关闭
        modalEl.querySelector('.bank-modal-overlay').addEventListener('click', closeModal);

        // Tab 切换
        modalEl.querySelectorAll('.bank-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const volume = this.dataset.volume;
                switchVolume(volume);
            });
        });

        // ESC 关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                closeModal();
            }
        });
    }

    // ========== 打开弹窗 ==========
    function openModal() {
        if (!modalEl) return;
        modalEl.classList.add('open');
        isOpen = true;
        loadModules();
    }

    // ========== 关闭弹窗 ==========
    function closeModal() {
        if (!modalEl) return;
        modalEl.classList.remove('open');
        isOpen = false;
    }

    // ========== 切换册别 ==========
    function switchVolume(volume) {
        currentState.volume = volume;
        currentState.moduleId = null;
        currentState.unitId = null;

        // 更新 Tab 样式
        modalEl.querySelectorAll('.bank-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.volume === volume);
        });

        loadModules();
        clearUnitInfo();
    }

    // ========== 加载模块列表 ==========
    function loadModules() {
        const modules = window.practiceBank.getModules(
            currentState.stage,
            currentState.grade,
            currentState.volume,
            CONFIG.version
        );

        const listEl = document.getElementById('moduleList');
        if (!listEl) return;

        let html = '';
        modules.forEach(module => {
            const isActive = currentState.moduleId === module.id;
            html += `
                <div class="bank-module ${isActive ? 'active' : ''}" data-module-id="${module.id}">
                    <div class="bank-module-title" onclick="toggleModule('${module.id}')">
                        <span class="bank-module-arrow">▶</span>
                        <span>${module.name}</span>
                        <span class="bank-module-cn">${module.nameCn}</span>
                    </div>
                    <div class="bank-unit-list" id="unitList-${module.id}" style="${isActive ? '' : 'display:none'}">
                        ${module.units.map(unit => `
                            <div class="bank-unit ${currentState.unitId === unit.id ? 'active' : ''}" 
                                 data-unit-id="${unit.id}"
                                 onclick="selectUnit('${module.id}', '${unit.id}')">
                                <span>${unit.name}</span>
                                <span class="bank-unit-cn">${unit.nameCn}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        listEl.innerHTML = html;
    }

    // ========== 展开/收起模块 ==========
    function toggleModule(moduleId) {
        const unitList = document.getElementById('unitList-' + moduleId);
        if (!unitList) return;

        if (unitList.style.display === 'none') {
            unitList.style.display = 'block';
            currentState.moduleId = moduleId;
        } else {
            unitList.style.display = 'none';
            if (currentState.moduleId === moduleId) {
                currentState.moduleId = null;
            }
        }

        // 更新箭头方向
        const moduleEl = document.querySelector(`.bank-module[data-module-id="${moduleId}"]`);
        if (moduleEl) {
            const arrow = moduleEl.querySelector('.bank-module-arrow');
            if (arrow) {
                arrow.textContent = unitList.style.display === 'none' ? '▶' : '▼';
            }
            moduleEl.classList.toggle('active', unitList.style.display !== 'none');
        }
    }

    // ========== 选择单元 ==========
    function selectUnit(moduleId, unitId) {
        currentState.moduleId = moduleId;
        currentState.unitId = unitId;

        // 更新选中样式
        document.querySelectorAll('.bank-unit').forEach(el => {
            el.classList.toggle('active', el.dataset.unitId === unitId);
        });

        loadUnitContent();
    }

    // ========== 加载单元内容 ==========
    function loadUnitContent() {
        const content = window.practiceBank.getUnitContent(
            currentState.stage,
            currentState.grade,
            currentState.volume,
            currentState.moduleId,
            currentState.unitId,
            CONFIG.version
        );

        const modules = window.practiceBank.getModules(
            currentState.stage,
            currentState.grade,
            currentState.volume,
            CONFIG.version
        );
        const module = modules.find(m => m.id === currentState.moduleId);
        const unit = module ? module.units.find(u => u.id === currentState.unitId) : null;

        // 单元信息
        const infoEl = document.getElementById('unitInfo');
        if (infoEl && unit) {
            const stars = '⭐'.repeat(unit.difficulty || 2);
            infoEl.innerHTML = `
                <h4>${unit.name}</h4>
                <p class="bank-unit-subtitle">${unit.nameCn}</p>
                <p class="bank-unit-difficulty">难度：${stars}</p>
            `;
        }

        // 练习类型列表
        const listEl = document.getElementById('practiceList');
        if (listEl && content) {
            const types = [
                { id: 'words', name: '单元单词', icon: '🔤', desc: `${content.words ? content.words.length : 0} 个单词` },
                { id: 'phrases', name: '重点短语', icon: '📝', desc: `${content.phrases ? content.phrases.length : 0} 个短语` },
                { id: 'sentences', name: '重点句型', icon: '💬', desc: `${content.sentences ? content.sentences.length : 0} 个句型` },
                { id: 'dialogue', name: '课文对话', icon: '📖', desc: '中英双语对照' }
            ];

            listEl.innerHTML = types.map(type => `
                <div class="bank-practice-item" onclick="selectPractice('${type.id}')">
                    <div class="bank-practice-icon">${type.icon}</div>
                    <div class="bank-practice-info">
                        <div class="bank-practice-name">${type.name}</div>
                        <div class="bank-practice-desc">${type.desc}</div>
                    </div>
                    <div class="bank-practice-arrow">→</div>
                </div>
            `).join('');
        }
    }

    // ========== 清空单元信息 ==========
    function clearUnitInfo() {
        const infoEl = document.getElementById('unitInfo');
        const listEl = document.getElementById('practiceList');
        if (infoEl) infoEl.innerHTML = '<p class="bank-empty">请选择左侧的单元</p>';
        if (listEl) listEl.innerHTML = '';
    }

    // ========== 选择练习类型 ==========
    function selectPractice(type) {
        const content = window.practiceBank.getUnitContent(
            currentState.stage,
            currentState.grade,
            currentState.volume,
            currentState.moduleId,
            currentState.unitId,
            CONFIG.version
        );

        if (!content) return;

        // 获取纯文本
        const withCn = type !== 'dialogue'; // 对话类型用双语模式，其他类型带中文
        const text = window.practiceBank.getPlainText(content, type, withCn);

        // 填充到练习内容区
        const textInput = document.getElementById('textInput');
        if (textInput) {
            textInput.value = text;
            // 触发内容变化事件，让主程序重新渲染
            if (textInput.onchange) textInput.onchange();
            if (window.loadText) window.loadText();
        }

        // 如果是课文对话，切换到双语对照模式
        if (type === 'dialogue' && window.switchMode) {
            window.switchMode('bilingual');
        } else if (window.switchMode) {
            window.switchMode('full');
        }

        // 关闭弹窗
        closeModal();

        // 重置练习
        if (window.resetPractice) window.resetPractice();
    }

    // ========== 暴露全局方法 ==========
    window.openPracticeBank = openModal;
    window.closePracticeBank = closeModal;
    window.toggleModule = toggleModule;
    window.selectUnit = selectUnit;
    window.selectPractice = selectPractice;

    // ========== 启动 ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
