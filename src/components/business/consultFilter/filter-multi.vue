<template>
    <div>
        <component v-for="(item,index) in model" key="index" :model="item" :is="currentView">
    
        </component>
    </div>
</template>
<script>

import Emiter from './emiter.vue';
import { Select, Option, OptionGroup } from '../../select';

function getComponentConfig(type, model) {
    var data;
    switch (type) {
        case "select":
            data = {
                value: model.value,
                multiple: true,
                disabled: model.disabled,
                filterable: model.filterable,
                placeholder: model.placeholder,
                clearable: model.clearable,
                "label-in-value": true,
                remote: false
            }
            break;

        default:
            break;
    }
    return data;
}

const MultiFilterSlotComponent = {
    props: {
        model: {
            type: Object,
            require: true
        }
    },
    data() {
        return {
        }
    },
    render(h) {
        var _this = this;
        //select组件
        if (this.model.type == 1) {
            return h(
                Select,
                {
                    props: getComponentConfig(this.model.componentType, this.model.componentConfig),
                    attr: !this.model.componentConfig.attr ? {} : this.model.componentConfig.attr,
                    on: {
                        "on-change": function (value) {
                            var data = {
                                componentType: _this.model.componentType,
                                sortValue: _this.model.sortValue,
                                sortName: _this.model.sortName,
                                value: value
                            }
                            Emiter.$emit("union-change-slot", data);
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

                ])
        }
    }

};

export default {
    name: 'consultFilterUnion',
    props: {
        model: {
            require: true
        }
    },
    components: {
    },
    data() {
        return {
            currentView: MultiFilterSlotComponent,
        };
    },
    computed: {

    },
    mounted() {
        this.init();
    },
    methods: {
        init() {

        },
        observeEvent() {
            //监听联动模块子组件change事件
            Emiter.$on("multi-change-slot", this.onChange);
            //监听父层筛选项修改事件
            Emiter.$on(this.model.sortValue + "-change", this.onFilterChange);
        },
        onChange(params) {
            var _this = this;
            if (params.componentType == "select") {
                data = {
                    sortName: params.sortName,
                    sortValue: params.sortValue,
                    label: []
                }
                params.value.map(function (item, index) {
                    var model = {
                        value: item.value,
                        text: item.label
                    }
                    data.label.push(model);
                })
            }
            Emiter.$on("multi-change", this.onChange);
        },
        onFilterChange(data) {
            if (!data) {
                return;
            }
            this.model.componentConfig.value = data;

        }

    }
};

</script>
