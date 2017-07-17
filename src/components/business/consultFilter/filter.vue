<template>
    <div :class="classes">
        <ul>
            <li :class="custom"></li>
            <li :class="search">
                <Select :value="searchArea.selected.text" @on-change="setSearchItem" label-in-value style="width:100px">
                    <Option v-for="item in searchData.data" :value="item.value" :key="item">{{ item.text }}</Option>
                </Select>
                 <Input type="text" icon="search" :placeholder="`请输入${this.searchArea.selected.text}`" @on-click="doSearch"></Input>
            </li>
            <li :class="filterBtn" @click="showContainer">
                <div class="ivu-select-selection">
                    <input type="text" value="筛选" class="ivu-select-input" disabled>
                    <i class="ivu-icon ivu-icon-arrow-down ivu-select-arrow" style="display:block"></i>
                </div>
            </li>
        </ul>
        <div :class="fitlerResult">
            <ul>
                <li v-for="data in queryResult">
                    <span>{{data.sortname}}</span>:
                    <span v-for="label in data.label">{{label.text}}&nbsp;</span>
                </li>
            </ul>
        </div>
        <div :class="filterContainer" :style="{display:status.isContainerShow ? 'block': 'none'}">
            <!-- 单选组件 -->
            <consult-Filter-General></consult-Filter-General>
            <!-- 联动组件 -->
            <consult-filter-Union></consult-filter-Union>
            <!-- 多选组件 -->
            <consult-Filter-General></consult-Filter-General>
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
            type: Object,
            default: null
        },
        customData: {
            type: Object,
            default: null
        },
        selected: {
            type: Function,
            default: null
        }
    },
    data() {
        return {
            status: {
                isContainerShow: false
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
            }],
            searchArea:{
                selected:{
                    "text":"",
                    "value":""
                }
            },
            customArea: {

            },

        };
    },
    computed: {
        classes() {
            return `${prefixCls}`;
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

         

        /****************************筛选项相关*********************************/
        //显示下拉项层
        showContainer() {
            this.status.isContainerShow = !this.status.isContainerShow;
        },
        //设置已筛选的筛选项
        setFilterResult() {

        },
        
       /****************************搜索项相关*********************************/
        
        setSearchItem(obj){
             this.searchArea.selected = {
                "text":obj.label,
                "value":obj.value,
            }
            // console.log(this.searchArea.selected.text);
        },

        doSearch(){
            if(typeof this.searchData.callback == "function"){
                this.searchData.callback();
            }else{
                throw new Error("请传入正确的搜索回调！")
            }
        },

       /****************************自定义区域相关*********************************/


        init(){
            //设置初始化搜索值
            this.searchArea.selected = {
                "text":this.searchData.data[0].text,
                "value":this.searchData.data[0].value,
            }
        }


    }
};

</script>
