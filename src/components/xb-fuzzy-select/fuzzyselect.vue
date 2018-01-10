<template>
    <div style="display: inline-block;margin-right: 20px;" v-if="searchData && isInitCompleted">
        <Select v-show="!searchData.opts.isHideOptsList" :value="searchSelectInitVal" @on-change="setSearchItem" label-in-value style="width:100px">
            <Option v-for="(item,i) in searchData.data" :value="item.value" :key="i">{{ item.text }}</Option>
        </Select>
        <div style="display:inline-block;width:260px">
            <Input type="text" icon="search" v-model="searchArea.searchInput" :placeholder="`请输入${searchArea.selected.text}`" 
            @on-focus="focus" 
            @on-change="onChange" 
            @on-blur="blur" 
            @on-click="doSearch" 
            @on-enter="doSearch"></Input>
            <transition name="slide-up">
            <ul style="
                position: absolute;
                width: 260px;
                overflow: auto;
                margin: 5px 0;
                padding: 10px 0;
                background-color: #fff;
                box-sizing: border-box;
                border-radius: 4px;
                box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
                z-index: 900;" 
                class="ivu-select-dropdown-list"
                v-show="dropdown && searchStatus">
                <li class="ivu-select-item" style="padding: 7px 0;text-align: center;color: #ccc;" 
                    v-show="searchArea.arr.length ==0 && !loading">无匹配数据</li>
                <li class="ivu-select-item" style="text-align: center;color: #ccc;" 
                    v-show="loading">加载中</li>
                <li  v-show="searchArea.arr.length !=0 && !loading" class="ivu-select-item" v-for="(item,index) in searchArea.arr" :key="index" @click="clickItem(item)">{{ item }}</li>             
            </ul>
            </transition>
        </div>
    </div>
</template>
<script>

import iSelect from '../select/select.vue';
import iOption from '../select/option.vue';

export default {
    name: 'XbFuzzySelect',
    components: { iSelect, iOption },
  //  directives: { clickoutside },
    props: {
        searchData: {
            type: [Boolean, Object],
            default: false
        },
        callback: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            isInitCompleted: true,
            searchArea: {
                selected: {
                    "text": "",
                    "value": ""
                },
                arr:[],
                searchInput: ""
            },
            dropdown:false,
            debounceObj:{},
            loading:false
        };
    },
    computed: {
        searchSelectInitVal() {
            if (this.searchData.data.length) {

                var defaultSearchKey = this.searchData.opts.defaultSearchKey,
                    defaultSearchText;

                if (defaultSearchKey) {
                    //找到searchKey对应的文案
                    this.searchData.data.map(function (item, index) {
                        if (item.value == defaultSearchKey) {
                            defaultSearchText = item.text;
                        }
                    })
                    this.searchArea.selected = {
                        "text": defaultSearchText,
                        "value": defaultSearchKey
                    }
                    return defaultSearchKey;

                } else {
                    this.searchArea.selected = {
                        "text": this.searchData.data[0].text,
                        "value": this.searchData.data[0].value
                    }
                    return this.searchData.data[0].value;
                }
            }
        },
        searchStatus(){

            return this.searchArea.selected.text == '学员姓名'
        }
    },
    created: function() {

    },
    methods: {
        setSearchItem(obj) {
            //已经有初始化赋值时
            if (!obj.label && obj.value) {
                return;
            }

            this.searchArea.selected = {
                "text": obj.label,
                "value": obj.value,
            }
        },
        debounce(func, timeout, type) {
            this.debounceObj[type] && clearTimeout(this.debounceObj[type]);
            this.debounceObj[type] = setTimeout(() => {
                func()
            }, timeout);
        },
        doSearch() {
            this.callback['dosearch']();
        },
        focus(){
           this.dropdown = true
        },
        blur(){
            this.dropdown = false
        },
        clickItem(item){
            this.searchArea.searchInput = item
            this.getSearchObj();
            this.callback['dosearch']();
        },
        onChange(){
            this.getSearchObj()
            this.debounce(()=>{
                this.fetchData()
            },300,'changeVal')
        },
        fetchData(){
            var qurey = this.searchArea.searchInput;
            var _this = this;
            this.loading = true
            setTimeout(function(){
                _this.loading = false;
                _this.searchArea.arr = [qurey,qurey + qurey,qurey + qurey + qurey + qurey]
            },1000)    
        },
        getSearchObj(){
            this.$emit('updateSearchRes',{value:this.searchArea.selected.value,input:this.searchArea.searchInput});
        }
    },
    mounted(){

    },
    watch: {
        "searchData": {
            deep: true,
            handler: function (oldv, newv) {
                if (!this.searchData.opts.defaultSearchKey && this.searchData.opts.defaultSearchValue) {
                    console.warn("注意：请给传入默认搜索项传入一个指定类型，否则将默认使用第一个搜索类型去查找数据！")
                }
                this.searchArea.selected.value = newv.opts.defaultSearchKey;
                this.searchArea.searchInput = newv.opts.defaultSearchValue;
            }
        }
    }
};
</script>
