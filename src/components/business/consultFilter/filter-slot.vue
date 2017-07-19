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
        if (this.model.type == 2) {
            return h('Button', {
                props: {
                    type: 'warning',
                    size: 'small'
                },
                style: {
                    marginRight: '8px'
                },
                on: {
                    click: function () {
                        alert(1)
                    }
                }
            }, '编辑');
        }
        else if (this.model.type == 3) {
            return createElement(Select);
        }
        else if (this.model.type == 4) {
            return createElement(Select);
        }
    }

};
export default {
    name: 'filterSlot',
    props: {
        model: {
            require: true
        }
    },
    data() {
        return {
            currentView: FilterSlotComponent
        };
    },
    components: { 
        Emiter
    },
    computed: {

    },
    mounted() {

    },
    methods: {

    }
};

</script>
