// js/data/p5u-m6.js
// 五年级上册 Module 6 - Weather 天气

(function() {
    const moduleData = {
        id: 'm6',
        name: 'Module 6 Weather',
        nameCn: '天气',
        units: [
            // ========== Unit 11 ==========
            {
                id: 'u11',
                name: 'Unit 11 What\'s the weather like today?',
                nameCn: '今天天气怎么样？',
                difficulty: 2,
                content: {
                    // 单词
                    words: [
                        { en: 'weather', cn: '天气' },
                        { en: 'sunny', cn: '晴朗的' },
                        { en: 'cloudy', cn: '多云的' },
                        { en: 'rainy', cn: '下雨的；多雨的' },
                        { en: 'windy', cn: '有风的；多风的' },
                        { en: 'snowy', cn: '下雪的；多雪的' },
                        { en: 'hot', cn: '热的' },
                        { en: 'warm', cn: '温暖的' },
                        { en: 'cool', cn: '凉爽的' },
                        { en: 'cold', cn: '寒冷的' },
                        { en: 'today', cn: '今天' },
                        { en: 'tomorrow', cn: '明天' },
                        { en: 'yesterday', cn: '昨天' },
                        { en: 'temperature', cn: '温度' },
                        { en: 'degree', cn: '度；度数' },
                        { en: 'umbrella', cn: '雨伞' },
                        { en: 'coat', cn: '外套；大衣' },
                        { en: 'raincoat', cn: '雨衣' },
                        { en: 'report', cn: '报告；报道' },
                        { en: 'forecast', cn: '预报；预测' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'weather report', cn: '天气预报' },
                        { en: 'weather forecast', cn: '天气预报' },
                        { en: 'What\'s the weather like?', cn: '天气怎么样？' },
                        { en: 'sunny and hot', cn: '晴朗又炎热' },
                        { en: 'cloudy and cool', cn: '多云又凉爽' },
                        { en: 'rainy and wet', cn: '下雨又潮湿' },
                        { en: 'windy and cold', cn: '有风又寒冷' },
                        { en: 'take an umbrella', cn: '带把伞' },
                        { en: 'wear a coat', cn: '穿外套' },
                        { en: 'put on a raincoat', cn: '穿上雨衣' },
                        { en: 'high temperature', cn: '高温' },
                        { en: 'low temperature', cn: '低温' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'What\'s the weather like today?', cn: '今天天气怎么样？' },
                        { en: 'It\'s sunny and hot.', cn: '天气晴朗又炎热。' },
                        { en: 'It\'s cloudy and cool.', cn: '天气多云又凉爽。' },
                        { en: 'It\'s rainy. Don\'t forget to take an umbrella.', cn: '下雨了。别忘了带伞。' },
                        { en: 'It\'s very cold today. You should wear a coat.', cn: '今天很冷。你应该穿件外套。' },
                        { en: 'What\'s the temperature?', cn: '温度是多少？' },
                        { en: 'The high temperature is 30 degrees.', cn: '最高温度是30度。' },
                        { en: 'The low temperature is 15 degrees.', cn: '最低温度是15度。' },
                        { en: 'What will the weather be like tomorrow?', cn: '明天天气会怎么样？' },
                        { en: 'It will be sunny tomorrow.', cn: '明天会是晴天。' },
                        { en: 'It will rain tomorrow.', cn: '明天会下雨。' },
                        { en: 'Let\'s watch the weather report.', cn: '我们看天气预报吧。' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'Janet and Xiaoling are talking about the weather.', cn: '珍妮特和小玲正在谈论天气。' },
                        { speaker: 'Janet', en: 'Good morning, Xiaoling!', cn: '早上好，小玲！' },
                        { speaker: 'Xiaoling', en: 'Good morning, Janet! What a nice day!', cn: '早上好，珍妮特！天气真好啊！' },
                        { speaker: 'Janet', en: 'Yes. It\'s sunny and warm.', cn: '是啊。天气晴朗又温暖。' },
                        { speaker: 'Xiaoling', en: 'What\'s the temperature today?', cn: '今天温度是多少？' },
                        { speaker: 'Janet', en: 'The high temperature is 25 degrees. It\'s very comfortable.', cn: '最高温度25度。非常舒服。' },
                        { speaker: 'Xiaoling', en: 'Great! What will the weather be like tomorrow?', cn: '太好了！明天天气会怎么样？' },
                        { speaker: 'Janet', en: 'I watched the weather report last night.', cn: '我昨晚看了天气预报。' },
                        { speaker: 'Janet', en: 'It will be cloudy and cool tomorrow.', cn: '明天会是多云，天气凉爽。' },
                        { speaker: 'Xiaoling', en: 'That\'s nice. What about the weekend?', cn: '那不错。周末呢？' },
                        { speaker: 'Janet', en: 'It will be rainy on Saturday.', cn: '周六会下雨。' },
                        { speaker: 'Xiaoling', en: 'Oh no! We planned to go to the park.', cn: '哦不！我们计划去公园的。' },
                        { speaker: 'Janet', en: 'Don\'t worry. It will be sunny again on Sunday.', cn: '别担心。周日又会是晴天。' },
                        { speaker: 'Xiaoling', en: 'Really? That\'s great!', cn: '真的吗？太好了！' },
                        { speaker: 'Janet', en: 'Yes. But it will be a little cold on Sunday morning.', cn: '是的。但是周日早上会有点冷。' },
                        { speaker: 'Xiaoling', en: 'OK. I will wear a coat.', cn: '好的。我会穿件外套。' },
                        { speaker: 'Janet', en: 'And don\'t forget to take an umbrella on Saturday.', cn: '周六别忘了带伞。' },
                        { speaker: 'Xiaoling', en: 'I won\'t. Thank you for telling me!', cn: '我不会忘的。谢谢你告诉我！' },
                        { en: 'Both girls are happy to know the weather forecast.', cn: '两个女孩都很高兴知道了天气预报。' }
                    ]
                }
            },
            // ========== Unit 12 ==========
            {
                id: 'u12',
                name: 'Unit 12 Four seasons in one day',
                nameCn: '一天四季',
                difficulty: 3,
                content: {
                    // 单词
                    words: [
                        { en: 'season', cn: '季节' },
                        { en: 'spring', cn: '春天；春季' },
                        { en: 'summer', cn: '夏天；夏季' },
                        { en: 'autumn', cn: '秋天；秋季' },
                        { en: 'winter', cn: '冬天；冬季' },
                        { en: 'four', cn: '四' },
                        { en: 'change', cn: '改变；变化' },
                        { en: 'quickly', cn: '迅速地；快地' },
                        { en: 'strange', cn: '奇怪的；陌生的' },
                        { en: 'surprise', cn: '惊奇；惊讶' },
                        { en: 'morning', cn: '早晨；上午' },
                        { en: 'afternoon', cn: '下午' },
                        { en: 'evening', cn: '晚上；傍晚' },
                        { en: 'night', cn: '夜晚' },
                        { en: 'start', cn: '开始' },
                        { en: 'end', cn: '结束；末尾' },
                        { en: 'cloud', cn: '云' },
                        { en: 'rain', cn: '雨；下雨' },
                        { en: 'sun', cn: '太阳；阳光' },
                        { en: 'wind', cn: '风' }
                    ],
                    // 短语
                    phrases: [
                        { en: 'four seasons', cn: '四季' },
                        { en: 'in spring', cn: '在春天' },
                        { en: 'in summer', cn: '在夏天' },
                        { en: 'in autumn', cn: '在秋天' },
                        { en: 'in winter', cn: '在冬天' },
                        { en: 'four seasons in one day', cn: '一天四季' },
                        { en: 'change quickly', cn: '变化很快' },
                        { en: 'in the morning', cn: '在早上' },
                        { en: 'in the afternoon', cn: '在下午' },
                        { en: 'in the evening', cn: '在晚上' },
                        { en: 'at night', cn: '在夜晚' },
                        { en: 'be surprised at', cn: '对……感到惊讶' }
                    ],
                    // 句型
                    sentences: [
                        { en: 'There are four seasons in a year.', cn: '一年有四个季节。' },
                        { en: 'Spring is warm and beautiful.', cn: '春天温暖而美丽。' },
                        { en: 'Summer is hot and sunny.', cn: '夏天炎热而晴朗。' },
                        { en: 'Autumn is cool and colourful.', cn: '秋天凉爽而多彩。' },
                        { en: 'Winter is cold and snowy.', cn: '冬天寒冷而多雪。' },
                        { en: 'The weather changes quickly.', cn: '天气变化很快。' },
                        { en: 'It is like four seasons in one day.', cn: '就像一天有四季。' },
                        { en: 'In the morning, it is sunny and warm.', cn: '早上，天气晴朗温暖。' },
                        { en: 'In the afternoon, it becomes cloudy and windy.', cn: '下午，天气变得多云又有风。' },
                        { en: 'In the evening, it starts to rain.', cn: '晚上，开始下雨了。' },
                        { en: 'At night, it is very cold.', cn: '夜晚，天气非常冷。' },
                        { en: 'People are surprised at the strange weather.', cn: '人们对这奇怪的天气感到惊讶。' }
                    ],
                    // 课文
                    dialogue: [
                        { en: 'Ben and Jiamin are talking about the strange weather in England.', cn: '本和家民正在谈论英国奇怪的天气。' },
                        { speaker: 'Jiamin', en: 'Ben, I hear the weather in England is very strange.', cn: '本，我听说英国的天气很奇怪。' },
                        { speaker: 'Ben', en: 'Yes, it is. The weather changes very quickly.', cn: '是的，确实。天气变化非常快。' },
                        { speaker: 'Jiamin', en: 'Really? How strange?', cn: '真的吗？有多奇怪？' },
                        { speaker: 'Ben', en: 'It is like four seasons in one day.', cn: '就像一天有四季。' },
                        { speaker: 'Jiamin', en: 'Four seasons in one day? That sounds amazing!', cn: '一天四季？听起来太神奇了！' },
                        { speaker: 'Ben', en: 'Let me tell you about a typical day.', cn: '我给你讲讲典型的一天吧。' },
                        { speaker: 'Ben', en: 'In the morning, the sun is shining. It is warm, like spring.', cn: '早上，阳光灿烂。天气温暖，就像春天。' },
                        { speaker: 'Jiamin', en: 'That sounds nice.', cn: '听起来不错。' },
                        { speaker: 'Ben', en: 'Then in the afternoon, dark clouds come. It becomes cloudy and windy.', cn: '然后到了下午，乌云来了。天气变得多云又有风。' },
                        { speaker: 'Ben', en: 'It is cool, just like autumn.', cn: '天气凉爽，就像秋天。' },
                        { speaker: 'Jiamin', en: 'Oh, that changes fast!', cn: '哦，变化得真快！' },
                        { speaker: 'Ben', en: 'Then in the evening, it starts to rain heavily.', cn: '然后到了晚上，开始下大雨。' },
                        { speaker: 'Ben', en: 'It is cold and wet, like winter.', cn: '又冷又湿，就像冬天。' },
                        { speaker: 'Jiamin', en: 'Wow! That is really like four seasons in one day!', cn: '哇！真的就像一天有四季！' },
                        { speaker: 'Ben', en: 'Yes. People are often surprised by the weather.', cn: '是的。人们经常对天气感到惊讶。' },
                        { speaker: 'Jiamin', en: 'What do people do then?', cn: '那人们怎么办呢？' },
                        { speaker: 'Ben', en: 'They always take an umbrella and a coat with them.', cn: '他们总是随身带着伞和外套。' },
                        { speaker: 'Jiamin', en: 'That\'s a good idea. You never know what the weather will be like.', cn: '好主意。你永远不知道天气会变成什么样。' },
                        { speaker: 'Ben', en: 'Exactly! That\'s why English people always talk about the weather.', cn: '没错！这就是为什么英国人总是谈论天气。' },
                        { en: 'Jiamin finds the weather in England very interesting.', cn: '家民觉得英国的天气很有趣。' }
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
