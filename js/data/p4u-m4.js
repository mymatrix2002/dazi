// js/data/p4u-m4.js
// 四年级上册 Module 4: My class
(function() {
    'use strict';

    const moduleContent = {
        'u7': {
            words: [
                { en: 'star', cn: '星星' },
                { en: 'group', cn: '小组' },
                { en: 'each', cn: '每个' },
                { en: 'have', cn: '有' },
                { en: 'has', cn: '有（第三人称）' },
                { en: 'more', cn: '更多' },
                { en: 'less', cn: '更少' },
                { en: 'than', cn: '比' },
                { en: 'win', cn: '赢' },
                { en: 'lose', cn: '输' },
                { en: 'game', cn: '游戏' },
                { en: 'team', cn: '团队' },
                { en: 'point', cn: '分数' },
                { en: 'score', cn: '得分' },
                { en: 'best', cn: '最好的' },
                { en: 'great', cn: '很棒的' }
            ],
            phrases: [
                { en: 'how many stars', cn: '多少颗星星' },
                { en: 'each group', cn: '每个小组' },
                { en: 'Group One', cn: '第一组' },
                { en: 'Group Two', cn: '第二组' },
                { en: 'have more stars', cn: '有更多星星' },
                { en: 'win the game', cn: '赢得比赛' },
                { en: 'good job', cn: '做得好' },
                { en: 'try again', cn: '再试一次' }
            ],
            sentences: [
                { en: 'How many stars does each group have?', cn: '每个小组有多少颗星星？' },
                { en: 'Group One has twenty stars.', cn: '第一组有二十颗星星。' },
                { en: 'Group Two has fifteen stars.', cn: '第二组有十五颗星星。' },
                { en: 'Our group has more stars than yours.', cn: '我们组比你们组有更多星星。' },
                { en: 'Which group has the most stars?', cn: '哪个小组星星最多？' },
                { en: 'Group Three is the best.', cn: '第三组是最好的。' },
                { en: 'We win the game!', cn: '我们赢了比赛！' },
                { en: 'Great job, everyone!', cn: '大家做得很棒！' }
            ],
            dialogue: [
                { speaker: 'Ms White', en: 'Good morning, class! Let\'s play a game today.', cn: '早上好，同学们！今天我们来玩个游戏。' },
                { speaker: 'Students', en: 'Great!', cn: '太好了！' },
                { speaker: 'Ms White', en: 'There are four groups. Each group can get stars.', cn: '有四个小组。每个小组都能得到星星。' },
                { speaker: 'Janet', en: 'How many stars does each group have now?', cn: '现在每个小组有多少颗星星？' },
                { speaker: 'Ms White', en: 'Group One has eighteen stars. Group Two has twenty stars.', cn: '第一组有十八颗星星。第二组有二十颗星星。' },
                { speaker: 'Jiamin', en: 'Wow, Group Two has more stars!', cn: '哇，第二组星星更多！' },
                { speaker: 'Ms White', en: 'Yes. But Group Three has twenty-two stars.', cn: '是的。但是第三组有二十二颗星星。' },
                { speaker: 'Ben', en: 'Twenty-two! That\'s the most!', cn: '二十二颗！那是最多的！' },
                { speaker: 'Ms White', en: 'Yes, Group Three is the best. Good job!', cn: '是的，第三组是最好的。做得好！' }
            ]
        },
        'u8': {
            words: [
                { en: 'subject', cn: '科目' },
                { en: 'English', cn: '英语' },
                { en: 'Chinese', cn: '语文' },
                { en: 'maths', cn: '数学' },
                { en: 'science', cn: '科学' },
                { en: 'art', cn: '美术' },
                { en: 'music', cn: '音乐' },
                { en: 'PE', cn: '体育' },
                { en: 'favourite', cn: '最喜欢的' },
                { en: 'like', cn: '喜欢' },
                { en: 'love', cn: '喜爱' },
                { en: 'best', cn: '最' },
                { en: 'interesting', cn: '有趣的' },
                { en: 'fun', cn: '好玩的' },
                { en: 'easy', cn: '简单的' },
                { en: 'difficult', cn: '困难的' }
            ],
            phrases: [
                { en: 'favourite subject', cn: '最喜欢的科目' },
                { en: 'like English best', cn: '最喜欢英语' },
                { en: 'very interesting', cn: '非常有趣' },
                { en: 'so much fun', cn: '非常好玩' },
                { en: 'an easy subject', cn: '一门简单的科目' },
                { en: 'a difficult subject', cn: '一门困难的科目' },
                { en: 'what about you', cn: '你呢' },
                { en: 'me too', cn: '我也是' }
            ],
            sentences: [
                { en: 'I like English best.', cn: '我最喜欢英语。' },
                { en: 'What\'s your favourite subject?', cn: '你最喜欢的科目是什么？' },
                { en: 'My favourite subject is maths.', cn: '我最喜欢的科目是数学。' },
                { en: 'English is very interesting.', cn: '英语非常有趣。' },
                { en: 'I love music. It\'s so much fun.', cn: '我喜爱音乐。非常好玩。' },
                { en: 'Science is difficult but interesting.', cn: '科学很难但很有趣。' },
                { en: 'PE is my favourite subject.', cn: '体育是我最喜欢的科目。' },
                { en: 'What about you?', cn: '你呢？' }
            ],
            dialogue: [
                { speaker: 'Xiaoling', en: 'Janet, what\'s your favourite subject?', cn: '珍妮特，你最喜欢的科目是什么？' },
                { speaker: 'Janet', en: 'I like English best. It\'s very interesting.', cn: '我最喜欢英语。非常有趣。' },
                { speaker: 'Xiaoling', en: 'I like English too. But I like art best.', cn: '我也喜欢英语。但我最喜欢美术。' },
                { speaker: 'Janet', en: 'Art? Why do you like art?', cn: '美术？你为什么喜欢美术？' },
                { speaker: 'Xiaoling', en: 'Because I like drawing. It\'s so much fun.', cn: '因为我喜欢画画。非常好玩。' },
                { speaker: 'Janet', en: 'That\'s nice. What about you, Jiamin?', cn: '真好。你呢，家民？' },
                { speaker: 'Jiamin', en: 'My favourite subject is PE.', cn: '我最喜欢的科目是体育。' },
                { speaker: 'Janet', en: 'PE? Do you like sports?', cn: '体育？你喜欢运动吗？' },
                { speaker: 'Jiamin', en: 'Yes! I love playing basketball and football.', cn: '是的！我喜欢打篮球和踢足球。' },
                { speaker: 'Xiaoling', en: 'Wow, you\'re very sporty!', cn: '哇，你真热爱运动！' }
            ]
        }
    };

    if (window.practiceBank && window.practiceBank.registerModuleContent) {
        window.practiceBank.registerModuleContent('p4u', 'm4', moduleContent);
    }
})();
