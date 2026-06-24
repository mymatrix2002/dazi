// js/data/practice-bank.js
// 内置题库主文件 - 元数据 + 工具方法 + 懒加载注册机制
(function() {
    'use strict';

    // ========== 题库根结构（元数据）==========
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
                        // 五年级
                        grade5: {
                            name: '五年级',
                            volumes: {
                                // 上册
                                upper: {
                                    name: '上册',
                                    modules: [
                                        {
                                            id: 'm1',
                                            name: 'Module 1 Hobbies',
                                            nameCn: '爱好',
                                            units: [
                                                { id: 'u1', name: 'Unit 1 What\'s your hobby?', nameCn: '你的爱好是什么？', difficulty: 2 },
                                                { id: 'u2', name: 'Unit 2 His hobby is drawing', nameCn: '他的爱好是画画', difficulty: 2 }
                                            ]
                                        },
                                        {
                                            id: 'm2',
                                            name: 'Module 2 Abilities',
                                            nameCn: '能力',
                                            units: [
                                                { id: 'u3', name: 'Unit 3 I can swim very fast', nameCn: '我游泳游得很快', difficulty: 2 },
                                                { id: 'u4', name: 'Unit 4 Can you do my homework?', nameCn: '你能做我的作业吗？', difficulty: 2 }
                                            ]
                                        },
                                        {
                                            id: 'm3',
                                            name: 'Module 3 Daily life',
                                            nameCn: '日常生活',
                                            units: [
                                                { id: 'u5', name: 'Unit 5 Where is Ben?', nameCn: '本在哪里？', difficulty: 2 },
                                                { id: 'u6', name: 'Unit 6 At the weekend', nameCn: '在周末', difficulty: 2 }
                                            ]
                                        },
                                        {
                                            id: 'm4',
                                            name: 'Module 4 Foods and drinks',
                                            nameCn: '饮食',
                                            units: [
                                                { id: 'u7', name: 'Unit 7 Do you want coffee or tea?', nameCn: '你想要咖啡还是茶？', difficulty: 2 },
                                                { id: 'u8', name: 'Unit 8 Let\'s have both', nameCn: '我们两个都要吧', difficulty: 2 }
                                            ]
                                        },
                                        {
                                            id: 'm5',
                                            name: 'Module 5 Foods we need',
                                            nameCn: '食物',
                                            units: [
                                                { id: 'u9', name: 'Unit 9 It smells delicious', nameCn: '闻起来很香', difficulty: 2 },
                                                { id: 'u10', name: 'Unit 10 Different tastes', nameCn: '不同的味道', difficulty: 2 }
                                            ]
                                        },
                                        {
                                            id: 'm6',
                                            name: 'Module 6 Weather',
                                            nameCn: '天气',
                                            units: [
                                                { id: 'u11', name: 'Unit 11 What\'s the weather like today?', nameCn: '今天天气怎么样？', difficulty: 2 },
                                                { id: 'u12', name: 'Unit 12 Four seasons in one day', nameCn: '一天四季', difficulty: 2 }
                                            ]
                                        }
                                    ]
                                },
                                // 下册
                                lower: {
                                    name: '下册',
                                    modules: [
                                        {
                                            id: 'm1',
                                            name: 'Module 1 Seasons',
                                            nameCn: '季节',
                                            units: [
                                                { id: 'u1', name: 'Unit 1 What\'s your favourite season?', nameCn: '你最喜欢的季节是什么？', difficulty: 2 },
                                                { id: 'u2', name: 'Unit 2 It\'s the middle of winter', nameCn: '现在是隆冬时节', difficulty: 2 }
                                            ]
                                        },
                                        {
                                            id: 'm2',
                                            name: 'Module 2 Plans',
                                            nameCn: '计划',
                                            units: [
                                                { id: 'u3', name: 'Unit 3 We are going to have an English test', nameCn: '我们将要进行英语测试', difficulty: 2 },
                                                { id: 'u4', name: 'Unit 4 Have a good time in Hainan', nameCn: '在海南玩得开心', difficulty: 2 }
                                            ]
                                        },
                                        {
                                            id: 'm3',
                                            name: 'Module 3 Invitations',
                                            nameCn: '邀请',
                                            units: [
                                                { id: 'u5', name: 'Unit 5 Would you like to go with us?', nameCn: '你愿意和我们一起去吗？', difficulty: 3 },
                                                { id: 'u6', name: 'Unit 6 See you at the party', nameCn: '聚会上见', difficulty: 3 }
                                            ]
                                        },
                                        {
                                            id: 'm4',
                                            name: 'Module 4 Travel',
                                            nameCn: '旅行',
                                            units: [
                                                { id: 'u7', name: 'Unit 7 We will go by train', nameCn: '我们将坐火车去', difficulty: 2 },
                                                { id: 'u8', name: 'Unit 8 Ben\'s first trip to Beijing', nameCn: '本的第一次北京之旅', difficulty: 2 }
                                            ]
                                        },
                                        {
                                            id: 'm5',
                                            name: 'Module 5 Safety',
                                            nameCn: '安全',
                                            units: [
                                                { id: 'u9', name: 'Unit 9 Be careful!', nameCn: '小心！', difficulty: 2 },
                                                { id: 'u10', name: 'Unit 10 How to stay safe', nameCn: '如何保持安全', difficulty: 2 }
                                            ]
                                        },
                                        {
                                            id: 'm6',
                                            name: 'Module 6 Directions',
                                            nameCn: '方向',
                                            units: [
                                                { id: 'u11', name: 'Unit 11 Can you tell me the way?', nameCn: '你能告诉我怎么走吗？', difficulty: 2 },
                                                { id: 'u12', name: 'Unit 12 I know a short cut', nameCn: '我知道一条近路', difficulty: 2 }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
                // 以后可加：renjiao（人教版）、waiyan（外研版）等
            }
        }
        // 以后可加：junior（初中）、senior（高中）等
    };

    // ========== 模块内容缓存（懒加载）==========
    const moduleContents = {}; // 已加载的模块内容
    const loadingModules = {}; // 正在加载中的模块 Promise

    // ========== 生成模块文件名 ==========
    function getModuleFileName(prefix, moduleId) {
        return prefix + '-' + moduleId + '.js';
    }

    // ========== 生成前缀（如 p5l、p5u）==========
    function getPrefix(stage, grade, volume) {
        const stageShort = stage === 'primary' ? 'p' : 'j';
        const gradeNum = typeof grade === 'number' ? grade : parseInt(grade.replace('grade', ''));
        const volumeShort = volume === 'upper' ? 'u' : 'l';
        return stageShort + gradeNum + volumeShort;
    }

    // ========== 注册模块内容（模块文件调用）==========
    function registerModuleContent(prefix, moduleId, content) {
        const key = prefix + '-' + moduleId;
        moduleContents[key] = content;
    }

    // ========== 动态加载模块内容 ==========
    function loadModuleContent(stage, grade, volume, moduleId) {
        const prefix = getPrefix(stage, grade, volume);
        const key = prefix + '-' + moduleId;

        // 已经加载过了，直接返回
        if (moduleContents[key]) {
            return Promise.resolve(moduleContents[key]);
        }

        // 正在加载中，返回同一个 Promise
        if (loadingModules[key]) {
            return loadingModules[key];
        }

        // 开始加载
        const promise = new Promise((resolve, reject) => {
            const fileName = getModuleFileName(prefix, moduleId);
            const script = document.createElement('script');
            script.src = 'js/data/' + fileName;

            script.onload = () => {
                delete loadingModules[key];
                if (moduleContents[key]) {
                    resolve(moduleContents[key]);
                } else {
                    reject(new Error('模块加载失败: ' + fileName));
                }
            };

            script.onerror = () => {
                delete loadingModules[key];
                reject(new Error('模块加载失败: ' + fileName));
            };

            document.head.appendChild(script);
        });

        loadingModules[key] = promise;
        return promise;
    }

    // ========== 工具方法 ==========

    /**
     * 获取模块列表
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
     * 获取单元内容（同步，需要先加载模块）
     */
    function getUnitContent(stage, grade, volume, moduleId, unitId, version) {
        const prefix = getPrefix(stage, grade, volume);
        const key = prefix + '-' + moduleId;

        const moduleContent = moduleContents[key];
        if (!moduleContent) return null;

        return moduleContent[unitId] || null;
    }

    /**
     * 获取模块全部内容（同步，需要先加载模块）
     */
    function getModuleFullContent(stage, grade, volume, moduleId, version) {
        const prefix = getPrefix(stage, grade, volume);
        const key = prefix + '-' + moduleId;
        return moduleContents[key] || null;
    }

    /**
     * 获取纯文本内容
     */
    function getPlainText(content, type, withCn) {
        if (!content || !content[type]) return '';

        const items = content[type];
        let lines = [];

        if (type === 'dialogue') {
            items.forEach(item => {
                if (item.speaker) {
                    if (withCn !== false) {
                        lines.push(item.speaker + ': ' + item.en);
                        lines.push(item.cn);
                    } else {
                        lines.push(item.speaker + ': ' + item.en);
                    }
                } else {
                    if (withCn !== false) {
                        lines.push(item.en);
                        lines.push(item.cn);
                    } else {
                        lines.push(item.en);
                    }
                }
                lines.push('');
            });
        } else {
            items.forEach(item => {
                if (withCn && item.cn) {
                    lines.push(item.en + ' ' + item.cn);
                } else {
                    lines.push(item.en);
                }
            });
        }

        return lines.join('\n').trim();
    }

    /**
     * 格式化年级 key
     */
    function formatGradeKey(grade) {
        if (typeof grade === 'number') {
            return 'grade' + grade;
        }
        return grade;
    }

    /**
     * 检查模块是否已加载
     */
    function isModuleLoaded(stage, grade, volume, moduleId) {
        const prefix = getPrefix(stage, grade, volume);
        const key = prefix + '-' + moduleId;
        return !!moduleContents[key];
    }

    // ========== 暴露到全局 ==========
    practiceBank.getModules = getModules;
    practiceBank.getUnitContent = getUnitContent;
    practiceBank.getModuleFullContent = getModuleFullContent;
    practiceBank.getPlainText = getPlainText;
    practiceBank.registerModuleContent = registerModuleContent;
    practiceBank.loadModule = loadModuleContent;
    practiceBank.isModuleLoaded = isModuleLoaded;

    window.practiceBank = practiceBank;

})();
