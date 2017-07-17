<template>
    <div :class="classes">
        <ul>
            <li :class="custom"></li>
            <li :class="search"></li>
            <li :class="filterBtn" @click="showContainer">
                <div class="ivu-select-selection">
                    <input type="text" value="筛选" class="ivu-select-input" disabled>
                    <i class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow" style="display:block"></i>
                </div>
            </li>
        </ul>
        <div :class="fitlerResult">
            <ul>
                <li v-for="data in queryResult" >
                    <span>{{data.sortname}}</span>:
                    <span v-for="label in data.label">{{label.lablename}}&nbsp;</span>
                </li>
            </ul>
        </div>
        <div :class="filterContainer" :style="{display:status.isContainerShow ? 'block': 'none'}">
            <!-- 单选组件 -->
           <i-Filter-General></i-Filter-General>
            <!-- 联动组件 -->
            <i-filter-Union></i-filter-Union>
             <!-- 多选组件 -->
           <i-Filter-General></i-Filter-General>
        </div>
    </div>
</template>
<script>

const prefixCls = "spui-b-consultFilter"

import filterGeneral from './filter-general.vue';
import filterUnion from './filter-union.vue';


export default {
    name: 'iFilter',
    components: { filterGeneral, filterUnion },
    props: {
        initFilter: {
            type: Object,
            default: null
        },
        initSearch: {
            type: Object,
            default: null
        },
        initCustom: {
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
                    "lablename": "跟进中",
                    "lablevalue": "123", 
                }, {
                    "lablename": "待跟进",
                    "lablevalue": "13",
                }],
            }] //保存筛选项结果
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

    },
    methods: {
        showContainer() {
            this.status.isContainerShow = !this.status.isContainerShow;
        },

        setQueryResult() {

        }

    }
};

</script>
