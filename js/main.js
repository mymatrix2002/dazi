// 项目唯一入口：DOM加载完成统一初始化所有事件，仅执行一次
document.addEventListener('DOMContentLoaded', function () {
    // 先绑定输入框核心打字逻辑
    bindInputEvent();
    // 再绑定页面全部基础按钮、朗读、弹窗、切换等全局事件
    bindBaseEvents();
});