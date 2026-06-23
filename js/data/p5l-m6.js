// js/data/p5l-m6.js
// 五年级下册 Module 6 - Directions 方向

(function() {
    const moduleData = {
        id: 'm6',
        name: 'Module 6 Directions',
        nameCn: '方向',
        units: [
            // ========== Unit 11 ==========
            {
                id: 'u11',
                name: 'Unit 11 Can you tell me the way?',
                nameCn: '你能告诉我怎么走吗？',
                difficulty: 3,
                content: {
                    // 单词
                    words: [
                        { en: 'way', cn: '路；方式' },
                        { en: 'direction', cn: '方向' },
                        { en: 'left', cn: '左边；向左' },
                        { en: 'right', cn: '右边；向右' },
                        { en: 'straight', cn: '直的；直地' },
                        { en: 'go', cn: '去；走' },
                        { en: 'turn', cn: '转弯；转动' },
                        { en: 'cross', cn: '穿过；横穿' },
                        { en: 'road', cn: '路；道路' },
                        { en: 'street', cn: '街道' },
                        { en: 'corner', cn: '角落；拐角' },
                        { en: 'building', cn: '建筑物' },
                        { en: 'hospital', cn: '医院' },
                        { en: 'bank', cn: '银行' },
                        { en: 'library', cn: '图书馆' },
                        { en: 'supermarket', cn: '超市' },
                        { en: 'park', cn: '公园' },
                        { en: 'station', cn: '车站' },
                        { en: 'miss', cn: '错过；想念' },
                        { en: 'find', cn: '找到；发现' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'the way to', cn: '去……的路' },
                        { en: 'go straight', cn: '直走' },
                        { en: 'turn left', cn: '向左转' },
                        { en: 'turn right', cn: '向右转' },
                        { en: 'go along', cn: '沿着……走' },
                        { en: 'cross the street', cn: '穿过街道' },
                        { en: 'on the left', cn: '在左边' },
                        { en: 'on the right', cn: '在右边' },
                        { en: 'at the corner', cn: '在拐角处' },
                        { en: 'next to', cn: '紧挨着' },
                        { en: 'across from', cn: '在……对面' },
                        { en: 'can\'t miss it', cn: '不会错过的' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'Can you tell me the way to the hospital?', cn: '你能告诉我去医院怎么走吗？' },
                        { en: 'Yes, of course.', cn: '是的，当然可以。' },
                        { en: 'Go straight ahead.', cn: '一直往前走。' },
                        { en: 'Turn left at the second corner.', cn: '在第二个拐角处左转。' },
                        { en: 'Then turn right at the first crossing.', cn: '然后在第一个十字路口右转。' },
                        { en: 'Go along this street.', cn: '沿着这条街走。' },
                        { en: 'The library is on your left.', cn: '图书馆在你的左边。' },
                        { en: 'It\'s next to the supermarket.', cn: '它紧挨着超市。' },
                        { en: 'It\'s across from the park.', cn: '它在公园对面。' },
                        { en: 'You can\'t miss it.', cn: '你不会错过的。' },
                        { en: 'Is it far from here?', cn: '离这儿远吗？' },
                        { en: 'No, it\'s about 5 minutes\' walk.', cn: '不远，步行大约 5 分钟。' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'One day, Ben is lost in the city. He sees a policeman.', cn: '一天，本在城里迷路了。他看到一位警察。' },
                        { speaker: 'Ben', en: 'Excuse me, sir. Can you help me?', cn: '打扰一下，先生。你能帮我吗？' },
                        { speaker: 'Policeman', en: 'Yes, of course. What\'s the matter?', cn: '当然可以。怎么了？' },
                        { speaker: 'Ben', en: 'I\'m lost. Can you tell me the way to the train station?', cn: '我迷路了。你能告诉我去火车站怎么走吗？' },
                        { speaker: 'Policeman', en: 'Sure. Go straight along this street.', cn: '当然。沿着这条街一直走。' },
                        { speaker: 'Policeman', en: 'Turn left at the second corner.', cn: '在第二个拐角处左转。' },
                        { speaker: 'Ben', en: 'Then what?', cn: '然后呢？' },
                        { speaker: 'Policeman', en: 'Then go straight and turn right at the first crossing.', cn: '然后直走，在第一个十字路口右转。' },
                        { speaker: 'Policeman', en: 'The station is on your left. You can\'t miss it.', cn: '车站就在你的左边。你不会错过的。' },
                        { speaker: 'Ben', en: 'Is it far from here?', cn: '离这儿远吗？' },
                        { speaker: 'Policeman', en: 'No, it\'s about 10 minutes\' walk.', cn: '不远，步行大约 10 分钟。' },
                        { speaker: 'Ben', en: 'Thank you very much!', cn: '非常感谢你！' },
                        { speaker: 'Policeman', en: 'You\'re welcome. Be careful!', cn: '不客气。小心点！' },
                        { en: 'Ben finds the station easily.', cn: '本很容易就找到了车站。' }
                    ]
                }
            },
            // ========== Unit 12 ==========
            {
                id: 'u12',
                name: 'Unit 12 I know a short cut',
                nameCn: '我知道一条近路',
                difficulty: 3,
                content: {
                    // 单词
                    words: [
                        { en: 'short', cn: '短的；矮的' },
                        { en: 'cut', cn: '切；近路' },
                        { en: 'shortcut', cn: '近路；捷径' },
                        { en: 'map', cn: '地图' },
                        { en: 'north', cn: '北；北方' },
                        { en: 'south', cn: '南；南方' },
                        { en: 'east', cn: '东；东方' },
                        { en: 'west', cn: '西；西方' },
                        { en: 'front', cn: '前面；正面' },
                        { en: 'behind', cn: '在……后面' },
                        { en: 'between', cn: '在……之间' },
                        { en: 'near', cn: '近的；靠近' },
                        { en: 'far', cn: '远的' },
                        { en: 'through', cn: '穿过；通过' },
                        { en: 'pass', cn: '经过；通过' },
                        { en: 'path', cn: '小路；路径' },
                        { en: 'village', cn: '村庄' },
                        { en: 'city', cn: '城市' },
                        { en: 'faster', cn: '更快的' },
                        { en: 'save', cn: '节省；挽救' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'a short cut', cn: '一条近路' },
                        { en: 'look at the map', cn: '看地图' },
                        { en: 'in front of', cn: '在……前面' },
                        { en: 'behind the building', cn: '在建筑物后面' },
                        { en: 'between A and B', cn: '在 A 和 B 之间' },
                        { en: 'near here', cn: '在这附近' },
                        { en: 'far away', cn: '遥远' },
                        { en: 'go through', cn: '穿过' },
                        { en: 'walk past', cn: '走过' },
                        { en: 'save time', cn: '节省时间' },
                        { en: 'on the map', cn: '在地图上' },
                        { en: 'the way to', cn: '去……的路' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'I know a short cut.', cn: '我知道一条近路。' },
                        { en: 'It can save us a lot of time.', cn: '它能节省我们很多时间。' },
                        { en: 'Look at the map.', cn: '看地图。' },
                        { en: 'The park is in front of the library.', cn: '公园在图书馆前面。' },
                        { en: 'The school is behind the hospital.', cn: '学校在医院后面。' },
                        { en: 'The bank is between the supermarket and the park.', cn: '银行在超市和公园之间。' },
                        { en: 'Is there a shortcut to the station?', cn: '有去车站的近路吗？' },
                        { en: 'Yes, go through this small path.', cn: '有，穿过这条小路。' },
                        { en: 'It\'s much faster.', cn: '这样快多了。' },
                        { en: 'We can save 10 minutes.', cn: '我们可以节省 10 分钟。' },
                        { en: 'Where is the village on the map?', cn: '村庄在地图上的哪里？' },
                        { en: 'It\'s in the south of the city.', cn: '在城市的南边。' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'Janet and Xiaoling are going to the museum. They are looking at a map.', cn: '珍妮特和小玲要去博物馆。她们正在看地图。' },
                        { speaker: 'Xiaoling', en: 'Janet, are we going the right way?', cn: '珍妮特，我们走的路对吗？' },
                        { speaker: 'Janet', en: 'I think so. But it\'s a long way.', cn: '我想是的。但是路很远。' },
                        { speaker: 'Xiaoling', en: 'I know a short cut. We can save time.', cn: '我知道一条近路。我们可以节省时间。' },
                        { speaker: 'Janet', en: 'Really? Where is it?', cn: '真的吗？在哪里？' },
                        { speaker: 'Xiaoling', en: 'Look at the map. Go through this small park.', cn: '看地图。穿过这个小公园。' },
                        { speaker: 'Xiaoling', en: 'Then walk past the library and turn right.', cn: '然后走过图书馆，右转。' },
                        { speaker: 'Janet', en: 'Is that faster?', cn: '那样更快吗？' },
                        { speaker: 'Xiaoling', en: 'Yes, much faster. We can save about 15 minutes.', cn: '是的，快多了。我们可以节省大约 15 分钟。' },
                        { speaker: 'Janet', en: 'Great! Let\'s take the short cut.', cn: '太好了！我们走近路吧。' },
                        { speaker: 'Xiaoling', en: 'OK. Follow me!', cn: '好的。跟我来！' },
                        { en: 'They take the short cut and arrive at the museum quickly.', cn: '她们走了近路，很快就到达了博物馆。' }
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
