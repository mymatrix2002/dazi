// js/data/p4u-m2.js
// 四年级上册 Module 2: My house
(function() {
    'use strict';

    const moduleContent = {
        'u3': {
            words: [
                { en: 'house', cn: '房子' },
                { en: 'home', cn: '家' },
                { en: 'living room', cn: '客厅' },
                { en: 'bedroom', cn: '卧室' },
                { en: 'kitchen', cn: '厨房' },
                { en: 'bathroom', cn: '浴室' },
                { en: 'study', cn: '书房' },
                { en: 'dining room', cn: '餐厅' },
                { en: 'garden', cn: '花园' },
                { en: 'garage', cn: '车库' },
                { en: 'welcome', cn: '欢迎' },
                { en: 'love', cn: '喜爱' },
                { en: 'beautiful', cn: '美丽的' },
                { en: 'large', cn: '大的' },
                { en: 'new', cn: '新的' },
                { en: 'old', cn: '旧的' }
            ],
            phrases: [
                { en: 'welcome to my house', cn: '欢迎来我家' },
                { en: 'a big house', cn: '一座大房子' },
                { en: 'a beautiful garden', cn: '一个漂亮的花园' },
                { en: 'in the living room', cn: '在客厅里' },
                { en: 'in the kitchen', cn: '在厨房里' },
                { en: 'in the study', cn: '在书房里' },
                { en: 'my favourite room', cn: '我最喜欢的房间' },
                { en: 'come in', cn: '进来' }
            ],
            sentences: [
                { en: 'Welcome to my house.', cn: '欢迎来我家。' },
                { en: 'This is my living room.', cn: '这是我的客厅。' },
                { en: 'There is a kitchen and a bathroom.', cn: '有一个厨房和一个浴室。' },
                { en: 'My house has three bedrooms.', cn: '我家有三个卧室。' },
                { en: 'I love my study very much.', cn: '我非常喜欢我的书房。' },
                { en: 'Your house is very beautiful.', cn: '你的房子真漂亮。' },
                { en: 'Is there a garden in your house?', cn: '你家有花园吗？' },
                { en: 'Yes, there is a small garden.', cn: '是的，有一个小花园。' }
            ],
            dialogue: [
                { speaker: 'Ben', en: 'Hello, Jiamin! Welcome to my new house.', cn: '你好，家民！欢迎来我的新家。' },
                { speaker: 'Jiamin', en: 'Wow, Ben! Your house is very big.', cn: '哇，本！你的房子真大。' },
                { speaker: 'Ben', en: 'Thank you. Come in, please.', cn: '谢谢。请进。' },
                { speaker: 'Jiamin', en: 'This is a beautiful living room.', cn: '这个客厅真漂亮。' },
                { speaker: 'Ben', en: 'Yes, I like it. This way, please.', cn: '是的，我喜欢。请这边走。' },
                { speaker: 'Ben', en: 'This is my bedroom. And that is the study.', cn: '这是我的卧室。那是书房。' },
                { speaker: 'Jiamin', en: 'I love the study. There are so many books!', cn: '我喜欢这个书房。有这么多书！' },
                { speaker: 'Ben', en: 'Yes, I like reading. Let\'s go to the garden.', cn: '是的，我喜欢读书。我们去花园吧。' },
                { speaker: 'Jiamin', en: 'Great! I love gardens.', cn: '太好了！我喜欢花园。' }
            ]
        },
        'u4': {
            words: [
                { en: 'live', cn: '居住' },
                { en: 'flat', cn: '公寓' },
                { en: 'building', cn: '楼房' },
                { en: 'floor', cn: '楼层' },
                { en: 'ground floor', cn: '一楼' },
                { en: 'first floor', cn: '二楼' },
                { en: 'second floor', cn: '三楼' },
                { en: 'lift', cn: '电梯' },
                { en: 'stairs', cn: '楼梯' },
                { en: 'apartment', cn: '公寓套房' },
                { en: 'neighbour', cn: '邻居' },
                { en: 'street', cn: '街道' },
                { en: 'city', cn: '城市' },
                { en: 'countryside', cn: '乡村' },
                { en: 'quiet', cn: '安静的' },
                { en: 'noisy', cn: '吵闹的' }
            ],
            phrases: [
                { en: 'live in a big house', cn: '住在一座大房子里' },
                { en: 'on the ground floor', cn: '在一楼' },
                { en: 'on the second floor', cn: '在三楼' },
                { en: 'a small flat', cn: '一套小公寓' },
                { en: 'in the city', cn: '在城市里' },
                { en: 'in the countryside', cn: '在乡村' },
                { en: 'a quiet street', cn: '一条安静的街道' },
                { en: 'my next door neighbour', cn: '我的隔壁邻居' }
            ],
            sentences: [
                { en: 'I live in a big house.', cn: '我住在一座大房子里。' },
                { en: 'He lives in a small flat.', cn: '他住在一套小公寓里。' },
                { en: 'My bedroom is on the first floor.', cn: '我的卧室在二楼。' },
                { en: 'The kitchen is on the ground floor.', cn: '厨房在一楼。' },
                { en: 'There is a lift in the building.', cn: '楼里有一部电梯。' },
                { en: 'I live in the city.', cn: '我住在城市里。' },
                { en: 'My grandparents live in the countryside.', cn: '我的祖父母住在乡村。' },
                { en: 'The countryside is very quiet.', cn: '乡村非常安静。' }
            ],
            dialogue: [
                { speaker: 'Janet', en: 'Jiamin, where do you live?', cn: '家民，你住在哪里？' },
                { speaker: 'Jiamin', en: 'I live in a big house in the countryside.', cn: '我住在乡村的一座大房子里。' },
                { speaker: 'Janet', en: 'Wow, that\'s nice. I live in a flat in the city.', cn: '哇，真好。我住在城里的一套公寓里。' },
                { speaker: 'Jiamin', en: 'Which floor do you live on?', cn: '你住在几楼？' },
                { speaker: 'Janet', en: 'I live on the tenth floor.', cn: '我住在十一楼。' },
                { speaker: 'Jiamin', en: 'Is there a lift in your building?', cn: '你们楼里有电梯吗？' },
                { speaker: 'Janet', en: 'Yes, there is. But sometimes I take the stairs.', cn: '是的，有。但有时候我走楼梯。' },
                { speaker: 'Jiamin', en: 'That\'s good exercise.', cn: '那是很好的锻炼。' },
                { speaker: 'Janet', en: 'Yes, it is. Do you like living in the countryside?', cn: '是的。你喜欢住在乡村吗？' },
                { speaker: 'Jiamin', en: 'Yes, it\'s very quiet and clean.', cn: '是的，非常安静和干净。' }
            ]
        }
    };

    if (window.practiceBank && window.practiceBank.registerModuleContent) {
        window.practiceBank.registerModuleContent('p4u', 'm2', moduleContent);
    }
})();
