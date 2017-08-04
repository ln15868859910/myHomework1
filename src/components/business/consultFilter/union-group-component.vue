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
import Axios from 'axios';
import { Select, Option, OptionGroup } from '../../select';


function getComponentConfig(model, remoteMethod, isRemote) {
    var data;
    switch (model.componentType) {
        case "select":
            data = {
                value: model.componentConfig.multiple ? model.componentConfig.value : model.componentConfig.value[0],
                multiple: model.componentConfig.multiple,
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
                if (data.multiple && data.value.length > 0) {
                    data.value.map(function (item, index) {
                        for (var i = 0, l = optionList.length; i < l; i++) {
                            if (optionList[i].value == item) {
                                data.label.push(optionList[i].label);
                                return;
                            }
                        }
                    })
                }
                else {
                    for (var i = 0, l = optionList.length; i < l; i++) {
                        if (optionList[i].value == data.value) {
                            data.label = optionList[i].label;
                            return;
                        }
                    }
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
const UnionComponentSlot = {
    props: {
        model: {
            type: Object,
            require: true
        }
    },
    data() {
        return {
            type: "fromBottom",
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
            selectValue: "",
            optionList: "",
            isInit: true,
            parentSelectValue: "",
            debounceObj: {

            },
            isRemote: false
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
                    props: getComponentConfig(this.model, this.remoteMethod, this.isRemote),
                    attr: !this.model.componentConfig.attr ? {} : this.model.componentConfig.attr,
                    ref: this.model.sortValue,
                    on: {
                        "on-change": function (value) {
                            if (_this.model.componentConfig.multiple) {
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
                            }
                            else {
                                //单选组有时会触发一次value不为空，label值为空的异常事件，临时解决
                                if ((!value.value && value.label) || (value.value && !value.label)) {
                                    return;
                                }
                            }
                            _this.isInit = true;
                            _this.selectValue = value;
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
                                key: item.value
                            }
                        })
                    })

                ]

            )
        }
    },
    created() {
        if (this.model.remoteUrl && this.model.remoteUrl.onSearch) {
            this.isRemote = true;
            //动态添加loading属性，双向绑定
            this.$set(this.model.componentConfig, "loading", true);
        }
        //动态添加disabled属性，双向绑定
        this.$set(this.model.componentConfig, "disabled", false);

        if (!this.model.componentConfig.optionList.length) {

            this.model.componentConfig.optionList.push({
                value: "emptyData",
                label: "暂无数据",
                disabled: true
            })

        }
        //数据超过50条，添加自定义文案
        if (this.model.componentConfig.optionList.length >= 50) {
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
        if (this.model.sonSortValue) {
            //移除联动模块父组件值初始化是否为空事件
            Emiter.$off(this.model.sortValue + "-union-empty-init", this.onDisableSon);
        }
        if (!!this.model.parentSortValue) {
            //移除联动模块父组件change事件
            Emiter.$off(this.model.parentSortValue + "-union-change", this.onParentChange);
            //移除联动模块父组件值为空事件
            Emiter.$off(this.model.parentSortValue + "-union-empty", this.onParentEmpty);
        }

        //移除父层筛选项修改事件
        Emiter.$off(this.model.sortValue + "-change", this.onFilterChange);
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
            var _this = this;
            this.parentSelectValue = [];
            params.selectModel.value.map(function (item) {
                _this.parentSelectValue.push(item.value);
            });
            this.onParentEmpty();
            if (Object.prototype.toString.call(params.selectModel.value) == "[object Array]" && params.selectModel.value.length == 0) {
                this.model.componentConfig.disabled = true;
                Emiter.$emit(this.model.sortValue + "-union-empty");
                return;
            }
            else {
                this.model.componentConfig.disabled = false;
            }

            if (params.onChangeUrl && Object.prototype.toString.call(params.onChangeUrl) == "[object String]") {
                var parentValue = [];
                params.selectModel.value.map(function (item) {
                    parentValue.push(item.value);
                });
                var req = {
                    "req": {
                        "Filter": {
                            "ParentValue": parentValue,
                            "Filter": ""
                        }
                    }
                }
                this.debounce(function (scope) {
                    var _this = scope;
                    Axios.post(params.onChangeUrl, req).then(function (res) {
                        var data = res.data;
                        if (data && data.Status) {

                            //优化：修改遍历时同时进行插入操作的bug by tianyu.chen
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
                                if (data.Data.ComponentConfig.OptionList.length >= 50) {
                                    tempList.push({
                                        value: "abadon",
                                        label: "【更多选项请输入更多关键词】",
                                        disabled: true
                                    })
                                }
                                _this.model.componentConfig.optionList = tempList;
                            }
                        }
                        if (_this.isRemote) {
                            _this.model.componentConfig.loading = false;
                        }
                    })
                }, "onchange")

            }

        },
        onFilterChange(value, label, type) {
            this.type = type ? type : this.type;
            if (!value) {
                return;
            }
            if (this.model.componentConfig.multiple) {
                this.model.componentConfig.value = value;
            }
            else {
                this.model.componentConfig.value = !value[0] ? "" : value[0];
            }
            //bugFix(临时)：修复清空了带搜索项的下拉，值没有被清空的bug

            if (this.isRemote) {
                var model = [];
                var sortValue = this.model.sortValue;
                if (this.model.componentConfig.multiple) {
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
                else {
                    setTimeout(() => {
                        this.$refs[sortValue] ? this.$refs[sortValue].selectedSingle = label : "";
                    })
                }

            }
        },
        onDisableSon: function (sonModel) {
            if (this.model.componentConfig.value.length == 0) {
                sonModel.componentConfig.disabled = true;
            }
            else {
            }
        },
        onParentEmpty: function () {
            var sortValue = this.model.sortValue;
            if (this.model.componentConfig.multiple) {
                if (this.selectValue.length == 0) {
                    return;
                }
                this.model.componentConfig.value = [];
                this.model.componentConfig.optionList = [];
                //bugFix（临时）：修复清空了值上一个未清空选中项的bug
                setTimeout(() => {
                    this.$refs[sortValue] ? this.$refs[sortValue].selectedMultiple = [] : "";
                }, 0)
            }
            else {
                if (this.selectValue.label == "" && this.selectValue.value == "") {
                    return;
                }
                this.model.componentConfig.value = "";
                this.model.componentConfig.optionList = [];
                //bugFix（临时）：修复清空了值上一个未清空选中项的bug
                setTimeout(() => {
                    this.$refs[sortValue] ? this.$refs[sortValue].clearSingleSelect() : "";
                    //bugFix（临时）：修复清空了值上一个未清空选中项的bug
                    this.$refs[sortValue] ? this.$refs[sortValue].selectedSingle = "" : "";
                }, 0)
            }
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
            Emiter.$emit("union-change-slot", data, this.type);
            this.type = "fromBottom";

            if (_this.model.sonSortValue) {
                Emiter.$emit(_this.model.sortValue + "-union-change", {
                    onChangeUrl: _this.model.remoteUrl ? _this.model.remoteUrl["onChange"] : "",
                    selectModel: {
                        sortValue: _this.model.sortValue,
                        value: data.value
                    }
                });
            }
        },
        remoteMethod(query) {
            query = query.trim();
            if (query == "") {
                return;
            }
            var _this = this;
            var req = {
                "req": {
                    "Filter": {
                        "ParentValue": this.parentSelectValue,
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
                        //优化：修改遍历时同时进行插入操作的bug by tianyu.chen
                        var tempList = [];
                        if (!data.Data.ComponentConfig.OptionList.length) {

                            _this.model.componentConfig.optionList = [];
                            _this.model.componentConfig.optionList.push({
                                value: "emptyData",
                                label: "暂无数据",
                                disabled: true
                            })

                        }
                        else {
                            data.Data.ComponentConfig.OptionList.map(function (item, index) {
                                tempList.push({
                                    label: item.Label,
                                    value: item.Value,
                                    disabled: false
                                })
                            })

                            //数据超过50条，添加自定义文案
                            if (data.Data.ComponentConfig.OptionList.length >= 50) {
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
