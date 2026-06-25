// js/data/p3l-m4.js
// 三年级下册 Module 4: Fruits
(function() {
    'use strict';

    const moduleContent = {
        'u7': {
            words: [
                { en: 'apple', cn: '苹果' },
                { en: 'banana', cn: '香蕉' },
                { en: 'orange', cn: '橙子' },
                { en: 'grape', cn: '葡萄' },
                { en: 'pear', cn: '梨' },
                { en: 'peach', cn: '桃子' },
                { en: 'watermelon', cn: '西瓜' },
                { en: 'strawberry', cn: '草莓' },
                { en: 'fruit', cn: '水果' },
                { en: 'some', cn: '一些' },
                { en: 'may', cn: '可以' },
                { en: 'have', cn: '吃，有' },
                { en: 'please', cn: '请' },
                { en: 'sure', cn: '当然' },
                { en: 'here', cn: '这里' },
                { en: 'you', cn: '你' }
            ],
            phrases: [
                { en: 'may I have some grapes', cn: '我可以吃一些葡萄吗' },
                { en: 'some fruit', cn: '一些水果' },
                { en: 'red apple', cn: '红苹果' },
                { en: 'yellow banana', cn: '黄色的香蕉' },
                { en: 'sweet orange', cn: '甜橙子' },
                { en: 'green grape', cn: '绿葡萄' },
                { en: 'here you are', cn: '给你' },
                { en: 'of course', cn: '当然' }
            ],
            sentences: [
                { en: 'May I have some grapes?', cn: '我可以吃一些葡萄吗？' },
                { en: 'Of course. Here you are.', cn: '当然。给你。' },
                { en: 'I like apples.', cn: '我喜欢苹果。' },
                { en: 'Apples are red.', cn: '苹果是红色的。' },
                { en: 'Bananas are yellow.', cn: '香蕉是黄色的。' },
                { en: 'Grapes are sweet.', cn: '葡萄很甜。' },
                { en: 'I want some fruit.', cn: '我想要一些水果。' },
                { en: 'Thank you very much!', cn: '非常感谢你！' }
            ],
            dialogue: [
                { speaker: 'Mum', en: 'Children, come and have some fruit!', cn: '孩子们，来吃点水果吧！' },
                { speaker: 'Janet', en: 'Great! I love fruit!', cn: '太好了！我喜欢水果！' },
                { speaker: 'Jiamin', en: 'May I have some grapes, please?', cn: '请问我可以吃一些葡萄吗？' },
                { speaker: 'Mum', en: 'Of course. Here you are.', cn: '当然。给你。' },
                { speaker: 'Jiamin', en: 'Thank you, Mum!', cn: '谢谢你，妈妈！' },
                { speaker: 'Janet', en: 'Can I have an apple?', cn: '我可以吃一个苹果吗？' },
                { speaker: 'Mum', en: 'Sure. This red apple is for you.', cn: '当然。这个红苹果给你。' },
                { speaker: 'Janet', en: 'Wow, it\'s big and sweet!', cn: '哇，它又大又甜！' },
                { speaker: 'Ben', en: 'I want a banana!', cn: '我想要一根香蕉！' },
                { speaker: 'Mum', en: 'OK, here you are. Eat more fruit, it\'s good for you.', cn: '好的，给你。多吃水果，对你有好处。' }
            ]
        },
        'u8': {
            words: [
                { en: 'apple', cn: '苹果' },
                { en: 'good', cn: '好的' },
                { en: 'for', cn: '对于' },
                { en: 'us', cn: '我们' },
                { en: 'healthy', cn: '健康的' },
                { en: 'eat', cn: '吃' },
                { en: 'every', cn: '每个' },
                { en: 'day', cn: '天' },
                { en: 'much', cn: '很多' },
                { en: 'many', cn: '很多' },
                { en: 'how many', cn: '多少' },
                { en: 'how much', cn: '多少' },
                { en: 'like', cn: '喜欢' },
                { en: 'best', cn: '最' },
                { en: 'favourite', cn: '最喜欢的' },
                { en: 'sweet', cn: '甜的' }
            ],
            phrases: [
                { en: 'apples are good for us', cn: '苹果对我们有好处' },
                { en: 'good for you', cn: '对你有好处' },
                { en: 'healthy food', cn: '健康的食物' },
                { en: 'eat fruit', cn: '吃水果' },
                { en: 'every day', cn: '每天' },
                { en: 'how many apples', cn: '多少个苹果' },
                { en: 'my favourite fruit', cn: '我最喜欢的水果' },
                { en: 'so sweet', cn: '真甜' }
            ],
            sentences: [
                { en: 'Apples are good for us.', cn: '苹果对我们有好处。' },
                { en: 'Fruit is healthy food.', cn: '水果是健康的食物。' },
                { en: 'We should eat fruit every day.', cn: '我们应该每天吃水果。' },
                { en: 'How many apples do you have?', cn: '你有多少个苹果？' },
                { en: 'I have three apples.', cn: '我有三个苹果。' },
                { en: 'What\'s your favourite fruit?', cn: '你最喜欢的水果是什么？' },
                { en: 'My favourite fruit is strawberry.', cn: '我最喜欢的水果是草莓。' },
                { en: 'It\'s so sweet and juicy!', cn: '它又甜又多汁！' }
            ],
            dialogue: [
                { speaker: 'Ms White', en: 'Children, today we talk about fruit.', cn: '孩子们，今天我们来谈谈水果。' },
                { speaker: 'Ms White', en: 'Why do we eat fruit?', cn: '我们为什么吃水果？' },
                { speaker: 'Jiamin', en: 'Because it\'s sweet!', cn: '因为它很甜！' },
                { speaker: 'Ms White', en: 'Yes, and fruit is good for us.', cn: '是的，而且水果对我们有好处。' },
                { speaker: 'Janet', en: 'Apples are good for us.', cn: '苹果对我们有好处。' },
                { speaker: 'Ms White', en: 'Very good! What\'s your favourite fruit?', cn: '非常好！你最喜欢的水果是什么？' },
                { speaker: 'Xiaoling', en: 'My favourite fruit is strawberry.', cn: '我最喜欢的水果是草莓。' },
                { speaker: 'Ben', en: 'I like watermelon best. It\'s so juicy!', cn: '我最喜欢西瓜。它汁很多！' },
                { speaker: 'Ms White', en: 'Great! We should eat fruit every day.', cn: '太棒了！我们应该每天吃水果。' },
                { speaker: 'Students', en: 'Yes, Ms White!', cn: '好的，怀特老师！' }
            ]
        }
    };

    if (window.practiceBank && window.practiceBank.registerModuleContent) {
        window.practiceBank.registerModuleContent('p3l', 'm4', moduleContent);
    }
})();
