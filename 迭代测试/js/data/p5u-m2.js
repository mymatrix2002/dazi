// js/data/p5u-m2.js
// 五年级上册 Module 2 - 能力
// 内容数据文件（懒加载用）
(function() {
    'use strict';
    
    // 模块内容数据
    const moduleContent = {
        'u3': {
                    // 单词
                    words: [
                        { en: 'can', cn: '能；能够' },
                        { en: 'can\'t', cn: '不能' },
                        { en: 'swim', cn: '游泳' },
                        { en: 'fast', cn: '快的；快地' },
                        { en: 'jump', cn: '跳' },
                        { en: 'high', cn: '高的；高地' },
                        { en: 'run', cn: '跑' },
                        { en: 'far', cn: '远的；远地' },
                        { en: 'ride', cn: '骑（马、自行车等）' },
                        { en: 'bike', cn: '自行车' },
                        { en: 'skate', cn: '滑冰' },
                        { en: 'ski', cn: '滑雪' },
                        { en: 'dance', cn: '跳舞' },
                        { en: 'sing', cn: '唱歌' },
                        { en: 'speak', cn: '说；说话' },
                        { en: 'English', cn: '英语' },
                        { en: 'Chinese', cn: '中文；汉语' },
                        { en: 'well', cn: '好' },
                        { en: 'very', cn: '很；非常' },
                        { en: 'also', cn: '也；还' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'swim very fast', cn: '游得很快' },
                        { en: 'jump high', cn: '跳得高' },
                        { en: 'run very fast', cn: '跑得很快' },
                        { en: 'jump far', cn: '跳得远' },
                        { en: 'ride a bike', cn: '骑自行车' },
                        { en: 'speak English', cn: '说英语' },
                        { en: 'speak Chinese', cn: '说中文' },
                        { en: 'sing songs', cn: '唱歌' },
                        { en: 'dance well', cn: '跳舞跳得好' },
                        { en: 'very well', cn: '非常好' },
                        { en: 'be good at', cn: '擅长' },
                        { en: 'do well in', cn: '在……方面做得好' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'I can swim very fast.', cn: '我能游得很快。' },
                        { en: 'Can you jump high?', cn: '你能跳得高吗？' },
                        { en: 'Yes, I can. / No, I can\'t.', cn: '是的，我能。/ 不，我不能。' },
                        { en: 'He can run very fast.', cn: '他能跑得很快。' },
                        { en: 'She can\'t ride a bike.', cn: '她不会骑自行车。' },
                        { en: 'Can you speak English?', cn: '你会说英语吗？' },
                        { en: 'Yes, I can speak English very well.', cn: '是的，我英语说得很好。' },
                        { en: 'What can you do?', cn: '你会做什么？' },
                        { en: 'I can sing and dance.', cn: '我会唱歌和跳舞。' },
                        { en: 'He is good at swimming.', cn: '他擅长游泳。' },
                        { en: 'She does well in English.', cn: '她英语学得好。' },
                        { en: 'I can also play the piano.', cn: '我也会弹钢琴。' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'The children are talking about what they can do.', cn: '孩子们正在谈论他们会做什么。' },
                        { speaker: 'Janet', en: 'Hi, everyone. Let\'s talk about our abilities.', cn: '嗨，大家好。我们来谈谈我们的能力吧。' },
                        { speaker: 'Jiamin', en: 'OK! I can swim very fast.', cn: '好的！我能游得很快。' },
                        { speaker: 'Ben', en: 'Really? I can swim too, but not very fast.', cn: '真的吗？我也会游泳，但不是很快。' },
                        { speaker: 'Jiamin', en: 'What about you, Xiaoling? What can you do?', cn: '你呢，小玲？你会做什么？' },
                        { speaker: 'Xiaoling', en: 'I can jump very high. I am good at the high jump.', cn: '我能跳得很高。我擅长跳高。' },
                        { speaker: 'Janet', en: 'Wow! That\'s great! Can you run fast?', cn: '哇！太棒了！你跑得快吗？' },
                        { speaker: 'Xiaoling', en: 'No, I can\'t run very fast. But I can jump far.', cn: '不，我跑得不是很快。但我能跳得远。' },
                        { speaker: 'Ben', en: 'I can run very fast. I am the fastest in my class.', cn: '我能跑得很快。我是班里最快的。' },
                        { speaker: 'Janet', en: 'That\'s amazing! Can you ride a bike, Ben?', cn: '太神奇了！本，你会骑自行车吗？' },
                        { speaker: 'Ben', en: 'Yes, I can. I ride my bike to school every day.', cn: '是的，我会。我每天骑自行车上学。' },
                        { speaker: 'Jiamin', en: 'I can ride a bike too. But I can\'t skate.', cn: '我也会骑自行车。但我不会滑冰。' },
                        { speaker: 'Xiaoling', en: 'I can skate. I go skating every winter.', cn: '我会滑冰。我每年冬天都去滑冰。' },
                        { speaker: 'Janet', en: 'Cool! I can dance well. I love dancing.', cn: '太酷了！我跳舞跳得很好。我喜欢跳舞。' },
                        { en: 'All the children have different abilities.', cn: '所有的孩子都有不同的能力。' }
                    ]
                },
        'u4': {
                    // 单词
                    words: [
                        { en: 'homework', cn: '家庭作业' },
                        { en: 'help', cn: '帮助' },
                        { en: 'problem', cn: '问题；难题' },
                        { en: 'maths', cn: '数学' },
                        { en: 'easy', cn: '容易的' },
                        { en: 'difficult', cn: '困难的' },
                        { en: 'try', cn: '尝试' },
                        { en: 'again', cn: '再；又' },
                        { en: 'sure', cn: '当然；肯定的' },
                        { en: 'sorry', cn: '对不起；抱歉的' },
                        { en: 'afraid', cn: '害怕的；担心的' },
                        { en: 'idea', cn: '主意；想法' },
                        { en: 'great', cn: '好极了；伟大的' },
                        { en: 'maybe', cn: '也许；可能' },
                        { en: 'ask', cn: '问；询问' },
                        { en: 'answer', cn: '回答；答案' },
                        { en: 'think', cn: '想；认为' },
                        { en: 'know', cn: '知道；了解' },
                        { en: 'understand', cn: '理解；明白' },
                        { en: 'show', cn: '展示；给……看' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'do one\'s homework', cn: '做作业' },
                        { en: 'help sb. with sth.', cn: '帮助某人做某事' },
                        { en: 'maths problem', cn: '数学题' },
                        { en: 'be easy for sb.', cn: '对某人来说容易' },
                        { en: 'be difficult for sb.', cn: '对某人来说困难' },
                        { en: 'have an idea', cn: '有一个主意' },
                        { en: 'good idea', cn: '好主意' },
                        { en: 'ask for help', cn: '寻求帮助' },
                        { en: 'the answer to', cn: '……的答案' },
                        { en: 'think about', cn: '思考；考虑' },
                        { en: 'try again', cn: '再试一次' },
                        { en: 'I\'m afraid not', cn: '恐怕不行' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'Can you do my homework?', cn: '你能做我的作业吗？' },
                        { en: 'I\'m afraid I can\'t.', cn: '恐怕不行。' },
                        { en: 'Can you help me with my maths?', cn: '你能帮我学数学吗？' },
                        { en: 'Sure! No problem.', cn: '当然！没问题。' },
                        { en: 'This maths problem is easy for me.', cn: '这道数学题对我来说很容易。' },
                        { en: 'It is too difficult for me.', cn: '这对我来说太难了。' },
                        { en: 'Let me try again.', cn: '让我再试一次。' },
                        { en: 'I have a good idea!', cn: '我有一个好主意！' },
                        { en: 'That\'s a great idea!', cn: '那是个好主意！' },
                        { en: 'Maybe you can ask the teacher.', cn: '也许你可以问问老师。' },
                        { en: 'I don\'t know the answer.', cn: '我不知道答案。' },
                        { en: 'I think you can do it.', cn: '我认为你能做到。' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'Jiamin has a problem with his maths homework.', cn: '家民的数学作业遇到了问题。' },
                        { speaker: 'Jiamin', en: 'Oh no! This maths problem is too difficult.', cn: '哦不！这道数学题太难了。' },
                        { speaker: 'Ben', en: 'What\'s wrong, Jiamin?', cn: '怎么了，家民？' },
                        { speaker: 'Jiamin', en: 'I can\'t do this maths problem. Can you help me?', cn: '我不会做这道数学题。你能帮我吗？' },
                        { speaker: 'Ben', en: 'Let me see. Hmm... I\'m afraid I can\'t do it either.', cn: '让我看看。嗯……恐怕我也不会做。' },
                        { speaker: 'Jiamin', en: 'What should I do?', cn: '我该怎么办？' },
                        { speaker: 'Ben', en: 'Maybe you can ask Xiaoling. She is good at maths.', cn: '也许你可以问问小玲。她数学很好。' },
                        { speaker: 'Jiamin', en: 'Good idea! Let\'s go and ask her.', cn: '好主意！我们去问问她吧。' },
                        { en: 'They go to find Xiaoling.', cn: '他们去找小玲。' },
                        { speaker: 'Jiamin', en: 'Xiaoling, can you help me with my maths homework?', cn: '小玲，你能帮我做数学作业吗？' },
                        { speaker: 'Xiaoling', en: 'Sure! Let me have a look.', cn: '当然！让我看看。' },
                        { speaker: 'Xiaoling', en: 'Oh, this problem is easy. Let me show you how to do it.', cn: '哦，这道题很简单。我来教你怎么做。' },
                        { speaker: 'Jiamin', en: 'Really? Thank you so much!', cn: '真的吗？太谢谢你了！' },
                        { speaker: 'Xiaoling', en: 'You\'re welcome. Now, first you need to...', cn: '不客气。现在，首先你需要……' },
                        { speaker: 'Jiamin', en: 'Oh, I see! I understand now.', cn: '哦，我明白了！我现在懂了。' },
                        { speaker: 'Ben', en: 'Great! You did it!', cn: '太棒了！你做出来了！' },
                        { en: 'Jiamin is very happy because he can do the problem now.', cn: '家民很高兴，因为他现在会做这道题了。' }
                    ]
                }
    };
    
    // 注册到题库
    if (window.practiceBank && window.practiceBank.registerModuleContent) {
        window.practiceBank.registerModuleContent('p5u', 'm2', moduleContent);
    }
})();
