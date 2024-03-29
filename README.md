# vue-web-loader-2-admin

一个简单通用的后台模板，适用非前端开发者。

项目提供了“表格、表单、统计”三种类型的后台页面，通过提供JSON配置，即可实现一个简单的后台。

设计主要参考  [SCUI](https://gitee.com/lolicode/scui)

## 页面预览：

![表格](https://raw.githubusercontent.com/dongnanyanhai/vue-web-loader-2-admin/main/img/table.png)

![表单](https://raw.githubusercontent.com/dongnanyanhai/vue-web-loader-2-admin/main/img/form.png)

![统计](https://raw.githubusercontent.com/dongnanyanhai/vue-web-loader-2-admin/main/img/card.png)


## 文档说明：

[登录页](https://github.com/dongnanyanhai/vue-web-loader-2-admin/wiki/%E7%99%BB%E5%BD%95%E9%A1%B5) (正在编写……)

[菜单页](https://github.com/dongnanyanhai/vue-web-loader-2-admin/wiki/%E8%8F%9C%E5%8D%95%E9%A1%B5) (正在编写……)

[表格页](https://github.com/dongnanyanhai/vue-web-loader-2-admin/wiki/%E8%A1%A8%E6%A0%BC%E9%A1%B5) (正在编写……)

[表单页](https://github.com/dongnanyanhai/vue-web-loader-2-admin/wiki/%E8%A1%A8%E5%8D%95%E9%A1%B5) (正在编写……)

[统计页](https://github.com/dongnanyanhai/vue-web-loader-2-admin/wiki/%E7%BB%9F%E8%AE%A1%E9%A1%B5) (正在编写……)


## 特别注意：

本地测试时，要修改nginx的配置文件，允许通过post请求json文件，配置代码如下：

```
    location ~ (.*\.json) {
        root d:/wwwroot/xxx.xxx.xxx;
        error_page 405 =200 $1;
    }
```