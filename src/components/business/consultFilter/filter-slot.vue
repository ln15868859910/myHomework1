/*
 * @Author: li.lv 
 * @Date: 2017-07-19 10:42:59 
 * @Last Modified by: li.lv
 * @Last Modified time: 2017-07-19 15:46:17
 */


// df
<template>
    <div>
        <component :model="model" :is="currentView">
    
        </component>
    </div>
</template>
<script>
import Emiter from './emiter.vue';
import { Select, Option, OptionGroup } from '../../select';
import DatePicker from '../../date-picker';

var config = {};

const FilterSlotComponent = {
    props: {
        model: {
            require: true
        }
    },
    data() {
        return {
        }
    },
    render(h) {
        var _this= this;
        //select组件
        if (this.model.type == 1) {
            return h(
                Select,
                {
                    props: {
                        value: this.model.value,
                        multiple: this.model.multiple,
                        disabled: this.model.disabled,
                        filterable: this.model.filterable,
                        placeholder: this.model.placeholder,
                        clearable: true
                    },
                    on: {
                        "on-change": function (value, label) {
                            Emiter.$emit("union-change", { value: value, label: label });
                        },
                        "on-query-change": function () {
                        }
                    }
                },
                [
                    this.model.optionList.map(function (item) {
                        return h(Option, {
                            props: {
                                label: item.label,
                                value: item.value
                            }
                        })
                    })

                ]
                , this.$slots.default)
        }
        //时间区间选择类型
        if (this.model.type == "daterange") {
            var me = this;
            return h(
                DatePicker,
                {
                    props: {
                        type:"daterange",
                        placeholder: this.model.placeholder ? this.model.placeholder : "请选择日期",
                        options: config.datePicker
                    },
                    on:{
                        "on-change": function(obj){
                            Emiter.$emit("single-change",{ value: obj.value, label: obj.label })
                            me.model.callback(obj);
                        }
                    }
                }
            )
        }
        
    }

};

//组件配置项
config.datePicker = {
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

export default {
    name: 'filterSlot',
    props: {
        model: {
            require: true
        }
    },
    data() {
        return {
            currentView: FilterSlotComponent,
        };
    },
    components: { 
    },
    computed: {

    },
    mounted() {

    },
    methods: {

    }
};

</script>
