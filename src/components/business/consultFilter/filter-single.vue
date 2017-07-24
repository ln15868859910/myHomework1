<template>
    <div :class="singleItemWrap">
        <div :class="singleItem" v-for="(model,index) in model.modelList" :key="index" :model="model" :config="config" :is="currentView"></div>
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
        },
        config: {
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
        createInitStatus() {
            this.initStatus[this.model.sortValue] = false;
        },

        dateFormat(dateStr,formatStr) {
            var isFormatValid,
                hasFormat = formatStr ? true : false;
            
            isFormatValid = /YYYY[^Y]+MM[^M]+DD[^D]*/i.test(formatStr);
                
            if(hasFormat && !isFormatValid){
                throw new Error("传入时间格式："+formatStr+"不符合YYYY-MM-DD格式，请检查大小写后重新输入")
                return;
            }

            var yearSeparate = hasFormat ? /YYYY([^]*)MM/i.exec(formatStr)[1]: "年",
                monthSeparate = hasFormat ? /MM([^]*)DD/i.exec(formatStr)[1]: "月",
                daySeparate = hasFormat ? /DD([^]*)/i.exec(formatStr)[1]: "日",
            
                dateYear = /(\d{4})[^\d]*(\d{1,2})[^\d]*(\d{1,2})/.exec(dateStr)[1],
                dateMonth = /(\d{4})[^\d]*(\d{1,2})[^\d]*(\d{1,2})/.exec(dateStr)[2],
                dateDay = /(\d{4})[^\d]*(\d{1,2})[^\d]*(\d{1,2})/.exec(dateStr)[3];
            
            return dateYear+yearSeparate+dateMonth+monthSeparate+dateDay+daySeparate;
        },

        observeEvent() {
            //监听父层筛选项修改事件
            Emiter.$on(this.model.sortValue + "-change", this.onFilterChange);
        },

        onFilterChange(data) {
            if (!data) {
                return;
            }
            if (this.model.componentConfig.multiple) {

                this.model.componentConfig.value = data;

            } else {
                this.model.componentConfig.value = data;
            }

        },
        initData() {
            var 
                me = this,
                modelList = this.model;

            if (modelList.componentType == "select") {
                var defaultValue = modelList.componentConfig.value[0];
                var defaultObj = modelList.componentConfig.optionList.find(function (item) {
                    if (item.value == defaultValue) {
                        return item;
                    }
                })

                Emiter.$emit("single-change", {
                    sortName: modelList.componentConfig.placeholder,
                    sortValue: modelList.sortValue,
                    componentType: "select",
                    label: [{
                        text: defaultObj.label,
                        value: defaultValue
                    }]
                });
            }

            if (modelList.componentType == "daterange") {

                var defaultValueList = modelList.componentConfig.value;
                var defaultFormat = modelList.componentConfig.format;
                Emiter.$emit("single-change", {
                    sortName: modelList.componentConfig.placeholder,
                    sortValue: modelList.sortValue,
                    componentType: "daterange",
                    shortcut: "",
                    label: [{
                        text: `开始时间：${me.dateFormat(defaultValueList[0],defaultFormat)} - 结束时间：${me.dateFormat(defaultValueList[1],defaultFormat)}`,
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
                        placeholder: modelList.componentConfig.placeholder,
                        clearable: modelList.componentConfig.clearable,
                        "label-in-value": true
                    },
                    on: {
                        "on-change": function (obj) {

                            //保持当前model的value值与组件内部的value一致
                            me.model.componentConfig.value = [obj.value];

                            Emiter.$emit("single-change", {
                                sortName: modelList.componentConfig.placeholder,
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
                        placeholder: modelList.componentConfig.placeholder ? modelList.componentConfig.placeholder : "请选择日期",
                        options: me.config.dateRange,
                        format: modelList.componentConfig.format ? modelList.componentConfig.format : "yyyy年MM月dd日"
                    },
                    on: {

                        "on-clear": function () {
                            Emiter.$emit("single-change", {
                                sortName: modelList.componentConfig.placeholder,
                                sortValue: modelList.sortValue,
                                componentType: "daterange",
                                label: []
                            });
                        },

                        "on-change": function (list) {
                            //删除时的分支
                            if (!list[0]) {
                                Emiter.$emit("single-change", {
                                    sortName: modelList.componentConfig.placeholder,
                                    sortValue: modelList.sortValue,
                                    componentType: "daterange",
                                    label: []
                                });
                            } else {

                                Emiter.$emit("single-change", {
                                    sortName: modelList.componentConfig.placeholder,
                                    sortValue: modelList.sortValue,
                                    componentType: "daterange",
                                    label: [me.dateFormat(list[0]), me.dateFormat(list[1])]
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
            currentView: maker,
            config: {
                dateRange: {
                    shortcuts: [
                        {
                            text: '一周内',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '一个月内',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '三个月内',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        },
                        {
                            text: '半年内',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                                return [start, end];
                            }
                        },
                        {
                            text: '一年内',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                                return [start, end];
                            }
                        },
                    ]
                }
            }
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
