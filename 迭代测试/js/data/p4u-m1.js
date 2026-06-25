// js/data/p4u-m1.js
// 四年级上册 Module 1: My bedroom
(function() {
    'use strict';

    const moduleContent = {
        'u1': {
            words: [
                { en: 'bedroom', cn: '卧室' },
                { en: 'bed', cn: '床' },
                { en: 'desk', cn: '书桌' },
                { en: 'chair', cn: '椅子' },
                { en: 'lamp', cn: '台灯' },
                { en: 'book', cn: '书' },
                { en: 'bag', cn: '书包' },
                { en: 'clock', cn: '时钟' },
                { en: 'picture', cn: '图片' },
                { en: 'window', cn: '窗户' },
                { en: 'door', cn: '门' },
                { en: 'wall', cn: '墙' },
                { en: 'floor', cn: '地板' },
                { en: 'room', cn: '房间' },
                { en: 'small', cn: '小的' },
                { en: 'big', cn: '大的' },
                { en: 'nice', cn: '漂亮的' },
                { en: 'clean', cn: '干净的' }
            ],
            phrases: [
                { en: 'in your room', cn: '在你的房间里' },
                { en: 'on the desk', cn: '在书桌上' },
                { en: 'under the bed', cn: '在床底下' },
                { en: 'next to the window', cn: '在窗户旁边' },
                { en: 'on the wall', cn: '在墙上' },
                { en: 'a small bedroom', cn: '一间小卧室' },
                { en: 'a big bed', cn: '一张大床' },
                { en: 'my favourite room', cn: '我最喜欢的房间' }
            ],
            sentences: [
                { en: 'What\'s in your room?', cn: '你的房间里有什么？' },
                { en: 'There is a bed and a desk.', cn: '有一张床和一张书桌。' },
                { en: 'There is a lamp on the desk.', cn: '书桌上有一盏台灯。' },
                { en: 'There are many books on the shelf.', cn: '书架上有很多书。' },
                { en: 'My bedroom is small but nice.', cn: '我的卧室很小但很漂亮。' },
                { en: 'I like my bedroom very much.', cn: '我非常喜欢我的卧室。' },
                { en: 'Is there a picture on the wall?', cn: '墙上有一幅画吗？' },
                { en: 'Yes, there is.', cn: '是的，有。' }
            ],
            dialogue: [
                { speaker: 'Jiamin', en: 'Hi, Janet! Welcome to my house.', cn: '嗨，珍妮特！欢迎来我家。' },
                { speaker: 'Janet', en: 'Thank you, Jiamin. Your house is very nice.', cn: '谢谢你，家民。你家真漂亮。' },
                { speaker: 'Jiamin', en: 'This is my bedroom.', cn: '这是我的卧室。' },
                { speaker: 'Janet', en: 'Wow! It\'s big. What\'s in your room?', cn: '哇！好大啊。你的房间里有什么？' },
                { speaker: 'Jiamin', en: 'There is a bed, a desk and a chair.', cn: '有一张床、一张书桌和一把椅子。' },
                { speaker: 'Janet', en: 'Is there a computer in your room?', cn: '你房间里有电脑吗？' },
                { speaker: 'Jiamin', en: 'No, there isn\'t. But there are many books.', cn: '不，没有。但是有很多书。' },
                { speaker: 'Janet', en: 'I like your bedroom. It\'s very clean.', cn: '我喜欢你的卧室。非常干净。' },
                { speaker: 'Jiamin', en: 'Thank you. I clean it every day.', cn: '谢谢。我每天都打扫。' }
            ]
        },
        'u2': {
            words: [
                { en: 'near', cn: '在...附近' },
                { en: 'behind', cn: '在...后面' },
                { en: 'in front of', cn: '在...前面' },
                { en: 'under', cn: '在...下面' },
                { en: 'on', cn: '在...上面' },
                { en: 'in', cn: '在...里面' },
                { en: 'next to', cn: '紧挨着' },
                { en: 'between', cn: '在...之间' },
                { en: 'above', cn: '在...上方' },
                { en: 'below', cn: '在...下方' },
                { en: 'where', cn: '哪里' },
                { en: 'here', cn: '这里' },
                { en: 'there', cn: '那里' },
                { en: 'find', cn: '找到' },
                { en: 'look', cn: '看' },
                { en: 'see', cn: '看见' }
            ],
            phrases: [
                { en: 'near the window', cn: '在窗户附近' },
                { en: 'behind the door', cn: '在门后面' },
                { en: 'in front of the house', cn: '在房子前面' },
                { en: 'under the table', cn: '在桌子下面' },
                { en: 'on the shelf', cn: '在架子上' },
                { en: 'in the box', cn: '在盒子里' },
                { en: 'next to the bed', cn: '在床旁边' },
                { en: 'between two chairs', cn: '在两把椅子之间' }
            ],
            sentences: [
                { en: 'Where is my bag?', cn: '我的书包在哪里？' },
                { en: 'It\'s near the window.', cn: '它在窗户旁边。' },
                { en: 'They\'re behind the door.', cn: '它们在门后面。' },
                { en: 'The cat is under the bed.', cn: '猫在床底下。' },
                { en: 'The picture is on the wall.', cn: '图片在墙上。' },
                { en: 'The shoes are under the chair.', cn: '鞋子在椅子下面。' },
                { en: 'Can you see my book?', cn: '你能看到我的书吗？' },
                { en: 'Yes, it\'s on the desk.', cn: '能，它在书桌上。' }
            ],
            dialogue: [
                { speaker: 'Xiaoling', en: 'Janet, where is your pencil-case?', cn: '珍妮特，你的铅笔盒在哪里？' },
                { speaker: 'Janet', en: 'I don\'t know. I can\'t find it.', cn: '我不知道。我找不到它了。' },
                { speaker: 'Xiaoling', en: 'Is it in your bag?', cn: '它在你的书包里吗？' },
                { speaker: 'Janet', en: 'No, it isn\'t.', cn: '不，不在。' },
                { speaker: 'Xiaoling', en: 'Is it on the desk?', cn: '它在书桌上吗？' },
                { speaker: 'Janet', en: 'No, it isn\'t there.', cn: '不，不在那里。' },
                { speaker: 'Xiaoling', en: 'Look! It\'s near the window.', cn: '看！它在窗户旁边。' },
                { speaker: 'Janet', en: 'Oh, yes! Thank you, Xiaoling.', cn: '哦，是的！谢谢你，小玲。' },
                { speaker: 'Xiaoling', en: 'You\'re welcome.', cn: '不客气。' }
            ]
        }
    };

    if (window.practiceBank && window.practiceBank.registerModuleContent) {
        window.practiceBank.registerModuleContent('p4u', 'm1', moduleContent);
    }
})();
