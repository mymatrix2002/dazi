// js/data/p4l-m2.js
// 四年级下册 Module 2: Daily routine
(function() {
    'use strict';

    const moduleContent = {
        'u3': {
            words: [
                { en: 'time', cn: '时间' },
                { en: 'get up', cn: '起床' },
                { en: 'go to bed', cn: '睡觉' },
                { en: 'breakfast', cn: '早餐' },
                { en: 'lunch', cn: '午餐' },
                { en: 'dinner', cn: '晚餐' },
                { en: 'morning', cn: '早上' },
                { en: 'afternoon', cn: '下午' },
                { en: 'evening', cn: '晚上' },
                { en: 'night', cn: '夜晚' },
                { en: 'o\'clock', cn: '点钟' },
                { en: 'half past', cn: '半点' },
                { en: 'quarter', cn: '一刻钟' },
                { en: 'usually', cn: '通常' },
                { en: 'always', cn: '总是' },
                { en: 'sometimes', cn: '有时候' }
            ],
            phrases: [
                { en: 'it\'s time to get up', cn: '该起床了' },
                { en: 'at seven o\'clock', cn: '在七点钟' },
                { en: 'half past six', cn: '六点半' },
                { en: 'have breakfast', cn: '吃早餐' },
                { en: 'go to school', cn: '去上学' },
                { en: 'in the morning', cn: '在早上' },
                { en: 'in the evening', cn: '在晚上' },
                { en: 'at night', cn: '在夜晚' }
            ],
            sentences: [
                { en: 'It\'s time to get up.', cn: '该起床了。' },
                { en: 'I usually get up at seven o\'clock.', cn: '我通常七点钟起床。' },
                { en: 'I have breakfast at half past seven.', cn: '我七点半吃早餐。' },
                { en: 'I go to school at eight o\'clock.', cn: '我八点钟去上学。' },
                { en: 'What time is it?', cn: '几点了？' },
                { en: 'It\'s nine o\'clock.', cn: '九点钟了。' },
                { en: 'It\'s time for class.', cn: '该上课了。' },
                { en: 'I go to bed at ten o\'clock.', cn: '我十点钟睡觉。' }
            ],
            dialogue: [
                { speaker: 'Mum', en: 'Jiamin, get up! It\'s time to get up.', cn: '家民，起床了！该起床了。' },
                { speaker: 'Jiamin', en: 'What time is it, Mum?', cn: '妈妈，几点了？' },
                { speaker: 'Mum', en: 'It\'s seven o\'clock.', cn: '七点钟了。' },
                { speaker: 'Jiamin', en: 'Oh no! I\'m late.', cn: '哦不！我迟到了。' },
                { speaker: 'Mum', en: 'Don\'t worry. Breakfast is ready.', cn: '别担心。早餐准备好了。' },
                { speaker: 'Jiamin', en: 'What time do we have breakfast?', cn: '我们几点吃早餐？' },
                { speaker: 'Mum', en: 'At half past seven. You have time.', cn: '七点半。你还有时间。' },
                { speaker: 'Jiamin', en: 'OK. I\'ll get up now.', cn: '好的。我现在就起床。' },
                { speaker: 'Mum', en: 'Good boy. Wash your face first.', cn: '好孩子。先洗洗脸。' }
            ]
        },
        'u4': {
            words: [
                { en: 'when', cn: '什么时候' },
                { en: 'class', cn: '课' },
                { en: 'start', cn: '开始' },
                { en: 'finish', cn: '结束' },
                { en: 'school', cn: '学校' },
                { en: 'home', cn: '家' },
                { en: 'homework', cn: '家庭作业' },
                { en: 'read', cn: '阅读' },
                { en: 'watch TV', cn: '看电视' },
                { en: 'play', cn: '玩' },
                { en: 'study', cn: '学习' },
                { en: 'sleep', cn: '睡觉' },
                { en: 'early', cn: '早的' },
                { en: 'late', cn: '晚的' },
                { en: 'timetable', cn: '时间表' },
                { en: 'schedule', cn: '日程表' }
            ],
            phrases: [
                { en: 'when do you have class', cn: '你什么时候上课' },
                { en: 'start at eight', cn: '八点开始' },
                { en: 'finish at four', cn: '四点结束' },
                { en: 'go home', cn: '回家' },
                { en: 'do my homework', cn: '做我的家庭作业' },
                { en: 'watch TV', cn: '看电视' },
                { en: 'read books', cn: '读书' },
                { en: 'go to bed early', cn: '早早上床睡觉' }
            ],
            sentences: [
                { en: 'When do you have class?', cn: '你什么时候上课？' },
                { en: 'We start class at eight o\'clock.', cn: '我们八点钟开始上课。' },
                { en: 'School finishes at four thirty.', cn: '学校四点半放学。' },
                { en: 'I go home at five o\'clock.', cn: '我五点钟回家。' },
                { en: 'I do my homework after school.', cn: '我放学后做家庭作业。' },
                { en: 'I sometimes watch TV in the evening.', cn: '我有时候晚上看电视。' },
                { en: 'I read books before bed.', cn: '我睡前读书。' },
                { en: 'I go to bed early.', cn: '我早早上床睡觉。' }
            ],
            dialogue: [
                { speaker: 'Janet', en: 'Jiamin, when do you have class?', cn: '家民，你什么时候上课？' },
                { speaker: 'Jiamin', en: 'We start class at eight o\'clock in the morning.', cn: '我们早上八点钟开始上课。' },
                { speaker: 'Janet', en: 'When does school finish?', cn: '学校什么时候放学？' },
                { speaker: 'Jiamin', en: 'School finishes at four thirty in the afternoon.', cn: '下午四点半放学。' },
                { speaker: 'Janet', en: 'What do you do after school?', cn: '你放学后做什么？' },
                { speaker: 'Jiamin', en: 'I usually do my homework first.', cn: '我通常先做家庭作业。' },
                { speaker: 'Janet', en: 'Do you watch TV?', cn: '你看电视吗？' },
                { speaker: 'Jiamin', en: 'Sometimes. But I usually read books.', cn: '有时候。但我通常读书。' },
                { speaker: 'Janet', en: 'When do you go to bed?', cn: '你什么时候睡觉？' },
                { speaker: 'Jiamin', en: 'I go to bed at half past nine. I go to bed early.', cn: '我九点半睡觉。我睡得早。' }
            ]
        }
    };

    if (window.practiceBank && window.practiceBank.registerModuleContent) {
        window.practiceBank.registerModuleContent('p4l', 'm2', moduleContent);
    }
})();
