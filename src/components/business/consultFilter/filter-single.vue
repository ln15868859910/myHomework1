<template>
    <div :class="singleItemWrap">
        <div :class="singleItem" v-for="(model,index) in model" :key="index" :model="model" :config="config" :is="currentView"></div>
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
        config:{
            require:true
        }

    },
    data() {
        return {
        }
    },

    render(h) {
        var me = this;
        //纯文本筛选
        if (this.model.type == "default") {
            return h(
                Select,
                {
                    props: {
                        value: this.model.value,
                        multiple: this.model.multiple,
                        disabled: this.model.disabled,
                        filterable: this.model.filterable,
                        placeholder: this.model.sortname
                    },
                    on: {
                        "on-change": function (obj) {
                            Emiter.$emit("single-change", { value: obj.value, label: obj.label });
                        },
                    }
                },
                [
                    me.model.lables.map(function (item) {
                        return h(Option, {
                            props: {
                                label: item.text,
                                value: item.value
                            }
                        })
                    })

                ])
        }

        //时间区间选择类型
        if (this.model.type == "daterange") {
            
            return h(
                DatePicker,
                {
                    props: {
                        type: "daterange",
                        placeholder: this.model.sortname ? this.model.sortname : "请选择日期",
                        style: "width:140px",
                        options: me.config.datePicker
                    },
                    on: {
                        "on-change": function (obj) {
                            Emiter.$emit("single-change", { value: obj.value, label: obj.label })
                            me.model.callback(obj);
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
                datePicker: {
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
            return `${prefixCls}-singleItemWrap`
        }
    },
    mounted() {
        Emiter.$on("single-change", this.fn);
    },
    methods: {
        fn(aa) {
            console.log(aa);
        }
    }
};

</script>
