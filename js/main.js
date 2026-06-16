// 项目入口：统一初始化所有事件
window.addEventListener('DOMContentLoaded', function(){
    // 绑定输入框事件
    bindInputEvent();
    // 绑定所有基础按钮、全局事件
    bindBaseEvents();
});