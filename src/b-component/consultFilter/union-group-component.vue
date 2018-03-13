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
import emitter from "./emit";
import Axios from 'axios';
import { Select, Option, OptionGroup } from '../../components/select';
import selectVue from '../../components/select/select.vue';

function getLabledata(optionlist,valuelist){
    let arr = [];
    optionlist.map((item)=>{
        if(valuelist.indexOf(item.value)>-1){
            arr.push(item.label);
        }
    });
    return arr;

}

function getComponentConfig(model, remoteMethod, isRemote,selectvalue) {
    var data;
    switch (model.componentType) {
        case "select":
            var label;
            if(Array.isArray(selectvalue)){
                label = selectvalue.map((item)=>{return item.label;});
            }else if(!model.componentConfig.multiple&&selectvalue.value){
                label = [selectvalue.label];
            }
            data = {
                value: model.componentConfig.multiple ? model.componentConfig.value : model.componentConfig.value[0],
                // label:label,
                multiple: model.componentConfig.multiple,
                disabled: model.componentConfig.disabled,
                filterable: model.componentConfig.filterable,
                placeholder: model.sortName,
                clearable: model.componentConfig.clearable,
                "label-in-value": true,
            };
            if (isRemote) {
                var optionList = model.componentConfig.optionList;
                data.remote = true;
                data["remote-method"] = remoteMethod;
                if(data.isFirst){
                    var arr = [];
                    if (data.multiple && data.value.length > 0) {
                        data.value.map(function (item, index) {
                            for (var i = 0, l = optionList.length; i < l; i++) {
                                if (optionList[i].value == item) {
                                    arr.push(optionList[i].label);
                                    return;
                                }
                            }
                        })
                    }
                    else {
                        for (var i = 0, l = optionList.length; i < l; i++) {
                            if (optionList[i].value == data.value) {
                                arr = optionList[i].label;
                                return;
                            }
                        }
                    }
                    data.label = arr;
                }else{
                    data.label = label;
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
    name: "selectComponent",
    mixins:[emitter],
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
            isFirst: true,
            currentparentvalue:[],
            parentSelectValue: "",
            debounceObj: {

            },
            isRemote: false,
            isParentChange: false
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
                    props: getComponentConfig(this.model, this.remoteMethod, this.isRemote,this.selectValue),
                    attr: !this.model.componentConfig.attr ? {} : this.model.componentConfig.attr,
                    ref: this.model.sortValue,
                    on: {
                        "on-change": function (value) {
                            if (_this.model.componentConfig.multiple) {
                                if (value.length == 0 && _this.isRemote) {
                                    _this.remoteMethod("");
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
                            }
                            else {
                                if (!value.value && !value.label && _this.isRemote) {
                                    _this.remoteMethod("");
                                }
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
        this.isFirst = false;
    },
    created() {
        if (this.model.remoteUrl && this.model.remoteUrl.onSearch) {
            this.isRemote = true;
            //动态添加loading属性，双向绑定
            this.$set(this.model.componentConfig, "loading", true);
            //修复父层组件带搜索时无法初始化的问题 2017年10月11日18:51:05
            this.$set(this.model.componentConfig, "loading", false);
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
        if (this.model.componentConfig.optionList.length > 50) {
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
            this.$parent.$parent.$off(this.model.sortValue + "-union-empty-init", this.onDisableSon);
            //移除 子级变化 联动父级事件 
            this.$parent.$parent.$off(this.model.sortValue + "-parent-change", this.onCurrentParentChange);  
        }
        if (!!this.model.parentSortValue) {
            //移除联动模块父组件change事件
            this.$parent.$parent.$off(this.model.parentSortValue + "-union-change", this.onParentChange);
            //移除联动模块父组件值为空事件
            this.$parent.$parent.$off(this.model.parentSortValue + "-union-empty", this.onParentEmpty);
        }

        //移除父层筛选项修改事件
        this.$off(this.model.sortValue + "-change", this.onFilterChange);
    },
    methods: {
        init() {
            this.observeEvent();
            this.initDataChange();

            if (this.model.parentSortValue) {
                this.$parent.$parent.$emit(this.model.parentSortValue + "-union-empty-init", this.model);
            }
        },
        initDataChange: function () {
            if (!this.model.componentConfig.value || this.model.componentConfig.value.length == 0) {
            }
            else {
                var model = this.model.componentConfig,
                    data = [];
                if (model.multiple && model.value.length > 0) {
                    if(model.label&&model.label.length&&model.label.length==model.value.length){
                        for(var ii=0,len=model.label.length;ii<len;ii++){
                            data.push({
                                value:model.value[ii],
                                label:model.label[ii]
                            });
                        }                        
                    }else{
                        var i = 0;
                        model.optionList.map(function (item) {
                            if (item.value == model.value[i]) {
                                data.push(item);
                                i++;
                            }
                        });
                    }
                }
                else if (!model.multiple && model.value) {
                    
                    if(model.label&&model.label.length&&model.label.length==model.value.length){
                        data = {
                            value:model.value[0],
                            label:model.label[0]
                        };                       
                    }else{
                        model.optionList.map(function (item) {
                            if (item.value == model.value) {
                                data = item;
                            }
                        });
                    }
                }
                this.selectValue = data;
            }
            this.currentparentvalue = this.$parent.currentparentvalue;
        },
        observeEvent() {
            if (this.model.sonSortValue) {
                //监听联动模块父组件值初始化是否为空事件
                this.$parent.$parent.$once(this.model.sortValue + "-union-empty-init", this.onDisableSon);
                this.$parent.$parent.$on(this.model.sortValue + "-parent-change", this.onCurrentParentChange);
            }
            if (!!this.model.parentSortValue) {
                //监听联动模块父组件change事件
                this.$parent.$parent.$on(this.model.parentSortValue + "-union-change", this.onParentChange);
                //监听联动模块父组件值为空事件
                this.$parent.$parent.$on(this.model.parentSortValue + "-union-empty", this.onParentEmpty);
            }

            //监听父层筛选项修改事件
            this.$on(this.model.sortValue + "-change", this.onFilterChange);
        },
        onCurrentParentChange(parms){
            this.currentparentvalue = parms.parentValue;
        },
        onParentChange(params) {
            var _this = this;
            this.parentSelectValue = [];
            params.selectModel.value.map(function (item) {
                _this.parentSelectValue.push(item.value);
            });
            // 分情况 是否清除子级数据 如果此时父子级以获取对应数据  则不清除
            if(_this.parentSelectValue.join() !== this.currentparentvalue.join()){
                this.onParentEmpty();
            }
            if (Object.prototype.toString.call(params.selectModel.value) == "[object Array]" && params.selectModel.value.length == 0) {
                this.model.componentConfig.disabled = true;
                this.model.componentConfig.filterable = false;
                this.$parent.$parent.$emit(this.model.sortValue + "-union-empty");
                return;
            }
            else {
                this.model.componentConfig.disabled = false;
                this.model.componentConfig.filterable = true;
            }
            if (params.selectModel.value.length == 0) {
                return;
            }
            this.isParentChange=true;
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
                    _this.model.componentConfig.loading = true;
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
                                if (data.Data.ComponentConfig.OptionList.length > 50) {
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
                        _this.isParentChange=false;
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
                sonModel.componentConfig.filterable = false;
            }
            else {
                sonModel.componentConfig.filterable = true;
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
                // if(Array.isArray(_this.model.componentConfig.label)){
                _this.model.componentConfig.alllabel = value.map((item)=>item.label);
                // }
            }
            else {
                //保持当前model的value值与组件内部的value一致
                _this.model.componentConfig.value = value.value;
                data.value = !value.value && !value.label ? [] : [value];
            }
            this.dispatch("consultFilterUnion","union-change-slot", data, this.type);
            this.type = "fromBottom";

            if (_this.model.sonSortValue) {
                this.$parent.$parent.$emit( _this.model.sortValue + "-union-change", {
                    onChangeUrl: _this.model.remoteUrl ? _this.model.remoteUrl["onChange"] : "",
                    selectModel: {
                        sortValue: _this.model.sortValue,
                        value: data.value
                    }
                });
            }
            if(_this.model.parentSortValue){
                //如果有父级情况 通知父级此时的子级对应父级数据
                this.$parent.$parent.$emit( _this.model.parentSortValue + "-parent-change", {
                    parentValue:_this.parentSelectValue
                });
            }
        },
        remoteMethod(query) {
            //父层修改时，不执行该方法
            if(this.isParentChange){
                return;
            }
            if (query.trim() == "" && query.length > 0) {
                return;
            }
            query = query.trim();
            var _this = this;
            if (this.model.parentSortValue && this.parentSelectValue.length == 0) {
                return;
            }
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
                            if (data.Data.ComponentConfig.OptionList.length > 50) {
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
        },
        currentparentvalue(){
            let arr = [];
            this.model.map((item)=>{
                if(item.parentSortValue&&item.componentConfig.parentvalue){
                    arr = item.componentConfig.parentvalue;
                }
            });
            return arr;
        }
    },
    mounted() {
        this.commonGroupName = prefixCls + '-union-group';
        this.groupName = prefixCls + '-union-group-' + this.model.length;
    }
};

</script>
