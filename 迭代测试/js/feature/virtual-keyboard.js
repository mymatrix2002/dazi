// js/feature/virtual-keyboard.js 完整代码
// 虚拟键盘功能模块

(function() {
    'use strict';
    
    // ========== 内部变量 ==========
    let isEnabled = false;
    let isShiftActive = false;
    let isNumberMode = false;
    let keyboardEl = null;
    let currentHighlightKey = null;
    
    // ========== 键盘布局定义 ==========
    const LETTER_LAYOUT = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
        ['num', 'space', 'enter']
    ];
    
    const NUMBER_LAYOUT = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['-', '/', ':', '?', '!', '@', '#', '$', '%', '&'],
        ['shift', '"', "'", '(', ')', '*', '+', ',', '.', 'backspace'],
        ['abc', 'space', 'enter']
    ];
    
    // ========== 初始化 ==========
    function init() {
        // 手机端不显示虚拟键盘（宽度 <= 768px）
        if (window.innerWidth <= 768) {
            return;
        }
        
        // 从本地存储读取设置
        const saved = localStorage.getItem('virtualKeyboardEnabled');
        isEnabled = saved === 'true';
        
        // 创建键盘容器
        createKeyboard();
        
        // 根据设置显示/隐藏
        if (isEnabled) {
            show();
        }
    }
    
    // ========== 创建键盘DOM ==========
    function createKeyboard() {
        keyboardEl = document.createElement('div');
        keyboardEl.className = 'virtual-keyboard';
        keyboardEl.id = 'virtualKeyboard';
        
        // 键盘头部（收起按钮）
        const header = document.createElement('div');
        header.className = 'vk-header';
        const closeBtn = document.createElement('button');
        closeBtn.className = 'vk-close-btn';
        closeBtn.textContent = '收起键盘';
        closeBtn.addEventListener('click', () => toggle());
        header.appendChild(closeBtn);
        keyboardEl.appendChild(header);
        
        // 键盘按键区域
        const keysContainer = document.createElement('div');
        keysContainer.className = 'vk-keys-container';
        keyboardEl.appendChild(keysContainer);
        
        // 渲染按键
        renderKeys();
        
        // 添加到页面
        document.body.appendChild(keyboardEl);
    }
    
    // ========== 安全查找按键（避免特殊字符导致选择器报错） ==========
    function findKeyByChar(char) {
        if (!keyboardEl) return null;
        const keys = keyboardEl.querySelectorAll('.vk-key');
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].dataset.key === char) {
                return keys[i];
            }
        }
        return null;
    }
    
    // ========== 渲染按键 ==========
    function renderKeys() {
        const container = keyboardEl.querySelector('.vk-keys-container');
        if (!container) return;
        container.innerHTML = '';
        
        const layout = isNumberMode ? NUMBER_LAYOUT : LETTER_LAYOUT;
        
        layout.forEach((row, rowIndex) => {
            const rowEl = document.createElement('div');
            rowEl.className = 'vk-row';
            rowEl.dataset.row = rowIndex;
            
            row.forEach(key => {
                const keyEl = document.createElement('button');
                keyEl.className = 'vk-key';
                keyEl.dataset.key = key;
                keyEl.type = 'button';
                
                // 设置按键显示内容
                switch(key) {
                    case 'shift':
                        keyEl.textContent = '⇧';
                        keyEl.classList.add('vk-key-wide');
                        if (isShiftActive) keyEl.classList.add('vk-shift-active');
                        break;
                    case 'backspace':
                        keyEl.textContent = '⌫';
                        keyEl.classList.add('vk-key-wide');
                        break;
                    case 'space':
                        keyEl.textContent = '空格';
                        keyEl.classList.add('vk-key-space');
                        break;
                    case 'enter':
                        keyEl.textContent = '回车';
                        keyEl.classList.add('vk-key-wide');
                        break;
                    case 'num':
                        keyEl.textContent = '123';
                        keyEl.classList.add('vk-key-wide');
                        break;
                    case 'abc':
                        keyEl.textContent = 'ABC';
                        keyEl.classList.add('vk-key-wide');
                        break;
                    default:
                        // 字母或数字
                        keyEl.textContent = isShiftActive ? key.toUpperCase() : key;
                }
                
                // 点击事件
                keyEl.addEventListener('click', (e) => {
                    e.preventDefault();
                    handleKeyPress(key, keyEl);
                });
                
                // 触摸事件（防止聚焦输入框）
                keyEl.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                });
                
                rowEl.appendChild(keyEl);
            });
            
            container.appendChild(rowEl);
        });
    }
    
    // ========== 处理按键点击 ==========
    function handleKeyPress(key, keyEl) {
        const inputArea = document.getElementById('inputArea');
        if (!inputArea) return;
        
        // 如果输入框是聚焦状态，先失焦，防止系统键盘弹出
        if (document.activeElement === inputArea) {
            inputArea.blur();
        }
        
        switch(key) {
            case 'shift':
                isShiftActive = !isShiftActive;
                renderKeys();
                return;
            case 'backspace':
                // 删除最后一个字符
                inputArea.value = inputArea.value.slice(0, -1);
                break;
            case 'space':
                inputArea.value += ' ';
                break;
            case 'enter':
                // 触发回车逻辑
                if (window.doHandleTypingEnter) {
                    window.doHandleTypingEnter();
                }
                // 回车强制重置键盘状态（切回字母、关闭shift）
                isNumberMode = false;
                isShiftActive = false;
                renderKeys();
                return;
            case 'num':
                isNumberMode = true;
                renderKeys();
                return;
            case 'abc':
                isNumberMode = false;
                renderKeys();
                return;
            default:
                // 普通字符
                const char = isShiftActive ? key.toUpperCase() : key;
                inputArea.value += char;
                // 单次shift输入后立刻关闭shift，防止常亮
                if (isShiftActive) {
                    isShiftActive = false;
                    renderKeys();
                }
        }
        
        // 手动触发 input 事件，让原有校验逻辑正常运行
        const inputEvent = new Event('input', { bubbles: true });
        inputArea.dispatchEvent(inputEvent);
        
        // ========== 输入符号后自动切回字母键盘 ==========
        if (isNumberMode) {
            setTimeout(() => {
                isNumberMode = false;
                renderKeys();
            }, 300);
        }
        
        // 按键按下反馈
        keyEl.classList.add('vk-pressed');
        setTimeout(() => {
            keyEl.classList.remove('vk-pressed');
        }, 150);
    }
    
    // ========== 更新高亮按键（指法引导） ==========
    function updateHighlight(nextChar) {
        if (!isEnabled || !keyboardEl) return;
        
        // 清除之前的高亮
        if (currentHighlightKey) {
            currentHighlightKey.classList.remove('vk-highlight');
            currentHighlightKey = null;
        }
        
        if (!nextChar || nextChar === '') return;
        
        // 封装真正执行高亮的逻辑，方便布局切换后延迟调用
        function doHighlightLogic(char) {
            // 空格特殊处理
            if (char === ' ') {
                const spaceKey = findKeyByChar('space');
                if (spaceKey) {
                    spaceKey.classList.add('vk-highlight');
                    currentHighlightKey = spaceKey;
                }
                return;
            }
            
            // 换行特殊处理
            if (char === '\n' || char === '\r') {
                const enterKey = findKeyByChar('enter');
                if (enterKey) {
                    enterKey.classList.add('vk-highlight');
                    currentHighlightKey = enterKey;
                }
                return;
            }
            
            const charLower = char.toLowerCase();
            let keyEl = findKeyByChar(charLower);
            
            // 如果没找到，尝试在数字符号布局找
            if (!keyEl && !isNumberMode) {
                // 检查是否是数字或符号
                const isNumOrSymbol = /[0-9\-\/:?!@#$%&"'()*+,.]/.test(char);
                if (isNumOrSymbol) {
                    // 自动切换到数字布局
                    isNumberMode = true;
                    renderKeys();
                    keyEl = findKeyByChar(charLower);
                }
            }
            
            if (keyEl && !isNumberMode) {
                // ========== 自动同步 shift 状态（指法引导用） ==========
                const needShift = /[A-Z]/.test(char); // 大写字母需要shift
                if (needShift !== isShiftActive) {
                    isShiftActive = needShift;
                    renderKeys();
                    // 重新查找并高亮
                    const newKeyEl = findKeyByChar(charLower);
                    if (newKeyEl) {
                        newKeyEl.classList.add('vk-highlight');
                        currentHighlightKey = newKeyEl;
                    }
                    return;
                }
            }
            
            if (keyEl) {
                keyEl.classList.add('vk-highlight');
                currentHighlightKey = keyEl;
            }
        }
        
        // 如果当前是数字布局，先切回字母布局，渲染完再做高亮判断
        if (isNumberMode) {
            isNumberMode = false;
            renderKeys();
            // 延迟一帧保证DOM渲染完成
            setTimeout(() => doHighlightLogic(nextChar), 0);
        } else {
            doHighlightLogic(nextChar);
        }
    }
    
    // ========== 设置正确/错误反馈 ==========
    function setFeedback(isCorrect) {
        if (!currentHighlightKey) return;
        
        const keyEl = currentHighlightKey;
        const feedbackClass = isCorrect ? 'vk-correct' : 'vk-wrong';
        keyEl.classList.add(feedbackClass);
        
        setTimeout(() => {
            keyEl.classList.remove(feedbackClass);
        }, 300);
    }
    
    // ========== 重置键盘状态 ==========
    function reset() {
        // 清除高亮
        if (currentHighlightKey) {
            currentHighlightKey.classList.remove('vk-highlight');
            currentHighlightKey = null;
        }
        // 清除所有反馈状态
        if (keyboardEl) {
            const keys = keyboardEl.querySelectorAll('.vk-key');
            keys.forEach(key => {
                key.classList.remove('vk-correct', 'vk-wrong', 'vk-pressed');
            });
        }
        // 重置 shift 和数字模式，回到默认小写字母布局
        isShiftActive = false;
        isNumberMode = false;
        renderKeys();
    }
    
    // ========== 显示/隐藏切换 ==========
    function toggle() {
        if (isEnabled) {
            hide();
        } else {
            show();
        }
    }
    
    function show() {
        isEnabled = true;
        localStorage.setItem('virtualKeyboardEnabled', 'true');
        
        if (keyboardEl) {
            keyboardEl.classList.add('vk-show');
        }
        
        // 显示虚拟键盘时，禁用系统键盘
        const inputArea = document.getElementById('inputArea');
        if (inputArea) {
            inputArea.setAttribute('inputmode', 'none');
        }
        
        // 给 body 添加底部 padding，防止遮挡内容
        document.body.style.paddingBottom = '260px';
    }
    
    function hide() {
        isEnabled = false;
        localStorage.setItem('virtualKeyboardEnabled', 'false');
        
        if (keyboardEl) {
            keyboardEl.classList.remove('vk-show');
        }
        
        // 隐藏虚拟键盘时，恢复系统键盘
        const inputArea = document.getElementById('inputArea');
        if (inputArea) {
            inputArea.removeAttribute('inputmode');
        }
        
        // 恢复 body 底部 padding
        document.body.style.paddingBottom = '';
    }
    
    // ========== 对外接口 ==========
    window.virtualKeyboard = {
        init: init,
        updateHighlight: updateHighlight,
        setFeedback: setFeedback,
        toggle: toggle,
        show: show,
        hide: hide,
        reset: reset,
        isEnabled: function() { return isEnabled; }
    };
    
})();