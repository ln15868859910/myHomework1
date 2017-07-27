<template>
    <div :class="singleItemWrap">
        <div :class="singleItem" v-for="(model,index) in model.modelList" :key="index" :model="model" :is="currentView"></div>
    </div>
</template>

<script>
const prefixCls = "spui-b-consultFilter";

import Emiter from './emiter.vue';
import DatePicker from '../../date-picker';
import { Select, Option, OptionGroup } from '../../select';

var maker = {
    props: {
        model: {
            require: true
        }
    },

    data() {
        return {

        }
    },
    created() {
    },
    mounted() {
        this.initData();
        this.observeEvent();
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

            var yearSeparate = hasFormat ? /YYYY([^]*)MM/i.exec(formatStr)[1] : "年",
                monthSeparate = hasFormat ? /MM([^]*)DD/i.exec(formatStr)[1] : "月",
                daySeparate = hasFormat ? /DD([^]*)/i.exec(formatStr)[1] : "日",

                dateYear = /(\d{4})[^\d]*(\d{1,2})[^\d]*(\d{1,2})/.exec(dateStr)[1],
                dateMonth = /(\d{4})[^\d]*(\d{1,2})[^\d]*(\d{1,2})/.exec(dateStr)[2],
                dateDay = /(\d{4})[^\d]*(\d{1,2})[^\d]*(\d{1,2})/.exec(dateStr)[3];

            return dateYear + yearSeparate + dateMonth + monthSeparate + dateDay + daySeparate;
        },

        observeEvent() {
            //监听父层筛选项修改事件
            Emiter.$on(this.model.sortValue + "-change", this.onFilterChange);
        },

        onFilterChange(data) {
            if (!data) {
                return;
            }
            this.model.componentConfig.value = data;
        },
        initData() {
            var
                me = this,
                modelList = this.model;

            if (modelList.componentType == "select") {
                var defaultValue = modelList.componentConfig.value[0];
               
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
                });
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
                });

            }
        }
    },

    render(h) {
        var me = this,
            modelList = this.model;

        //纯文本筛选
        if (modelList.componentType == "select") {

            return h(
                Select,
                {
                    props: {
                        value: modelList.componentConfig.value[0],
                        multiple: modelList.componentConfig.multiple,
                        disabled: modelList.componentConfig.disabled,
                        filterable: modelList.componentConfig.filterable,
                        placeholder: modelList.sortName,
                        clearable: modelList.componentConfig.clearable,
                        "label-in-value": true
                    },
                    on: {
                        "on-change": function (obj) {

                            //保持当前model的value值与组件内部的value一致
                            me.model.componentConfig.value = [obj.value];

                            Emiter.$emit("single-change", {
                                sortName: modelList.sortName,
                                sortValue: modelList.sortValue,
                                componentType: "select",
                                label: [{
                                    text: obj.label,
                                    value: obj.value
                                }]
                            });
                        },
                    }
                },
                [
                    modelList.componentConfig.optionList.map(function (item) {
                        return h(Option, {
                            props: {
                                label: item.label,
                                value: item.value
                            }
                        })
                    })
                ])

        }

        //时间区间选择类型
        if (modelList.componentType == "daterange") {

            return h(
                DatePicker,
                {
                    props: {
                        type: "daterange",
                        value: modelList.componentConfig.value,
                        placeholder: modelList.sortName ? modelList.sortName : "请选择日期",
                        placement: "bottom-end",
                        options: {shortcuts:modelList.componentConfig.optionList.length ? this.setDateRangeShotcuts(modelList.componentConfig.optionList) : []},
                        format: modelList.componentConfig.format ? modelList.componentConfig.format : "yyyy年MM月dd日"
                    },
                    on: {

                        "on-clear": function () {
                            Emiter.$emit("single-change", {
                                sortName: modelList.sortName,
                                sortValue: modelList.sortValue,
                                componentType: "daterange",
                                label: [{
                                    text:"",
                                    value:""
                                }]
                            });
                        },

                        "on-change": function (list) {

                            if(list[0]){
                                Emiter.$emit("single-change", {
                                    sortName: modelList.sortName,
                                    sortValue: modelList.sortValue,
                                    componentType: "daterange",
                                    shortcut: "",
                                    label: [{
                                        text: `开始时间：${me.dateFormat(list[0], modelList.componentConfig.format)} - 结束时间：${me.dateFormat(list[1], modelList.componentConfig.format)}`,
                                        value: [me.dateFormat(list[0],"YYYY-MM-DD"), me.dateFormat(list[1],"YYYY-MM-DD")]
                                    }]
                                });
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
