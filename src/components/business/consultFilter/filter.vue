<template>
    <div :class="classes">
        <ul>
            <!-- 自定义内容区域 -->
            <li :class="custom" v-if="customData">
                <span id="customLeft" :class="customArea.buttonLeft.styleName" @click="customArea.buttonLeft.clickEvent" :style="{display:status.isCustomLeftShow ? 'inline-block': 'none'}">
                </span>
                <span id="customCenter" :class="customArea.buttonCenter.styleName" @click="customArea.buttonCenter.clickEvent" :style="{display:status.isCustomCenterShow ? 'inline-block': 'none'}">
                </span>
                <span id="customRight" :class="customArea.buttonRight.styleName" @click="customArea.buttonRight.clickEvent" :style="{display:status.isCustomRightShow ? 'inline-block': 'none'}">
                </span>
            </li>
    
            <!-- 搜索内容区域 -->
            <li :class="search" v-if="searchData">
                <Select :value="searchArea.selected.text" @on-change="setSearchItem" label-in-value style="width:100px">
                    <Option v-for="item in searchData.data" :value="item.value" :key="item">{{ item.text }}</Option>
                </Select>
                <Input type="text" icon="search" :placeholder="`请输入${this.searchArea.selected.text}`" @on-click="doSearch"></Input>
            </li>
    
            <!-- 筛选组件按钮区域 -->
            <li :class="filterBtn" @click="showContainer">
                <div class="ivu-select-selection">
                    <input type="text" value="筛选" class="ivu-select-input" disabled>
                    <i class="ivu-icon ivu-icon-arrow-down ivu-select-arrow" style="display:block"></i>
                </div>
            </li>
        </ul>
    
        <!-- 筛选内容展示区域 -->
        <div :class="fitlerResult">
            <ul>
                <li v-for="data in queryResult">
                    <span :class="sortName">{{data.sortname}}：</span>
                    <span :class="sortLabel" v-for="label in data.label">{{label.text}}&nbsp;</span>
                </li>
            </ul>
        </div>
    
        <!-- 下拉组件区域 -->
        <div :class="filterContainer" :style="{display:status.isContainerShow ? 'block': 'none'}">
            <!-- 单选组件 -->
            <consult-filter-general></consult-filter-general>
            <!-- 联动组件 -->
            <consult-filter-union></consult-filter-union>
            <!-- 多选组件 -->
            <consult-filter-general></consult-filter-general>
        </div>
    </div>
</template>
<script>

const prefixCls = "spui-b-consultFilter";

import iSelect from '../../select';
import iInput from '../../input'
import FilterGeneral from './filter-general.vue';
import FilterUnion from './filter-union.vue';


export default {
    name: 'consultFilter',
    components: { iSelect, iInput, FilterGeneral, FilterUnion },
    props: {
        filterData: {
            type: Object,
            default: null
        },
        searchData: {
            type: [Boolean, Object],
            default: false
        },
        customData: {
            type: [Boolean, Object],
            default: false
        },
        selected: {
            type: Function,
            default: null
        }
    },
    data() {
        return {
            status: {
                isContainerShow: false,
                isCustomLeftShow: true,
                isCustomCenterShow: true,
                isCustomRightShow: true
            },

            queryResult: [{//mock数据
                sortname: "跟进状态",
                sortvalue: "111",
                label: [{
                    "text": "跟进中",
                    "value": "123",
                }, {
                    "text": "待跟进",
                    "value": "13",
                }],
            },{//mock数据
                sortname: "跟进状态",
                sortvalue: "111",
                label: [{
                    "text": "跟进中",
                    "value": "123",
                }, {
                    "text": "待跟进",
                    "value": "13",
                }],
            }],
            searchArea: {
                selected: {
                    "text": "",
                    "value": ""
                }
            },
            customArea: {
                buttonLeft: {
                    styleName:`${prefixCls}-customLeft`,
                    template:"新增咨询",
                    clickEvent:function(){}
                },
                buttonCenter: {
                    styleName:`${prefixCls}-customCenter`,
                    template:"导入",
                    clickEvent:function(){}
                },
                buttonRight: {
                    styleName:`${prefixCls}-customRight`,
                    template:"导出",
                    clickEvent:function(){}
                }
            },

        };
    },
    computed: {
        classes() {
            return `${prefixCls}`;
        },
        sortName(){
            return `${prefixCls}-sortName`
        },
        sortLabel(){
            return `${prefixCls}-label`
        },
        custom() {
            return `${prefixCls}-custom`
        },
        search() {
            return `${prefixCls}-search`
        },
        filterBtn() {
            return `${prefixCls}-filterBtn`
        },
        fitlerResult() {
            return `${prefixCls}-fitlerResult`
        },
        filterContainer() {
            return `${prefixCls}-container`
        }
    },

    mounted() {
        this.init();
        
    },
    methods: {

        /****************************自定义区域相关*********************************/

        setCustomStyleName() {

            var 
                leftStyleName = this.customData.buttonLeft.styleName,
                centerStyleName = this.customData.buttonCenter.styleName,
                rightStyleName = this.customData.buttonRight.styleName;

            leftStyleName ? this.customArea.buttonLeft.styleName = leftStyleName : false;
            centerStyleName ? this.customArea.buttonCenter.styleName = centerStyleName : false;
            rightStyleName ? this.customArea.buttonRight.styleName = rightStyleName : false;

        },

        setCustomTemplate() {

            var
                tplLeft = this.customData.buttonLeft.template,
                tplCenter =this.customData.buttonCenter.template,
                tplRight =this.customData.buttonRight.template,

                tplLeftDefult = this.customArea.buttonLeft.template,
                tplCenterDefult = this.customArea.buttonCenter.template,
                tplRightDefult = this.customArea.buttonRight.template;

            tplLeft ? tplLeftDefult = tplLeft : false;
            tplCenter ? tplCenterDefult = tplCenter : false;
            tplRight ? tplRightDefult = tplRight : false;

            this.$el.querySelector("#customLeft").innerHTML = tplLeftDefult;
            this.$el.querySelector("#customCenter").innerHTML = tplCenterDefult;
            this.$el.querySelector("#customRight").innerHTML = tplRightDefult;
        },

        setCustomCallBack(){
            var
                leftCallBack = this.customData.buttonLeft.clickEvent,
                centerCallBack = this.customData.buttonCenter.clickEvent,
                rightCallBack = this.customData.buttonRight.clickEvent;
            
            if(leftCallBack && !(typeof leftCallBack === "function")){
                throw new Error("请给buttonLeft点击事件传入正确的函数")
            }
            leftCallBack ? this.customArea.buttonLeft.clickEvent = leftCallBack : false;

            if(centerCallBack && !(typeof centerCallBack === "function")){
                throw new Error("请给buttonCenter点击事件传入正确的函数")
            }
            centerCallBack ? this.customArea.buttonCenter.clickEvent = centerCallBack : false;

            if(rightCallBack && !(typeof rightCallBack === "function")){
                throw new Error("请给buttonRight点击事件传入正确的函数")
            }
            rightCallBack ? this.customArea.buttonRight.clickEvent = rightCallBack : false;
        },


        /****************************搜索项相关*********************************/

        setSearchItem(obj) {
            this.searchArea.selected = {
                "text": obj.label,
                "value": obj.value,
            }
            // console.log(this.searchArea.selected.text);
        },

        doSearch() {
            if (typeof this.searchData.callback == "function") {
                this.searchData.callback();
            } else {
                throw new Error("请传入正确的搜索回调！")
            }
        },

        /****************************筛选项相关*********************************/
        //显示下拉项层
        showContainer() {
            this.status.isContainerShow = !this.status.isContainerShow;
        },
        //设置已筛选的筛选项
        setFilterResult() {

        },




        init() {
            //设置初始化搜索值
            if (this.searchData) {
                this.searchArea.selected = {
                    "text": this.searchData.data[0].text,
                    "value": this.searchData.data[0].value,
                }
            }
            //设置初始化自定义区域显示
            if (this.customData) {
                this.status.isCustomLeftShow = this.customData.buttonLeft.isShow === false ? false : true;
                this.status.isCustomCenterShow = this.customData.buttonCenter.isShow === false ? false : true;
                this.status.isCustomRightShow = this.customData.buttonRight.isShow === false ? false : true;

                //传入customData时
                if(!this.customData.buttonLeft || !this.customData.buttonCenter || !this.customData.buttonRight){
                    throw new Error("请传入正确格式的customData配置项");
                }
                this.setCustomTemplate();
                this.setCustomStyleName();
                this.setCustomCallBack();
            }

        }

        

    }
};

</script>
