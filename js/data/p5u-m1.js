// js/data/p5u-m1.js
// 五年级上册 Module 1 - Hobbies 爱好

(function() {
    const moduleData = {
        id: 'm1',
        name: 'Module 1 Hobbies',
        nameCn: '爱好',
        units: [
            // ========== Unit 1 ==========
            {
                id: 'u1',
                name: 'Unit 1 What\'s your hobby?',
                nameCn: '你的爱好是什么？',
                difficulty: 2,
                content: {
                    // 单词
                    words: [
                        { en: 'hobby', cn: '爱好' },
                        { en: 'collect', cn: '收集' },
                        { en: 'stamp', cn: '邮票' },
                        { en: 'more', cn: '更多的' },
                        { en: 'country', cn: '国家' },
                        { en: 'keep', cn: '保持；饲养' },
                        { en: 'animal', cn: '动物' },
                        { en: 'every', cn: '每一个' },
                        { en: 'during', cn: '在……期间' },
                        { en: 'holiday', cn: '假日；假期' },
                        { en: 'learn', cn: '学习；学会' },
                        { en: 'person', cn: '人' },
                        { en: 'photo', cn: '照片' },
                        { en: 'chess', cn: '国际象棋' },
                        { en: 'play', cn: '玩；演奏' },
                        { en: 'music', cn: '音乐' },
                        { en: 'paint', cn: '用颜料画' },
                        { en: 'read', cn: '读；阅读' },
                        { en: 'write', cn: '写；书写' },
                        { en: 'draw', cn: '画' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'collect stamps', cn: '集邮' },
                        { en: 'keep animals', cn: '饲养动物' },
                        { en: 'play chess', cn: '下国际象棋' },
                        { en: 'play music', cn: '演奏音乐' },
                        { en: 'read books', cn: '读书' },
                        { en: 'paint pictures', cn: '画画' },
                        { en: 'take photos', cn: '拍照' },
                        { en: 'during the holiday', cn: '在假期期间' },
                        { en: 'every day', cn: '每天' },
                        { en: 'learn from', cn: '向……学习' },
                        { en: 'be interested in', cn: '对……感兴趣' },
                        { en: 'lots of', cn: '许多' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'What\'s your hobby?', cn: '你的爱好是什么？' },
                        { en: 'My hobby is collecting stamps.', cn: '我的爱好是集邮。' },
                        { en: 'I have more than 500 stamps from 20 countries.', cn: '我有来自20个国家的500多张邮票。' },
                        { en: 'His hobby is keeping animals.', cn: '他的爱好是饲养动物。' },
                        { en: 'What do you like doing?', cn: '你喜欢做什么？' },
                        { en: 'I like playing chess.', cn: '我喜欢下国际象棋。' },
                        { en: 'She is interested in music.', cn: '她对音乐感兴趣。' },
                        { en: 'I learn a lot from books.', cn: '我从书中学到很多。' },
                        { en: 'What do you usually do during the holiday?', cn: '你假期通常做什么？' },
                        { en: 'I usually read books every day.', cn: '我通常每天读书。' },
                        { en: 'That\'s a great hobby!', cn: '那是个很棒的爱好！' },
                        { en: 'It\'s very interesting.', cn: '非常有趣。' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'Janet and Jiamin are talking about hobbies.', cn: '珍妮特和家民正在谈论爱好。' },
                        { speaker: 'Janet', en: 'Hi, Jiamin. What\'s your hobby?', cn: '嗨，家民。你的爱好是什么？' },
                        { speaker: 'Jiamin', en: 'My hobby is collecting stamps.', cn: '我的爱好是集邮。' },
                        { speaker: 'Janet', en: 'Wow! That\'s great! How many stamps do you have?', cn: '哇！太棒了！你有多少张邮票？' },
                        { speaker: 'Jiamin', en: 'I have more than 500 stamps from 20 countries.', cn: '我有来自20个国家的500多张邮票。' },
                        { speaker: 'Janet', en: 'That\'s amazing! Where do you get them?', cn: '太神奇了！你从哪里得到它们的？' },
                        { speaker: 'Jiamin', en: 'Some are from my letters, and some are from my friends.', cn: '有些来自我的信件，有些来自我的朋友。' },
                        { speaker: 'Janet', en: 'What about you, Xiaoling? What\'s your hobby?', cn: '你呢，小玲？你的爱好是什么？' },
                        { speaker: 'Xiaoling', en: 'My hobby is keeping animals.', cn: '我的爱好是饲养动物。' },
                        { speaker: 'Jiamin', en: 'Really? What animals do you keep?', cn: '真的吗？你养什么动物？' },
                        { speaker: 'Xiaoling', en: 'I keep two cats and a dog. They are very cute.', cn: '我养了两只猫和一只狗。它们非常可爱。' },
                        { speaker: 'Janet', en: 'That sounds fun! I like taking photos.', cn: '听起来很有趣！我喜欢拍照。' },
                        { speaker: 'Jiamin', en: 'Taking photos is a great hobby too.', cn: '拍照也是个很棒的爱好。' },
                        { en: 'They all think hobbies are very interesting.', cn: '他们都认为爱好非常有趣。' }
                    ]
                }
            },
            // ========== Unit 2 ==========
            {
                id: 'u2',
                name: 'Unit 2 His hobby is drawing',
                nameCn: '他的爱好是画画',
                difficulty: 2,
                content: {
                    // 单词
                    words: [
                        { en: 'draw', cn: '画' },
                        { en: 'drawing', cn: '画画；图画' },
                        { en: 'colour', cn: '颜色；给……着色' },
                        { en: 'picture', cn: '图片；照片' },
                        { en: 'place', cn: '地方' },
                        { en: 'will', cn: '将；会' },
                        { en: 'together', cn: '一起' },
                        { en: 'love', cn: '爱；喜爱' },
                        { en: 'enjoy', cn: '享受；喜欢' },
                        { en: 'free', cn: '空闲的；自由的' },
                        { en: 'time', cn: '时间' },
                        { en: 'when', cn: '当……的时候' },
                        { en: 'grow', cn: '生长；种植' },
                        { en: 'flower', cn: '花' },
                        { en: 'garden', cn: '花园' },
                        { en: 'plant', cn: '植物；种植' },
                        { en: 'look', cn: '看；看起来' },
                        { en: 'beautiful', cn: '美丽的；漂亮的' },
                        { en: 'interesting', cn: '有趣的' },
                        { en: 'fun', cn: '有趣的；乐趣' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'draw pictures', cn: '画画' },
                        { en: 'colour the picture', cn: '给图画着色' },
                        { en: 'in the garden', cn: '在花园里' },
                        { en: 'grow flowers', cn: '种花' },
                        { en: 'plant trees', cn: '种树' },
                        { en: 'in one\'s free time', cn: '在某人的空闲时间' },
                        { en: 'have fun', cn: '玩得开心' },
                        { en: 'look beautiful', cn: '看起来很漂亮' },
                        { en: 'love doing sth.', cn: '喜爱做某事' },
                        { en: 'enjoy doing sth.', cn: '喜欢做某事' },
                        { en: 'every weekend', cn: '每个周末' },
                        { en: 'after school', cn: '放学后' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'His hobby is drawing.', cn: '他的爱好是画画。' },
                        { en: 'She loves drawing very much.', cn: '她非常喜欢画画。' },
                        { en: 'I enjoy growing flowers in the garden.', cn: '我喜欢在花园里种花。' },
                        { en: 'What do you do in your free time?', cn: '你空闲时间做什么？' },
                        { en: 'I usually draw pictures when I am free.', cn: '我有空的时候通常画画。' },
                        { en: 'The flowers look very beautiful.', cn: '这些花看起来很漂亮。' },
                        { en: 'We have lots of fun together.', cn: '我们在一起玩得很开心。' },
                        { en: 'My grandpa plants trees every spring.', cn: '我爷爷每年春天都种树。' },
                        { en: 'Drawing is very interesting.', cn: '画画非常有趣。' },
                        { en: 'I will show you my pictures.', cn: '我给你看我的画。' },
                        { en: 'Let\'s draw together.', cn: '我们一起画画吧。' },
                        { en: 'He is good at drawing.', cn: '他擅长画画。' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'Ben and Mike are talking about their hobbies.', cn: '本和迈克正在谈论他们的爱好。' },
                        { speaker: 'Ben', en: 'Hi, Mike. What do you usually do after school?', cn: '嗨，迈克。你放学后通常做什么？' },
                        { speaker: 'Mike', en: 'I usually draw pictures. Drawing is my hobby.', cn: '我通常画画。画画是我的爱好。' },
                        { speaker: 'Ben', en: 'Really? Do you enjoy drawing?', cn: '真的吗？你喜欢画画吗？' },
                        { speaker: 'Mike', en: 'Yes, I love drawing very much.', cn: '是的，我非常喜欢画画。' },
                        { speaker: 'Ben', en: 'What do you like drawing?', cn: '你喜欢画什么？' },
                        { speaker: 'Mike', en: 'I like drawing animals and beautiful places.', cn: '我喜欢画动物和美丽的地方。' },
                        { speaker: 'Ben', en: 'That sounds great! Can I see your pictures?', cn: '听起来很棒！我能看看你的画吗？' },
                        { speaker: 'Mike', en: 'Sure! I will show you tomorrow.', cn: '当然！我明天给你看。' },
                        { speaker: 'Ben', en: 'Thank you! My hobby is growing flowers.', cn: '谢谢你！我的爱好是种花。' },
                        { speaker: 'Mike', en: 'Growing flowers? That\'s interesting too.', cn: '种花？那也很有趣。' },
                        { speaker: 'Ben', en: 'Yes. I grow many flowers in my garden.', cn: '是的。我在花园里种了很多花。' },
                        { speaker: 'Mike', en: 'Do they look beautiful?', cn: '它们看起来漂亮吗？' },
                        { speaker: 'Ben', en: 'Yes, they look very beautiful in spring.', cn: '是的，它们春天看起来非常漂亮。' },
                        { speaker: 'Mike', en: 'I want to see your garden too!', cn: '我也想看看你的花园！' },
                        { en: 'Both Ben and Mike enjoy their hobbies very much.', cn: '本和迈克都非常享受他们的爱好。' }
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