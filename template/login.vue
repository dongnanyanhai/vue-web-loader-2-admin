<template>
    <div class="login_bg">
        <div class="login_adv">
            <div class="login_adv__title">
                <h2>{{ $CONFIG.APP_NAME }}</h2>
                <h4>{{ $CONFIG.SLOGAN }}</h4>
                <p>{{ $CONFIG.DESCRIPTIONS }}</p>
            </div>
            <div class="login_adv__mask"></div>
            <div class="login_adv__bottom">
                © {{$CONFIG.APP_NAME}} {{$CONFIG.APP_VER}}
            </div>
        </div>
        <div class="login_main">
            <div class="login-form">
                <div class="login-header">
                    <div class="logo">
                        <img :alt="$CONFIG.APP_NAME" src="img/logo.png">
                        <label>{{$CONFIG.APP_NAME}}</label>
                    </div>
                </div>
                <el-tabs>
                    <el-tab-pane label="账号登录" lazy>
                        <el-form ref="loginForm" :model="form" :rules="rules" label-width="0" size="large" @keyup.enter="login">
                            <el-form-item prop="user">
                                <el-input v-model="form.user" prefix-icon="el-icon-user" clearable placeholder="用户名">
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password" style="margin-bottom: 30px;">
                                <el-input v-model="form.password" prefix-icon="el-icon-lock" clearable show-password placeholder="请输入密码"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" style="width: 100%;" round @click="submitOnClick('loginForm')">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    components: {},
    data() {
        return {
            form: {
                user: "",
                password: "",
            },
            rules: {
                user: [
                    { required: true, message: '请填写用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },
        }
    },
    created: function() {},
    methods: {
        submitOnClick: function(formName) {
            var that = this;

            that.$refs[formName].validate(function(valid) {
                if (valid) {
                    // 通过api获取菜单数据
                    that.$funs.post(that.$CONFIG.API.LOGIN, {}, function(result) {

                        // 状态1表示调用接口成功
                        if (result.status == 1) {
                            // 登录成功，直接回到首页
                            window.location.href = window.location.href.split('#')[0];
                            return;
                        }

                        // 其他情况都弹出信息
                        that.$funs.errorMsg(result.msg);

                    }, function(err) {
                        console.log(err);
                        that.$funs.errorMsg('登录失败');
                    });
                } else {
                    that.$funs.errorMsg('请填写用户名和密码');
                    return false;
                }
            });
        },
    }
}
</script>
<style>
.login_bg {
    width: 100%;
    height: 100%;
    background: #fff;
    display: flex;
}

.login_adv {
    width: 33.33333%;
    background-color: #555;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    position: relative;
    background-image: url(img/auth_banner.jpg);
}

.login_adv__title {
    color: #fff;
    padding: 40px;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    z-index: 2;
}

.login_adv__title h2 {
    font-size: 40px;
}

.login_adv__title h4 {
    font-size: 18px;
    margin-top: 10px;
    font-weight: normal;
}

.login_adv__title p {
    font-size: 14px;
    margin-top: 10px;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.6);
}

.login_adv__title div {
    margin-top: 10px;
    display: flex;
    align-items: center;
}

.login_adv__title div span {
    margin-right: 15px;
}

.login_adv__title div i {
    font-size: 40px;
}

.login_adv__title div i.add {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.6);
}

.login_adv__bottom {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    color: #fff;
    padding: 40px;
    background-image: linear-gradient(transparent, #000);
    z-index: 3;
}

.login_adv__mask {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
}

.login_main {
    flex: 1;
    overflow: auto;
    display: flex;
}

.login-form {
    width: 400px;
    margin: auto;
    padding: 20px 0;
    padding-bottom: 200px;
}

.login-header {
    margin-bottom: 40px;
}

.login-header .logo {
    display: flex;
    align-items: center;
}

.login-header .logo img {
    width: 40px;
    height: 40px;
    vertical-align: bottom;
    margin-right: 10px;
}

.login-header .logo label {
    font-size: 26px;
    font-weight: bold;
}

.login-oauth {
    display: flex;
    justify-content: space-around;
}

.login-form .el-divider {
    margin-top: 40px;
}

.login-form {}

.login-form:deep(.el-tabs) .el-tabs__header {
    margin-bottom: 25px;
}

.login-form:deep(.el-tabs) .el-tabs__header .el-tabs__item {
    font-size: 14px;
}

.login-form:deep(.login-forgot) {
    text-align: right;
}

.login-form:deep(.login-forgot) a {
    color: var(--el-color-primary);
}

.login-form:deep(.login-forgot) a:hover {
    color: var(--el-color-primary-light-3);
}

.login-form:deep(.login-reg) {
    font-size: 14px;
    color: var(--el-text-color-primary);
}

.login-form:deep(.login-reg) a {
    color: var(--el-color-primary);
}

.login-form:deep(.login-reg) a:hover {
    color: var(--el-color-primary-light-3);
}

.login-form:deep(.login-msg-yzm) {
    display: flex;
    width: 100%;
}

.login-form:deep(.login-msg-yzm) .el-button {
    margin-left: 10px;
    --el-button-size: 42px;
}

@media (max-width: 1200px) {
    .login-form {
        width: 340px;
    }
}

@media (max-width: 1000px) {
    .login_main {
        display: block;
    }

    .login-form {
        width: 100%;
        padding: 20px 40px;
    }

    .login_adv {
        display: none;
    }
}
</style>