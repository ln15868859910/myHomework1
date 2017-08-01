<template>
    <div :class="multiItemWrap">
        <component :class="multiItem" v-for="(item,index) in model.modelList" :key="index" :model="item" :is="currentView">
    
        </component>
    </div>
</template>
<script>

import Emiter from './emiter.vue';
import Axios from 'axios';
import { Select, Option, OptionGroup } from '../../select';

function getComponentConfig(model, remoteMethod) {
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
            if (model.remoteUrl && model.remoteUrl.onSearch) {
                var optionList = model.componentConfig.optionList;
                data.remote = true;
                data["remote-method"] = remoteMethod;
                data.label = [];
                if (data.value.length > 0) {
                    data.value.map(function (item, index) {
                        for (var i = 0, l = optionList.length; i < l; i++) {
                            if (optionList[i].value == item.value) {
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
        }
    },
    render(h) {
        var _this = this;

        //select组件
        if (this.model.componentType == "select") {
            return h(
                Select,
                {
                    props: getComponentConfig(this.model, this.remoteMethod),
                    attr: !this.model.componentConfig.attr ? {} : this.model.componentConfig.attr,
                    ref:this.model.sortValue,
                    on: {
                        "on-change": function (value) {
                            var data = {
                                componentType: _this.model.componentType,
                                sortValue: _this.model.sortValue,
                                sortName: _this.model.sortName,
                                value: []
                            }
                            data.value = value;
                            Emiter.$emit("multi-change-slot", data);

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
    created() {
        if (this.model.remoteUrl && this.model.remoteUrl.onSearch) {
            //动态添加loading属性，双向绑定
            this.$set(this.model.componentConfig, "loading", false);
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
            //bugFix(临时)：修复清空了带搜索项的下拉，值没有被清空的bug
            var sortValue = this.model.sortValue;
            setTimeout(()=>{
                this.$refs[sortValue] ? this.$refs[sortValue].selectedMultiple = [] : "";
            })
            
            this.model.componentConfig.value = data;

        },
        remoteMethod(query) {
            if (query == "") {
                return;
            }
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
            Axios.post(this.model.remoteUrl.onSearch, req).then(function (res) {
                var data = data;
                if (data && data.Status) {

                    var tempList = [];
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
               
                _this.model.componentConfig.loading = false;
            })
        },
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
