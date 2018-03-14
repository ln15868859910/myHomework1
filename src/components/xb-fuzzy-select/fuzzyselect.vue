<template>
    <div style="display: inline-block;margin-right: 20px;" v-if="searchData && isInitCompleted">
        <Select v-show="!searchData.opts.isHideOptsList" v-model="searchArea.selectModel" @on-change="setSearchItem" label-in-value style="width:100px">
            <Option v-for="(item,i) in searchData.data" :value="item.value" :key="i">{{ item.text }}</Option>
        </Select>
        <div style="display:inline-block;width:260px">
            <i-Input type="text" icon="search" :maxlength="searchData.maxLen || 999" v-model.trim="searchArea.searchInput" :placeholder="vplaceholder" 
            @on-focus="focus" 
            @on-change="onChange" 
            @on-blur="blur" 
            @on-click="doSearch" 
            @on-enter="doSearch"></i-Input>
            <transition name="slide-up">
                <div class="ivu-select-dropdown" style="max-height: 400px;text-align:left" v-show="dropdown && searchStatus">
                    <ul class="ivu-select-dropdown-list">
                        <li v-show="searchArea.arr.length ==0 && !loading" class="ivu-select-item" style="padding: 7px 0;text-align: center;color: #ccc;">无匹配数据</li>
                        <li v-show="loading" class="ivu-select-item" style="text-align: center;color: #ccc;">加载中</li>
                        <li v-show="searchArea.arr.length !=0 && !loading" class="ivu-select-item"
                        v-for="(item,index) in searchArea.arr" :key="index" @click="clickItem(item)">{{ item }}</li>             
                    </ul>
                </div>
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
                    'text': '',
                    'value': ''
                },
                selectModel:'',
                arr:[],
                searchInput: ''
            },
            dropdown:false,
            debounceObj:{},
            loading:false
        };
    },
    computed: {
        searchStatus(){
            var bool = false;
            if(this.searchData.data && this.searchData.data.length>0){
                bool = this.searchData.data.some(ele =>{
                    return (ele.text === this.searchArea.selected.text) && ele.fuzzy;
                });
            }
            return bool;
        },
        vplaceholder(){
            var op;
            if(this.searchData.data && this.searchData.data.length>0){
                // op = this.searchData.data.find(ele =>{
                //     return (ele.text === this.searchArea.selected.text);
                // });
                this.searchData.data.forEach(ele =>{
                    if(ele.text === this.searchArea.selected.text){
                        op = {};
                        op.placeholder = ele.placeholder;
                    }
                });
            }
            var def = '请输入' + this.searchArea.selected.text;
            return (op == undefined) ? def : op.placeholder || def;
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
                'text': obj.label,
                'value': obj.value,
            };
            this.getSearchObj();
        },
        debounce(func, timeout, type) {
            this.debounceObj[type] && clearTimeout(this.debounceObj[type]);
            this.debounceObj[type] = setTimeout(() => {
                func();
            }, timeout);
        },
        doSearch() {
            this.callback['dosearch']();
        },
        focus(){
            
        },
        blur(){
            this.dropdown = false;
        },
        clickItem(item){
            this.searchArea.searchInput = item;
            this.callback['dosearch']();
        },
        onChange(){
            this.debounce(()=>{
                this.fetchData();
            },500,'changeVal');
        },
        fetchData(){
            var query = this.searchArea.searchInput;
            var _this = this;
            if(query == '' ||  !this.searchStatus){
                _this.searchArea.arr = [];
                _this.dropdown = false;
                return;
            }
            this.loading = true;
            this.dropdown = true;          
            Axios.get(this.searchData.url || '/api/Reception/GetStuInfoPinyinList',{
                params:{
                    q:query,
                    takeCount:10,
                    time:+new Date()
                }
            }).then((res)=>{
                var result = res.data;
                if(result.Status && result.Data.List && result.Data.List.length>0){
                    _this.searchArea.arr = result.Data.List;
                }else{
                    _this.searchArea.arr = [];
                }
                _this.loading = false;
            }); 
        },
        getSearchObj(){
            this.$emit('update-search-res',{value:this.searchArea.selected.value,input:this.searchArea.searchInput,text:this.searchArea.selected.text});
        },
        // 清空，返回默认值。冒泡到父组件
        clear(){
            this.searchArea.searchInput = '';
            this.init();
        },
        // 下拉项的默认值        
        init(){
            if (this.searchData.data.length) {
                var defaultSearchKey = this.searchData.opts.defaultSearchKey;
                var defaultSearchValue = this.searchData.opts.defaultSearchValue;
                var defaultSearchText;
                if (defaultSearchKey) {
                    //找到searchKey对应的文案
                    this.searchData.data.map(function (item) {
                        if (item.value == defaultSearchKey) {
                            defaultSearchText = item.text;
                        }
                    });
                    this.searchArea.selected = {
                        'text': defaultSearchText,
                        'value': defaultSearchKey
                    };
                } else {
                    this.searchArea.selected = {
                        'text': this.searchData.data[0].text,
                        'value': this.searchData.data[0].value
                    };
                }
                this.searchArea.selectModel = this.searchArea.selected.value;
                if(defaultSearchValue){
                    this.searchArea.searchInput = this.searchData.opts.defaultSearchValue;
                }
            }
        }
    },
    mounted(){
        this.init(); 
    },
    watch:{
        'searchArea.searchInput':function(){
            this.getSearchObj();
        }
    }
};
</script>
