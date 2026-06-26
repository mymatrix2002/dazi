// js/data/p4u-m6.js
// 四年级上册 Module 6: Occupations
(function() {
    'use strict';

    const moduleContent = {
        'u11': {
            words: [
                { en: 'painter', cn: '画家' },
                { en: 'teacher', cn: '老师' },
                { en: 'doctor', cn: '医生' },
                { en: 'nurse', cn: '护士' },
                { en: 'driver', cn: '司机' },
                { en: 'farmer', cn: '农民' },
                { en: 'worker', cn: '工人' },
                { en: 'cook', cn: '厨师' },
                { en: 'policeman', cn: '警察' },
                { en: 'singer', cn: '歌手' },
                { en: 'dancer', cn: '舞蹈家' },
                { en: 'writer', cn: '作家' },
                { en: 'want', cn: '想要' },
                { en: 'be', cn: '成为' },
                { en: 'dream', cn: '梦想' },
                { en: 'job', cn: '工作' }
            ],
            phrases: [
                { en: 'want to be', cn: '想成为' },
                { en: 'a great painter', cn: '一位伟大的画家' },
                { en: 'my dream job', cn: '我梦想的工作' },
                { en: 'when I grow up', cn: '当我长大' },
                { en: 'help people', cn: '帮助人们' },
                { en: 'teach English', cn: '教英语' },
                { en: 'drive a bus', cn: '开公交车' },
                { en: 'very interesting', cn: '非常有趣' }
            ],
            sentences: [
                { en: 'I want to be a painter.', cn: '我想成为一名画家。' },
                { en: 'What do you want to be?', cn: '你想成为什么？' },
                { en: 'I want to be a teacher.', cn: '我想成为一名老师。' },
                { en: 'My mother is a doctor.', cn: '我妈妈是一名医生。' },
                { en: 'His father is a driver.', cn: '他爸爸是一名司机。' },
                { en: 'I want to help people.', cn: '我想帮助人们。' },
                { en: 'She wants to be a nurse.', cn: '她想成为一名护士。' },
                { en: 'That\'s a great dream!', cn: '那是一个很棒的梦想！' }
            ],
            dialogue: [
                { speaker: 'Ms White', en: 'Children, what do you want to be when you grow up?', cn: '孩子们，你们长大以后想做什么？' },
                { speaker: 'Janet', en: 'I want to be a teacher. I want to teach English.', cn: '我想成为一名老师。我想教英语。' },
                { speaker: 'Ms White', en: 'That\'s wonderful, Janet!', cn: '太棒了，珍妮特！' },
                { speaker: 'Jiamin', en: 'I want to be a doctor. I want to help sick people.', cn: '我想成为一名医生。我想帮助生病的人。' },
                { speaker: 'Ms White', en: 'That\'s a very good dream, Jiamin.', cn: '那是一个非常好的梦想，家民。' },
                { speaker: 'Ben', en: 'I want to be a driver. I want to drive a big bus.', cn: '我想成为一名司机。我想开一辆大公交车。' },
                { speaker: 'Ms White', en: 'Interesting! What about you, Xiaoling?', cn: '真有趣！你呢，小玲？' },
                { speaker: 'Xiaoling', en: 'I want to be a painter. I love drawing.', cn: '我想成为一名画家。我喜欢画画。' },
                { speaker: 'Ms White', en: 'Great! All of you have wonderful dreams!', cn: '太好了！你们都有很棒的梦想！' }
            ]
        },
        'u12': {
            words: [
                { en: 'father', cn: '爸爸' },
                { en: 'mother', cn: '妈妈' },
                { en: 'parent', cn: '父母' },
                { en: 'uncle', cn: '叔叔' },
                { en: 'aunt', cn: '阿姨' },
                { en: 'grandfather', cn: '爷爷' },
                { en: 'grandmother', cn: '奶奶' },
                { en: 'cousin', cn: '表兄弟姐妹' },
                { en: 'job', cn: '工作' },
                { en: 'work', cn: '工作' },
                { en: 'factory', cn: '工厂' },
                { en: 'hospital', cn: '医院' },
                { en: 'school', cn: '学校' },
                { en: 'office', cn: '办公室' },
                { en: 'busy', cn: '忙碌的' },
                { en: 'hard', cn: '努力地' }
            ],
            phrases: [
                { en: 'your father\'s job', cn: '你爸爸的工作' },
                { en: 'my mother is a nurse', cn: '我妈妈是一名护士' },
                { en: 'works in a hospital', cn: '在医院工作' },
                { en: 'works in a school', cn: '在学校工作' },
                { en: 'works in a factory', cn: '在工厂工作' },
                { en: 'very busy', cn: '非常忙碌' },
                { en: 'works very hard', cn: '工作非常努力' },
                { en: 'love my parents', cn: '爱我的父母' }
            ],
            sentences: [
                { en: 'What\'s your father\'s job?', cn: '你爸爸的工作是什么？' },
                { en: 'My father is a teacher.', cn: '我爸爸是一名老师。' },
                { en: 'Where does he work?', cn: '他在哪里工作？' },
                { en: 'He works in a school.', cn: '他在一所学校工作。' },
                { en: 'My mother is a doctor.', cn: '我妈妈是一名医生。' },
                { en: 'She works in a big hospital.', cn: '她在一家大医院工作。' },
                { en: 'My parents are very busy.', cn: '我的父母非常忙碌。' },
                { en: 'They work very hard.', cn: '他们工作非常努力。' }
            ],
            dialogue: [
                { speaker: 'Xiaoling', en: 'Janet, what\'s your father\'s job?', cn: '珍妮特，你爸爸的工作是什么？' },
                { speaker: 'Janet', en: 'My father is a doctor.', cn: '我爸爸是一名医生。' },
                { speaker: 'Xiaoling', en: 'Wow, a doctor! Where does he work?', cn: '哇，医生！他在哪里工作？' },
                { speaker: 'Janet', en: 'He works in a big hospital.', cn: '他在一家大医院工作。' },
                { speaker: 'Xiaoling', en: 'That\'s great. What about your mother?', cn: '真好。你妈妈呢？' },
                { speaker: 'Janet', en: 'My mother is a teacher. She works in a primary school.', cn: '我妈妈是一名老师。她在一所小学工作。' },
                { speaker: 'Xiaoling', en: 'Are they very busy?', cn: '他们很忙吗？' },
                { speaker: 'Janet', en: 'Yes, they are very busy. But they love their jobs.', cn: '是的，他们非常忙。但是他们热爱他们的工作。' },
                { speaker: 'Xiaoling', en: 'That\'s nice. My father is a worker.', cn: '真好。我爸爸是一名工人。' },
                { speaker: 'Janet', en: 'Where does he work?', cn: '他在哪里工作？' },
                { speaker: 'Xiaoling', en: 'He works in a factory.', cn: '他在一家工厂工作。' }
            ]
        }
    };

    if (window.practiceBank && window.practiceBank.registerModuleContent) {
        window.practiceBank.registerModuleContent('p4u', 'm6', moduleContent);
    }
})();
