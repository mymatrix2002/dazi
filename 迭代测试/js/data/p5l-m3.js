// js/data/p5l-m3.js
// 五年级下册 Module 3 - Invitations 邀请

(function() {
    const moduleData = {
        id: 'm3',
        name: 'Module 3 Invitations',
        nameCn: '邀请',
        units: [
            // ========== Unit 5 ==========
            {
                id: 'u5',
                name: 'Unit 5 Would you like to go with us?',
                nameCn: '你愿意和我们一起去吗？',
                difficulty: 3,
                content: {
                    // 单词
                    words: [
                        { en: 'invitation', cn: '邀请；邀请函' },
                        { en: 'hey', cn: '嘿；喂' },
                        { en: 'guy', cn: '家伙；小伙子' },
                        { en: 'nothing', cn: '没有东西；没事' },
                        { en: 'why', cn: '为什么' },
                        { en: 'plan', cn: '计划；打算' },
                        { en: 'would', cn: '将会；愿意' },
                        { en: 'sound', cn: '听起来' },
                        { en: 'gate', cn: '大门；门口' },
                        { en: 'cool', cn: '酷的；凉爽的' },
                        { en: 'problem', cn: '问题；难题' },
                        { en: 'match', cn: '比赛；匹配' },
                        { en: 'center', cn: '中心' },
                        { en: 'supermarket', cn: '超市' },
                        { en: 'cinema', cn: '电影院' },
                        { en: 'concert', cn: '音乐会' },
                        { en: 'together', cn: '一起' },
                        { en: 'sure', cn: '当然；确信的' },
                        { en: 'afraid', cn: '害怕的；恐怕' },
                        { en: 'free', cn: '空闲的；自由的' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'would you like', cn: '你愿意……吗' },
                        { en: 'go with us', cn: '和我们一起去' },
                        { en: 'at the gate', cn: '在大门口' },
                        { en: 'no problem', cn: '没问题' },
                        { en: 'football match', cn: '足球比赛' },
                        { en: 'shopping center', cn: '购物中心' },
                        { en: 'go to the cinema', cn: '去看电影' },
                        { en: 'go to the concert', cn: '去听音乐会' },
                        { en: 'this Saturday', cn: '这个周六' },
                        { en: 'this Sunday', cn: '这个周日' },
                        { en: 'be free', cn: '有空' },
                        { en: 'I\'m afraid', cn: '恐怕；我担心' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'Would you like to go with us?', cn: '你愿意和我们一起去吗？' },
                        { en: 'Yes, I\'d love to.', cn: '是的，我很乐意。' },
                        { en: 'Sorry, I can\'t. I\'m busy.', cn: '对不起，我不能去。我很忙。' },
                        { en: 'What are you going to do this weekend?', cn: '这个周末你打算做什么？' },
                        { en: 'Nothing much. Why?', cn: '没什么事。怎么了？' },
                        { en: 'We are going to have a football match.', cn: '我们要进行一场足球比赛。' },
                        { en: 'That sounds cool!', cn: '听起来很酷！' },
                        { en: 'Let\'s meet at the school gate.', cn: '我们在学校大门口见面吧。' },
                        { en: 'What time shall we meet?', cn: '我们什么时候见面？' },
                        { en: 'Let\'s meet at 9 o\'clock.', cn: '我们九点钟见面吧。' },
                        { en: 'Are you free this afternoon?', cn: '你今天下午有空吗？' },
                        { en: 'I\'m afraid I have something to do.', cn: '恐怕我有事要做。' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'Mike meets Jiamin on the way to school.', cn: '迈克在上学的路上遇到了家民。' },
                        { speaker: 'Mike', en: 'Hey, Jiamin! What are you going to do this Sunday?', cn: '嗨，家民！这个周日你打算做什么？' },
                        { speaker: 'Jiamin', en: 'Nothing much. Why?', cn: '没什么事。怎么了？' },
                        { speaker: 'Mike', en: 'We are going to have a football match. Would you like to go with us?', cn: '我们要进行一场足球比赛。你愿意和我们一起去吗？' },
                        { speaker: 'Jiamin', en: 'Football match? That sounds cool! Yes, I\'d love to.', cn: '足球比赛？听起来很酷！是的，我很乐意。' },
                        { speaker: 'Mike', en: 'Great! We are going to play at the sports center.', cn: '太好了！我们要在体育中心比赛。' },
                        { speaker: 'Jiamin', en: 'When shall we meet?', cn: '我们什么时候见面？' },
                        { speaker: 'Mike', en: 'Let\'s meet at 8:30 in the morning.', cn: '我们早上八点半见面吧。' },
                        { speaker: 'Jiamin', en: 'Where shall we meet?', cn: '我们在哪里见面？' },
                        { speaker: 'Mike', en: 'At the school gate.', cn: '在学校大门口。' },
                        { speaker: 'Jiamin', en: 'No problem. See you then!', cn: '没问题。到时候见！' },
                        { speaker: 'Mike', en: 'See you!', cn: '再见！' },
                        { en: 'Jiamin is very happy to join the football match.', cn: '家民很高兴能参加足球比赛。' }
                    ]
                }
            },
            // ========== Unit 6 ==========
            {
                id: 'u6',
                name: 'Unit 6 See you at the party',
                nameCn: '派对上见',
                difficulty: 3,
                content: {
                    // 单词
                    words: [
                        { en: 'party', cn: '派对；聚会' },
                        { en: 'birthday', cn: '生日' },
                        { en: 'invite', cn: '邀请' },
                        { en: 'bring', cn: '带来' },
                        { en: 'present', cn: '礼物' },
                        { en: 'cake', cn: '蛋糕' },
                        { en: 'candle', cn: '蜡烛' },
                        { en: 'sing', cn: '唱歌' },
                        { en: 'dance', cn: '跳舞' },
                        { en: 'game', cn: '游戏；比赛' },
                        { en: 'fun', cn: '乐趣；有趣的' },
                        { en: 'enjoy', cn: '享受；喜欢' },
                        { en: 'arrive', cn: '到达' },
                        { en: 'leave', cn: '离开' },
                        { en: 'late', cn: '晚的；迟的' },
                        { en: 'early', cn: '早的' },
                        { en: 'tonight', cn: '今晚' },
                        { en: 'tomorrow', cn: '明天' },
                        { en: 'weekend', cn: '周末' },
                        { en: 'wonderful', cn: '极好的；了不起的' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'see you', cn: '再见' },
                        { en: 'at the party', cn: '在派对上' },
                        { en: 'birthday party', cn: '生日派对' },
                        { en: 'birthday cake', cn: '生日蛋糕' },
                        { en: 'birthday present', cn: '生日礼物' },
                        { en: 'sing a song', cn: '唱一首歌' },
                        { en: 'play games', cn: '玩游戏' },
                        { en: 'have fun', cn: '玩得开心' },
                        { en: 'have a good time', cn: '玩得愉快' },
                        { en: 'arrive at', cn: '到达' },
                        { en: 'be late for', cn: '迟到' },
                        { en: 'on time', cn: '准时' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'See you at the party!', cn: '派对上见！' },
                        { en: 'Would you like to come to my birthday party?', cn: '你愿意来参加我的生日派对吗？' },
                        { en: 'Yes, I\'d love to. Thank you for inviting me.', cn: '是的，我很乐意。谢谢你邀请我。' },
                        { en: 'When is the party?', cn: '派对是什么时候？' },
                        { en: 'It\'s this Saturday evening, at 7 o\'clock.', cn: '这周六晚上七点钟。' },
                        { en: 'Where is the party?', cn: '派对在哪里？' },
                        { en: 'It\'s at my house.', cn: '在我家。' },
                        { en: 'Should I bring a present?', cn: '我需要带礼物吗？' },
                        { en: 'No, you don\'t have to. Just come and have fun.', cn: '不用，你不必带。来玩就好。' },
                        { en: 'Don\'t be late!', cn: '别迟到了！' },
                        { en: 'I\'ll arrive on time.', cn: '我会准时到的。' },
                        { en: 'We are going to sing, dance and play games.', cn: '我们要唱歌、跳舞、玩游戏。' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'Janet meets Xiaoling in the classroom.', cn: '珍妮特在教室里遇到了小玲。' },
                        { speaker: 'Janet', en: 'Hi, Xiaoling! What are you going to do this Saturday?', cn: '嗨，小玲！这周六你打算做什么？' },
                        { speaker: 'Xiaoling', en: 'I\'m going to have a birthday party. Would you like to come?', cn: '我要办一个生日派对。你愿意来吗？' },
                        { speaker: 'Janet', en: 'A birthday party? Great! Yes, I\'d love to.', cn: '生日派对？太好了！是的，我很乐意。' },
                        { speaker: 'Xiaoling', en: 'Thank you! The party starts at 7 o\'clock in the evening.', cn: '谢谢你！派对晚上七点钟开始。' },
                        { speaker: 'Janet', en: 'Where is the party?', cn: '派对在哪里？' },
                        { speaker: 'Xiaoling', en: 'At my house.', cn: '在我家。' },
                        { speaker: 'Janet', en: 'Should I bring a birthday present?', cn: '我需要带生日礼物吗？' },
                        { speaker: 'Xiaoling', en: 'No, you don\'t have to. Just come and have fun.', cn: '不用，你不必带。来玩就好。' },
                        { speaker: 'Janet', en: 'OK! What are we going to do at the party?', cn: '好的！我们在派对上要做什么？' },
                        { speaker: 'Xiaoling', en: 'We are going to eat cake, sing songs and play games.', cn: '我们要吃蛋糕、唱歌、玩游戏。' },
                        { speaker: 'Janet', en: 'That sounds wonderful! See you at the party!', cn: '听起来太棒了！派对上见！' },
                        { speaker: 'Xiaoling', en: 'See you! Don\'t be late!', cn: '再见！别迟到了！' },
                        { en: 'Janet is very excited about the birthday party.', cn: '珍妮特对生日派对感到非常兴奋。' }
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
        
        if (!ver.grades.grade5.volumes.lower) {
            ver.grades.grade5.volumes.lower = {
                name: '下册',
                modules: []
            };
        }
        
        ver.grades.grade5.volumes.lower.modules.push(moduleData);
    }
})();
