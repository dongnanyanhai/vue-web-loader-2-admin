<template>
    <el-main>
        <div class="adminui-page-title">
            控制面板
        </div>
        <el-row :gutter="15">
            <el-col :lg="6" :sm="12" v-for="item in cardSetting">
                <el-card shadow="never" class="adminui-statistic-card">
                    <div class="adminui-statistic">
                        <div class="adminui-statistic-title">
                            {{ item.title }}
                            <el-tooltip v-if="item.tips" effect="light">
                                <template #content>
                                    <div style="width: 200px;line-height: 2;">
                                        {{ item.tips }}
                                    </div>
                                </template>
                                <i class="adminui-statistic-tips el-icon-question"></i>
                            </el-tooltip>
                        </div>
                        <div class="adminui-statistic-content">
                            <span v-if="item.prefix" class="adminui-statistic-content-prefix">{{ item.prefix }}</span>
                            <span class="adminui-statistic-content-value">{{ item.content }}</span>
                            <span v-if="item.suffix" class="adminui-statistic-content-suffix">{{ item.suffix }}</span>
                        </div>
                        <div v-if="item.description" class="adminui-statistic-description">
                            {{ item.description }}
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-card shadow="never">
            <el-tabs tab-position="top" @tab-click="tabOnClick">
                <el-tab-pane v-for="(item,index) in lineSetting" :label="item.label">
                    <div class="line-data-box" :ref="'lineDataBox'+index"></div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </el-main>
</template>
<script>
export default {
    components: {},
    computed: {
        testData: function() {
            return this.$root.$data.state.testData;
        },
    },
    watch: {
        'testData.pdemo': function(data) {
            if (data) {
                this.onShow();
            } else {
                this.onHide();
            }
        }
    },
    data: function() {
        return {
            cardSetting: [],
            lineSetting: [],
            lineDataBox: [],
        }
    },
    mounted: function() {
        // 初始化页面数据
        this.getSettingAndData();
    },
    methods: {
        tabOnClick: function(vm) {
            this.getLineData(this.lineSetting[vm.index], vm.index);
        },
        getFirstLineData: function() {

            if (!this.lineSetting || this.lineSetting.length <= 0) {
                this.$funs.errorMsg('未提供折线图配置数据');
                return;
            }

            this.getLineData(this.lineSetting[0], 0);
        },
        getLineData: function(item, index) {

            var that = this;

            var meta = this.$funs.cloneData(this.$route.meta);
            // 避免将配置数据重复发送到后台
            delete meta['setting'];
            delete meta['api'];

            // 其他情况，都尝试通过后台获取表单字段和表单数据
            this.$funs.post(item.url, { meta: meta, data: item }, function(result) {

                // 状态1表示调用接口成功
                if (result.status == 1) {

                    var chart = echarts.init(that.$refs['lineDataBox' + index][0]);
                    chart.setOption(result.lineOption);

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
                that.$funs.errorMsg('获取统计数据失败败');
            });
        },
        getSettingAndData: function() {

            var that = this;

            if (!this.$route.meta['api'] || !this.$route.meta['api']['card']) {
                this.$funs.errorMsg('当前菜单未提供统计配置数据接口');
                return;
            }

            var meta = this.$funs.cloneData(this.$route.meta);
            // 避免将配置数据重复发送到后台
            delete meta['api'];
            delete meta['setting'];
            meta['hasSetting'] = 0;

            // 直接复用配置数据
            if (this.$route.meta.setting) {
                meta['hasSetting'] = 1;
                this.cardSetting = this.$route.meta.setting['cardSetting'];
                this.lineSetting = this.$route.meta.setting['lineSetting'];
                // 获取第一个折线图统计数据
                this.getFirstLineData();
                return;
            }


            // 其他情况，都尝试通过后台获取表单字段和表单数据
            this.$funs.post(this.$route.meta['api']['card'], { meta: meta }, function(result) {

                // 状态1表示调用接口成功
                if (result.status == 1) {

                    if (meta['hasSetting'] == 0) {
                        if (!that.$route.meta['setting']) {
                            that.$route.meta['setting'] = {};
                        }
                        that.cardSetting = that.$route.meta['setting']['cardSetting'] = result.cardSetting;
                        that.lineSetting = that.$route.meta['setting']['lineSetting'] = result.lineSetting;
                    }

                    // 获取第一个折线图统计数据
                    that.getFirstLineData();
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
                that.$funs.errorMsg('获取统计数据失败败');
            });
        },
    }
}
</script>
<style>
.adminui-page-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 15px;
}

.adminui-statistic-title {
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}

.adminui-statistic-tips {
    margin-left: 5px;
}

.adminui-statistic-content {
    font-size: 20px;
    color: rgb(51, 51, 51);
}

.adminui-statistic-content-value {
    font-weight: 700;
}

.adminui-statistic-content-prefix {
    margin-right: 5px;
}

.adminui-statistic-content-suffix {
    margin-left: 5px;
    font-size: 12px;
}

.adminui-statistic-description {
    margin-top: 10px;
    color: rgb(153, 153, 153);
}

.dark .adminui-statistic-content {
    color: rgb(208, 208, 208);
}

.adminui-statistic-card {
    margin-bottom: 15px;
}

.up {
    color: rgb(245, 108, 108);
    margin-left: 5px;
}

.down {
    color: rgb(103, 194, 58);
    margin-left: 5px;
}

.line-data-box {
    width: 100%;
    height: 500px;
    padding: 20px;
}
</style>