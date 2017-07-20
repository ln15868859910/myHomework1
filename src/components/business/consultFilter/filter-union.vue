<template>
    <div :class="model.class">
        <component v-for="(item,index) in model" key="index" :model="item" :is="currentView">
    
        </component>
    </div>
</template>
<script>
import CommonSlot1 from './filter-slot.vue';
import Emiter from './emiter.vue';
import { Select, Option, OptionGroup } from '../../select';


function getComponentConfig(type,model) {
    var data;
    switch (type) {
        case "select":
            data = {
                value: model.value,
                multiple: model.multiple,
                disabled: model.disabled,
                filterable: model.filterable,
                placeholder: model.placeholder,
                clearable: model.clearable,
                "label-in-value": true
            }
            break;

        default:
            break;
    }
    return data;
}
const UnionFilterSlotComponent = {
    props: {
        model: {
            type: Object,
            require: true
        }
    },
    data() {
        return {
            data: {
                value: "",
                multiple: false,
                disabled: false,
                filterable: false,
                placeholder: false,
                clearable: false,
                "label-in-value":true,
                remote:false
            }
        }
    },
    render(h) {
        var _this = this;
        //select组件
        if (this.model.componentType == "select") {
            return h(
                Select,
                {
                    props: getComponentConfig(this.model.componentType,this.model.componentConfig),
                        // value: this.model.componentConfig.value,
                        // multiple: this.model.componentConfig.multiple,
                        // disabled: this.model.componentConfig.disabled,
                        // filterable: this.model.componentConfig.filterable,
                        // placeholder: this.model.componentConfig.placeholder,
                        // clearable: this.model.componentConfig.clearable,
                        // "label-in-value": true
                    // },
                    on: {
                        "on-change": function (value) {
                            var data = {
                                componentType: _this.data.componentType,
                                sortValue: _this.model.sortValue,
                                multiple: _this.model.multiple,
                                value: value
                            }
                            if (!_this.model.sonSortValue) {
                                Emiter.$emit("union-change-slot", data);
                            }
                            else {
                                Emiter.$emit(_this.model.sortValue + "union-change", {
                                    callback: _this.model.callback["on-change"],
                                    selectModel: {
                                        sortValue: _this.model.sortValue,
                                        value: value
                                    }
                                });;
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
        this.observeEvent();
    },
    methods: {
        observeEvent() {
            if (!this.model.parentSortValue) {
                return;
            }
            //监听联动模块子组件change事件
            Emiter.$on(this.model.parentSortValue + "union-change", this.onChange);
        },
        onChange(params) {
            if (params.callback && toString.call(params.callback) == "[object Function]") {
                params.callback(params.selectModel, this.model);


            }
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
            currentView: UnionFilterSlotComponent,
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
            Emiter.$on("union-change-slot", this.onChange);
        },
        onChange(params) {
            var _this = this;
            if (params.type == 1) {
                var data = {
                    sortKey: params.sortName,
                    label: []
                }
                if (params.multiple) {
                    params.value.map(function (value, index) {
                        var model = {
                            value: value.value,
                            text: value.label
                        }
                        data.label.push(model);
                    })
                }
                else {
                    var model = {
                        value: params.value,
                        text: params.label
                    }
                    data.label.push(model);
                }

            }
            Emiter.$on("union-change", this.onChange);
        }

    }
};

</script>
