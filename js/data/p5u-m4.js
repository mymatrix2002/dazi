// js/data/p5u-m4.js
// 五年级上册 Module 4 - Foods and drinks 饮食

(function() {
    const moduleData = {
        id: 'm4',
        name: 'Module 4 Foods and drinks',
        nameCn: '饮食',
        units: [
            // ========== Unit 7 ==========
            {
                id: 'u7',
                name: 'Unit 7 Do you want coffee or tea?',
                nameCn: '你想要咖啡还是茶？',
                difficulty: 2,
                content: {
                    // 单词
                    words: [
                        { en: 'coffee', cn: '咖啡' },
                        { en: 'tea', cn: '茶' },
                        { en: 'juice', cn: '果汁' },
                        { en: 'milk', cn: '牛奶' },
                        { en: 'water', cn: '水' },
                        { en: 'coke', cn: '可乐' },
                        { en: 'want', cn: '想要' },
                        { en: 'or', cn: '或者；还是' },
                        { en: 'something', cn: '某事；某物' },
                        { en: 'drink', cn: '喝；饮料' },
                        { en: 'eat', cn: '吃' },
                        { en: 'food', cn: '食物' },
                        { en: 'hungry', cn: '饥饿的' },
                        { en: 'thirsty', cn: '口渴的' },
                        { en: 'tired', cn: '疲倦的' },
                        { en: 'happy', cn: '高兴的；快乐的' },
                        { en: 'sure', cn: '当然；肯定的' },
                        { en: 'please', cn: '请' },
                        { en: 'thanks', cn: '谢谢' },
                        { en: 'welcome', cn: '受欢迎的；不必谢的' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'want something to drink', cn: '想要点喝的' },
                        { en: 'want something to eat', cn: '想要点吃的' },
                        { en: 'a cup of coffee', cn: '一杯咖啡' },
                        { en: 'a cup of tea', cn: '一杯茶' },
                        { en: 'a glass of juice', cn: '一杯果汁' },
                        { en: 'a glass of milk', cn: '一杯牛奶' },
                        { en: 'a bottle of water', cn: '一瓶水' },
                        { en: 'be hungry', cn: '饿了' },
                        { en: 'be thirsty', cn: '渴了' },
                        { en: 'be tired', cn: '累了' },
                        { en: 'of course', cn: '当然' },
                        { en: 'you\'re welcome', cn: '不客气' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'Do you want coffee or tea?', cn: '你想要咖啡还是茶？' },
                        { en: 'I want coffee, please.', cn: '我想要咖啡，谢谢。' },
                        { en: 'Tea, please.', cn: '请来杯茶。' },
                        { en: 'Would you like something to drink?', cn: '你想要点喝的吗？' },
                        { en: 'Yes, please. / No, thanks.', cn: '好的，谢谢。/ 不用了，谢谢。' },
                        { en: 'I am hungry. I want something to eat.', cn: '我饿了。我想要点吃的。' },
                        { en: 'She is thirsty. She wants a glass of juice.', cn: '她渴了。她想要一杯果汁。' },
                        { en: 'What would you like to drink?', cn: '你想喝点什么？' },
                        { en: 'I\'d like a cup of tea.', cn: '我想要一杯茶。' },
                        { en: 'Do you like coffee?', cn: '你喜欢咖啡吗？' },
                        { en: 'Yes, I do. / No, I don\'t.', cn: '是的，我喜欢。/ 不，我不喜欢。' },
                        { en: 'Thank you very much! You\'re welcome.', cn: '非常感谢！不客气。' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'It is a hot afternoon. The children are in the park.', cn: '这是一个炎热的下午。孩子们在公园里。' },
                        { speaker: 'Janet', en: 'Oh, it\'s so hot today!', cn: '哦，今天好热啊！' },
                        { speaker: 'Jiamin', en: 'Yes, I am very thirsty.', cn: '是啊，我好渴。' },
                        { speaker: 'Xiaoling', en: 'Me too. I want something to drink.', cn: '我也是。我想要点喝的。' },
                        { speaker: 'Ben', en: 'Look! There is a shop over there.', cn: '看！那边有个商店。' },
                        { speaker: 'Janet', en: 'Great! Let\'s go and get some drinks.', cn: '太好了！我们去买点饮料吧。' },
                        { en: 'They go to the shop.', cn: '他们去了商店。' },
                        { speaker: 'Shopkeeper', en: 'Hello! What would you like?', cn: '你们好！你们想要什么？' },
                        { speaker: 'Janet', en: 'Do you want coffee or tea, Jiamin?', cn: '家民，你想要咖啡还是茶？' },
                        { speaker: 'Jiamin', en: 'I want a cup of tea, please.', cn: '请给我一杯茶。' },
                        { speaker: 'Janet', en: 'I want a glass of orange juice.', cn: '我想要一杯橙汁。' },
                        { speaker: 'Xiaoling', en: 'Can I have a bottle of water, please?', cn: '请给我一瓶水好吗？' },
                        { speaker: 'Shopkeeper', en: 'Sure. What about you, young man?', cn: '当然。你呢，小伙子？' },
                        { speaker: 'Ben', en: 'I want a can of coke, please.', cn: '请给我一罐可乐。' },
                        { speaker: 'Shopkeeper', en: 'OK. One tea, one juice, one water and one coke.', cn: '好的。一杯茶，一杯果汁，一瓶水和一罐可乐。' },
                        { speaker: 'Janet', en: 'How much are they?', cn: '一共多少钱？' },
                        { speaker: 'Shopkeeper', en: 'They are twenty yuan.', cn: '二十元。' },
                        { speaker: 'Jiamin', en: 'Here you are. Thank you!', cn: '给你。谢谢你！' },
                        { speaker: 'Shopkeeper', en: 'You\'re welcome! Enjoy your drinks!', cn: '不客气！祝你们喝得开心！' },
                        { en: 'The children sit under a tree and enjoy their drinks.', cn: '孩子们坐在树下，享受他们的饮料。' }
                    ]
                }
            },
            // ========== Unit 8 ==========
            {
                id: 'u8',
                name: 'Unit 8 Let\'s have both',
                nameCn: '我们两个都要吧',
                difficulty: 2,
                content: {
                    // 单词
                    words: [
                        { en: 'both', cn: '两个都' },
                        { en: 'all', cn: '全部；所有' },
                        { en: 'noodle', cn: '面条' },
                        { en: 'rice', cn: '米饭；大米' },
                        { en: 'bread', cn: '面包' },
                        { en: 'cake', cn: '蛋糕' },
                        { en: 'sandwich', cn: '三明治' },
                        { en: 'hamburger', cn: '汉堡包' },
                        { en: 'chicken', cn: '鸡肉；鸡' },
                        { en: 'beef', cn: '牛肉' },
                        { en: 'fish', cn: '鱼；鱼肉' },
                        { en: 'vegetable', cn: '蔬菜' },
                        { en: 'fruit', cn: '水果' },
                        { en: 'apple', cn: '苹果' },
                        { en: 'banana', cn: '香蕉' },
                        { en: 'orange', cn: '橙子；橙色的' },
                        { en: 'grape', cn: '葡萄' },
                        { en: 'delicious', cn: '美味的；可口的' },
                        { en: 'taste', cn: '品尝；味道' },
                        { en: 'sweet', cn: '甜的' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'have both', cn: '两个都要' },
                        { en: 'have all', cn: '全部都要' },
                        { en: 'rice noodles', cn: '米粉' },
                        { en: 'fried rice', cn: '炒饭' },
                        { en: 'a piece of bread', cn: '一片面包' },
                        { en: 'a piece of cake', cn: '一块蛋糕' },
                        { en: 'chicken wings', cn: '鸡翅' },
                        { en: 'beef noodles', cn: '牛肉面' },
                        { en: 'fish and chips', cn: '炸鱼薯条' },
                        { en: 'fresh vegetables', cn: '新鲜蔬菜' },
                        { en: 'fresh fruit', cn: '新鲜水果' },
                        { en: 'taste good', cn: '尝起来很好' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'Let\'s have both.', cn: '我们两个都要吧。' },
                        { en: 'Do you want noodles or rice?', cn: '你想要面条还是米饭？' },
                        { en: 'I want both. I like both noodles and rice.', cn: '我两个都要。我既喜欢面条又喜欢米饭。' },
                        { en: 'Which do you like better, chicken or beef?', cn: '鸡肉和牛肉，你更喜欢哪个？' },
                        { en: 'I like chicken better.', cn: '我更喜欢鸡肉。' },
                        { en: 'What would you like to eat?', cn: '你想吃点什么？' },
                        { en: 'I\'d like a hamburger and some chips.', cn: '我想要一个汉堡包和一些薯条。' },
                        { en: 'The food tastes very delicious.', cn: '这食物尝起来非常美味。' },
                        { en: 'The cake is very sweet.', cn: '这个蛋糕很甜。' },
                        { en: 'We all like fresh fruit.', cn: '我们都喜欢新鲜水果。' },
                        { en: 'Apples and bananas are my favourite.', cn: '苹果和香蕉是我的最爱。' },
                        { en: 'Let\'s go and try it!', cn: '我们去尝尝吧！' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'It is lunch time. The children are talking about what to eat.', cn: '现在是午餐时间。孩子们正在讨论吃什么。' },
                        { speaker: 'Ben', en: 'I\'m hungry. What should we have for lunch?', cn: '我饿了。我们午餐吃什么好呢？' },
                        { speaker: 'Janet', en: 'How about noodles? I love noodles.', cn: '面条怎么样？我喜欢面条。' },
                        { speaker: 'Jiamin', en: 'Noodles? I prefer rice.', cn: '面条？我更喜欢米饭。' },
                        { speaker: 'Janet', en: 'Hmm... noodles or rice? Which one should we choose?', cn: '嗯……面条还是米饭？我们该选哪个呢？' },
                        { speaker: 'Xiaoling', en: 'Why not have both?', cn: '为什么不两个都要呢？' },
                        { speaker: 'Ben', en: 'Have both? That\'s a great idea!', cn: '两个都要？好主意！' },
                        { speaker: 'Jiamin', en: 'Yes! Let\'s have both noodles and rice.', cn: '是啊！我们面条和米饭都吃吧。' },
                        { speaker: 'Janet', en: 'Great! What else should we have?', cn: '太好了！我们还吃点别的什么？' },
                        { speaker: 'Ben', en: 'How about chicken? I love chicken wings.', cn: '鸡肉怎么样？我喜欢鸡翅。' },
                        { speaker: 'Xiaoling', en: 'Chicken is good, but I like fish better.', cn: '鸡肉不错，但我更喜欢鱼。' },
                        { speaker: 'Jiamin', en: 'Let\'s have both chicken and fish!', cn: '那我们鸡肉和鱼都要吧！' },
                        { speaker: 'Janet', en: 'Wow, we are going to have a big lunch!', cn: '哇，我们要吃一顿丰盛的午餐！' },
                        { speaker: 'Ben', en: 'And we need some vegetables too.', cn: '我们还需要一些蔬菜。' },
                        { speaker: 'Xiaoling', en: 'Yes, vegetables are good for us.', cn: '是的，蔬菜对我们有好处。' },
                        { speaker: 'Jiamin', en: 'What about fruit? Do you want any fruit after lunch?', cn: '水果呢？午饭后你们想吃点水果吗？' },
                        { speaker: 'Janet', en: 'Yes! I want apples and bananas.', cn: '想！我想要苹果和香蕉。' },
                        { speaker: 'Ben', en: 'I want grapes. They are sweet.', cn: '我想要葡萄。它们很甜。' },
                        { speaker: 'Xiaoling', en: 'Let\'s have all the fruit!', cn: '我们所有水果都要吧！' },
                        { speaker: 'Jiamin', en: 'Haha, that\'s too much. But it will be delicious!', cn: '哈哈，那太多了。但一定会很美味！' },
                        { en: 'All the children are happy and can\'t wait for lunch.', cn: '所有的孩子都很开心，迫不及待地想吃午餐了。' }
                    ]
                }
            }
        ]
    };

    // 注册到全局题库
    if (window.practiceBank) {
        const bank = window.practiceBank;
        const ver = bank.primary.versions.guangzhou;
        
        if (!ver.grades.grade5) {
            ver.grades.grade5 = {
                name: '五年级',
                volumes: {}
            };
        }
        
        if (!ver.grades.grade5.volumes.upper) {
            ver.grades.grade5.volumes.upper = {
                name: '上册',
                modules: []
            };
        }
        
        ver.grades.grade5.volumes.upper.modules.push(moduleData);
    }
})();
