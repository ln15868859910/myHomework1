<template>
    <div style="display: inline-block;margin-right: 20px;" v-if="searchData && isInitCompleted">
        <Select v-show="!searchData.opts.isHideOptsList" v-model="searchArea.selectModel" @on-change="setSearchItem" label-in-value style="width:100px">
            <Option v-for="(item,i) in searchData.data" :value="item.value" :key="i">{{ item.text }}</Option>
        </Select>
        <div style="display:inline-block;width:260px">
            <Input type="text" icon="search" :maxlength="searchData.maxLen || 999" v-model.trim="searchArea.searchInput" :placeholder="vplaceholder" 
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
                <li v-show="searchArea.arr.length ==0 && !loading" class="ivu-select-item" style="padding: 7px 0;text-align: center;color: #ccc;">无匹配数据</li>
                <li v-show="loading" class="ivu-select-item" style="text-align: center;color: #ccc;">加载中</li>
                <li v-show="searchArea.arr.length !=0 && !loading" class="ivu-select-item"
                v-for="(item,index) in searchArea.arr" :key="index" @click="clickItem(item)">{{ item }}</li>             
            </ul>
            </transition>
        </div>
    </div>
</template>
<style>
    
</style>   
<script>
import Axios from 'axios';
import iSelect from '../select/select.vue';
import iOption from '../select/option.vue';

//↓ searchData 搜索区域，传入null该对象则整块区域隐藏
// searchData: {
//     // ↓ searchData.data 必填，搜索下拉项，至少一项。其中的text会成为搜索框的placeholder，例： “请选择 + 学员姓名”
//     data: [{"text": "学员姓名","value": "1"}, {"text": "学员电话","value": "2"}],
//     // ↓ searchData.opts 必填，没有配置传入空对象{}，否则报错给你看 _(:з」∠)_
//     opts: {
//         "defaultSearchKey": "", //← 非必填，默认搜索类型（iview only：搜索类型必须在下拉项中），不填取默认第一项
//         "defaultSearchValue": "", //← 非必填：搜索默认值，不填取默认第一项
//         "isHideOptsList": false,//← 非必填：是否隐藏搜索栏边上的下拉列表，默认：false
//         "isResetFilter": false //← 非必填：搜索时结果是否与筛选项互斥，默认：false
//     },
//     maxLen:999 //← 非必填，默认999
// },

export default {
    name: 'XbFuzzySelect',
    components: { iSelect, iOption },
  //  directives: { clickoutside },
    props: {
        searchData: {
            type: [Boolean, Object],
            default: false
        },
        isInitCompleted: {
            type: Boolean,
            default: true
        },
        callback: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            searchArea: {
                selected: {
                    "text": "",
                    "value": ""
                },
                selectModel:'',
                arr:[],
                searchInput: ""
            },
            dropdown:false,
            debounceObj:{},
            loading:false
        };
    },
    computed: {
        searchStatus(){
            return this.searchArea.selected.text == '学员姓名'
        },
        vplaceholder(){
            var t = "请输入" + this.searchArea.selected.text;
            if(this.searchArea.selected.text == '学员姓名'){
                t = t  + "，支持拼音缩写"
            }
            return t
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
            this.getSearchObj()
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
        //    this.dropdown = true
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
            var query = this.searchArea.searchInput;
            var _this = this;
            if(query == "" ||  !this.searchStatus){
                _this.searchArea.arr = [];
                _this.dropdown = false;
                return
            }
            this.loading = true;
            this.dropdown = true;          
            Axios.get('/api/Reception/GetStuInfoPinyinList',{
                params:{
                    q:query,
                    takeCount:10,
                    time:+new Date()
                }
            }).then((res)=>{
                var res = res.data;
                if(res.Status && res.Data.List && res.Data.List.length>0){
                    _this.searchArea.arr = res.Data.List;
                }else{
                    _this.searchArea.arr = [];
                    // _this.dropdown = false;
                }
                _this.loading = false;
            }) 
        },
        getSearchObj(){
            this.$emit('updateSearchRes',{value:this.searchArea.selected.value,input:this.searchArea.searchInput,text:this.searchArea.selected.text});
        },
        clear(){
            this.searchArea.searchInput = '';
            // this.searchArea.selected = {
            //     "text": this.searchData.data[0].text,
            //     "value": this.searchData.data[0].value
            // }
            // this.searchArea.selectModel = this.searchData.data[0].value;
            this.init();
        },
        init(){
            if (this.searchData.data.length) {
                var defaultSearchKey = this.searchData.opts.defaultSearchKey;
                var defaultSearchText;
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
                } else {
                    this.searchArea.selected = {
                        "text": this.searchData.data[0].text,
                        "value": this.searchData.data[0].value
                    }
                }
                this.searchArea.selectModel = this.searchData.data[0].value;
            }
        }
    },
    mounted(){
        this.init();
    }
};
</script>
