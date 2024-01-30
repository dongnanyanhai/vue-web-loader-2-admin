<template>
    <section class="aminui-wrapper">
        <div class="aminui-side-split">
            <div class="aminui-side-split-top">
                <a href="javascript:;">
                    <img class="logo" :title="$CONFIG.APP_NAME" src="img/logo-r.png">
                </a>
            </div>
            <div class="adminui-side-split-scroll">
                <!-- 一级菜单 -->
                <el-scrollbar>
                    <ul>
                        <li v-for="item in menus" :class="curTopMenu.path == item.path ? 'active' : ''" @click="topMenuOnClick(item)">
                            <i :class="item.meta.icon || 'el-icon-menu'"></i>
                            <p>{{ item.meta.title }}</p>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
        <div v-if="topMenus.length > 0" class="aminui-side">
            <div class="adminui-side-top">
                <h2 v-if="curTopMenu.meta">{{ curTopMenu.meta.title }}</h2>
            </div>
            <div class="adminui-side-scroll">
                <!-- 二级菜单 -->
                <el-scrollbar>
                    <el-menu :default-active="topActive">
                        <template v-for="subMenu in topMenus">
                            <el-menu-item-group>
                                <template slot="title">
                                    <i v-if="subMenu.meta && subMenu.meta.icon" :class="subMenu.meta.icon || 'el-icon-menu'"></i>
                                    <span>{{subMenu.meta.title}}</span>
                                </template>
                                <template v-for="terMenu in subMenu.children">
                                    <el-menu-item :index="terMenu.path" @click="terMenuOnClick(terMenu)">
                                        <a v-if="terMenu.meta && terMenu.meta.type=='link'" :href="terMenu.path" target="_blank" @click.stop='javascript:;'></a>
                                        <span class="aminui-menu-title">{{terMenu.meta.title}}</span>
                                    </el-menu-item>
                                </template>
                            </el-menu-item-group>
                        </template>
                    </el-menu>
                </el-scrollbar>
            </div>
        </div>
        <div class="aminui-body el-container">
            <div class="adminui-topbar">
                <div class="left-panel">
                    <el-menu :default-active="terActive" mode="horizontal">
                        <template v-for="fouMenu in terMenus.children">
                            <el-menu-item :index="fouMenu.path" @click="fouMenuOnClick(fouMenu)">
                                <a v-if="fouMenu.meta && fouMenu.meta.type=='link'" :href="fouMenu.path" target="_blank" @click.stop='javascript:;'></a>
                                <span class="aminui-menu-title">{{fouMenu.meta.title}}</span>
                            </el-menu-item>
                        </template>
                    </el-menu>
                </div>
                <div class="right-panel">
                    <div class="user-bar">
                        <!-- <div class="panel-item hidden-sm-and-down" @click="search">
                            <i class="el-icon-search"></i>
                        </div> -->
                        <el-dropdown class="user panel-item" trigger="click" @command="userMenuOnClick">
                            <div class="user-avatar">
                                <el-avatar :size="28" icon="el-icon-user-solid"></el-avatar>
                                <label>{{ user.userName }}</label>
                                <i class="el-icon--right el-icon-arrow-down"></i>
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-for="item in user.menus" :command="item" :divided="item.divided">{{ item.title }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </div>
            </div>
            <div class="adminui-main" id="adminui-main">
                <router-view :key="routerViewKey"></router-view>
            </div>
        </div>
    </section>
</template>
<script>
export default {
    components: {},
    computed: {
        menus: function() {
            return this.$root.$data.state.menus;
        },
        user: function() {
            return this.$root.$data.state.user;
        },
        activeMenuHook: function() {
            return this.$root.$data.state.activeMenuHook;
        },
        routerViewKey: function() {
            // 解决不同路由使用相同组件钩子函数不执行问题
            // https://www.cnblogs.com/XF-eng/p/14722578.html
            if (this.$route.name !== undefined) {
                return this.$route.name + +new Date();
            } else {
                return this.$route + +new Date();
            }
        },
    },
    watch: {
        'activeMenuHook': function(data) {
            console.log('layout.vue in watch activeMenuHook');
            // 当路由地址发生改变的时候，重新分析菜单
            this.parseActiveMenu(this.menus);
        },
    },
    mounted: function() {
        if (this.menus && this.menus.length > 0) {
            this.parseActiveMenu(this.menus);
        }
    },
    data: function() {
        return {
            curTopMenu: {},
            topMenus: [],
            terMenus: [],
            topActive: '',
            terActive: '',
        }
    },
    methods: {
        setTopActiveMenu: function(menu, path) {
            this.curTopMenu = menu;
            this.topMenus = this.filterUrl(this.curTopMenu.children);
            this.topActive = path;
        },
        parseActiveMenu: function(menus) {
            var that = this;

            this.terMenus = [];
            this.terActive = '';

            var routePath = this.$route.path;

            if (routePath == '/') {
                // 访问的是首页
                // 取第一个三级菜单
                var nextMenu = menus[0].children[0].children[0];
                this.setTopActiveMenu(menus[0], nextMenu.path);

                if (nextMenu.children && nextMenu.children.length > 0) {
                    this.terMenus = nextMenu;
                    // 存在下级菜单，使用下一级菜单
                    nextMenu = nextMenu.children[0];
                    this.terActive = nextMenu.path;
                }
                // 加载子菜单中的第一项
                this.$router.push(nextMenu.path);
                return;
            }

            // 如果访问的是特定页面，逐级遍历菜单，找到对应的路由地址
            // 遍历全部菜单
            for (var i = 0; i < menus.length; i++) {

                var topMenu = menus[i];

                // 遍历每个一级菜单
                for (var j = 0; j < topMenu.children.length; j++) {

                    var subMenu = topMenu.children[j];

                    // 判断2级菜单是否具有子菜单
                    if (!subMenu.children || subMenu.children.length <= 0) {
                        continue;
                    }

                    // 遍历每个二级菜单
                    for (var k = 0; k < subMenu.children.length; k++) {

                        var terMenu = subMenu.children[k];

                        // 检测路由是否对应当前三级菜单
                        if (routePath.indexOf(terMenu.path) == 0) {
                            this.setTopActiveMenu(menus[i], terMenu.path);
                            return;
                        }

                        // 判断三级菜单是否具有子菜单
                        if (!terMenu.children || terMenu.children.length <= 0) {
                            continue;
                        }

                        // 遍历每个三级菜单
                        for (var l = 0; l < terMenu.children.length; l++) {

                            var fouMenu = terMenu.children[l];
                            // 检测是否三级菜单
                            if (routePath.indexOf(fouMenu.path) == 0) {
                                this.setTopActiveMenu(menus[i], terMenu.path);
                                this.terMenus = terMenu;
                                this.terActive = fouMenu.path;
                                return;
                            }
                        }
                    }
                }
            }

        },
        terMenuOnClick: function(terMenu) {

            // 判断是否存在子菜单
            if (terMenu.children && terMenu.children.length > 0) {
                this.terMenus = terMenu;

                var nextPath = this.terMenus.children[0].path;

                // 重复点击菜单
                if (this.$route.path == nextPath) {
                    return;
                }

                this.terActive = nextPath;

                // 加载子菜单中的第一项
                this.$router.push(nextPath);
                return;
            }

            // 重复点击菜单
            if (this.$route.path == terMenu.path) {
                return;
            }

            // 没有子菜单，清空并尝试直接加载对应路由页面
            this.terMenus = [];
            this.$router.push(terMenu.path);
        },
        fouMenuOnClick: function(fouMenu) {
            // 重复点击菜单
            if (this.$route.path == fouMenu.path) {
                return;
            }

            this.terActive = fouMenu.path;

            this.$router.push(fouMenu.path);
        },
        //点击显示
        topMenuOnClick: function(route) {
            this.curTopMenu = route;
            this.topMenus = this.filterUrl(route.children);
            if ((!route.children || route.children.length == 0) && route.component) {
                this.$router.push({ path: route.path })
            }
        },
        //转换外部链接的路由
        filterUrl: function(map) {
            var newMap = []
            map && map.forEach(item => {
                item.meta = item.meta ? item.meta : {};
                //处理隐藏
                if (item.meta.hidden || item.meta.type == "button") {
                    return false
                }
                //处理http
                if (item.meta.type == 'iframe') {
                    item.path = `/i/${item.name}`;
                }
                //递归循环
                if (item.children && item.children.length > 0) {
                    item.children = this.filterUrl(item.children)
                }
                newMap.push(item)
            })
            return newMap;
        },
        userMenuOnClick: function(item) {
            
            if (item.action == 'ajax') {
                // 删除按钮
                this.userMenuAjax(item);
                return;
            }

            if (item.action == 'link') {
                // 跳转链接
                window.open(item.url);
                return;
            }
        },
        userMenuAjax: function(item) {

            var that = this;

            var meta = this.$funs.cloneData(this.$route.meta);
            // 避免将配置数据重复发送到后台
            delete meta['api'];
            delete meta['setting'];

            // 其他情况，都尝试通过后台获取表单字段和表单数据
            this.$funs.post(item.url, { meta: meta, item: item }, function(result) {

                // 状态1表示调用接口成功
                if (result.status == 1) {

                    // 弹出正确信息
                    that.$funs.successMsg(result.msg);

                    // 判断是否需要reload
                    if (result.reload == 1) {
                        setTimeout(function() {
                            window.location.reload();
                        }, 3000);
                    }
                    return;
                }

                // 其他情况都弹出信息
                that.$funs.errorMsg(result.msg);

                // 状态2表示token过期
                if (result.status == 2) {
                    that.$funs.removeTokenAndReload(0);
                    return;
                }

            }, function(err) {
                console.log(err);
                that.$funs.errorMsg('数据操作失败');
            });
        },
    },
}
</script>
<style>
.aminui-side .el-menu-item-group__title {
    height: 56px;
    line-height: 56px;
    padding: 0px;
    font-size: 14px;
    color: #303133;
}

.aminui-side .el-menu-item-group__title i {}

.aminui-side .el-menu-item .aminui-menu-title {
    padding-left: 20px;
}

.aminui-side .el-menu-item.is-active {
    background-color: #ecf5ff;
}

.adminui-topbar .user-bar {
    display: flex;
    align-items: center;
    height: 100%;
}

.adminui-topbar .user-bar .panel-item {
    padding: 0 10px;
    cursor: pointer;
    height: 100%;
    display: flex;
    align-items: center;
}

.adminui-topbar .user-bar .panel-item i {
    font-size: 16px;
}

.adminui-topbar .user-bar .panel-item:hover {
    background: rgba(0, 0, 0, 0.1);
}

.adminui-topbar .user-bar .user-avatar {
    height: 49px;
    display: flex;
    align-items: center;
}

.adminui-topbar .user-bar .user-avatar label {
    display: inline-block;
    margin-left: 5px;
    font-size: 12px;
    cursor: pointer;
}

.adminui-topbar .el-menu--horizontal>.el-menu-item {
    height: 49px;
    line-height: 49px;
}

.adminui-topbar .left-panel .el-menu-item .adminui-menu-link {
    position: relative;
}
</style>