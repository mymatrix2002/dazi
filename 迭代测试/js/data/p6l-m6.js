// js/data/p6l-m6.js
// 六年级下册 Module 6 - 回顾与总结
// 内容数据文件（懒加载用）
(function() {
    'use strict';
    
    // 模块内容数据
    const moduleContent = {
        'u11': {
                    // 单词（综合复习）
                    words: [
                        { en: 'review', cn: '复习；回顾' },
                        { en: 'look back', cn: '回顾' },
                        { en: 'remember', cn: '记住；记得' },
                        { en: 'forget', cn: '忘记' },
                        { en: 'learn', cn: '学习' },
                        { en: 'study', cn: '学习；研究' },
                        { en: 'knowledge', cn: '知识' },
                        { en: 'important', cn: '重要的' },
                        { en: 'useful', cn: '有用的' },
                        { en: 'practice', cn: '练习' },
                        { en: 'improve', cn: '提高；改善' },
                        { en: 'progress', cn: '进步' },
                        { en: 'hard-working', cn: '努力的' },
                        { en: 'careful', cn: '仔细的；小心的' },
                        { en: 'confident', cn: '自信的' },
                        { en: 'proud', cn: '骄傲的；自豪的' },
                        { en: 'grade', cn: '年级；成绩' },
                        { en: 'exam', cn: '考试' },
                        { en: 'test', cn: '测试' },
                        { en: 'result', cn: '结果' }
                    ],
                    // 短语（综合复习）
                    phrases: [
                        { en: 'let\'s look back', cn: '让我们回顾一下' },
                        { en: 'review the lessons', cn: '复习功课' },
                        { en: 'go over', cn: '复习；仔细检查' },
                        { en: 'remember well', cn: '记得清楚' },
                        { en: 'never forget', cn: '永不忘记' },
                        { en: 'learn from', cn: '向……学习' },
                        { en: 'study hard', cn: '努力学习' },
                        { en: 'practice more', cn: '多练习' },
                        { en: 'make progress', cn: '取得进步' },
                        { en: 'improve English', cn: '提高英语' },
                        { en: 'be proud of', cn: '为……自豪' },
                        { en: 'get ready for', cn: '为……做准备' }
                    ],
                    // 句型（综合复习）
                    sentences: [
                        { en: 'Let\'s look back at what we have learned.', cn: '让我们回顾一下我们学过的内容。' },
                        { en: 'We have learned many new words this term.', cn: '这学期我们学了很多新单词。' },
                        { en: 'We have learned many useful sentences.', cn: '我们学了很多有用的句子。' },
                        { en: 'We learned about famous people and animals.', cn: '我们学习了名人和动物的知识。' },
                        { en: 'We learned about good manners and travel.', cn: '我们学习了礼仪和旅行的知识。' },
                        { en: 'It is important to review what we have learned.', cn: '复习我们学过的内容很重要。' },
                        { en: 'Practice makes perfect.', cn: '熟能生巧。' },
                        { en: 'The more we practice, the better we will be.', cn: '我们练习得越多，就会越好。' },
                        { en: 'We have made great progress this term.', cn: '这学期我们取得了很大的进步。' },
                        { en: 'We should be proud of ourselves.', cn: '我们应该为自己感到自豪。' },
                        { en: 'Let\'s get ready for the final exam.', cn: '让我们为期末考试做好准备。' },
                        { en: 'I believe we can do well!', cn: '我相信我们能做得很好！' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'The term is coming to an end. The students are reviewing their lessons.', cn: '学期快结束了。学生们正在复习功课。' },
                        { speaker: 'Teacher', en: 'Boys and girls, this term is almost over.', cn: '孩子们，这学期快结束了。' },
                        { speaker: 'Teacher', en: 'Let\'s look back at what we have learned.', cn: '让我们回顾一下我们学过的内容。' },
                        { speaker: 'Jiamin', en: 'We learned many new words, right?', cn: '我们学了很多新单词，对吗？' },
                        { speaker: 'Teacher', en: 'Yes. We learned about two hundred new words.', cn: '是的。我们学了大约两百个新单词。' },
                        { speaker: 'Janet', en: 'We learned many interesting stories too.', cn: '我们也学了很多有趣的故事。' },
                        { speaker: 'Ben', en: 'We learned about famous people like Dr Sun Yatsen.', cn: '我们学习了像孙中山先生这样的名人。' },
                        { speaker: 'Xiaoling', en: 'We learned about animals and how to protect them.', cn: '我们学习了动物以及如何保护它们。' },
                        { speaker: 'Jiamin', en: 'We learned about good manners too.', cn: '我们也学习了良好的礼仪。' },
                        { speaker: 'Janet', en: 'And we learned about travel abroad.', cn: '还有出国旅行的知识。' },
                        { speaker: 'Teacher', en: 'Excellent! You have learned so much.', cn: '太棒了！你们学了这么多东西。' },
                        { speaker: 'Teacher', en: 'Now it is time to review and practice.', cn: '现在是复习和练习的时候了。' },
                        { speaker: 'Ben', en: 'Why is reviewing important?', cn: '为什么复习很重要？' },
                        { speaker: 'Teacher', en: 'Because practice makes perfect.', cn: '因为熟能生巧。' },
                        { speaker: 'Teacher', en: 'The more you practice, the better you will be.', cn: '你们练习得越多，就会越好。' },
                        { speaker: 'Xiaoling', en: 'We have made great progress this term.', cn: '这学期我们取得了很大的进步。' },
                        { speaker: 'Teacher', en: 'Yes! I am very proud of you all.', cn: '是的！我为你们所有人感到骄傲。' },
                        { speaker: 'Teacher', en: 'Keep working hard and you will do even better.', cn: '继续努力，你们会做得更好。' },
                        { speaker: 'All the students', en: 'Thank you, teacher!', cn: '谢谢老师！' },
                        { en: 'All the students are ready for the final exam.', cn: '所有的学生都为期末考试做好了准备。' }
                    ]
                },
        'u12': {
                    // 单词（综合复习）
                    words: [
                        { en: 'summer', cn: '夏天' },
                        { en: 'holiday', cn: '假期' },
                        { en: 'summer holiday', cn: '暑假' },
                        { en: 'plan', cn: '计划' },
                        { en: 'future', cn: '未来' },
                        { en: 'dream', cn: '梦想' },
                        { en: 'hope', cn: '希望' },
                        { en: 'wish', cn: '愿望；祝愿' },
                        { en: 'best wishes', cn: '最美好的祝愿' },
                        { en: 'friend', cn: '朋友' },
                        { en: 'friendship', cn: '友谊' },
                        { en: 'together', cn: '一起' },
                        { en: 'happy', cn: '快乐的' },
                        { en: 'wonderful', cn: '精彩的；极好的' },
                        { en: 'amazing', cn: '令人惊奇的' },
                        { en: 'memorable', cn: '难忘的' },
                        { en: 'remember', cn: '记住' },
                        { en: 'forever', cn: '永远' },
                        { en: 'keep in touch', cn: '保持联系' },
                        { en: 'goodbye', cn: '再见' }
                    ],
                    // 短语（综合复习）
                    phrases: [
                        { en: 'summer holiday', cn: '暑假' },
                        { en: 'plan for the future', cn: '未来的计划' },
                        { en: 'dream of', cn: '梦想' },
                        { en: 'hope to do', cn: '希望做……' },
                        { en: 'best wishes', cn: '最美好的祝愿' },
                        { en: 'good friends', cn: '好朋友' },
                        { en: 'study together', cn: '一起学习' },
                        { en: 'play together', cn: '一起玩' },
                        { en: 'have a good time', cn: '玩得开心' },
                        { en: 'keep in touch', cn: '保持联系' },
                        { en: 'say goodbye', cn: '说再见' },
                        { en: 'see you next term', cn: '下学期见' }
                    ],
                    // 句型（综合复习）
                    sentences: [
                        { en: 'The summer holiday is coming soon.', cn: '暑假很快就要来了。' },
                        { en: 'What are your plans for the summer holiday?', cn: '你暑假有什么计划？' },
                        { en: 'I hope you have a wonderful summer holiday.', cn: '我希望你有一个美好的暑假。' },
                        { en: 'We have had a wonderful school year together.', cn: '我们一起度过了美好的一学年。' },
                        { en: 'We have learned so much and made many friends.', cn: '我们学到了很多，交了很多朋友。' },
                        { en: 'Our friendship is very important to me.', cn: '我们的友谊对我来说很重要。' },
                        { en: 'I will remember this year forever.', cn: '我会永远记住这一年。' },
                        { en: 'What is your dream for the future?', cn: '你对未来有什么梦想？' },
                        { en: 'I hope your dreams will come true.', cn: '我希望你的梦想会实现。' },
                        { en: 'Best wishes to you all!', cn: '给大家最美好的祝愿！' },
                        { en: 'Let\'s keep in touch during the holiday.', cn: '假期让我们保持联系。' },
                        { en: 'See you next term! Goodbye!', cn: '下学期见！再见！' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'It is the last day of school. The students are saying goodbye to each other.', cn: '这是学期的最后一天。学生们正在互相道别。' },
                        { speaker: 'Jiamin', en: 'Wow! This school year went by so fast!', cn: '哇！这一学年过得好快啊！' },
                        { speaker: 'Janet', en: 'Yes. We have learned so much this year.', cn: '是啊。今年我们学了这么多东西。' },
                        { speaker: 'Ben', en: 'And we have had so much fun together.', cn: '我们一起玩得也很开心。' },
                        { speaker: 'Xiaoling', en: 'I will remember this year forever.', cn: '我会永远记住这一年。' },
                        { speaker: 'Jiamin', en: 'What are your plans for the summer holiday?', cn: '你们暑假有什么计划？' },
                        { speaker: 'Janet', en: 'I will go to Beijing to visit my grandparents.', cn: '我要去北京看望我的祖父母。' },
                        { speaker: 'Ben', en: 'I will travel to Japan with my family.', cn: '我要和家人去日本旅行。' },
                        { speaker: 'Xiaoling', en: 'I will stay in Guangzhou and study English.', cn: '我会待在广州学习英语。' },
                        { speaker: 'Xiaoling', en: 'And my pen pal Amy will come to visit me!', cn: '还有我的笔友艾米会来看我！' },
                        { speaker: 'Jiamin', en: 'That sounds amazing!', cn: '听起来太棒了！' },
                        { speaker: 'Janet', en: 'I hope everyone has a wonderful summer holiday.', cn: '我希望每个人都有一个美好的暑假。' },
                        { speaker: 'Ben', en: 'Best wishes to you all!', cn: '给大家最美好的祝愿！' },
                        { speaker: 'Xiaoling', en: 'Let\'s keep in touch during the holiday.', cn: '假期让我们保持联系。' },
                        { speaker: 'Jiamin', en: 'Yes! We can chat online and share photos.', cn: '好的！我们可以网上聊天，分享照片。' },
                        { speaker: 'Janet', en: 'I will miss you all.', cn: '我会想念你们所有人的。' },
                        { speaker: 'Ben', en: 'Me too. You are all my best friends.', cn: '我也是。你们都是我最好的朋友。' },
                        { speaker: 'Xiaoling', en: 'See you next term!', cn: '下学期见！' },
                        { speaker: 'All the students', en: 'Goodbye! Have a great summer!', cn: '再见！暑假愉快！' },
                        { en: 'All the students leave school with big smiles on their faces.', cn: '所有的学生都面带笑容地离开了学校。' }
                    ]
                }
    };
    
    // 注册到题库
    if (window.practiceBank && window.practiceBank.registerModuleContent) {
        window.practiceBank.registerModuleContent('p6l', 'm6', moduleContent);
    }
})();
