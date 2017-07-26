<template>
    <div :class="multiItemWrap">
        <component :class="multiItem" v-for="(item,index) in model.modelList" :key="index" :model="item" :is="currentView">
    
        </component>
    </div>
</template>
<script>

import Emiter from './emiter.vue';
import { Select, Option, OptionGroup } from '../../select';

function getComponentConfig(type, model,placeholder) {
    var data;
    switch (type) {
        case "select":
            data = {
                value: model.value,
                multiple: true,
                disabled: model.disabled,
                filterable: model.filterable,
                placeholder:placeholder,
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
const prefixCls = "spui-b-consultFilter";
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
        if (this.model.componentType == "select") {
            return h(
                Select,
                {
                    props: getComponentConfig(this.model.componentType, this.model.componentConfig,this.model.sortName),
                    attr: !this.model.componentConfig.attr ? {} : this.model.componentConfig.attr,
                    on: {
                        "on-change": function (value) {
                            var data = {
                                componentType: _this.model.componentType,
                                sortValue: _this.model.sortValue,
                                sortName: _this.model.sortName,
                                value: []
                            }
                            data.value = value;
                            if (!_this.model.sonSortValue) {
                                Emiter.$emit("multi-change-slot", data);
                            }
                            else {
                                Emiter.$emit(_this.model.sortValue + "union-change", {
                                    callback: _this.model.callback["on-change"],
                                    selectModel: {
                                        sortValue: _this.model.sortValue,
                                        value: value
                                    }
                                });
                            }
                        },
                        "on-query-change": function () {
                        }
                    }
                },
                [
                    this.model.componentConfig.optionList.map(function (item) {
                        return h(Option, {
                            props: {
                                label: item.label,
                                value: item.value
                            }
                        })
                    })

                ])
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.observeEvent();
            this.initDataChange();
        },
        observeEvent() {
            if (this.model.parentSortValue) {
                //监听父层筛选项修改事件
                Emiter.$on(this.model.sortValue + "-change", this.onFilterChange);
            }
            //监听父层筛选项修改事件
            Emiter.$on(this.model.sortValue + "-change", this.onFilterChange);
        },
        initDataChange: function () {
            var hasInitValue = false;
            var model = this.model.componentConfig;
            var data = {
                componentType: this.model.componentType,
                sortValue: this.model.sortValue,
                sortName: this.model.sortName,
                value: []
            }
            if (model.multiple && model.value.length > 0) {
                var i = 0;
                model.optionList.map(function (item) {
                    if (item.value == model.value[i]) {
                        data.value.push(item);
                        i++;
                    }
                })
                hasInitValue = true;
            }
            if (!hasInitValue) {
                return;
            }
            if (!this.model.sonSortValue) {
                Emiter.$emit("union-change-slot", data);
            }
            else {
                Emiter.$emit(this.model.sortValue + "union-change", {
                    callback: this.model.callback["on-change"],
                    selectModel: {
                        sortValue: this.model.sortValue,
                        value: data.value
                    }
                });
            }
        },
        onFilterChange(data) {
            if (!data) {
                return;
            }
            this.model.componentConfig.value = data;

        }
    }

};

export default {
    name: 'consultFilterMulti',
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
        multiItem() {
            return `${prefixCls}-multiItem`
        },
        multiItemWrap() {
            return this.model.class ? this.model.class : `${prefixCls}-multiItemWrap`;
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.observeEvent();
        },
        observeEvent() {
            //监听联动模块子组件change事件
            Emiter.$on("multi-change-slot", this.onChange);

        },
        onChange(params) {
            var _this = this,
                data = {};
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
            Emiter.$emit("multi-change", data);
        }

    }
};

</script>
