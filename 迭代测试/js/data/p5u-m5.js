// js/data/p5u-m5.js
// 五年级上册 Module 5 - 我们需要的食物
// 内容数据文件（懒加载用）
(function() {
    'use strict';
    
    // 模块内容数据
    const moduleContent = {
        'u10': {
                    // 单词
                    words: [
                        { en: 'different', cn: '不同的' },
                        { en: 'same', cn: '相同的' },
                        { en: 'taste', cn: '味道；品尝' },
                        { en: 'prefer', cn: '更喜欢' },
                        { en: 'favourite', cn: '最喜欢的' },
                        { en: 'kind', cn: '种类' },
                        { en: 'food', cn: '食物' },
                        { en: 'Chinese', cn: '中国的；中国人；汉语' },
                        { en: 'Western', cn: '西方的' },
                        { en: 'England', cn: '英格兰' },
                        { en: 'America', cn: '美国；美洲' },
                        { en: 'India', cn: '印度' },
                        { en: 'Italy', cn: '意大利' },
                        { en: 'Japan', cn: '日本' },
                        { en: 'pizza', cn: '比萨饼' },
                        { en: 'pasta', cn: '意大利面' },
                        { en: 'sushi', cn: '寿司' },
                        { en: 'curry', cn: '咖喱' },
                        { en: 'dumpling', cn: '饺子' },
                        { en: 'noodle', cn: '面条' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'different tastes', cn: '不同的味道' },
                        { en: 'the same as', cn: '和……一样' },
                        { en: 'different from', cn: '和……不同' },
                        { en: 'prefer...to...', cn: '比起……更喜欢……' },
                        { en: 'favourite food', cn: '最喜欢的食物' },
                        { en: 'all kinds of', cn: '各种各样的' },
                        { en: 'Chinese food', cn: '中国食物' },
                        { en: 'Western food', cn: '西方食物' },
                        { en: 'Italian pizza', cn: '意大利比萨' },
                        { en: 'Japanese sushi', cn: '日本寿司' },
                        { en: 'Indian curry', cn: '印度咖喱' },
                        { en: 'Chinese dumplings', cn: '中国饺子' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'Different people have different tastes.', cn: '不同的人有不同的口味。' },
                        { en: 'My favourite food is Chinese food.', cn: '我最喜欢的食物是中国食物。' },
                        { en: 'I prefer noodles to rice.', cn: '比起米饭，我更喜欢面条。' },
                        { en: 'What kind of food do you like?', cn: '你喜欢哪种食物？' },
                        { en: 'I like all kinds of food.', cn: '我喜欢各种各样的食物。' },
                        { en: 'Chinese food is different from Western food.', cn: '中国食物和西方食物不一样。' },
                        { en: 'Is your taste the same as mine?', cn: '你的口味和我的一样吗？' },
                        { en: 'No, my taste is different from yours.', cn: '不，我的口味和你的不一样。' },
                        { en: 'Pizza comes from Italy.', cn: '比萨饼来自意大利。' },
                        { en: 'Sushi is Japanese food.', cn: '寿司是日本食物。' },
                        { en: 'Curry is very popular in India.', cn: '咖喱在印度很受欢迎。' },
                        { en: 'Dumplings are traditional Chinese food.', cn: '饺子是中国的传统食物。' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'The children are talking about different kinds of food from different countries.', cn: '孩子们正在谈论来自不同国家的各种食物。' },
                        { speaker: 'Ms White', en: 'Today we will talk about food from different countries.', cn: '今天我们来谈谈来自不同国家的食物。' },
                        { speaker: 'Ms White', en: 'Different people have different tastes.', cn: '不同的人有不同的口味。' },
                        { speaker: 'Ben', en: 'I love Western food. My favourite is hamburgers.', cn: '我喜欢西方食物。我最喜欢的是汉堡包。' },
                        { speaker: 'Jiamin', en: 'I prefer Chinese food. I love dumplings.', cn: '我更喜欢中国食物。我喜欢饺子。' },
                        { speaker: 'Ms White', en: 'Good. Chinese food and Western food are very different.', cn: '很好。中国食物和西方食物非常不同。' },
                        { speaker: 'Xiaoling', en: 'I like Japanese food too. Sushi is very delicious.', cn: '我也喜欢日本食物。寿司非常美味。' },
                        { speaker: 'Janet', en: 'What about Italian food? I love pizza and pasta.', cn: '意大利食物呢？我喜欢比萨和意大利面。' },
                        { speaker: 'Ms White', en: 'Yes, pizza comes from Italy. It is very popular all over the world.', cn: '是的，比萨来自意大利。它在全世界都很受欢迎。' },
                        { speaker: 'Ben', en: 'What about India? What food is famous there?', cn: '印度呢？那里什么食物有名？' },
                        { speaker: 'Ms White', en: 'Curry is very famous in India. Indian curry is very spicy.', cn: '咖喱在印度很有名。印度咖喱很辣。' },
                        { speaker: 'Jiamin', en: 'I don\'t like spicy food. It\'s too hot for me.', cn: '我不喜欢辣的食物。对我来说太辣了。' },
                        { speaker: 'Xiaoling', en: 'I like spicy food. It tastes good!', cn: '我喜欢辣的食物。味道很好！' },
                        { speaker: 'Ms White', en: 'See? Different people have different tastes.', cn: '看到了吗？不同的人有不同的口味。' },
                        { speaker: 'Janet', en: 'What about you, Ms White? What\'s your favourite food?', cn: '怀特老师，你呢？你最喜欢的食物是什么？' },
                        { speaker: 'Ms White', en: 'I love all kinds of food. But my favourite is Chinese dumplings.', cn: '我喜欢各种各样的食物。但我最喜欢的是中国饺子。' },
                        { speaker: 'Ben', en: 'Really? I want to try dumplings too!', cn: '真的吗？我也想尝尝饺子！' },
                        { speaker: 'Jiamin', en: 'Great! My grandma makes the best dumplings. You can come to my home and try them!', cn: '太好了！我奶奶做的饺子最好吃。你们可以来我家尝尝！' },
                        { speaker: 'Janet', en: 'Wow, that sounds wonderful!', cn: '哇，听起来太棒了！' },
                        { en: 'All the children are excited to try Jiamin\'s grandma\'s dumplings.', cn: '所有的孩子都很兴奋，想尝尝家民奶奶做的饺子。' }
                    ]
                },
        'u9': {
                    // 单词
                    words: [
                        { en: 'smell', cn: '闻；气味' },
                        { en: 'taste', cn: '尝；味道' },
                        { en: 'look', cn: '看起来；看' },
                        { en: 'sound', cn: '听起来；声音' },
                        { en: 'feel', cn: '摸起来；感觉' },
                        { en: 'delicious', cn: '美味的；可口的' },
                        { en: 'nice', cn: '好的；令人愉快的' },
                        { en: 'wonderful', cn: '极好的；精彩的' },
                        { en: 'fresh', cn: '新鲜的' },
                        { en: 'sweet', cn: '甜的' },
                        { en: 'sour', cn: '酸的' },
                        { en: 'salty', cn: '咸的' },
                        { en: 'bitter', cn: '苦的' },
                        { en: 'spicy', cn: '辣的' },
                        { en: 'dish', cn: '菜；盘子' },
                        { en: 'cook', cn: '烹饪；厨师' },
                        { en: 'kitchen', cn: '厨房' },
                        { en: 'meal', cn: '一餐；一顿饭' },
                        { en: 'dinner', cn: '晚餐；正餐' },
                        { en: 'ready', cn: '准备好的' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'smell delicious', cn: '闻起来很香' },
                        { en: 'taste good', cn: '尝起来很好' },
                        { en: 'look nice', cn: '看起来不错' },
                        { en: 'sound great', cn: '听起来很棒' },
                        { en: 'feel soft', cn: '摸起来很软' },
                        { en: 'fresh vegetables', cn: '新鲜蔬菜' },
                        { en: 'sweet and sour', cn: '酸甜的' },
                        { en: 'spicy food', cn: '辛辣的食物' },
                        { en: 'cook dinner', cn: '做晚饭' },
                        { en: 'in the kitchen', cn: '在厨房里' },
                        { en: 'be ready', cn: '准备好了' },
                        { en: 'have a meal', cn: '吃饭' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'It smells delicious!', cn: '它闻起来很香！' },
                        { en: 'The food tastes very good.', cn: '这食物尝起来非常好。' },
                        { en: 'The cake looks very nice.', cn: '这个蛋糕看起来很漂亮。' },
                        { en: 'That sounds great!', cn: '那听起来很棒！' },
                        { en: 'The silk feels very soft.', cn: '丝绸摸起来很软。' },
                        { en: 'Is the fish fresh?', cn: '这鱼新鲜吗？' },
                        { en: 'Yes, it smells very fresh.', cn: '是的，闻起来很新鲜。' },
                        { en: 'Do you like sweet food?', cn: '你喜欢甜食吗？' },
                        { en: 'No, I don\'t like sweet food. I like sour food.', cn: '不，我不喜欢甜食。我喜欢酸的食物。' },
                        { en: 'Mum is cooking dinner in the kitchen.', cn: '妈妈正在厨房里做晚饭。' },
                        { en: 'Dinner is ready!', cn: '晚饭准备好了！' },
                        { en: 'Let\'s go and have a meal.', cn: '我们去吃饭吧。' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'It is Sunday evening. Janet\'s mum is cooking dinner in the kitchen.', cn: '这是周日晚上。珍妮特的妈妈正在厨房里做晚饭。' },
                        { speaker: 'Janet', en: 'Mum, what are you cooking? It smells delicious!', cn: '妈妈，你在做什么？闻起来好香啊！' },
                        { speaker: 'Mum', en: 'I\'m cooking fish and vegetables.', cn: '我在做鱼和蔬菜。' },
                        { speaker: 'Janet', en: 'Wow! Fish is my favourite. Can I help?', cn: '哇！鱼是我的最爱。我能帮忙吗？' },
                        { speaker: 'Mum', en: 'Yes, you can help me wash the vegetables.', cn: '好的，你可以帮我洗菜。' },
                        { speaker: 'Janet', en: 'OK! Are these vegetables fresh?', cn: '好的！这些蔬菜新鲜吗？' },
                        { speaker: 'Mum', en: 'Yes, they are very fresh. I bought them this morning.', cn: '是的，它们非常新鲜。我今天早上买的。' },
                        { speaker: 'Janet', en: 'They look green and nice.', cn: '它们看起来绿油油的，很好。' },
                        { en: 'Soon, dinner is ready.', cn: '很快，晚饭就做好了。' },
                        { speaker: 'Mum', en: 'Dinner is ready! Come and eat!', cn: '晚饭好了！来吃饭吧！' },
                        { speaker: 'Dad', en: 'Wow, what a big meal!', cn: '哇，好丰盛的一顿饭！' },
                        { speaker: 'Janet', en: 'The fish smells wonderful!', cn: '这鱼闻起来太棒了！' },
                        { speaker: 'Dad', en: 'Let me taste it first.', cn: '让我先尝尝。' },
                        { speaker: 'Dad', en: 'Hmm... it tastes delicious!', cn: '嗯……味道好极了！' },
                        { speaker: 'Janet', en: 'Really? Let me try.', cn: '真的吗？让我试试。' },
                        { speaker: 'Janet', en: 'Oh, it\'s a little salty.', cn: '哦，有点咸。' },
                        { speaker: 'Mum', en: 'Is it? I\'m sorry. Let me add some water.', cn: '是吗？对不起。我加点水吧。' },
                        { speaker: 'Dad', en: 'It\'s OK. It still tastes good.', cn: '没关系。味道还是很好的。' },
                        { speaker: 'Janet', en: 'Yes, I like it. Thank you, Mum!', cn: '是的，我喜欢。谢谢你，妈妈！' },
                        { speaker: 'Mum', en: 'You\'re welcome. Enjoy your dinner!', cn: '不客气。祝你们晚餐愉快！' },
                        { en: 'The family has a happy dinner together.', cn: '一家人一起吃了一顿愉快的晚餐。' }
                    ]
                }
    };
    
    // 注册到题库
    if (window.practiceBank && window.practiceBank.registerModuleContent) {
        window.practiceBank.registerModuleContent('p5u', 'm5', moduleContent);
    }
})();
