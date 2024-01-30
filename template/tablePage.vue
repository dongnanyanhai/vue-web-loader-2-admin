<template>
    <el-main>
        <el-card shadow="never" style="height: auto;margin-bottom: 20px;" v-if="filterSetting && filterSetting.length > 0">
            <div class="adminui-select-filter">
                <div v-for="(item,index) in filterSetting" :key="item.key" class="adminui-select-filter__item">
                    <div class="adminui-select-filter__item-title"><label>{{item.title}}：</label></div>
                    <div class="adminui-select-filter__item-options">
                        <ul>
                            <li v-for="option in item.options" :key="option.value" :class="{'active':(!filterSelected[item.key] && !option.value) || (filterSelected[item.key]&& option.value &&filterSelected[item.key].indexOf(option.value) > -1)}" @click="filterOnSelect(item,option)">
                                <span>{{option.label}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </el-card>
        <el-header class="adminui-table-panel">
            <div class="left-panel">
                <el-button v-for="(item,index) in batchSetting" :type="item.type" :icon="item.icon" @click="batchOnClick(item)"></el-button>
            </div>
            <div class="right-panel">
                <div class="right-panel-date">
                    <el-date-picker v-model="searchDate" type="datetimerange" value-format="timestamp" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                    </el-date-picker>
                </div>
                <div class="right-panel-search">
                    <el-cascader v-model="searchComparator" :options="searchOptions" @change="cascaderOnChange"></el-cascader>
                    <el-input placeholder="请输入内容" v-model="searchKeyword" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="searchOnClick"></el-button>
                    </el-input>
                </div>
            </div>
        </el-header>
        <!-- 表格 -->
        <ext-table :current-page="currentPage" :table-total="tableTotal" :table-data="tableData" :table-column="tableColumn" :table-action="tableAction" @pagechange="pageOnChange" @selectionchange="selectionOnChange" @formedit="formOnEdit"></ext-table>
        <el-drawer title="表单数据" :before-close="closeOnClick" :visible.sync="dialogVisible" direction="rtl" size="40%" custom-class="adminui-drawer" ref="drawer">
            <ext-form type="drawer" :unique-value="uniqueValue" :form-data="formData" :form-fields="formFields" @formcancel="closeOnClick"></ext-form>
        </el-drawer>
    </el-main>
</template>
<script>
import table from './table.vue'
import form from './form.vue'
export default {
    components: {
        'ext-table': table,
        'ext-form': form,
    },
    computed: {},
    watch: {
        'filterSetting': function(data) {
            var query = this.$funs.cloneData(this.$route.query);

            for (var key in query) {
                if (query[key].indexOf('-') > -1) {
                    query[key] = query[key].split('-');
                }
            }

            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (query[item.key] && item.multiple) {
                    if (!Array.isArray(query[item.key])) {
                        var value = query[item.key];
                        query[item.key] = [];
                        query[item.key].push(value);
                    }
                }
            }

            this.filterSelected = query;
        },
    },
    mounted: function() {
        // 分析URL里面的参数
        this.parseQueryData();
        // 更新配置和数据
        this.getSettingAndData();
    },
    data: function() {
        return {
            // 搜索
            filterSetting: [],
            batchSetting: [],
            searchOptions: [],
            tableColumn: [],
            tableAction: [],
            tableData: [],
            tableTotal: [],
            multipleSelection: [],
            currentPage: 1,
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick: function(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick: function(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick: function(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            searchDate: [],
            searchComparator: [],
            searchKeyword: '',
            // 弹出层
            formData: {},
            formFields: [],
            uniqueValue: 0,
            dialogVisible: false,
        }
    },
    methods: {
        reloadThisPage: function(query) {
            // 推送到新的路由地址后，当前页面的mounted方法会被触发，然后mounted里面回去调用getSettingAndData
            this.$router.push({ path: this.$route.path, query });
        },
        parseQueryData: function() {
            if (this.$route.query.searchDate) {
                this.searchDate = decodeURIComponent(this.$route.query.searchDate).split('-');
            }
            if (this.$route.query.searchComparator) {
                this.searchComparator = decodeURIComponent(this.$route.query.searchComparator).split('-');
            }
            if (this.$route.query.searchKeyword) {
                this.searchKeyword = decodeURIComponent(this.$route.query.searchKeyword);
            }
        },
        filterOnSelect: function(item, option) {

            var key = item.key;
            var value = option.value;
            var query = this.$funs.cloneData(this.filterSelected);

            // 允许多选
            if (item.multiple) {
                // 如果地址中已经存在数据
                if (!query[key]) {
                    query[key] = [];
                }

                if (query[key].indexOf(value) > -1) {
                    // 重复点击不处理
                    return;
                }

                // 如果是空字符串，则表示清理全部数据
                if (value == '') {
                    // 直接
                    delete query[key];
                } else {
                    query[key].push(value);
                }

            } else {

                if (query[key] && query[key] == value) {
                    // 重复点击不处理
                    return;
                }

                if (value == '') {
                    delete query[key];
                } else {
                    // 将该项的值更新
                    query[key] = value;
                }
            }

            for (var key in query) {

                if (Array.isArray(query[key])) {
                    // 将数组转换为字符串
                    query[key] = query[key].join('-');
                }
            }

            this.reloadThisPage(query);
        },
        //搜索
        searchOnClick: function() {
            var query = this.$funs.cloneData(this.$route.query);

            if (this.searchDate.length > 0) {
                query['searchDate'] = encodeURIComponent(this.searchDate.join('-'));
            }

            if (this.searchComparator.length > 0) {
                query['searchComparator'] = encodeURIComponent(this.searchComparator.join('-'));
            }

            if (this.searchKeyword.length > 0) {
                query['searchKeyword'] = encodeURIComponent(this.searchKeyword);
            }

            this.reloadThisPage(query);
        },
        pageOnChange: function(page) {

            // 修改页码，然后通过路由触发数据更新

            var query = this.$funs.cloneData(this.$route.query);

            // 更新页码
            query['page'] = page;

            this.reloadThisPage(query);
        },
        selectionOnChange: function(value) {
            this.multipleSelection = value;
        },
        getSettingAndData: function() {

            var that = this;
            // 判断是否提供了获取数据的接口地址
            if (!this.$route.meta['api'] || !this.$route.meta['api']['table']) {
                this.$funs.errorMsg('当前菜单未提供表格配置数据接口');
                return;
            }
            var query = this.$funs.cloneData(this.$route.query);
            var meta = this.$funs.cloneData(this.$route.meta);
            // 避免将配置数据重复发送到后台
            delete meta['setting'];
            delete meta['api'];
            meta['hasSetting'] = 0;

            // 直接复用配置数据
            if (this.$route.meta.setting) {
                meta['hasSetting'] = 1;
                this.filterSetting = this.$route.meta.setting['filterSetting'];
                this.batchSetting = this.$route.meta.setting['batchSetting'];
                this.searchOptions = this.$route.meta.setting['searchOptions'];
                this.tableColumn = this.$route.meta.setting['tableColumn'];
                this.tableAction = this.$route.meta.setting['tableAction'];
            }

            // 通过后台获取数据
            this.$funs.post(this.$route.meta['api']['table'], { query: query, meta: meta }, function(result) {

                // 状态1表示调用接口成功
                if (result.status == 1) {
                    if (meta['hasSetting'] == 0) {
                        that.$route.meta['setting'] = {};
                        that.filterSetting = that.$route.meta['setting']['filterSetting'] = result.filterSetting;
                        that.batchSetting = that.$route.meta['setting']['batchSetting'] = result.batchSetting;
                        that.searchOptions = that.$route.meta['setting']['searchOptions'] = result.searchOptions;
                        that.tableColumn = that.$route.meta['setting']['tableColumn'] = result.tableColumn;
                        that.tableAction = that.$route.meta['setting']['tableAction'] = result.tableAction;
                    }

                    // 更新页码及总数
                    that.currentPage = query['page'] ? query['page'] : 1;
                    that.tableTotal = result.tableTotal ? result.tableTotal : 0;
                    // 更新表格数据
                    that.tableData = result.tableData ? result.tableData : [];
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
                that.$funs.errorMsg('获取表格数据失败败');
            });
        },
        batchOnClick: function(item) {

            if (item.action == 'add') {
                // 添加按钮
                this.showDrawerForm();
                return;
            }

            if (item.action == 'ajax') {
                // 删除按钮
                this.batchAjax(item);
                return;
            }

            if (item.action == 'link') {
                // 跳转链接
                window.open(item.url);
                return;
            }
        },
        batchAjax: function(item) {

            var that = this;
            var rows = this.multipleSelection;

            if (rows.length <= 0) {
                this.$funs.errorMsg('请选择要处理的数据');
                return;
            }

            var values = [];
            var field = item.field;

            for (var i = 0; i < rows.length; i++) {

                var row = rows[i];

                if (row[field]) {
                    values.push(row[field]);
                    continue;
                }

                // 当前表数据为提供ID字段
                this.$funs.errorMsg('当前表数据未提供' + field + '字段');
                return;
            }

            var meta = this.$funs.cloneData(this.$route.meta);
            // 避免将配置数据重复发送到后台
            delete meta['setting'];

            // 其他情况，都尝试通过后台获取表单字段和表单数据
            this.$funs.post(item.url, { meta: meta, data: { field: field, value: values } }, function(result) {

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
                that.$funs.errorMsg('批量处理数据失败');
            });


        },
        showDrawerForm: function(uniqueValue) {

            var that = this;

            this.uniqueValue = uniqueValue;

            if (!this.$route.meta['api'] || !this.$route.meta['api']['form']) {
                this.$funs.errorMsg('当前菜单未提供获取表单配置数据接口');
                return;
            }

            var meta = this.$funs.cloneData(this.$route.meta);
            // 避免将配置数据重复发送到后台
            delete meta['setting'];
            delete meta['api'];
            meta['hasSetting'] = 0;
            meta['formAction'] = 'get';
            meta['uniqueValue'] = uniqueValue;

            // 判断是否已经有表单配置缓存
            if (this.$route.meta.setting && this.$route.meta.setting['formFields']) {

                meta['hasSetting'] = 1;
                // 如果没有指定ID，说明是新增表单数据
                if (!uniqueValue) {
                    this.formFields = this.$route.meta.setting['formFields'];
                    // 直接显示表单
                    this.formData = {};
                    this.dialogVisible = true;
                    return;
                }
            }

            // 其他情况，都尝试通过后台获取表单字段和表单数据
            this.$funs.post(this.$route.meta['api']['form'], { meta: meta }, function(result) {

                // 状态1表示调用接口成功
                if (result.status == 1) {

                    if (meta['hasSetting'] == 0) {
                        if (!that.$route.meta['setting']) {
                            that.$route.meta['setting'] = {};
                        }
                        // 表单字段
                        that.formFields = that.$route.meta['setting']['formFields'] = result.formFields;
                    } else {
                        // 从菜单里读取配置，放到这里主要是为了避免渲染checkbox出错
                        that.formFields = that.$route.meta.setting['formFields'];
                    }

                    // 表单数据
                    that.formData = result.formData ? result.formData : {};
                    that.dialogVisible = true;
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
                that.$funs.errorMsg('获取表单数据失败败');
            });
        },
        formOnEdit: function(uniqueValue) {
            this.showDrawerForm(uniqueValue);
        },
        closeOnClick(done) {
            var that = this;
            that.$confirm('确定要关闭表单吗？')
                .then(function() {
                    that.dialogVisible = false;
                })
                .catch(function() {
                    that.dialogVisible = true;
                });
        },
        cascaderOnChange: function(data) {},
    }
}
</script>
<style>
.adminui-table-panel {
    border: 1px solid #EBEEF5;
    border-bottom: none;
}

.adminui-table-panel .el-button {
    padding: 8px 15px;
}

.adminui-table-panel .search-field .el-input.el-input--suffix .el-input__inner {
    min-width: 108px;
    text-align: center;
}

.adminui-table-panel .search-comparator .el-input.el-input--suffix .el-input__inner {
    min-width: 108px;
    text-align: center;
}

.adminui-table-panel .el-input__inner,
.adminui-table-panel .el-input .el-select__caret {
    height: 32px;
    line-height: 32px;
}

.adminui-table-panel .el-date-editor .el-range-input {
    width: 50%;
}

.adminui-table-panel .el-date-editor .el-range-separator {
    height: auto;
    padding: 0;
}

.adminui-table-panel .el-date-editor .el-input__icon {
    height: auto;
}

.adminui-select-filter {
    width: 100%;
}

.adminui-select-filter__item {
    display: flex;
}

.adminui-select-filter__item-title {
    width: 80px;
}

.adminui-select-filter__item-title label {
    font-size: 14px;
    padding-top: 13px;
    display: inline-block;
    color: #999;
}

.adminui-select-filter__item-options {
    flex: 1;
    border-bottom: 1px dashed var(--el-border-color-light);
}

.adminui-select-filter__item-options ul {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;
}

.adminui-select-filter__item-options li {
    list-style: none;
    cursor: pointer;
    height: 28px;
    padding: 0 15px;
    border-radius: 32px;
    margin: 0 10px 10px 0;
    display: flex;
    align-items: center;
    background: var(--el-color-primary-light-9);
}

.adminui-select-filter__item-options li .el-icon {
    margin-right: 3px;
    font-size: 16px;
}

.adminui-select-filter__item-options li:hover {
    color: var(--el-color-primary);
}

.adminui-select-filter__item-options li.active {
    background: var(--el-color-primary);
    color: #fff;
    font-weight: bold;
}

.adminui-select-filter__item:last-of-type .adminui-select-filter__item-options {
    border: 0;
}

.adminui-select-filter__no-data {
    color: #999;
}

.adminui-drawer {}

.adminui-drawer .el-drawer__header {
    font-size: 16px;
    color: #303133;
    padding-bottom: 20px;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 15px;
}
</style>