// js/feature/practice-bank-ui.js
// 内置题库选择 UI 功能（修复createButton残留报错、手风琴、输入框ID）
(function() {
    'use strict';

    // ========== 配置 ==========
    const CONFIG = {
        defaultStage: 'primary',
        defaultGrade: 5,
        defaultVolume: 'lower',
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
        createModal();
        bindEvents();
    }

    // ========== 已删除createButton函数，彻底消除报错源头 ==========

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
                        <button class="bank-tab" data-volume="upper">五年级上册</button>
                        <button class="bank-tab active" data-volume="lower">五年级下册</button>
                    </div>
                    <!-- 主内容区 -->
                    <div class="bank-main">
                        <!-- 左侧：模块/单元列表 -->
                        <div class="bank-sidebar">
                            <div class="bank-module-list" id="moduleList"></div>
                        </div>
                        <!-- 右侧：练习内容 -->
                        <div class="bank-content">
                            <div class="bank-unit-info" id="unitInfo">
                                <p class="bank-empty">请选择左侧的单元</p>
                            </div>
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
        // ESC 关闭弹窗
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) closeModal();
        });
    }

    // ========== 打开弹窗（全局暴露给onclick）==========
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

    // ========== 切换上下册 ==========
    function switchVolume(volume) {
        currentState.volume = volume;
        currentState.moduleId = null;
        currentState.unitId = null;
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
                        <span class="bank-module-arrow">${isActive ? '▼' : '▶'}</span>
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

    // ========== 手风琴：展开模块，自动收起其他模块 ==========
    function toggleModule(moduleId) {
        const allModules = document.querySelectorAll('.bank-module');
        allModules.forEach(moduleEl => {
            const mid = moduleEl.dataset.moduleId;
            const unitWrap = document.getElementById(`unitList-${mid}`);
            const arrow = moduleEl.querySelector('.bank-module-arrow');
            if (mid === moduleId) {
                // 当前点击模块切换展开/收起
                if (unitWrap.style.display === 'none') {
                    unitWrap.style.display = 'block';
                    moduleEl.classList.add('active');
                    arrow.textContent = '▼';
                    currentState.moduleId = moduleId;
                } else {
                    unitWrap.style.display = 'none';
                    moduleEl.classList.remove('active');
                    arrow.textContent = '▶';
                    if (currentState.moduleId === moduleId) currentState.moduleId = null;
                }
            } else {
                // 其他模块全部收起
                unitWrap.style.display = 'none';
                moduleEl.classList.remove('active');
                arrow.textContent = '▶';
            }
        });
    }

    // ========== 选择单元 ==========
    function selectUnit(moduleId, unitId) {
        currentState.moduleId = moduleId;
        currentState.unitId = unitId;
        document.querySelectorAll('.bank-unit').forEach(el => {
            el.classList.toggle('active', el.dataset.unitId === unitId);
        });
        loadUnitContent();
    }

    // ========== 渲染单元详情、练习卡片 ==========
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
        // 单元标题信息
        const infoEl = document.getElementById('unitInfo');
        if (infoEl && unit) {
            const stars = '⭐'.repeat(unit.difficulty || 2);
            infoEl.innerHTML = `
                <h4>${unit.name}</h4>
                <p class="bank-unit-subtitle">${unit.nameCn}</p>
                <p class="bank-unit-difficulty">难度：${stars}</p>
            `;
        }
        // 四类练习卡片
        const listEl = document.getElementById('practiceList');
        if (listEl && content) {
            const types = [
                { id: 'words', name: '单元单词', icon: '🔤', desc: `${content.words?.length || 0} 个单词` },
                { id: 'phrases', name: '重点短语', icon: '📝', desc: `${content.phrases?.length || 0} 个短语` },
                { id: 'sentences', name: '重点句型', icon: '💬', desc: `${content.sentences?.length || 0} 个句型` },
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

    // ========== 填充内容到输入框 #sourceText ==========
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
        const withCn = true;  // 所有类型都带中文译文
        const text = window.practiceBank.getPlainText(content, type, withCn);
        const inputBox = document.getElementById('sourceText');
        if (inputBox) {
            inputBox.value = text;
            // 触发输入事件，自动更新字符计数
            inputBox.dispatchEvent(new Event('input', { bubbles: true }));
        }
        closeModal();
    }

    // ========== 挂载全局函数（给HTML onclick调用）==========
    window.openPracticeBank = openModal;
    window.closePracticeBank = closeModal;
    window.toggleModule = toggleModule;
    window.selectUnit = selectUnit;
    window.selectPractice = selectPractice;

    // ========== DOM加载完成后初始化弹窗 ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();