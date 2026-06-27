// js/data/p5l-m1.js
// 广州教科版五年级下册 Module 1 Seasons 原版课文
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
                { "en": "rainy", "cn": "下雨的" }
            ],
            "phrases": [
                { "en": "middle of winter", "cn": "隆冬时节" },
                { "en": "during summer holidays", "cn": "暑假期间" },
                { "en": "in Australia", "cn": "在澳大利亚" },
                { "en": "in China", "cn": "在中国" },
                { "en": "summer holiday", "cn": "暑假" },
                { "en": "winter holiday", "cn": "寒假" },
                { "en": "talk about", "cn": "谈论" },
                { "en": "all year round", "cn": "一整年" }
            ],
            "sentences": [
                { "en": "It's the middle of winter.", "cn": "现在是隆冬时节。" },
                { "en": "When it's summer in Australia, it's winter in China.", "cn": "澳大利亚是夏天的时候，中国是冬天。" },
                { "en": "I'm from Australia.", "cn": "我来自澳大利亚。" },
                { "en": "What's the weather like there?", "cn": "那里的天气怎么样？" },
                { "en": "During summer holidays, I go swimming every day.", "cn": "暑假期间，我每天都去游泳。" }
            ],
            "dialogue": [
                { "en": "Ben is a new classmate from Australia. He talks with Xiaoling about different seasons in two countries.", "cn": "本是来自澳大利亚的新同学，他和小玲谈论两个国家不同的季节。" },
                { "speaker": "Ben", "en": "Hi, I'm Ben. I'm from Australia.", "cn": "大家好，我是本，我来自澳大利亚。" },
                { "speaker": "Xiaoling", "en": "Welcome to our class. It's so cold here!", "cn": "欢迎来到我们班，这里好冷啊！" },
                { "speaker": "Ben", "en": "Yes. It's the middle of winter. I never see snow in Australia.", "cn": "是啊，现在正值隆冬，我在澳大利亚从来没见过雪。" },
                { "speaker": "Xiaoling", "en": "Why is that?", "cn": "为什么会这样呢？" },
                { "speaker": "Ben", "en": "When it's winter in China, it's summer in Australia. During summer holidays, I go swimming every day.", "cn": "中国是冬天的时候，澳大利亚是夏天。暑假我每天都会去游泳。" },
                { "speaker": "Xiaoling", "en": "Wow! Maybe we can make a snowman tomorrow.", "cn": "太有意思啦！明天我们可以一起堆雪人。" }
            ]
        }
    };
    window.practiceBank?.registerModuleContent('p5l', 'm1');
})();