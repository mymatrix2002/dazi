// js/main.js完整代码
// 项目入口脚本，解决core文件加载时序错乱导致函数未定义报错
window.addEventListener('DOMContentLoaded', function(){
    // 安全初始化方法：检测依赖函数是否加载完成，未就绪则延迟重试
    function safeInitBindEvents() {
        try {
            // 校验两个核心绑定全局函数是否已加载完毕
            if (typeof bindInputEvent === 'function' && typeof bindBaseEvents === 'function') {
                bindInputEvent();
                bindBaseEvents();
                // 日志记录初始化成功状态
                if (typeof Log !== "undefined") {
                    Log.info("页面DOM加载完成，事件绑定初始化执行成功");
                }
            } else {
                // 依赖未加载完成，100ms延迟重试初始化
                if (typeof Log !== "undefined") {
                    Log.warn("bindInputEvent / bindBaseEvents 尚未加载完成，100ms后重试初始化");
                }
                setTimeout(safeInitBindEvents, 100);
            }
        } catch (err) {
            // 捕获初始化异常，写入日志避免页面卡死
            if (typeof Log !== "undefined") {
                Log.error("页面初始化绑定事件捕获异常", err);
            }
        }
    }
    // 启动安全初始化流程
    safeInitBindEvents();
});
