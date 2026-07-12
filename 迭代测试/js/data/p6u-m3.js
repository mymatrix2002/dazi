// js/data/p6u-m3.js
// 六年级上册 Module 3 - 健康
// 内容数据文件（懒加载用，严格匹配教材图片内容）
(function() {
    'use strict';
    
    // 模块内容数据
    const moduleContent = {
        'u5': {
            // 单词（完全匹配教材单词表）
            words: [
                { en: 'matter', cn: '事情；问题' },
                { en: 'wrong', cn: '有毛病的；错误的' },
                { en: 'feel', cn: '感觉' },
                { en: 'ill', cn: '生病的' },
                { en: 'bad', cn: '坏的；严重的' },
                { en: 'cold', cn: '感冒' },
                { en: 'fever', cn: '发烧' },
                { en: 'headache', cn: '头痛' },
                { en: 'stomachache', cn: '肚子痛；胃痛' },
                { en: 'toothache', cn: '牙痛' },
                { en: 'hurt', cn: '疼痛；受伤' },
                { en: 'doctor', cn: '医生' },
                { en: 'see a doctor', cn: '看医生' },
                { en: 'rest', cn: '休息' },
                { en: 'medicine', cn: '药' },
                { en: 'take medicine', cn: '吃药' },
                { en: 'plenty', cn: '大量；充足' },
                { en: 'water', cn: '水' },
                { en: 'drink', cn: '喝' },
                { en: 'better', cn: '更好的' },
                { en: 'soon', cn: '很快；不久' }
            ],
            // 短语（教材原文）
            phrases: [
                { en: 'What\'s the matter?', cn: '怎么了？' },
                { en: 'What\'s wrong with you?', cn: '你怎么了？' },
                { en: 'feel ill', cn: '感觉不舒服' },
                { en: 'have a cold', cn: '感冒' },
                { en: 'have a fever', cn: '发烧' },
                { en: 'have a headache', cn: '头痛' },
                { en: 'have a stomachache', cn: '肚子痛' },
                { en: 'have a toothache', cn: '牙痛' },
                { en: 'see a doctor', cn: '看医生' },
                { en: 'have a good rest', cn: '好好休息' },
                { en: 'take some medicine', cn: '吃点药' },
                { en: 'drink plenty of water', cn: '喝大量的水' }
            ],
            // 句型（教材原文）
            sentences: [
                { en: 'What\'s the matter with you?', cn: '你怎么了？' },
                { en: 'I don\'t feel very well. I feel ill.', cn: '我感觉不太舒服，我生病了。' },
                { en: 'I have a bad cold and a fever.', cn: '我得了重感冒，还发烧。' },
                { en: 'I have a headache and my throat hurts.', cn: '我头痛，喉咙也疼。' },
                { en: 'You should see a doctor.', cn: '你应该去看医生。' },
                { en: 'Take this medicine three times a day.', cn: '这个药一天吃三次。' },
                { en: 'Stay in bed and have a good rest.', cn: '卧床好好休息。' },
                { en: 'Drink plenty of water and you will be better soon.', cn: '多喝水，你很快就会好的。' }
            ],
            // 课文对话（教材原文：Jiamin看医生）
            dialogue: [
                { en: 'Jiamin doesn\'t feel well. He goes to see the doctor with his mum.', cn: '家民感觉不舒服，他和妈妈去看医生。' },
                { speaker: 'Doctor', en: 'Good morning, young man. What\'s the matter with you?', cn: '早上好，小朋友，你怎么了？' },
                { speaker: 'Jiamin', en: 'I don\'t feel well, Doctor. I feel very tired, and I have a bad headache.', cn: '医生，我感觉不舒服，我很累，头很疼。' },
                { speaker: 'Doctor', en: 'Let me check. Oh, you have a fever. Do you have a sore throat?', cn: '我看看，哦，你发烧了，喉咙疼吗？' },
                { speaker: 'Jiamin', en: 'Yes, I do. And I have a stomachache too.', cn: '疼，我肚子也疼。' },
                { speaker: 'Doctor', en: 'Don\'t worry. You just have a bad cold. Take this medicine three times a day.', cn: '别担心，你只是得了重感冒，这个药一天吃三次。' },
                { speaker: 'Doctor', en: 'Stay in bed, have a good rest and drink plenty of water. You will be better soon.', cn: '卧床好好休息，多喝水，你很快就会好的。' },
                { speaker: 'Jiamin', en: 'Thank you, Doctor.', cn: '谢谢医生。' }
            ]
        },
        'u6': {
            // 单词（完全匹配教材单词表）
            words: [
                { en: 'secret', cn: '秘密' },
                { en: 'health', cn: '健康' },
                { en: 'healthy', cn: '健康的' },
                { en: 'keep', cn: '保持' },
                { en: 'stay', cn: '保持' },
                { en: 'exercise', cn: '锻炼；运动' },
                { en: 'walk', cn: '走路；散步' },
                { en: 'run', cn: '跑' },
                { en: 'swim', cn: '游泳' },
                { en: 'enough', cn: '足够的' },
                { en: 'sleep', cn: '睡眠；睡觉' },
                { en: 'hour', cn: '小时' },
                { en: 'wash', cn: '洗' },
                { en: 'hand', cn: '手' },
                { en: 'face', cn: '脸' },
                { en: 'before', cn: '在……之前' },
                { en: 'after', cn: '在……之后' },
                { en: 'meal', cn: '一餐；饭' },
                { en: 'fruit', cn: '水果' },
                { en: 'vegetable', cn: '蔬菜' },
                { en: 'junk food', cn: '垃圾食品' },
                { en: 'happy', cn: '开心的' },
                { en: 'smile', cn: '微笑' }
            ],
            // 短语（教材原文）
            phrases: [
                { en: 'the secret to good health', cn: '健康的秘诀' },
                { en: 'keep healthy', cn: '保持健康' },
                { en: 'get enough sleep', cn: '获得充足睡眠' },
                { en: 'at least', cn: '至少' },
                { en: '8 hours a night', cn: '每晚8小时' },
                { en: 'plenty of exercise', cn: '充足的锻炼' },
                { en: 'wash your hands', cn: '洗手' },
                { en: 'before meals', cn: '饭前' },
                { en: 'after using the toilet', cn: '上完厕所后' },
                { en: 'eat more vegetables and fruit', cn: '多吃蔬菜水果' },
                { en: 'too much junk food', cn: '太多垃圾食品' },
                { en: 'stay happy', cn: '保持开心' }
            ],
            // 句型（教材原文）
            sentences: [
                { en: 'Do you want to know the secret to good health?', cn: '你想知道健康的秘诀吗？' },
                { en: 'First, get enough sleep every night. You should sleep for at least 8 hours.', cn: '第一，每晚保证充足睡眠，你应该至少睡8小时。' },
                { en: 'Second, get plenty of exercise. You can walk, run, swim or play sports.', cn: '第二，多锻炼，你可以走路、跑步、游泳或者做运动。' },
                { en: 'Third, keep clean. Wash your hands before meals and after using the toilet.', cn: '第三，保持干净，饭前便后要洗手。' },
                { en: 'Fourth, eat healthy food. Eat more vegetables and fruit. Don\'t eat too much junk food.', cn: '第四，吃健康的食物，多吃蔬菜水果，不要吃太多垃圾食品。' },
                { en: 'Last, stay happy. Smile every day and don\'t worry too much.', cn: '最后，保持开心，每天微笑，不要太焦虑。' },
                { en: 'If you follow these rules, you will stay healthy and strong.', cn: '如果你遵守这些规则，你就会保持健康强壮。' }
            ],
            // 课文（教材原文：健康四秘诀）
            dialogue: [
                { en: 'Everyone wants to be healthy. Do you know the secret to good health?', cn: '每个人都想健康，你知道健康的秘诀吗？' },
                { en: 'First, you need to get enough sleep. You should sleep for at least 8 hours every night. Go to bed early and don\'t stay up late.', cn: '第一，你需要充足的睡眠，每晚至少睡8小时，早睡不要熬夜。' },
                { en: 'Second, get plenty of exercise. You can walk to school, run in the morning, swim or play ball games with your friends. Exercise makes you strong.', cn: '第二，多锻炼，你可以走路上学、晨跑、游泳或者和朋友打球，运动让你强壮。' },
                { en: 'Third, keep yourself clean. Wash your hands before meals and after using the toilet. Take a shower every day and wear clean clothes.', cn: '第三，保持个人卫生，饭前便后洗手，每天洗澡，穿干净的衣服。' },
                { en: 'Fourth, eat healthy food. Eat more vegetables and fruit. Drink plenty of water. Don\'t eat too much candy or junk food.', cn: '第四，吃健康的食物，多吃蔬菜水果，多喝水，不要吃太多糖或者垃圾食品。' },
                { en: 'Finally, stay happy. Smile every day and try to be a happy person. Happiness is the best medicine.', cn: '最后，保持开心，每天微笑，努力做一个开心的人，开心是最好的药。' },
                { en: 'Follow these rules, and you will stay healthy and have a happy life.', cn: '遵守这些规则，你就会保持健康，拥有快乐的生活。' }
            ]
        }
    };
    
    // 注册模块到题库
    if (window.practiceBank && window.practiceBank.registerModuleContent) {
        window.practiceBank.registerModuleContent('p6u', 'm3', moduleContent);
    }
})();