// Service Worker - 离线缓存
// 每次更新代码后，修改下面的版本号，用户就能拿到新版本
const CACHE_NAME = 'typing-practice-v2.4.0';

// 预缓存的核心文件（第一次加载就缓存）
const PRECACHE_URLS = [
    './',
    './index.html',
    './css/main.css',
    './css/responsive.css',
    './css/keyboard.css',
    './css/font-size.css',
    './js/main.js',
    './js/core/config.js',
    './js/core/utils.js',
    './js/core/typing-mode.js',
    './js/core/typing-input.js',
    './js/core/event-base.js',
    './js/feature/virtual-keyboard.js',
    './js/feature/online-tts.js',
    './js/feature/practice-bank-ui.js',
    './js/data/practice-bank.js'
];

// ========== 安装：预缓存核心文件 ==========
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting()) // 立即激活新的 SW
    );
});

// ========== 激活：清理旧版本缓存 ==========
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim()) // 立即接管所有页面
    );
});

// ========== 请求拦截：缓存策略 ==========
self.addEventListener('fetch', event => {
    // 只缓存 GET 请求
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // 在线语音接口不缓存（每次都是新的音频）
    if (url.hostname === 'tts.841231.xyz') {
        return;
    }

    // ========== HTML 页面：网络优先 ==========
    // 效果：打开页面优先加载最新的 HTML，保证用户看到的是最新版
    // 离线时用缓存兜底，保证能打开
    if (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname === './') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // 网络成功，更新缓存
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // 网络失败，用缓存兜底
                    return caches.match(event.request);
                })
        );
        return;
    }

    // 第三方 CDN 资源（比如 Tailwind）：缓存优先
    if (url.hostname !== location.hostname) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;
                return fetch(event.request).then(response => {
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                }).catch(() => cached);
            })
        );
        return;
    }

    // 本站其他资源（JS/CSS/图片等）：缓存优先
    // 因为 URL 有版本号（?v=xxx），版本变了 URL 就变，自动加载新的
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            }).catch(() => cached);
        })
    );
});
