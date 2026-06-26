// js/data/p5u-m3.js
// 五年级上册 Module 3 - 日常生活
// 内容数据文件（懒加载用）
(function() {
    'use strict';
    
    // 模块内容数据
    const moduleContent = {
        'u5': {
                    // 单词
                    words: [
                        { en: 'where', cn: '在哪里' },
                        { en: 'usually', cn: '通常' },
                        { en: 'often', cn: '经常' },
                        { en: 'sometimes', cn: '有时' },
                        { en: 'always', cn: '总是；一直' },
                        { en: 'never', cn: '从不' },
                        { en: 'morning', cn: '早晨；上午' },
                        { en: 'afternoon', cn: '下午' },
                        { en: 'evening', cn: '晚上；傍晚' },
                        { en: 'night', cn: '夜晚' },
                        { en: 'breakfast', cn: '早餐' },
                        { en: 'lunch', cn: '午餐' },
                        { en: 'dinner', cn: '晚餐' },
                        { en: 'home', cn: '家' },
                        { en: 'school', cn: '学校' },
                        { en: 'library', cn: '图书馆' },
                        { en: 'playground', cn: '操场' },
                        { en: 'classroom', cn: '教室' },
                        { en: 'gym', cn: '体育馆' },
                        { en: 'office', cn: '办公室' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'in the morning', cn: '在早上' },
                        { en: 'in the afternoon', cn: '在下午' },
                        { en: 'in the evening', cn: '在晚上' },
                        { en: 'at night', cn: '在夜晚' },
                        { en: 'have breakfast', cn: '吃早餐' },
                        { en: 'have lunch', cn: '吃午餐' },
                        { en: 'have dinner', cn: '吃晚餐' },
                        { en: 'at home', cn: '在家' },
                        { en: 'at school', cn: '在学校' },
                        { en: 'in the library', cn: '在图书馆' },
                        { en: 'on the playground', cn: '在操场上' },
                        { en: 'every day', cn: '每天' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'Where is Ben?', cn: '本在哪里？' },
                        { en: 'He is in the library.', cn: '他在图书馆里。' },
                        { en: 'What do you usually do in the morning?', cn: '你早上通常做什么？' },
                        { en: 'I usually have breakfast at 7 o\'clock.', cn: '我通常7点吃早餐。' },
                        { en: 'He often plays football after school.', cn: '他放学后经常踢足球。' },
                        { en: 'Sometimes I read books in the library.', cn: '有时我在图书馆看书。' },
                        { en: 'She always gets up early.', cn: '她总是早起。' },
                        { en: 'I never go to bed late.', cn: '我从不晚睡。' },
                        { en: 'Where do you have lunch?', cn: '你在哪里吃午餐？' },
                        { en: 'I have lunch at school.', cn: '我在学校吃午餐。' },
                        { en: 'They are on the playground.', cn: '他们在操场上。' },
                        { en: 'What time do you go home?', cn: '你几点回家？' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'It is 3 o\'clock in the afternoon. The children are looking for Ben.', cn: '现在是下午3点。孩子们正在找本。' },
                        { speaker: 'Janet', en: 'Where is Ben? I can\'t find him.', cn: '本在哪里？我找不到他。' },
                        { speaker: 'Jiamin', en: 'Is he in the classroom?', cn: '他在教室里吗？' },
                        { speaker: 'Janet', en: 'No, he isn\'t. The classroom is empty.', cn: '不，他不在。教室是空的。' },
                        { speaker: 'Xiaoling', en: 'Maybe he is in the library. He often reads books there.', cn: '也许他在图书馆。他经常在那里看书。' },
                        { speaker: 'Jiamin', en: 'Let\'s go and check.', cn: '我们去看看吧。' },
                        { en: 'They go to the library.', cn: '他们去了图书馆。' },
                        { speaker: 'Janet', en: 'Is Ben here?', cn: '本在这里吗？' },
                        { speaker: 'Librarian', en: 'No, he isn\'t here today.', cn: '不，他今天不在这里。' },
                        { speaker: 'Xiaoling', en: 'Hmm... Where can he be?', cn: '嗯……他会在哪里呢？' },
                        { speaker: 'Jiamin', en: 'Oh! I know! He is on the playground. He sometimes plays football in the afternoon.', cn: '哦！我知道了！他在操场上。他有时下午踢足球。' },
                        { speaker: 'Janet', en: 'Let\'s go to the playground!', cn: '我们去操场吧！' },
                        { en: 'They run to the playground.', cn: '他们跑到操场。' },
                        { speaker: 'Xiaoling', en: 'Look! There he is!', cn: '看！他在那里！' },
                        { speaker: 'Ben', en: 'Hi, guys! What\'s up?', cn: '嗨，伙计们！怎么了？' },
                        { speaker: 'Janet', en: 'We were looking for you! Where were you?', cn: '我们一直在找你！你刚才在哪里？' },
                        { speaker: 'Ben', en: 'I was in the gym. I always play basketball on Wednesday afternoon.', cn: '我在体育馆。我周三下午总是打篮球。' },
                        { speaker: 'Jiamin', en: 'Oh right! It\'s Wednesday today!', cn: '哦对！今天是周三！' },
                        { en: 'All the children laugh and play together.', cn: '所有的孩子都笑了，一起玩耍。' }
                    ]
                },
        'u6': {
                    // 单词
                    words: [
                        { en: 'weekend', cn: '周末' },
                        { en: 'Saturday', cn: '星期六' },
                        { en: 'Sunday', cn: '星期日' },
                        { en: 'weekday', cn: '工作日' },
                        { en: 'busy', cn: '忙碌的' },
                        { en: 'free', cn: '空闲的' },
                        { en: 'visit', cn: '参观；拜访' },
                        { en: 'grandparent', cn: '祖父（母）；外祖父（母）' },
                        { en: 'shop', cn: '商店；购物' },
                        { en: 'shopping', cn: '购物' },
                        { en: 'cinema', cn: '电影院' },
                        { en: 'film', cn: '电影' },
                        { en: 'park', cn: '公园' },
                        { en: 'zoo', cn: '动物园' },
                        { en: 'museum', cn: '博物馆' },
                        { en: 'stay', cn: '停留；待' },
                        { en: 'watch', cn: '观看；手表' },
                        { en: 'TV', cn: '电视' },
                        { en: 'housework', cn: '家务' },
                        { en: 'clean', cn: '打扫；干净的' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'at the weekend', cn: '在周末' },
                        { en: 'on Saturday', cn: '在星期六' },
                        { en: 'on Sunday', cn: '在星期日' },
                        { en: 'visit grandparents', cn: '看望祖父母' },
                        { en: 'go shopping', cn: '去购物' },
                        { en: 'go to the cinema', cn: '去看电影' },
                        { en: 'see a film', cn: '看电影' },
                        { en: 'go to the park', cn: '去公园' },
                        { en: 'go to the zoo', cn: '去动物园' },
                        { en: 'watch TV', cn: '看电视' },
                        { en: 'do housework', cn: '做家务' },
                        { en: 'clean the house', cn: '打扫房子' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'What do you usually do at the weekend?', cn: '你周末通常做什么？' },
                        { en: 'I usually visit my grandparents on Saturday.', cn: '我星期六通常去看望祖父母。' },
                        { en: 'On Sunday, I often go shopping with my mum.', cn: '星期天，我经常和妈妈去购物。' },
                        { en: 'Sometimes we go to the cinema.', cn: '有时我们去看电影。' },
                        { en: 'Do you like watching films?', cn: '你喜欢看电影吗？' },
                        { en: 'Yes, I love seeing films.', cn: '是的，我喜欢看电影。' },
                        { en: 'I usually stay at home and watch TV.', cn: '我通常待在家里看电视。' },
                        { en: 'She helps her mother do housework.', cn: '她帮妈妈做家务。' },
                        { en: 'They clean the house every Sunday.', cn: '他们每个星期天打扫房子。' },
                        { en: 'Are you busy at the weekend?', cn: '你周末忙吗？' },
                        { en: 'Yes, I am very busy. / No, I am free.', cn: '是的，我很忙。/ 不，我很闲。' },
                        { en: 'The weekend is coming!', cn: '周末就要来了！' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'It is Friday afternoon. The children are talking about their weekend plans.', cn: '现在是周五下午。孩子们正在谈论他们的周末计划。' },
                        { speaker: 'Janet', en: 'Hooray! The weekend is coming!', cn: '太棒了！周末就要来了！' },
                        { speaker: 'Ben', en: 'Yes! What are you going to do this weekend, Janet?', cn: '是啊！珍妮特，你这个周末打算做什么？' },
                        { speaker: 'Janet', en: 'On Saturday, I usually visit my grandparents with my parents.', cn: '星期六，我通常和父母一起去看望祖父母。' },
                        { speaker: 'Jiamin', en: 'That\'s nice. Do you stay there for the whole day?', cn: '真好。你在那里待一整天吗？' },
                        { speaker: 'Janet', en: 'Yes, we have lunch and dinner together.', cn: '是的，我们一起吃午餐和晚餐。' },
                        { speaker: 'Xiaoling', en: 'What about Sunday?', cn: '星期天呢？' },
                        { speaker: 'Janet', en: 'On Sunday, I often go shopping with my mum.', cn: '星期天，我经常和妈妈去购物。' },
                        { speaker: 'Ben', en: 'I love shopping! What about you, Jiamin?', cn: '我喜欢购物！家民，你呢？' },
                        { speaker: 'Jiamin', en: 'I usually stay at home and watch TV. Sometimes I play computer games.', cn: '我通常待在家里看电视。有时我玩电脑游戏。' },
                        { speaker: 'Xiaoling', en: 'That sounds fun. I am very busy at the weekend.', cn: '听起来很有趣。我周末很忙。' },
                        { speaker: 'Ben', en: 'Really? What do you do?', cn: '真的吗？你做什么？' },
                        { speaker: 'Xiaoling', en: 'I help my mum do housework on Saturday morning.', cn: '我周六早上帮妈妈做家务。' },
                        { speaker: 'Xiaoling', en: 'Then I go to the library to read books in the afternoon.', cn: '然后下午我去图书馆看书。' },
                        { speaker: 'Janet', en: 'What about Sunday?', cn: '星期天呢？' },
                        { speaker: 'Xiaoling', en: 'On Sunday, I sometimes go to the park with my family.', cn: '星期天，我有时和家人一起去公园。' },
                        { speaker: 'Ben', en: 'Wow, you have a busy weekend!', cn: '哇，你的周末真忙！' },
                        { speaker: 'Xiaoling', en: 'Yes, but I enjoy it. It\'s happy to be with family.', cn: '是的，但我很享受。和家人在一起很开心。' },
                        { en: 'All the children agree that weekends are great.', cn: '所有的孩子都认为周末很棒。' }
                    ]
                }
    };
    
    // 注册到题库
    if (window.practiceBank && window.practiceBank.registerModuleContent) {
        window.practiceBank.registerModuleContent('p5u', 'm3', moduleContent);
    }
})();
