// js/feature/practice-bank-ui.js
// 内置题库选择 UI 功能（懒加载版 + 语音预加载）
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
        unitId: null,
        isAllUnits: false,
        currentModuleContent: null
    };
    let modalEl = null;
    let isOpen = false;
    // ========== 初始化 ==========
    function init() {
        createModal();
        bindEvents();
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
        modalEl.querySelector('.bank-modal-overlay').addEventListener('click', closeModal);
        modalEl.querySelectorAll('.bank-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const volume = this.dataset.volume;
                switchVolume(volume);
            });
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) closeModal();
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
    // ========== 切换上下册 ==========
    function switchVolume(volume) {
        currentState.volume = volume;
        currentState.moduleId = null;
        currentState.unitId = null;
        currentState.isAllUnits = false;
        modalEl.querySelectorAll('.bank-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.volume === volume);
        });
        loadModules();
        clearUnitInfo();
    }
    // ========== 加载模块列表（元数据，秒开）==========
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
            const isAllActive = isActive && currentState.isAllUnits;
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
                        <!-- 全部单元（合并练习）选项 -->
                        <div class="bank-unit bank-unit-all ${isAllActive ? 'active' : ''}"
                             onclick="selectAllUnitsInModule('${module.id}')">
                            <span>📚 全部单元（合并练习）</span>
                            <span class="bank-unit-cn">${module.units.length} 个单元合并</span>
                        </div>
                    </div>
                </div>
            `;
        });
        listEl.innerHTML = html;
    }
    // ========== 手风琴：展开模块 ==========
    function toggleModule(moduleId) {
        const allModules = document.querySelectorAll('.bank-module');
        allModules.forEach(moduleEl => {
            const mid = moduleEl.dataset.moduleId;
            const unitWrap = document.getElementById('unitList-' + mid);
            const arrow = moduleEl.querySelector('.bank-module-arrow');
            if (mid === moduleId) {
                if (unitWrap.style.display === 'none') {
                    unitWrap.style.display = 'block';
                    moduleEl.classList.add('active');
                    arrow.textContent = '▼';
                    currentState.moduleId = moduleId;
                    // 自动选中第一个 Unit
                    const firstUnit = unitWrap.querySelector('.bank-unit:not(.bank-unit-all)');
                    if (firstUnit) {
                        const firstUnitId = firstUnit.dataset.unitId;
                        selectUnit(moduleId, firstUnitId);
                    }
                } else {
                    unitWrap.style.display = 'none';
                    moduleEl.classList.remove('active');
                    arrow.textContent = '▶';
                    if (currentState.moduleId === moduleId) currentState.moduleId = null;
                }
            } else {
                unitWrap.style.display = 'none';
                moduleEl.classList.remove('active');
                arrow.textContent = '▶';
            }
        });
    }
    // ========== 确保模块内容已加载（懒加载核心）==========
    function ensureModuleLoaded(moduleId) {
        // 已经加载过了，直接返回
        if (window.practiceBank.isModuleLoaded(
            currentState.stage,
            currentState.grade,
            currentState.volume,
            moduleId
        )) {
            return Promise.resolve();
        }
        // 显示加载提示
        showLoadingState();
        // 动态加载模块内容
        return window.practiceBank.loadModule(
            currentState.stage,
            currentState.grade,
            currentState.volume,
            moduleId
        ).catch(err => {
            console.warn('模块加载失败:', err);
            showLoadError();
            throw err;
        });
    }
    // ========== 显示加载状态 ==========
    function showLoadingState() {
        const infoEl = document.getElementById('unitInfo');
        const listEl = document.getElementById('practiceList');
        if (infoEl) {
            infoEl.innerHTML = '<p class="bank-empty">⏳ 加载中...</p>';
        }
        if (listEl) {
            listEl.innerHTML = '';
        }
    }
    // ========== 显示加载错误 ==========
    function showLoadError() {
        const infoEl = document.getElementById('unitInfo');
        if (infoEl) {
            infoEl.innerHTML = '<p class="bank-empty">❌ 加载失败，请重试</p>';
        }
    }
    // ========== 选择单元 ==========
    function selectUnit(moduleId, unitId) {
        currentState.isAllUnits = false;
        currentState.moduleId = moduleId;
        currentState.unitId = unitId;
        // 更新选中状态
        document.querySelectorAll('.bank-unit').forEach(el => {
            el.classList.toggle('active', el.dataset.unitId === unitId);
        });
        // 先确保模块内容已加载，再显示内容
        ensureModuleLoaded(moduleId).then(() => {
            loadUnitContent();
        }).catch(() => {
            // 加载失败，状态已经显示了
        });
    }
    // ========== 选择模块全部单元（合并练习）==========
    function selectAllUnitsInModule(moduleId) {
        currentState.moduleId = moduleId;
        currentState.unitId = null;
        currentState.isAllUnits = true;
        // 更新选中状态
        document.querySelectorAll('.bank-unit').forEach(el => {
            el.classList.remove('active');
        });
        const allUnitEl = document.querySelector('.bank-module[data-module-id="' + moduleId + '"] .bank-unit-all');
        if (allUnitEl) allUnitEl.classList.add('active');
        // 先确保模块内容已加载，再显示内容
        ensureModuleLoaded(moduleId).then(() => {
            loadModuleContent(moduleId);
        }).catch(() => {
            // 加载失败
        });
    }
    // ========== 加载模块全部单元的合并内容 ==========
    function loadModuleContent(moduleId) {
        const modules = window.practiceBank.getModules(
            currentState.stage,
            currentState.grade,
            currentState.volume,
            CONFIG.version
        );
        const module = modules.find(m => m.id === moduleId);
        if (!module) return;
        // 合并所有单元的内容
        const merged = {
            words: [],
            phrases: [],
            sentences: [],
            dialogue: []
        };
        module.units.forEach(unit => {
            const content = window.practiceBank.getUnitContent(
                currentState.stage,
                currentState.grade,
                currentState.volume,
                moduleId,
                unit.id,
                CONFIG.version
            );
            if (content) {
                if (content.words) merged.words = merged.words.concat(content.words);
                if (content.phrases) merged.phrases = merged.phrases.concat(content.phrases);
                if (content.sentences) merged.sentences = merged.sentences.concat(content.sentences);
                if (content.dialogue) merged.dialogue = merged.dialogue.concat(content.dialogue);
            }
        });
        currentState.currentModuleContent = merged;
        // 单元标题信息
        const infoEl = document.getElementById('unitInfo');
        if (infoEl) {
            infoEl.innerHTML = `
                <h4>${module.name} · 全部单元</h4>
                <p class="bank-unit-subtitle">${module.nameCn}（${module.units.length} 个单元合并）</p>
                <p class="bank-unit-difficulty">综合练习</p>
            `;
        }
        // 四类练习卡片
        const listEl = document.getElementById('practiceList');
        if (listEl) {
            const types = [
                { id: 'words', name: '全部单词', icon: '🔤', desc: merged.words.length + ' 个单词' },
                { id: 'phrases', name: '全部短语', icon: '📝', desc: merged.phrases.length + ' 个短语' },
                { id: 'sentences', name: '全部句型', icon: '💬', desc: merged.sentences.length + ' 个句型' },
                { id: 'dialogue', name: '全部课文', icon: '📖', desc: module.units.length + ' 篇课文对话' }
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
                { id: 'words', name: '单元单词', icon: '🔤', desc: (content.words?.length || 0) + ' 个单词' },
                { id: 'phrases', name: '重点短语', icon: '📝', desc: (content.phrases?.length || 0) + ' 个短语' },
                { id: 'sentences', name: '重点句型', icon: '💬', desc: (content.sentences?.length || 0) + ' 个句型' },
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
    // ========== 语音预加载 ==========
    function preloadVoice(text) {
        if (!window.onlineTTS || typeof window.onlineTTS.preload !== 'function') return;
        if (!text || !text.trim()) return;
        
        // 简单分句，取前 2 句预加载
        const sentences = text.split(/[.?!。？！\n]/).filter(s => s.trim().length > 2);
        if (sentences.length === 0) return;
        
        const rate = 1.0; // 默认语速
        const preloadCount = Math.min(2, sentences.length); // 预加载 2 句
        
        for (let i = 0; i < preloadCount; i++) {
            const sen = sentences[i].trim();
            if (sen && sen.length > 2) {
                // 延迟一点再预加载，避免和其他请求冲突
                setTimeout(() => {
                    window.onlineTTS.preload(sen, 'zh', rate);
                }, 200 * (i + 1));
            }
        }
    }
    // ========== 填充内容到输入框 ==========
    function selectPractice(type) {
        let content;
        if (currentState.isAllUnits && currentState.currentModuleContent) {
            content = currentState.currentModuleContent;
        } else {
            content = window.practiceBank.getUnitContent(
                currentState.stage,
                currentState.grade,
                currentState.volume,
                currentState.moduleId,
                currentState.unitId,
                CONFIG.version
            );
        }
        if (!content) return;
        const withCn = true;
        const text = window.practiceBank.getPlainText(content, type, withCn);
        const inputBox = document.getElementById('sourceText');
        if (inputBox) {
            inputBox.value = text;
            inputBox.dispatchEvent(new Event('input', { bubbles: true }));
        }
        // ===== 新增：直接触发语音预加载 =====
        preloadVoice(text);
        closeModal();
    }
    // ========== 挂载全局函数（给HTML onclick调用）==========
    window.openPracticeBank = openModal;
    window.closePracticeBank = closeModal;
    window.toggleModule = toggleModule;
    window.selectUnit = selectUnit;
    window.selectAllUnitsInModule = selectAllUnitsInModule;
    window.selectPractice = selectPractice;
    // ========== DOM加载完成后初始化弹窗 ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();