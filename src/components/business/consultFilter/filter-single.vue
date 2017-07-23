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
        return {//临时解决方案，时间控件会render两次，无法作区分，这里保存控件初始化状态
            initStatus: {}
        }
    },
    created() {
        this.createInitStatus();
    },
    mounted() {
        this.observeEvent();
    },
    methods: {
        createInitStatus() {
            this.initStatus[this.model.sortValue] = false;
        },

        dateFormat(dateStr) {
            return `${dateStr.substring(0, 4)}-${dateStr.substring(5, 7)}-${dateStr.substring(8, 10)}`;
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

        }
    },

    render(h) {
        var me = this,
            modelList = this.model;

        //纯文本筛选
        if (modelList.componentType == "select") {

            //默认值处理，手动触发事件
            var defaultValue = modelList.componentConfig.value[0];
            if (!this.initStatus[modelList.sortValue] && defaultValue) {
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
                            me.model.componentConfig.value=[obj.value];

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
                    }),
                    //初始化完成记录，该分类的初始化完成状态
                    me.initStatus[modelList.sortValue] = true
                ])

        }

        //时间区间选择类型
        if (modelList.componentType == "daterange") {

            //默认值处理，手动触发事件
            var defaultValueList = modelList.componentConfig.value;
            if (!this.initStatus[modelList.sortValue] && defaultValueList.length > 0) {

                Emiter.$emit("single-change", {
                    sortName: modelList.componentConfig.placeholder,
                    sortValue: modelList.sortValue,
                    componentType: "daterange",
                    shortcut: "",
                    label: [me.dateFormat(defaultValueList[0]), me.dateFormat(defaultValueList[1])]
                });
            }

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

                        "on-clear": function(){
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

                                 //保持当前model的value值与组件内部的value一致
                                // me.model.componentConfig.value=list;

                                Emiter.$emit("single-change", {
                                    sortName: modelList.componentConfig.placeholder,
                                    sortValue: modelList.sortValue,
                                    componentType: "daterange",
                                    label: [me.dateFormat(list[0]), me.dateFormat(list[1])]
                                });
                            }

                        }
                    }
                }, [
                    //初始化完成记录，该分类的初始化完成状态
                    this.initStatus[modelList.sortValue] = true
                ]
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
