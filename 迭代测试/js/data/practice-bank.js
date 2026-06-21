// js/data/practice-bank.js
// 内置题库主文件 - 结构定义 + 工具方法
// 修复：grade 参数自动转换，支持数字和字符串两种格式

(function() {
    'use strict';

    // ========== 题库根结构 ==========
    const practiceBank = {
        // 学段：小学
        primary: {
            name: '小学',
            // 版本
            versions: {
                // 广州版（教科版）
                guangzhou: {
                    name: '广州版',
                    // 年级
                    grades: {
                        // 示例结构，实际数据由各模块文件注册
                        // grade5: {
                        //     name: '五年级',
                        //     volumes: {
                        //         upper: { name: '上册', modules: [] },
                        //         lower: { name: '下册', modules: [] }
                        //     }
                        // }
                    }
                }
                // 以后可加：renjiao（人教版）、waiyan（外研版）等
            }
        }
        // 以后可加：junior（初中）、senior（高中）等
    };

    // ========== 工具方法 ==========

    /**
     * 获取模块列表
     * @param {string} stage - 学段：primary（小学）
     * @param {number|string} grade - 年级：5 或 'grade5'
     * @param {string} volume - 册别：upper（上册）/ lower（下册）
     * @param {string} version - 版本：guangzhou（广州版）
     * @returns {Array} 模块列表
     */
    function getModules(stage, grade, volume, version) {
        const gradeKey = formatGradeKey(grade);
        
        try {
            return practiceBank[stage]
                .versions[version]
                .grades[gradeKey]
                .volumes[volume]
                .modules || [];
        } catch (e) {
            console.warn('practiceBank.getModules 查找失败:', e.message);
            return [];
        }
    }

    /**
     * 获取单元内容
     * @param {string} stage - 学段
     * @param {number|string} grade - 年级
     * @param {string} volume - 册别
     * @param {string} moduleId - 模块ID
     * @param {string} unitId - 单元ID
     * @param {string} version - 版本
     * @returns {Object|null} 单元内容
     */
    function getUnitContent(stage, grade, volume, moduleId, unitId, version) {
        const modules = getModules(stage, grade, volume, version);
        const module = modules.find(m => m.id === moduleId);
        if (!module) return null;
        
        const unit = module.units.find(u => u.id === unitId);
        return unit ? unit.content : null;
    }

    /**
     * 获取纯文本内容（用于填充到练习框）
     * @param {Object} content - 单元内容对象
     * @param {string} type - 类型：words/phrases/sentences/dialogue
     * @param {boolean} withCn - 是否包含中文
     * @returns {string} 纯文本
     */
    function getPlainText(content, type, withCn) {
        if (!content || !content[type]) return '';

        const items = content[type];
        let lines = [];

        if (type === 'dialogue') {
            // 对话类型：统一数组格式
            items.forEach(item => {
                if (item.speaker) {
                    // 人物对话
                    if (withCn !== false) {
                        lines.push(`${item.speaker}: ${item.en}`);
                        lines.push(item.cn);
                    } else {
                        lines.push(`${item.speaker}: ${item.en}`);
                    }
                } else {
                    // 叙述句
                    if (withCn !== false) {
                        lines.push(item.en);
                        lines.push(item.cn);
                    } else {
                        lines.push(item.en);
                    }
                }
                lines.push(''); // 空行分隔
            });
        } else {
            // 单词/短语/句型
            items.forEach(item => {
                if (withCn && item.cn) {
                    lines.push(`${item.en} ${item.cn}`);
                } else {
                    lines.push(item.en);
                }
            });
        }

        return lines.join('\n').trim();
    }

    /**
     * 格式化年级 key：数字 5 → 'grade5'，字符串 'grade5' → 'grade5'
     */
    function formatGradeKey(grade) {
        if (typeof grade === 'number') {
            return 'grade' + grade;
        }
        return grade;
    }

    // ========== 暴露到全局 ==========
    practiceBank.getModules = getModules;
    practiceBank.getUnitContent = getUnitContent;
    practiceBank.getPlainText = getPlainText;

    window.practiceBank = practiceBank;

})();