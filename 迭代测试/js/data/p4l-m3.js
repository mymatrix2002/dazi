// js/data/p4l-m3.js
// 四年级下册 Module 3: Food & Drinks
(function() {
    'use strict';
    const moduleContent = {
        'u5': {
            words: [
                { en: 'rice', cn: '米饭' },
                { en: 'noodles', cn: '面条' },
                { en: 'egg', cn: '鸡蛋' },
                { en: 'milk', cn: '牛奶' },
                { en: 'bread', cn: '面包' },
                { en: 'fish', cn: '鱼肉' },
                { en: 'chicken', cn: '鸡肉' },
                { en: 'vegetable', cn: '蔬菜' },
                { en: 'fruit', cn: '水果' },
                { en: 'water', cn: '水' },
                { en: 'juice', cn: '果汁' },
                { en: 'healthy', cn: '健康的' },
                { en: 'sweet', cn: '甜的' },
                { en: 'delicious', cn: '美味的' },
                { en: 'favourite', cn: '最喜欢的' },
                { en: 'food', cn: '食物' }
            ],
            phrases: [
                { en: 'have rice', cn: '吃米饭' },
                { en: 'drink milk', cn: '喝牛奶' },
                { en: 'eat vegetables', cn: '吃蔬菜' },
                { en: 'fresh fruit', cn: '新鲜水果' },
                { en: 'healthy food', cn: '健康食物' },
                { en: 'a glass of juice', cn: '一杯果汁' },
                { en: 'for breakfast', cn: '作为早餐' },
                { en: 'very delicious', cn: '十分美味' }
            ],
            sentences: [
                { en: 'My favourite food is rice.', cn: '我最喜欢的食物是米饭。' },
                { en: 'I have milk and bread for breakfast.', cn: '我早餐喝牛奶吃面包。' },
                { en: 'Fish is good for us.', cn: '鱼肉对我们有益。' },
                { en: 'We should eat more vegetables.', cn: '我们应该多吃蔬菜。' },
                { en: 'Do you like orange juice?', cn: '你喜欢橙汁吗？' },
                { en: 'This apple is sweet.', cn: '这个苹果很甜。' },
                { en: 'Healthy food makes us strong.', cn: '健康食物让我们强壮。' },
                { en: 'I don\'t like noodles.', cn: '我不喜欢面条。' }
            ],
            dialogue: [
                { speaker: 'Mum', en: 'Jiamin, what would you like for lunch?', cn: '家民，你午餐想吃什么？' },
                { speaker: 'Jiamin', en: 'I want rice and fish, Mum.', cn: '妈妈，我想要米饭和鱼肉。' },
                { speaker: 'Mum', en: 'OK. We also have green vegetables.', cn: '好的。我们还有青菜。' },
                { speaker: 'Jiamin', en: 'Great! I love vegetables.', cn: '太棒了！我喜欢蔬菜。' },
                { speaker: 'Mum', en: 'Would you like some apple juice?', cn: '你想喝点苹果汁吗？' },
                { speaker: 'Jiamin', en: 'Yes, please. It\'s my favourite drink.', cn: '好的，谢谢。那是我最喜欢的饮品。' },
                { speaker: 'Mum', en: 'Eat more fruit. It\'s healthy.', cn: '多吃点水果，很健康。' },
                { speaker: 'Jiamin', en: 'I know, Mum. Thank you.', cn: '我知道啦妈妈，谢谢你。' }
            ]
        },
        'u6': {
            words: [
                { en: 'hamburger', cn: '汉堡包' },
                { en: 'hot dog', cn: '热狗' },
                { en: 'cola', cn: '可乐' },
                { en: 'candy', cn: '糖果' },
                { en: 'chocolate', cn: '巧克力' },
                { en: 'potato chip', cn: '薯片' },
                { en: 'fast food', cn: '快餐' },
                { en: 'bad', cn: '不好的' },
                { en: 'less', cn: '更少的' },
                { en: 'often', cn: '经常' },
                { en: 'body', cn: '身体' },
                { en: 'grow', cn: '成长' },
                { en: 'tomato', cn: '西红柿' },
                { en: 'banana', cn: '香蕉' },
                { en: 'strawberry', cn: '草莓' },
                { en: 'orange', cn: '橙子' }
            ],
            phrases: [
                { en: 'fast food', cn: '快餐' },
                { en: 'too much candy', cn: '太多糖果' },
                { en: 'drink cola', cn: '喝可乐' },
                { en: 'be bad for', cn: '对……有害' },
                { en: 'eat less fast food', cn: '少吃快餐' },
                { en: 'grow well', cn: '好好成长' },
                { en: 'fresh tomatoes', cn: '新鲜西红柿' },
                { en: 'a box of chocolates', cn: '一盒巧克力' }
            ],
            sentences: [
                { en: 'Hamburgers are fast food.', cn: '汉堡包是快餐。' },
                { en: 'Too much cola is bad for your body.', cn: '喝太多可乐对你身体不好。' },
                { en: 'We should eat less candy.', cn: '我们应该少吃糖果。' },
                { en: 'I seldom eat potato chips.', cn: '我很少吃薯片。' },
                { en: 'Bananas and strawberries are good fruit.', cn: '香蕉和草莓都是优质水果。' },
                { en: 'Don\'t eat too much fast food.', cn: '不要吃太多快餐。' },
                { en: 'Healthy food helps us grow well.', cn: '健康食物帮助我们好好成长。' },
                { en: 'I only eat chocolate at weekends.', cn: '我只在周末吃巧克力。' }
            ],
            dialogue: [
                { speaker: 'Janet', en: 'Jiamin, let\'s eat hamburgers for lunch!', cn: '家民，我们午餐吃汉堡包吧！' },
                { speaker: 'Jiamin', en: 'Sorry, I don\'t want fast food today.', cn: '不了，我今天不想吃快餐。' },
                { speaker: 'Janet', en: 'Why? They taste so good.', cn: '为什么呀？它们味道很棒。' },
                { speaker: 'Jiamin', en: 'Fast food is bad for us if we eat too much.', cn: '吃太多快餐对我们身体不好。' },
                { speaker: 'Janet', en: 'What do you usually eat then?', cn: '那你平时都吃什么？' },
                { speaker: 'Jiamin', en: 'Rice, vegetables and fruit. I seldom drink cola.', cn: '米饭、蔬菜和水果，我很少喝可乐。' },
                { speaker: 'Janet', en: 'Can I eat some strawberries after lunch?', cn: '午饭后我能吃点草莓吗？' },
                { speaker: 'Jiamin', en: 'Sure! Fruit is healthy for our body.', cn: '当然可以！水果对我们身体很健康。' },
                { speaker: 'Janet', en: 'I will eat less candy from now on.', cn: '从现在起我要少吃糖果了。' },
                { speaker: 'Jiamin', en: 'That\'s a good habit.', cn: '这是个好习惯。' }
            ]
        }
    };
    if (window.practiceBank && window.practiceBank.registerModuleContent) {
        window.practiceBank.registerModuleContent('p4l', 'm3', moduleContent);
    }
})();
