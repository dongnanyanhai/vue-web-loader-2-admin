<template>
    <div class="adminui-form">
        <el-form class="adminui-form-content" :model="formData" label-position="right" label-width="120px">
            <el-form-item v-for="(item, idx1) in formFields" :key="idx1" :label="item.label" :prop="item.name">
                <el-radio-group v-if="item.type == 'radio'" v-model="formData[item.name]" :disabled="check(item.disabled,false)" :text-color="check(item.textColor,'#ffffff')" :fill="check(item.fill,'#409EFF')">
                    <el-radio v-for="(option,idx2) in item.options" :key="idx2" :label="option.label" :disabled="check(option.disabled,false)" :border="check(option.border,false)">{{check(option.title,option.label)}}</el-radio>
                </el-radio-group>
                <el-checkbox-group v-if="item.type == 'checkbox'" v-model="formData[item.name]" :max="check(item.max,999999999)" :min="check(item.min,0)" :disabled="check(item.disabled,false)" :text-color="check(item.textColor,'#ffffff')" :fill="check(item.fill,'#409EFF')">
                    <el-checkbox v-for="(option,idx2) in item.options" :key="idx2" :label="option.label" :disabled="check(option.disabled,false)" :border="check(option.border,false)">{{check(option.title,option.label)}}</el-checkbox>
                </el-checkbox-group>
                <el-input v-if="item.type == 'input' || item.type == 'textarea'" v-model="formData[item.name]" :type="item.type" :maxlength="check(item.maxlength,-1)" :minlength="check(item.minlength,-1)" :show-word-limit="check(item.showWordLimit,false)" :placeholder="check(item.placeholder,'')" :clearable="check(item.clearable,false)" :show-password="check(item.showPassword,false)" :disabled="check(item.disabled,false)" :prefix-icon="check(item.prefixIcon,'')" :suffix-icon="check(item.suffixIcon,'')" :rows="check(item.rows,2)" :autosize="check(item.autosize,false)" :autocomplete="check(item.autocomplete,'off')" :readonly="check(item.readonly,false)" :max="check(item.max,'')" :min="check(item.min,'')" :step="check(item.step,'')" :resize="check(item.resize,'')" :autofocus="check(item.autofocus,false)" :tabindex="check(item.tabindex,'')" :validate-event="check(item.validateEvent,true)"></el-input>
                <el-input-number v-if="item.type == 'input-number'" v-model="formData[item.name]" :max="check(item.max,Infinity)" :min="check(item.min,-Infinity)" :step="check(item.step,1)" :step-strictly="check(item.stepStrictly,false)" :precision="check(item.precision,undefined)" :disabled="check(item.disabled,false)" :controls="check(item.controls,true)" :controls-position="check(item.controlsPosition,'')" :placeholder="check(item.placeholder,'')"></el-input-number>
                <el-select v-if="item.type == 'select'" v-model="formData[item.name]" :multiple="check(item.multiple,false)" :disabled="check(item.disabled,false)" :value-key="check(item.valueKey,'')" :clearable="check(item.clearable,false)" :collapse-tags="check(item.collapseTags,false)" :multiple-limit="check(item.multipleLimit,0)" :autocomplete="check(item.autocomplete,'off')" :placeholder="check(item.placeholder,'')" :filterable="check(item.filterable,false)" :allow-create="check(item.allowCreate,false)" :no-match-text="check(item.noMatchText,'无匹配数据')" :no-data-text="check(item.noDataText,'无数据')" :popper-class="check(item.popperClass,'')" :reserve-keyword="check(item.reserveKeyword,false)" :default-first-option="check(item.defaultFirstOption,false)" :popper-append-to-body="check(item.popperAppendToBody,true)" :automatic-dropdown="check(item.automaticDropdown,false)">
                    <el-option-group v-if="item.options && item.options[0] && item.options[0].options" v-for="(group,idx2) in item.options" :key="idx2" :label="group.label" :disabled="check(group.disabled,false)">
                        <el-option v-for="(option,idx3) in group.options" :key="idx3" :label="option.label" :value="option.value" :disabled="check(option.disabled,false)"></el-option>
                    </el-option-group>
                    <el-option v-if="item.options && item.options[0] && !item.options[0].options" v-for="(option,idx2) in item.options" :key="idx2" :label="option.label" :value="option.value" :disabled="check(option.disabled,false)"></el-option>
                </el-select>
                <el-cascader v-if="item.type == 'cascader'" v-model="formData[item.name]" :options="item.options" :props="check(item.props,{})" :placeholder="check(item.placeholder,'')" :disabled="check(item.disabled,false)" :clearable="check(item.clearable,false)" :show-all-levels="check(item.showAllLevels,true)" :collapse-tags="check(item.collapseTags,false)" :separator="check(item.separator,'/')" :filterable="check(item.filterable,false)" :debounce="check(item.debounce,300)" :popper-class="check(item.popperClass,'')"></el-cascader>
                <el-switch v-if="item.type == 'switch'" v-model="formData[item.name]" :disabled="check(item.disabled,false)" :width="check(item.width,40)" :active-icon-class="check(item.activeIconClass,'')" :inactive-icon-class="check(item.inactiveIconClass,'')" :active-text="check(item.activeText,'')" :inactive-text="check(item.inactiveText,'')" :active-value="check(item.activeValue,true)" :inactive-value="check(item.inactiveValue,false)" :active-color="check(item.activeColor,'#409EFF')" :inactive-color="check(item.inactiveColor,'#C0CCDA')" :validate-event="check(item.validateEvent,true)"></el-switch>
                <el-slider v-if="item.type == 'slider'" v-model="formData[item.name]" :min="check(item.min,0)" :max="check(item.max,100)" :disabled="check(item.disabled,false)" :step="check(item.step,1)" :show-input="check(item.showInput,false)" :show-input-controls="check(item.showInputControls,true)" :input-size="check(item.inputSize,'small')" :show-stops="check(item.showStops,false)" :show-tooltip="check(item.showTooltip,true)" :range="check(item.range,false)" :vertical="check(item.vertical,false)" :height="check(item.height,'')" :debounce="check(item.debounce,300)" :tooltip-class="check(item.tooltipClass,'')" :marks="check(item.marks,{})"></el-slider>
                <el-time-select v-if="item.type == 'time-select'" v-model="formData[item.name]" :readonly="check(item.readonly,false)" :disabled="check(item.disabled,false)" :editable="check(item.editable,true)" :clearable="check(item.clearable,true)" :placeholder="check(item.placeholder,'')" :start-placeholder="check(item.startPlaceholder,'')" :end-placeholder="check(item.endPlaceholder,'')" :is-range="check(item.isRange,false)" :arrow-control="check(item.arrowControl,false)" :align="check(item.align,'left')" :popper-class="check(item.popperClass,'')" :picker-options="check(item.pickerOptions,{})" :range-separator="check(item.rangeSeparator,'')" :value-format="check(item.valueFormat,'')" :default-value="check(item.defaultValue,'')" :prefix-icon="check(item.prefixIcon,'')" :clear-icon="check(item.clearIcon,'')"></el-time-select>
                <el-date-picker v-if="item.type == 'date-picker'" v-model="formData[item.name]" :readonly="check(item.readonly,false)" :disabled="check(item.disabled,false)" :editable="check(item.editable,true)" :clearable="check(item.clearable,true)" :placeholder="check(item.placeholder,'')" :start-placeholder="check(item.startPlaceholder,'')" :end-placeholder="check(item.endPlaceholder,'')" :time-arrow-control="check(item.timeArrowControl,false)" :type="check(item.panelType,'date')" :format="check(item.format,'yyyy-MM-dd')" :align="check(item.align,'left')" :popper-class="check(item.popperClass,'')" :picker-options="check(item.pickerOptions,{})" :range-separator="check(item.rangeSeparator,'-')" :default-value="check(item.defaultValue,'')" :default-time="check(item.defaultTime,[])" :value-format="check(item.valueFormat,'')" :unlink-panels="check(item.unlinkPanels,false)" :prefix-icon="check(item.prefixIcon,'')" :clear-icon="check(item.clearIcon,'')" :validate-event="check(item.validateEvent,true)" :append-to-body="check(item.appendToBody,true)"></el-date-picker>
                <el-upload v-if="item.type == 'upload'" v-model="formData[item.name]" :action="check(item.action,'')" :headers="check(item.headers,{})" :multiple="check(item.multiple,false)" :data="check(item.data,{})" :with-credentials="check(item.withCredentials,false)" :show-file-list="check(item.showFileList,true)" :drag="check(item.drag,false)" :accept="check(item.accept,'')" :list-type="check(item.listType,'text')" :auto-upload="check(item.autoUpload,true)" :file-list="check(item.fileList,[])" :disabled="check(item.disabled,false)" :limit="check(item.limit,999999)">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">{{item.tip}}</div>
                </el-upload>
                <el-rate v-if="item.type == 'rate'" v-model="formData[item.name]" :max="check(item.max,5)" :disabled="check(item.disabled,false)" :allow-half="check(item.allowHalf,false)" :low-threshold="check(item.lowThreshold,2)" :high-threshold="check(item.highThreshold,4)" :colors="check(item.colors,['#F7BA2A', '#F7BA2A', '#F7BA2A'])" :void-color="check(item.voidColor,'#C6D1DE')" :disabled-void-color="check(item.disabledVoidColor,'#EFF2F7')" :icon-classes="check(item.iconClasses,['el-icon-star-on', 'el-icon-star-on','el-icon-star-on'])" :void-icon-class="check(item.voidIconClass,'el-icon-star-off')" :disabled-void-icon-class="check(item.disabledVoidIconClass,'el-icon-star-on')" :show-text="check(item.showText,false)" :show-score="check(item.showScore,false)" :text-color="check(item.textColor,'#1F2D3D')" :texts="check(item.texts,['极差', '失望', '一般', '满意', '惊喜'])" :score-template="check(item.scoreTemplate,'{value}')"></el-rate>
                <el-color-picker v-if="item.type == 'color-picker'" v-model="formData[item.name]" :disabled="check(item.disabled,false)" :show-alpha="check(item.showAlpha,false)" :color-format="check(item.colorFormat,'hex')" :popper-class="check(item.popperClass,'')" :predefine="check(item.predefine,[])"></el-color-picker>
            </el-form-item>
            <el-form-item v-if="type == 'card'">
                <el-button type="primary" @click="submitOnClick">提交</el-button>
            </el-form-item>
        </el-form>
        <div class="adminui-form-footer" v-if="type == 'drawer'">
            <div class="adminui-form-footer-box">
                <el-button @click="cancelOnClick" size="small">取消</el-button>
                <el-button @click="submitOnClick" size="small" type="primary">提交</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['type', 'uniqueValue', 'formData', 'formFields'],
    computed: {},
    watch: {
        'formData': function(data) {
            var formFields = this.formFields;

            for (var i = 0; i < formFields.length; i++) {
                var type = formFields[i].type;
                var name = formFields[i].name;
                if (type == 'checkbox' && data[name] == undefined) {
                    data[name] = [];
                }
            }

            return data;
        }
    },
    mounted: function() {
    },
    data: function() {
        return {}
    },
    methods: {
        check: function(value, defaultValue) {
            return value !== undefined ? value : defaultValue;
        },
        submitOnClick: function() {
            var that = this;

            if(!this.$route.meta['api'] || !this.$route.meta['api']['form']){
                this.$funs.errorMsg('当前菜单未提供获取表单配置数据接口');
                return;
            }

            var meta = this.$funs.cloneData(this.$route.meta);
            // 避免将配置数据重复发送到后台
            delete meta['setting'];
            delete meta['api'];
            meta['hasSetting'] = 0;
            meta['formAction'] = 'set';
            meta['uniqueValue'] = this.uniqueValue;

            // 其他情况，都尝试通过后台获取表单字段和表单数据
            this.$funs.post(this.$route.meta['api']['form'], { meta: meta, data: this.formData }, function(result) {

                // 弹出提交成功的消息
                if (result.status == 1) {
                    that.$funs.successMsg(result.msg);
                    return;
                }

                // 弹出错误信息
                that.$funs.errorMsg(result.msg);

                // 状态2表示token过期
                if (result.status == 2) {
                    that.$funs.removeTokenAndReload(0);
                    return;
                }

            }, function(err) {
                console.log(err);
                that.$funs.errorMsg('获取表单数据失败');
            });
        },
        cancelOnClick: function() {
            this.$emit('formcancel');
        },

    },
}
</script>
<style>
.adminui-form {}

.adminui-form .adminui-form-content {
    padding: 10px 32px 40px 32px;
}

.adminui-form .adminui-form-footer {
    position: absolute;
    width: 100%;
    padding: 15px 0;
    bottom: 0;
    border-top: 1px solid #e4e7ed;
    text-align: right;
    background-color: #fff;
    z-index: 999999;
}

.adminui-form .adminui-form-footer .adminui-form-footer-box {
    padding-right: 20px;
}

.adminui-form .adminui-form-footer .el-button {
    /*    margin-right: 20px;*/
    /*    width: 140px;*/
}
</style>