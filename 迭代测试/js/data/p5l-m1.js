// js/data/p5l-m1.js
// 广州教科版 五年级下册 Module1 Seasons 实拍课本原版校正
(function() {
    'use strict';
    const moduleContent = {
        "u1": {
            "words": [
                { "en": "colourful", "cn": "五颜六色的" },
                { "en": "prefer", "cn": "更喜欢" },
                { "en": "winter", "cn": "冬天" },
                { "en": "either", "cn": "也（用于否定句）" },
                { "en": "autumn", "cn": "秋天" },
                { "en": "fall", "cn": "秋天（美式）" },
                { "en": "ski", "cn": "滑雪" },
                { "en": "skate", "cn": "滑冰" },
                { "en": "plant", "cn": "种植" },
                { "en": "camp", "cn": "野营" },
                { "en": "spring", "cn": "春天" },
                { "en": "summer", "cn": "夏天" },
                { "en": "season", "cn": "季节" },
                { "en": "favourite", "cn": "最喜欢的" },
                { "en": "kite", "cn": "风筝" },
                { "en": "windy", "cn": "多风的" },
                { "en": "swim", "cn": "游泳" },
                { "en": "snowman", "cn": "雪人" }
            ],
            "phrases": [
                { "en": "go camping", "cn": "去野营" },
                { "en": "go skiing", "cn": "去滑雪" },
                { "en": "go skating", "cn": "去滑冰" },
                { "en": "plant flowers", "cn": "种花" },
                { "en": "play outdoors", "cn": "在户外玩耍" },
                { "en": "fly a kite", "cn": "放风筝" },
                { "en": "make a snowman", "cn": "堆雪人" },
                { "en": "go swimming", "cn": "去游泳" },
                { "en": "favourite season", "cn": "最喜欢的季节" },
                { "en": "look at", "cn": "看一看" },
                { "en": "in the tree", "cn": "在树上" }
            ],
            "sentences": [
                { "en": "What's your favourite season?", "cn": "你最喜欢什么季节？" },
                { "en": "My favourite season is spring.", "cn": "我最喜欢春天。" },
                { "en": "I prefer autumn.", "cn": "我更喜欢秋天。" },
                { "en": "I don't like summer and I don't like winter, either.", "cn": "我不喜欢夏天，也不喜欢冬天。" },
                { "en": "It's very windy and I can fly a kite.", "cn": "秋天风很大，我可以放风筝。" },
                { "en": "In spring, I can plant flowers.", "cn": "春天我可以种花。" },
                { "en": "In summer, I can go swimming.", "cn": "夏天我可以去游泳。" },
                { "en": "In winter, I can make a snowman.", "cn": "冬天我可以堆雪人。" }
            ],
            "dialogue": [
                { "en": "Xiaoling, Ben and Jiamin are talking about their favourite seasons in the park.", "cn": "小玲、本和嘉明正在公园里谈论他们最喜欢的季节。" },
                { "speaker": "Xiaoling", "en": "Look at all the colourful flowers and the beautiful birds in the trees. I really love spring. What's your favourite season, Ben?", "cn": "看树上五彩缤纷的花儿和漂亮的小鸟，我太喜欢春天了。本，你最喜欢哪个季节？" },
                { "speaker": "Ben", "en": "Summer. I love swimming and summer is the best time for swimming. Do you like summer, Jiamin?", "cn": "夏天。我喜欢游泳，夏天最适合游泳。嘉明，你喜欢夏天吗？" },
                { "speaker": "Jiamin", "en": "I like swimming but I don't like summer. It is too hot. I prefer winter. When it snows, I can make a snowman.", "cn": "我喜欢游泳，但不喜欢夏天，太热了。我更喜欢冬天，下雪的时候我可以堆雪人。" },
                { "speaker": "Janet", "en": "I don't like summer and I don't like winter, either. My favourite season is autumn. It's very windy and I can fly a kite.", "cn": "我既不喜欢夏天，也不喜欢冬天。我最喜欢秋天，风很大，我可以放风筝。" }
            ]
        },
        "u2": {
            "words": [
                { "en": "middle", "cn": "中间；中部" },
                { "en": "classmate", "cn": "同班同学" },
                { "en": "Australia", "cn": "澳大利亚" },
                { "en": "answer", "cn": "回答" },
                { "en": "snow", "cn": "雪；下雪" },
                { "en": "ice", "cn": "冰" },
                { "en": "during", "cn": "在……期间" },
                { "en": "holiday", "cn": "假期" },
                { "en": "weather", "cn": "天气" },
                { "en": "warm", "cn": "温暖的" },
                { "en": "cool", "cn": "凉爽的" },
                { "en": "cold", "cn": "寒冷的" },
                { "en": "sunny", "cn": "晴朗的" },
                { "en": "rainy", "cn": "下雨的" },
                { "en": "cousin", "cn": "表/堂兄（弟）" },
                { "en": "visit", "cn": "拜访；探望" },
                { "en": "understand", "cn": "明白；理解" },
                { "en": "January", "cn": "一月" },
                { "en": "February", "cn": "二月" },
                { "en": "July", "cn": "七月" },
                { "en": "August", "cn": "八月" }
            ],
            "phrases": [
                { "en": "the middle of winter", "cn": "隆冬时节" },
                { "en": "summer holidays", "cn": "暑假" },
                { "en": "from December to February", "cn": "十二月到二月" },
                { "en": "from July to August", "cn": "七月到八月" },
                { "en": "go swimming every day", "cn": "每天去游泳" }
            ],
            "sentences": [
                { "en": "It's the middle of winter in January.", "cn": "一月正值隆冬时节。" },
                { "en": "Summer in Australia is from December to February.", "cn": "澳大利亚的夏天是十二月到二月。" },
                { "en": "When it is summer in Australia, it is winter in China.", "cn": "澳大利亚是夏天的时候，中国是冬天。" },
                { "en": "We can go swimming every day from July to August in China.", "cn": "在中国，七月到八月我们可以每天游泳。" }
            ],
            "dialogue": [
                { "en": "Ben introduces his cousin Reg from Australia to his classmates, they talk about different seasons in two countries.", "cn": "本向同学们介绍来自澳大利亚的表哥Reg，他们聊两个国家相反的季节。" },
                { "speaker": "Ben", "en": "Hi, everyone! This is my cousin Reg. He is visiting me for the summer holidays.", "cn": "大家好！这是我的表哥Reg，他放暑假来探望我。" },
                { "speaker": "Xiaoling", "en": "I don't understand. It is January now, the middle of winter. How can you have a summer holiday?", "cn": "我不明白。现在是一月，隆冬时节，你们怎么会放暑假？" },
                { "speaker": "Reg", "en": "I'm from Australia. Our summer is from December to February, so it is summer in Australia now.", "cn": "我来自澳大利亚。我们的夏天是十二月到二月，所以澳大利亚现在是夏天。" },
                { "speaker": "Jiamin", "en": "I see now. When it is summer in Australia, it is winter in China.", "cn": "我现在懂了。澳大利亚是夏天的时候，中国是冬天。" },
                { "speaker": "Xiaoling", "en": "What's summer like in Australia, Reg?", "cn": "Reg，澳大利亚的夏天是什么样子的？" },
                { "speaker": "Reg", "en": "It's very hot, so we always go swimming.", "cn": "天气很热，所以我们总是去游泳。" },
                { "speaker": "Ben", "en": "It's too cold to swim now. But if you are here from July to August, we can go swimming every day.", "cn": "现在天气太冷没法游泳。但如果你七八月来这里，我们就能每天去游泳。" }
            ]
        }
    };
    window.practiceBank?.registerModuleContent('p5l', 'm1');
})();