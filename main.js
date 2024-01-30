import store from './template/store.js'

/*
import ext from './extPage.vue'
*/

// 扩展页面放到下面这个对象里
var extMap = {
    // ext: ext,
}

var $CONFIG = Vue.prototype.$CONFIG = {
    APP_NAME: 'HiCode',
    APP_VER: '4.0',
    SLOGAN: '高性能 / 快速 / 简洁',
    DESCRIPTIONS: '基于Vue + Element 的中后台前端解决方案。',
    API: {
        LOGIN: './template/mock/login.json',
        MENUS: './template/mock/menus.json',
    }
};

var router = store.funs.initVueRouter();
var token = store.funs.cache('token');

if (!token) {

    window.VueApp = store.funs.initVue(router);

    // 未登录，跳转到登录页
    if (window.VueApp.$route.path != '/login') {
        window.VueApp.$router.replace('/login');
    }
} else {

    // 获取后端的菜单数据
    store.funs.initMenusAndUser($CONFIG.API.MENUS, extMap, router, function(result) {
        window.VueApp = store.funs.initVue(router);
    });
}