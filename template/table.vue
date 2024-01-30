<template>
    <div class="adminui-table">
        <div class="adminui-table-content">
            <el-table :data="tableData" ref="adminui-table" @selection-change="selectionOnChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column v-for="(item, index) in tableColumn" :key="item.prop" :label="item.label" :prop="item.prop" :align="item.align" :width="item.width" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作" align="right" v-if="tableAction" fixed="right">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button class="is-text" type="primary" size="small" v-for="(item, index) in tableAction" :key="item.title" @click="actionOnClick(item,scope.row)">{{ item.title }}</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="adminui-table-footer">
            <div class="adminui-table-pagination">
                <el-pagination background :small="true" :layout="'total, prev, pager, next, jumper'" :total="tableTotal" :page-size="20" :current-page.sync="currentPage" @current-change="currentOnChange"></el-pagination>
            </div>
            <div class="adminui-table-actions">
                <el-button @click="refreshOnClick" icon="el-icon-refresh" circle></el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['currentPage', 'tableTotal', 'tableData', 'tableColumn', 'tableAction', ],
    components: {},
    computed: {},
    mounted: function() {},
    data: function() {
        return {}
    },
    methods: {
        refreshOnClick: function() {
            window.location.reload();
        },
        currentOnChange: function(page) {
            this.$emit('pagechange', page);
        },
        actionOnClick: function(action, data) {

            if (action.action == 'edit') {
                // 添加按钮
                this.$emit('formedit', data[action.field]);
                return;
            }

            if (action.action == 'ajax') {
                // 删除按钮
                this.actionAjax(action, data);
                return;
            }

            if (action.action == 'goto') {
                // 删除按钮
                this.actionGoto(action, data);
                return;
            }

            if (action.action == 'link') {
                // 跳转链接
                window.open(action.url);
                return;
            }
        },
        actionAjax: function(action, data) {

            var that = this;

            var meta = this.$funs.cloneData(this.$route.meta);
            // 避免将配置数据重复发送到后台
            delete meta['api'];
            delete meta['setting'];

            // 其他情况，都尝试通过后台获取表单字段和表单数据
            this.$funs.post(action.url, { meta: meta, action: action, data: data }, function(result) {

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
        selectionOnChange: function(value) {
            this.$emit('selectionchange', value);
        },
        actionGoto: function(action, data) {

            var field = action.field;

            var query = {};

            if (Array.isArray(field)) {

                for (var i = 0; i < field.length; i++) {
                    var temp = field[i];
                    query[temp] = data[temp];
                }

            } else {
                query[action.field] = data[action.field];
            }

            var path = action.path ? action.path : this.$route.path;

            this.$funs.reparseActiveMenu();
            this.$router.push({ path: path, query });
        }
    },

}
</script>
<style>
/*表格*/
.adminui-table {
    padding-bottom: 40px;
}

.adminui-table-content {
    border: 1px solid #EBEEF5;
}

.adminui-table-content .el-button-group {}

.adminui-table-footer {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;

    position: absolute;
    bottom: 0;
    background-color: #fff;
    width: calc(100% - 310px);
    z-index: 9;
    border: 1px solid #EBEEF5;
}

.adminui-table-actions {
    white-space: nowrap;
}

.adminui-table-actions .el-button {
    margin-left: 15px;
    padding: 9px;
}

.adminui-table:deep(.el-table__footer) .cell {
    font-weight: bold;
}

.adminui-table:deep(.el-table__body-wrapper) .el-scrollbar__bar.is-horizontal {
    height: 12px;
    border-radius: 12px;
}

.adminui-table:deep(.el-table__body-wrapper) .el-scrollbar__bar.is-vertical {
    width: 12px;
    border-radius: 12px;
}

.adminui-table .el-button.is-text {
    color: #409eff;
    border: 0 solid transparent;
    background-color: transparent;
    padding: 7px 8px;
}
</style>