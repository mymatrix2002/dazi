// js/data/practice-bank.js
// 内置练习题库 - 主文件
// 支持多版本教材（广州版、人教版等）

// 全局题库对象
const practiceBank = {
    // 当前默认版本
    defaultVersion: 'guangzhou',

    // ========== 学段 ==========
    primary: {
        name: '小学',
        versions: {
            // 广州版（教科版）
            guangzhou: {
                name: '广州版',
                fullName: '广州教育版（教科版）',
                grades: {}
            }
            // 未来可以加：
            // renjiao: { name: '人教版', grades: {} }
            // waiyan: { name: '外研版', grades: {} }
        }
    },

    // 预留初中
    junior: {
        name: '初中',
        versions: {}
    },

    // 预留高中
    senior: {
        name: '高中',
        versions: {}
    },

    // ========== 工具方法 ==========

    /**
     * 获取指定版本的数据
     */
    getVersionData: function(stage, version) {
        try {
            const stageData = this[stage];
            if (!stageData || !stageData.versions) return null;
            
            const ver = version || this.defaultVersion;
            return stageData.versions[ver] || null;
        } catch (e) {
            console.error('获取版本数据失败:', e);
            return null;
        }
    },

    /**
     * 获取指定年级和册别的所有模块
     * @param {string} stage - 学段：primary/junior/senior
     * @param {number} grade - 年级：5/6...
     * @param {string} volume - 册别：upper/lower
     * @param {string} version - 版本：guangzhou/renjiao...（可选，默认广州版）
     * @returns {Array} 模块列表
     */
    getModules: function(stage, grade, volume, version) {
        try {
            const verData = this.getVersionData(stage, version);
            if (!verData) return [];
            
            const gradeData = verData.grades['grade' + grade];
            if (!gradeData) return [];
            
            const volumeData = gradeData.volumes[volume];
            if (!volumeData) return [];
            
            return volumeData.modules || [];
        } catch (e) {
            console.error('获取模块列表失败:', e);
            return [];
        }
    },

    /**
     * 获取指定单元的内容
     */
    getUnitContent: function(stage, grade, volume, moduleId, unitId, version) {
        try {
            const modules = this.getModules(stage, grade, volume, version);
            const module = modules.find(m => m.id === moduleId);
            if (!module) return null;
            
            const unit = module.units.find(u => u.id === unitId);
            if (!unit) return null;
            
            return unit.content || null;
        } catch (e) {
            console.error('获取单元内容失败:', e);
            return null;
        }
    },

    /**
     * 获取练习内容的纯文本
     * @param {Object} content - 单元内容对象
     * @param {string} type - 类型：words/phrases/sentences/dialogue
     * @param {boolean} withCn - 是否包含中文
     * @returns {string} 纯文本内容
     */
    getPlainText: function(content, type, withCn) {
        try {
            if (!content || !content[type]) return '';
            
            const items = content[type];
            
            // 对话类型特殊处理
            if (type === 'dialogue') {
                if (withCn && items[0] && items[0].cn) {
                    return items[0].cn;
                }
                return items[0] ? items[0].en : '';
            }
            
            // 单词、短语、句型
            return items.map(item => {
                if (withCn && item.cn) {
                    return item.en + '  ' + item.cn;
                }
                return item.en;
            }).join('\n');
            
        } catch (e) {
            console.error('获取纯文本失败:', e);
            return '';
        }
    }
};

// 暴露给全局
window.practiceBank = practiceBank;
