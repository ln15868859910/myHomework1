<template>
    <div class="" :class="[commonGroupName,groupName]" style="position: relative;">
        <div class="union-link">
            <div class="union-link-line top-line"></div>
            <Icon type="link" size="16" style="color:#ccc;margin:2px 0;"></Icon>
            <div class="union-link-line bottom-line"></div>
        </div>
        <component :class="unionItem" v-for="(item,index) in model" :key="index" :model="item" :is="currentView">
    
        </component>
    </div>
</template>
<script>
import Emiter from './emiter.vue';
import { Select, Option, OptionGroup } from '../../select';


function getComponentConfig(type, model, placeholder) {
    var data;
    switch (type) {
        case "select":
            data = {
                value: model.value,
                multiple: model.multiple,
                disabled: model.disabled,
                filterable: model.filterable,
                placeholder: placeholder,
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
const UnionComponentSlot = {
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
                "label-in-value": true,
                remote: false,
                disabled: false
            },
            selectValue: ""
        }
    },
    watch: {
        //监听选中值变化
        'selectValue': 'onSelectChange'
    },
    render(h) {
        var _this = this;
        //select组件
        if (this.model.componentType == "select") {
            return h(
                'Select',
                {
                    props: getComponentConfig(this.model.componentType, this.model.componentConfig, this.model.sortName),
                    attr: !this.model.componentConfig.attr ? {} : this.model.componentConfig.attr,
                    on: {
                        "on-change": function (value) {
                            _this.selectValue = value;
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
                                value: item.value,
                                disabled: !item.disabled ? false : true
                            }
                        })
                    })

                ]

            )
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.observeEvent();
            this.initDataChange();
            if (this.model.parentSortValue) {
                Emiter.$emit(this.model.parentSortValue + "-union-empty-init", this.model);
            }
        },
        initDataChange: function () {
            if (!this.model.componentConfig.value || this.model.componentConfig.value.length == 0) {
            }
            else {
                var model = this.model.componentConfig,
                    data = [];
                if (model.multiple && model.value.length > 0) {
                    var i = 0;
                    model.optionList.map(function (item) {
                        if (item.value == model.value[i]) {
                            data.push(item);
                            i++;
                        }
                    })
                }
                else if (!model.multiple && model.value) {
                    model.optionList.map(function (item) {
                        if (item.value == model.value) {
                            data = item;
                        }
                    })
                }
                this.selectValue = data;
            }
        },
        observeEvent() {
            if (this.model.sonSortValue) {
                //监听联动模块父组件值初始化是否为空事件
                Emiter.$once(this.model.sortValue + "-union-empty-init", this.onDisableSon);
            }
            if (!!this.model.parentSortValue) {
                //监听联动模块父组件change事件
                Emiter.$on(this.model.parentSortValue + "-union-change", this.onParentChange);
                //监听联动模块父组件值为空事件
                Emiter.$on(this.model.parentSortValue + "-union-empty", this.onParentEmpty);
            }

            //监听父层筛选项修改事件
            Emiter.$on(this.model.sortValue + "-change", this.onFilterChange);
        },
        onParentChange(params) {
            if (toString.call(params.selectModel.value) == "[object Array]" && params.selectModel.value.length == 0) {
                this.onParentEmpty();
                Emiter.$emit(this.model.sortValue + "-union-empty");
            }
            else if (toString.call(params.selectModel.value) == "[object Object]" && !params.selectModel.value.value && !params.selectModel.value.label) {
                this.onParentEmpty();
                Emiter.$emit(this.model.sortValue + "-union-empty");
            }
            else {
                this.model.componentConfig.disabled = false;
            }
            if (params.callback && toString.call(params.callback) == "[object Function]") {
                params.callback(params.selectModel, this.model);
            }

        },
        onFilterChange(data) {
            if (!data) {
                return;
            }
            if (this.model.componentConfig.multiple) {
                this.model.componentConfig.value = data;
            }
            else {
                this.model.componentConfig.value = !data[0] ? "" : data[0];
            }
        },
        onDisableSon: function (sonModel) {
            if (this.model.componentConfig.multiple && this.model.componentConfig.value.length == 0) {
                sonModel.componentConfig.disabled = true;
            }
            else if (!this.model.componentConfig.multiple && !this.model.componentConfig.value) {
                sonModel.componentConfig.disabled = true;
            }
            else {
            }
        },
        onParentEmpty: function () {
            if (this.model.componentConfig.multiple) {
                this.model.componentConfig.value = [];
                this.model.componentConfig.optionList = [];
            }
            else {
                this.model.componentConfig.value = "";
                this.model.componentConfig.optionList = [];
            }
            this.model.componentConfig.disabled = true;
        },
        onSelectChange: function (value, oldValue) {
            var _this = this;
            var data = {
                componentType: _this.model.componentType,
                sortValue: _this.model.sortValue,
                sortName: _this.model.sortName,
                value: []
            }
            if (_this.model.componentConfig.multiple) {
                data.value = value;
            }
            else {
                //保持当前model的value值与组件内部的value一致
                _this.model.componentConfig.value = value.value
                data.value = !value.value && !value.label ? [] : [value];
            }
            Emiter.$emit("union-change-slot", data);
            if (_this.model.sonSortValue) {
                Emiter.$emit(_this.model.sortValue + "-union-change", {
                    callback: _this.model.callback ? _this.model.callback["on-change"] : null,
                    selectModel: {
                        sortValue: _this.model.sortValue,
                        value: value
                    }
                });
            }
        }
    }
};


export default {
    name: 'UnionComponent',
    props: {
        model: {
            require: true
        }
    },
    components: {
    },
    data() {
        return {
            commonGroupName: "",
            groupName: "",
            currentView: UnionComponentSlot
        };
    },
    computed: {
        unionItem() {
            return `${prefixCls}-unionItem`
        },
        unionItemWrap() {
            return this.model.class ? this.model.class : `${prefixCls}-unionItemWrap`;
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.commonGroupName = prefixCls + '-union-group';
            this.groupName = prefixCls + '-union-group-' + this.model.length;
            this.observeEvent();
        },
        observeEvent() {
            // //监听联动模块子组件change事件
            // Emiter.$on("union-change-slot", this.onChange);
        },
        onChange(params) {
            // var _this = this;
            // var data = {};
            // if (params.componentType == "select") {
            //     data = {
            //         sortName: params.sortName,
            //         sortValue: params.sortValue,
            //         label: []
            //     }
            //     params.value.map(function (item, index) {
            //         var model = {
            //             value: item.value,
            //             text: item.label
            //         }
            //         data.label.push(model);
            //     })


            // }
            // Emiter.$emit("union-change", data);
        }

    }
};

</script>
