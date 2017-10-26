<template>
    <div :class="singleItemWrap" :style="{display:model.modelList.length?'block':'none'}">
        <div :class="singleItem" v-for="(model,index) in model.modelList" :key="index" :model="model" :is="currentView"></div>
    </div>
</template>

<script>
const prefixCls = "spui-b-consultFilter";

import Emiter from './emiter.vue';
import DatePicker from '../../components/date-picker';
import Axios from 'axios';
import { Select, Option, OptionGroup } from '../../components/select';

//拼装数据
function getComponentConfig(model, remoteMethod) {
    var data;
    switch (model.componentType) {
        case "select":
            data = {
                value: model.componentConfig.value[0],
                multiple: model.componentConfig.multiple,
                disabled: model.componentConfig.disabled,
                filterable: model.componentConfig.filterable,
                placeholder: model.sortName,
                clearable: model.componentConfig.clearable,
                "label-in-value": true
            };

            if (remoteMethod) {
                var optionList = model.componentConfig.optionList;
                data.remote = true;
                data["remote-method"] = remoteMethod;
                data.loading = model.componentConfig.loading === true ? true : false
                data.label = "";
                for (var i = 0, l = optionList.length; i < l; i++) {
                    if (optionList[i].value == data.value) {
                        data.label = optionList[i].label;
                        break;
                    }
                }
            }
            break;

        default:
            break;
    }
    return data;
}



var maker = {
    props: {
        model: {
            require: true
        }
    },

    data() {
        return {
            type: "fromBottom",
            status: {
                isInitComplete: false
            },
            debounceObj: {},
            selectedValue: ""
        }
    },
    created() {
        if (this.model.remoteUrl && this.model.remoteUrl.onSearch) {
            //动态添加loading属性，双向绑定
            this.$set(this.model.componentConfig, "loading", false);
        }
        //根据外部传入数据设置type标识数据来源
        if (this.model.componentConfig.value.length) {
            this.type = "fromOutSide"
        }

        if (this.model.componentConfig.componentType == "select") {

            //给每一项下拉添加默认disabled属性
            if (this.model.componentConfig.optionList.length) {

                this.model.componentConfig.optionList.map(function (item, index) {
                    item.disabled = false;
                })
                //数据超过50条，添加自定义文案
                if (this.model.componentConfig.itemCount >= 50) {
                    this.model.componentConfig.optionList.push({
                        value: "abadon",
                        label: "【更多选项请搜索】",
                        disabled: true
                    })
                }
            } else {

                this.model.componentConfig.optionList.push({
                    value: "emptyData",
                    label: "暂无数据",
                    disabled: true
                })

            }
        }
    },
    mounted() {
        this.observeEvent();
        this.initData();
    },
    beforeDestroy() {
        //移除父层筛选项修改事件
        Emiter.$off(this.model.sortValue + "-change", this.onFilterChange);
    },
    methods: {
        setDateRangeShotcuts(shotCutsList) {
            return shotCutsList.map(function (item, index) {
                return {
                    "text": item.label,
                    value() {
                        const end = new Date(item.value.split(",")[1]);
                        const start = new Date(item.value.split(",")[0]);
                        return [start, end];
                    }
                }
            })
        },
        dateFormat(dateStr, formatStr) {
            var isFormatValid,
                hasFormat = formatStr ? true : false;

            isFormatValid = /YYYY[^Y]+MM[^M]+DD[^D]*/i.test(formatStr);

            if (hasFormat && !isFormatValid) {
                throw new Error("传入时间格式：" + formatStr + "不符合YYYY-MM-DD格式，请检查大小写后重新输入")
                return;
            }

            var yearSeparate = hasFormat ? /YYYY(.*)MM/i.exec(formatStr)[1] : "年",
                monthSeparate = hasFormat ? /MM(.*)DD/i.exec(formatStr)[1] : "月",
                daySeparate = hasFormat ? /DD(.*)/i.exec(formatStr)[1] : "日",

                dateYear = /(\d{4})[^\d]*(\d{1,2})[^\d]*(\d{1,2})/.exec(dateStr)[1],
                dateMonth = /(\d{4})[^\d]*(\d{1,2})[^\d]*(\d{1,2})/.exec(dateStr)[2],
                dateDay = /(\d{4})[^\d]*(\d{1,2})[^\d]*(\d{1,2})/.exec(dateStr)[3];

            return dateYear + yearSeparate + dateMonth + monthSeparate + dateDay + daySeparate;
        },

        observeEvent() {
            //监听父层筛选项修改事件
            Emiter.$on(this.model.sortValue + "-change", this.onFilterChange);
        },

        onFilterChange(data, list, type) {

            this.type = type ? type : this.type;

            if (!data) {
                return;
            }
            this.model.componentConfig.value = data;

            var me = this;
            // bugFix(临时)：修复时间类型清空了默认值父层检测不到事件的bug
            if (this.model.componentType == "daterange") {
                Emiter.$emit("single-change", {
                    sortName: me.model.sortName,
                    sortValue: me.model.sortValue,
                    componentType: "daterange",
                    label: [{
                        text: "",
                        value: ""
                    }]
                }, this.type);
                this.type = "fromBottom";
            }

            var sortValue = this.model.sortValue;
            setTimeout(() => {
                //bugFix（临时）：修复清空了值上一个未清空选中项的bug
                this.$refs[sortValue] ? this.$refs[sortValue].clearSingleSelect() : "";
                this.$refs[sortValue] ? this.$refs[sortValue].selectedSingle = "" : "";
            }, 0)
        },
        remoteMethod(query) {
            this.query=query;
            //bugFix(临时)：单选选中选项后不再请求
            if (this.isValueChange) {
                this.isValueChange = !this.isValueChange;
                return;
            }

            //输入空格不做请求
            if (/\s+/.test(query)) {
                return;
            }
            query = query.trim();

            var me = this;
            var req = {
                "req": {
                    "Filter": {
                        "Filter": query
                    }
                }
            }
            me.model.componentConfig.loading = true;

            var ajax = () => {
                Axios.post(this.model.remoteUrl.onSearch, req).then(function (res) {
                    var data = res.data;
                    me.model.componentConfig.loading = false;
                    if (data && data.Status) {
                        var tempList = [];

                        data.Data.ComponentConfig.OptionList.map(function (item, index) {
                            tempList.push({
                                label: item.Label,
                                value: item.Value,
                                disabled: false
                            })
                        })

                        //数据超过50条，添加自定义文案
                        if (data.Data.ComponentConfig.ItemCount >= 50) {
                            tempList.push({
                                value: "abadon",
                                label: "【更多选项请输入更多关键词】",
                                disabled: true
                            })
                        }
                        me.model.componentConfig.optionList = tempList;
                    }

                })
            }
            this.debounce(ajax, 500, "remoteMethod")

        },
        debounce(func, timeout, type) {

            this.debounceObj[type] && clearTimeout(this.debounceObj[type]);
            this.debounceObj[type] = setTimeout(() => {
                func()
            }, timeout)
        },
        initData() {
            var
                me = this,
                modelList = this.model;

            if (modelList.componentType == "select") {
                var defaultValue = this.model.componentConfig.value[0];

                //判断是否有初始值
                if (!defaultValue) {
                    return;
                }

                var defaultObj = modelList.componentConfig.optionList.find(function (item) {
                    if (item.value == defaultValue) {
                        return item;
                    }
                })

                Emiter.$emit("single-change", {
                    sortName: modelList.sortName,
                    sortValue: modelList.sortValue,
                    componentType: "select",
                    label: [{
                        text: defaultObj.label,
                        value: defaultValue
                    }]
                }, me.type);
                me.type = "fromBottom";
            }

            if (modelList.componentType == "daterange") {

                var defaultValueList = modelList.componentConfig.value,
                    defaultFormat = modelList.componentConfig.format;

                //判断是否有初始值
                if (defaultValueList.length === 0) {
                    return;
                }

                Emiter.$emit("single-change", {
                    sortName: modelList.sortName,
                    sortValue: modelList.sortValue,
                    componentType: "daterange",
                    shortcut: "",
                    label: [{
                        text: `开始时间：${me.dateFormat(defaultValueList[0], defaultFormat)} - 结束时间：${me.dateFormat(defaultValueList[1], defaultFormat)}`,
                        value: [defaultValueList[0], defaultValueList[1]]
                    }]
                }, me.type);
                me.type = "fromBottom";
            }
        }
    },

    render(h) {
        var me = this,
            remoteMethod = null;

        if (this.model.remoteUrl && this.model.remoteUrl.onSearch) {
            remoteMethod = this.remoteMethod;
        }

        //纯文本筛选
        if (me.model.componentType == "select") {

            return h(
                Select,
                {
                    props: getComponentConfig(this.model, remoteMethod),
                    ref: this.model.sortValue,
                    on: {
                        "on-change": function (obj) {

                            var result = {};
                            if (!me.selectedValue && !me.query) {
                                me.isValueChange = true;
                            }
                            me.selectedValue = obj.value;
                            //bugFix（临时）：解决iview单选组件选中后默认会去请求一次接口，现根据是否有选中值去调不同的方法

                            if (Object.prototype.toString.call(obj).toLowerCase() === "[object object]") {
                                result = obj;
                                //保持当前model的value值与组件内部的value一致
                                me.model.componentConfig.value = [result.value];
                            }
                            //bugFix(临时)：针对obj有时只返回value值手动去找一遍它的value值
                            // else if (typeof obj === "string") {
                            //     var
                            //         optsList = me.model.componentConfig.optionList;
                            //     //保持当前model的value值与组件内部的value一致
                            //     me.model.componentConfig.value = [obj];
                            //     optsList.map(function (item, index) {
                            //         if (item.value == obj) {
                            //             result.label = item.label;
                            //             return;
                            //         }
                            //     })
                            //     result.value = obj;
                            // }

                            Emiter.$emit("single-change", {
                                sortName: me.model.sortName,
                                sortValue: me.model.sortValue,
                                componentType: "select",
                                label: [{
                                    text: result.label,
                                    value: result.value
                                }]
                            }, me.type);
                            me.type = "fromBottom"
                        },
                    }
                },
                [
                    me.model.componentConfig.optionList.map(function (item) {
                        return h(Option, {
                            props: {
                                label: item.label,
                                value: item.value,
                                disabled: item.disabled
                            }
                        })
                    })
                ])

        }

        //时间区间选择类型
        if (me.model.componentType == "daterange") {

            return h(
                DatePicker,
                {
                    props: {
                        type: "daterange",
                        value: me.model.componentConfig.value,
                        placeholder: me.model.sortName ? me.model.sortName : "请选择日期",
                        placement: "bottom-end",
                        options: { shortcuts: me.model.componentConfig.optionList.length ? this.setDateRangeShotcuts(me.model.componentConfig.optionList) : [] },
                        format: me.model.componentConfig.format ? me.model.componentConfig.format : "yyyy年MM月dd日"
                    },
                    on: {

                        "on-clear": function () {

                            //保持当前model的value值与组件内部的value一致
                            me.model.componentConfig.value = [];

                            Emiter.$emit("single-change", {
                                sortName: me.model.sortName,
                                sortValue: me.model.sortValue,
                                componentType: "daterange",
                                label: [{
                                    text: "",
                                    value: ""
                                }]
                            }, me.type);
                            me.type = "fromBottom"
                        },

                        "on-change": function (list) {

                            if (list[0]) {

                                //保持当前model的value值与组件内部的value一致
                                me.model.componentConfig.value = [me.dateFormat(list[0], "YYYY-MM-DD"), me.dateFormat(list[1], "YYYY-MM-DD")]

                                Emiter.$emit("single-change", {
                                    sortName: me.model.sortName,
                                    sortValue: me.model.sortValue,
                                    componentType: "daterange",
                                    shortcut: "",
                                    label: [{
                                        text: `开始时间：${me.dateFormat(list[0], me.model.componentConfig.format)} - 结束时间：${me.dateFormat(list[1], me.model.componentConfig.format)}`,
                                        value: [me.dateFormat(list[0], "YYYY-MM-DD"), me.dateFormat(list[1], "YYYY-MM-DD")]
                                    }]
                                }, me.type);
                                me.type = "fromBottom"
                            }

                        }
                    }
                }
            )

        }
    }
};

export default {
    name: 'consultFilterSingle',
    props: {
        model: {
            require: true
        }
    },
    components: {

    },
    data() {
        return {
            currentView: maker
        };
    },
    computed: {
        singleItem() {
            return `${prefixCls}-singleItem`
        },
        singleItemWrap() {
            return this.model.class ? this.model.class : `${prefixCls}-singleItemWrap`;
        }
    },

    mounted() {

    },
    methods: {

    }
};

</script>
