<template>
    <div :class="multiItemWrap" :style="{display:model.modelList.length?'block':'none'}">
        <component :class="multiItem" v-for="(item,index) in model.modelList" :key="index" :model="item" :is="currentView">
    
        </component>
    </div>
</template>
<script>

import Emiter from './emiter.vue';
import Axios from 'axios';
import { Select, Option, OptionGroup } from '../../select';

function getComponentConfig(model, remoteMethod, isRemote) {
    var data;
    switch (model.componentType) {
        case "select":
            data = {
                value: model.componentConfig.value,
                multiple: true,
                disabled: model.componentConfig.disabled,
                filterable: model.componentConfig.filterable,
                placeholder: model.sortName,
                clearable: model.componentConfig.clearable,
                "label-in-value": true,
            }
            if (isRemote) {
                var optionList = model.componentConfig.optionList;
                data.remote = true;
                data["remote-method"] = remoteMethod;
                data.label = [];
                if (data.value.length > 0) {
                    data.value.map(function (item, index) {
                        for (var i = 0, l = optionList.length; i < l; i++) {
                            if (optionList[i].value == item) {
                                data.label.push(optionList[i].label);
                                return;
                            }
                        }
                    })
                }
                data.loading = model.componentConfig.loading;
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
            debounceObj: {

            },
            selectValue: [],
            isRemote: false,
            type: "fromBottom"
        }
    },
    render(h) {
        var _this = this;

        //select组件
        if (this.model.componentType == "select") {
            return h(
                Select,
                {
                    props: getComponentConfig(this.model, this.remoteMethod, this.isRemote),
                    attr: !this.model.componentConfig.attr ? {} : this.model.componentConfig.attr,
                    ref: this.model.sortValue,
                    on: {
                        "on-change": function (value) {
                            var data = {
                                componentType: _this.model.componentType,
                                sortValue: _this.model.sortValue,
                                sortName: _this.model.sortName,
                                value: []
                            }
                            value.map(function (item) {
                                if (Object.prototype.toString.call(item.label).toLowerCase() == "[object undefined]") {
                                    for (var i = 0, l = _this.selectValue.length; i < l; i++) {
                                        if (item.value == _this.selectValue[i].value) {
                                            item.label = _this.selectValue[i].label;
                                            break;
                                        }
                                    }
                                }
                            })
                            data.value = value;
                            _this.selectValue = data.value;
                            Emiter.$emit("multi-change-slot", data, _this.type);
                            _this.type = "fromBottom";

                        }
                    }
                },
                [
                    this.model.componentConfig.optionList.map(function (item) {
                        return h(Option, {
                            props: {
                                label: item.label,
                                value: item.value,
                                disabled: !item.disabled ? false : true,
                            }
                        })
                    })

                ])
        }
    },
    created() {
        if (this.model.remoteUrl && this.model.remoteUrl.onSearch) {
            this.isRemote = true;
            //动态添加loading属性，双向绑定
            this.$set(this.model.componentConfig, "loading", false);
        }

        if (!this.model.componentConfig.optionList.length) {

            this.model.componentConfig.optionList.push({
                value: "emptyData",
                label: "暂无数据",
                disabled: true
            })

        }
        //数据超过50条，添加自定义文案
        else if (this.model.componentConfig.optionList.length >= 50) {
            this.model.componentConfig.optionList.push({
                value: "abadon",
                label: "【更多选项请搜索】",
                disabled: true
            })
        }

        //根据外部传入数据设置type标识数据来源
        if (this.model.componentConfig.value.length) {
            this.type = "fromOutSide"
        }
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
        if (this.model.parentSortValue) {
            //移除父层筛选项修改事件
            Emiter.$off(this.model.sortValue + "-change", this.onFilterChange);
        }
        //移除父层筛选项修改事件
        Emiter.$off(this.model.sortValue + "-change", this.onFilterChange);
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
            var me = this;
            var model = this.model.componentConfig;
            var data = {
                componentType: this.model.componentType,
                sortValue: this.model.sortValue,
                sortName: this.model.sortName,
                value: []
            }
            if (model.value.length > 0) {
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

            Emiter.$emit("union-change-slot", data, me.type);
            this.type = "fromBottom";

        },
        onFilterChange(value, label, type) {

            this.type = type ? type : this.type;

            if (!value) {
                return;
            }
            var sortValue = this.model.sortValue,
                model = [];
            //bugFix(临时)：修复清空了带搜索项的下拉，值没有被清空的bug
            this.model.componentConfig.value = value;
            if (this.isRemote) {
                value.map(function (item, index) {
                    model.push(
                        {
                            label: label[index],
                            value: item
                        }
                    )
                });
                setTimeout(() => {
                    this.$refs[sortValue] ? this.$refs[sortValue].selectedMultiple = model : "";
                })
            }
        },
        remoteMethod(query) {
            if (query.trim() == "" && query.length > 0) {
                return;
            }
            query = query.trim();
            var _this = this;
            var req = {
                "req": {
                    "Filter": {
                        "ParentValue": [],
                        "Filter": query
                    }
                }
            }
            this.model.componentConfig.loading = true;
            this.debounce(function (scope) {
                var _this = scope;
                Axios.post(_this.model.remoteUrl.onSearch, req).then(function (res) {
                    var data = res.data;
                    if (data && data.Status) {

                        var tempList = [];

                        if (!data.Data.ComponentConfig.OptionList.length) {

                            _this.model.componentConfig.optionList = [];
                            _this.model.componentConfig.optionList.push({
                                value: "emptyData",
                                label: "暂无数据",
                                disabled: true
                            })

                        } else {
                            data.Data.ComponentConfig.OptionList.map(function (item, index) {
                                tempList.push({
                                    label: item.Label,
                                    value: item.Value,
                                    disabled: false
                                })
                            })

                            //数据超过50条，添加自定义文案
                            if (data.Data.ComponentConfig.ItemCount >= 50) {
                                tempList.push({
                                    value: "abadon",
                                    label: "【更多选项请输入更多关键词】",
                                    disabled: true
                                })
                            }
                            _this.model.componentConfig.optionList = tempList;
                        }
                    }

                    _this.model.componentConfig.loading = false;
                })
            }, "onSearch")

        },
        debounce: function (func, type) {
            var _this = this;
            clearTimeout(this.debounceObj[type]);
            this.debounceObj[type] = setTimeout(function () {
                func(_this);
            }, 500);
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
    beforeDestroy() {
        //监听联动模块子组件change事件
        Emiter.$off("multi-change-slot", this.onChange);
    },
    methods: {
        init() {
            this.observeEvent();
        },
        observeEvent() {
            //监听联动模块子组件change事件
            Emiter.$on("multi-change-slot", this.onChange);

        },
        onChange(params, type) {
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
            Emiter.$emit("multi-change", data, type);

        }

    }
};

</script>
