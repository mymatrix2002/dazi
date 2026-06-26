// js/data/p6u-m4.js
// 六年级上册 Module 4 - 过去的经历
// 内容数据文件（懒加载用）
(function() {
    'use strict';
    
    // 模块内容数据
    const moduleContent = {
        'u7': {
                    // 单词
                    words: [
                        { en: 'yesterday', cn: '昨天' },
                        { en: 'last', cn: '上一个；最后的' },
                        { en: 'ago', cn: '以前' },
                        { en: 'before', cn: '在……之前' },
                        { en: 'did', cn: '做（do的过去式）' },
                        { en: 'went', cn: '去（go的过去式）' },
                        { en: 'was', cn: '是（is/am的过去式）' },
                        { en: 'were', cn: '是（are的过去式）' },
                        { en: 'had', cn: '有（have的过去式）' },
                        { en: 'ate', cn: '吃（eat的过去式）' },
                        { en: 'drank', cn: '喝（drink的过去式）' },
                        { en: 'saw', cn: '看见（see的过去式）' },
                        { en: 'said', cn: '说（say的过去式）' },
                        { en: 'gave', cn: '给（give的过去式）' },
                        { en: 'took', cn: '拿；乘坐（take的过去式）' },
                        { en: 'made', cn: '制作（make的过去式）' },
                        { en: 'read', cn: '读（read的过去式）' },
                        { en: 'wrote', cn: '写（write的过去式）' },
                        { en: 'played', cn: '玩（play的过去式）' },
                        { en: 'visited', cn: '参观；拜访（visit的过去式）' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'last week', cn: '上周' },
                        { en: 'last month', cn: '上个月' },
                        { en: 'last year', cn: '去年' },
                        { en: 'three days ago', cn: '三天前' },
                        { en: 'yesterday morning', cn: '昨天早上' },
                        { en: 'yesterday afternoon', cn: '昨天下午' },
                        { en: 'yesterday evening', cn: '昨天晚上' },
                        { en: 'last night', cn: '昨晚' },
                        { en: 'go to the park', cn: '去公园' },
                        { en: 'visit a friend', cn: '拜访朋友' },
                        { en: 'see a film', cn: '看电影' },
                        { en: 'have a good time', cn: '玩得开心' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'What did you do yesterday?', cn: '你昨天做了什么？' },
                        { en: 'I went to the park with my family.', cn: '我和家人去了公园。' },
                        { en: 'We played football and flew kites.', cn: '我们踢了足球，放了风筝。' },
                        { en: 'I visited my grandparents last weekend.', cn: '上周末我拜访了祖父母。' },
                        { en: 'We had a big dinner together.', cn: '我们一起吃了一顿丰盛的晚餐。' },
                        { en: 'I saw a film with my friends last night.', cn: '昨晚我和朋友们看了一场电影。' },
                        { en: 'The film was very interesting.', cn: '那部电影非常有趣。' },
                        { en: 'What did you eat for breakfast yesterday?', cn: '你昨天早餐吃了什么？' },
                        { en: 'I ate bread and drank milk.', cn: '我吃了面包，喝了牛奶。' },
                        { en: 'Did you finish your homework yesterday?', cn: '你昨天完成作业了吗？' },
                        { en: 'Yes, I did. I finished it before dinner.', cn: '是的，我完成了。晚饭前就做完了。' },
                        { en: 'I had a wonderful time yesterday.', cn: '我昨天玩得很开心。' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'Jiamin and Janet are talking about what they did yesterday.', cn: '家民和珍妮特正在谈论他们昨天做了什么。' },
                        { speaker: 'Janet', en: 'Hi Jiamin! What did you do yesterday?', cn: '嗨，家民！你昨天做了什么？' },
                        { speaker: 'Jiamin', en: 'I went to the zoo with my parents.', cn: '我和父母去了动物园。' },
                        { speaker: 'Janet', en: 'That sounds fun! What animals did you see?', cn: '听起来很有趣！你看到了什么动物？' },
                        { speaker: 'Jiamin', en: 'We saw pandas, tigers, elephants and monkeys.', cn: '我们看到了熊猫、老虎、大象和猴子。' },
                        { speaker: 'Jiamin', en: 'The pandas were so cute!', cn: '熊猫太可爱了！' },
                        { speaker: 'Janet', en: 'Wow! I love pandas too. Did you take photos?', cn: '哇！我也喜欢熊猫。你拍照了吗？' },
                        { speaker: 'Jiamin', en: 'Yes, I took many photos. I will show you later.', cn: '是的，我拍了很多照片。稍后给你看。' },
                        { speaker: 'Janet', en: 'Great! What else did you do?', cn: '太好了！你还做了什么？' },
                        { speaker: 'Jiamin', en: 'We had lunch at a restaurant near the zoo.', cn: '我们在动物园附近的餐馆吃了午饭。' },
                        { speaker: 'Jiamin', en: 'The food was delicious.', cn: '食物很美味。' },
                        { speaker: 'Janet', en: 'You really had a good day!', cn: '你真的度过了愉快的一天！' },
                        { speaker: 'Jiamin', en: 'Yes, it was a wonderful day.', cn: '是的，真是美好的一天。' },
                        { en: 'They both had a great time yesterday.', cn: '他们昨天都过得很愉快。' }
                    ]
                },
        'u8': {
                    // 单词
                    words: [
                        { en: 'trip', cn: '旅行；旅程' },
                        { en: 'travel', cn: '旅行' },
                        { en: 'Hong Kong', cn: '香港' },
                        { en: 'Disneyland', cn: '迪士尼乐园' },
                        { en: 'Ocean Park', cn: '海洋公园' },
                        { en: 'ferry', cn: '渡轮' },
                        { en: 'train', cn: '火车' },
                        { en: 'subway', cn: '地铁' },
                        { en: 'hotel', cn: '酒店' },
                        { en: 'shopping', cn: '购物' },
                        { en: 'sights', cn: '风景；名胜' },
                        { en: 'famous', cn: '著名的' },
                        { en: 'exciting', cn: '令人兴奋的' },
                        { en: 'wonderful', cn: '精彩的；极好的' },
                        { en: 'amazing', cn: '令人惊奇的' },
                        { en: 'bought', cn: '买（buy的过去式）' },
                        { en: 'went', cn: '去（go的过去式）' },
                        { en: 'took', cn: '拿；乘坐（take的过去式）' },
                        { en: 'stayed', cn: '停留（stay的过去式）' },
                        { en: 'enjoyed', cn: '享受（enjoy的过去式）' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'a trip to Hong Kong', cn: '香港之旅' },
                        { en: 'go on a trip', cn: '去旅行' },
                        { en: 'Ocean Park', cn: '海洋公园' },
                        { en: 'Disneyland', cn: '迪士尼乐园' },
                        { en: 'go shopping', cn: '去购物' },
                        { en: 'go sightseeing', cn: '去观光' },
                        { en: 'stay in a hotel', cn: '住在酒店' },
                        { en: 'by train', cn: '乘火车' },
                        { en: 'by ferry', cn: '乘渡轮' },
                        { en: 'take photos', cn: '拍照' },
                        { en: 'buy souvenirs', cn: '买纪念品' },
                        { en: 'have a wonderful time', cn: '玩得很开心' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'I went on a trip to Hong Kong last summer.', cn: '去年夏天我去香港旅行了。' },
                        { en: 'We went there by train.', cn: '我们乘火车去的那里。' },
                        { en: 'We stayed in a nice hotel near the sea.', cn: '我们住在海边一家不错的酒店。' },
                        { en: 'We visited Ocean Park on the first day.', cn: '第一天我们参观了海洋公园。' },
                        { en: 'We saw many sea animals and watched a dolphin show.', cn: '我们看到了很多海洋动物，还看了海豚表演。' },
                        { en: 'The dolphin show was amazing!', cn: '海豚表演太精彩了！' },
                        { en: 'On the second day, we went to Disneyland.', cn: '第二天，我们去了迪士尼乐园。' },
                        { en: 'We played many games and took lots of photos.', cn: '我们玩了很多游戏，拍了很多照片。' },
                        { en: 'We also went shopping and bought some souvenirs.', cn: '我们还去购物，买了一些纪念品。' },
                        { en: 'The food in Hong Kong was very delicious.', cn: '香港的食物非常美味。' },
                        { en: 'We enjoyed the trip very much.', cn: '我们非常享受这次旅行。' },
                        { en: 'It was a wonderful and exciting trip.', cn: '这是一次精彩而令人兴奋的旅行。' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'Ben is telling his classmates about his trip to Hong Kong.', cn: '本正在给他的同学们讲述他的香港之旅。' },
                        { speaker: 'Xiaoling', en: 'Ben, I heard you went to Hong Kong last month. How was it?', cn: '本，我听说你上个月去香港了。怎么样？' },
                        { speaker: 'Ben', en: 'It was wonderful! I had a great time.', cn: '太棒了！我玩得很开心。' },
                        { speaker: 'Jiamin', en: 'What places did you visit?', cn: '你参观了哪些地方？' },
                        { speaker: 'Ben', en: 'We visited Ocean Park and Disneyland.', cn: '我们参观了海洋公园和迪士尼乐园。' },
                        { speaker: 'Ben', en: 'Ocean Park was amazing. We saw pandas and dolphins.', cn: '海洋公园太棒了。我们看到了熊猫和海豚。' },
                        { speaker: 'Janet', en: 'Wow! Did you watch the dolphin show?', cn: '哇！你们看海豚表演了吗？' },
                        { speaker: 'Ben', en: 'Yes, we did. It was very exciting!', cn: '是的，看了。非常令人兴奋！' },
                        { speaker: 'Jiamin', en: 'What about Disneyland? Was it fun?', cn: '迪士尼乐园呢？好玩吗？' },
                        { speaker: 'Ben', en: 'It was super fun! We played many games.', cn: '超级好玩！我们玩了很多游戏。' },
                        { speaker: 'Ben', en: 'And we took lots of photos with cartoon characters.', cn: '我们还和卡通人物拍了很多照片。' },
                        { speaker: 'Xiaoling', en: 'Did you go shopping?', cn: '你们去购物了吗？' },
                        { speaker: 'Ben', en: 'Yes, we did. I bought some souvenirs for my friends.', cn: '是的，去了。我给朋友们买了一些纪念品。' },
                        { speaker: 'Ben', en: 'The trip was really wonderful. I want to go again!', cn: '这次旅行真的很棒。我还想再去一次！' },
                        { en: 'All the students want to visit Hong Kong too after hearing Ben\'s story.', cn: '听了本的故事，所有学生都想去香港了。' }
                    ]
                }
    };
    
    // 注册到题库
    if (window.practiceBank && window.practiceBank.registerModuleContent) {
        window.practiceBank.registerModuleContent('p6u', 'm4', moduleContent);
    }
})();
