<template>
    <div :class="classes">
        <div :class="boxTitle">
            <em :class="boxTitleEm"></em>
            经办信息
        </div>
        <div :class="content">
            <ul :class="ul">
                <li :class="li" v-for="(data,dataIndex) in infoData.dataList" :key="dataIndex">
                    <div v-if="data.type==1||(data.type==5&&!newstudent)">
                        <label :class="label">{{data.title}}</label>
                        <span :class="selectMan" style="margin-left: 10px;" v-if="showdetail">{{returnLabel(data)}}</span>
                        <Select v-if="data.isShowPhone&&!showdetail" v-model="data.default" :label="returnLabel(data)" ref="abc" :index="dataIndex" :class="selectMan" remote :remote-method="remoteMethod" @click.native="setCurrentIndex(dataIndex)" :loading="search" :filterable="data.isSearch" :disabled="data.isDisabled" :placeholder="catplace(data)" @on-change="setDataItem(data)" label-in-value :placement="countHeight(dataIndex)">
                            <Option v-for="item in data.list" :value="item.value" :key="item.value" :label="item.label" :disabled="item.disabled">
                                <span v-if="!item.disabled" :class="spanName" :title="item.label">{{ item.label }}</span>
                                <span v-if="!item.disabled" :class="spanPhone">{{item.phone}}</span>
                                <span v-if="item.disabled">{{item.label}}</span>
                            </Option>
                        </Select>
                        <span :class="selectMan" style="margin-left: 10px;" v-if="showdetail">{{findLable(data.list,data.default)}}</span>
                        <Select v-if="!data.isShowPhone&&!showdetail" v-model="data.default" :class="select" :filterable="data.isSearch" :disabled="data.isDisabled" :placeholder="catplace(data)"  @on-change="setDataItem(data)" label-in-value placement="top">
                            <Option v-for="item in data.list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                    <div v-else-if="data.type==2">
                        <label :class="label">{{data.title}}</label>
                        <span :class="selectMan" style="margin-left: 10px;" v-if="showdetail">{{data.default}}</span>
                        <Date-picker type="date" v-if="!showdetail" v-model="data.default" :placeholder="catplace(data)" :editable="false" :clearable="false" :disabled="data.isDisabled" style="width: 140px;display:inline-block;" @on-change="setDataItem(data,'date')"></Date-picker>
                        <Alert v-if="data.authority" dot class="ivu-alert-fromalert ivu-alert-fromalert-error spui-b-infobox-authority">{{data.authoritytext}}</Alert>
                    </div>
                    <div v-else-if="data.type==3">
                        <label :class="label">{{data.title}}</label>
                        <span :class="selectMan" style="margin-left: 10px;" v-if="showdetail">{{data.default}}</span>
                        <Input v-model="data.default" v-if="!showdetail" :placeholder="catplace(data)" :disabled="data.isDisabled" :style="data.style || 'width:160px'" :maxlength="data.maxlength||100" @on-change="setDataItem(data)"></Input>
                    </div>
                    <div v-else-if="data.type==4">
                        <label :class="label">{{data.title}}</label>
                        <span :class="selectMan" style="margin-left: 10px;" v-if="showdetail">{{data.value}}</span>
                        <Input v-model="data.value" v-if="!showdetail" :placeholder="catplace(data)" :disabled="data.isDisabled" :style="data.style || 'width:160px'" :maxlength="data.maxlength||100" @on-change="setDataItem(data)"></Input>
                    </div>
                    <!--todo 多级联动选择未完成-->
                    <div v-else :index="dataIndex">
                        <label :class="label">{{data.title}}</label>
                        <span :class="selectMan" style="margin-left: 10px;" v-if="showdetail">{{data.value}}</span>
                        <Cascader :data="data.list" v-if="!showdetail" :placeholder="catplace(data)" :load-data="remoteMethod" filterable v-model="data.value" @click.native="setCurrentIndex(dataIndex)" @on-change="getMultistepData" :remote-fuc="remoteMethod"></Cascader>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>

const prefixCls = "spui-b-infoBox";
import Axios from 'axios';

export default {
    name: 'infoBox',
    components: {},
    directives: {},
    props: {
        infoData: {
            type: Object,
            default: null
        },
        callback: {
            type: Object,
            default: null
        },
        showdetail:{
            type: Boolean,
            default: false
        },
        newstudent:{    //目前只有新建学生才会选择 多角色
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            search: false,
            debounceObj: {},
            oldIndex: "",
            placementArr:[],
            first:true
        };
    },
    computed: {
        classes() {
            return `${prefixCls}`;
        },
        boxTitle() {
            return `${prefixCls}-boxTitle`;
        },
        boxTitleEm() {
            return `${prefixCls}-boxTitleEm`;
        },
        content() {
            return `${prefixCls}-content`;
        },
        ul() {
            return `${prefixCls}-ul`;
        },
        li() {
            return `${prefixCls}-li`;
        },
        label() {
            return `${prefixCls}-label`;
        },
        select() {
            return `${prefixCls}-select`;
        },
        selectMan() {
            return `${prefixCls}-selectMan`;
        },
        spanName() {
            return `${prefixCls}-spanName`;
        },
        spanPhone() {
            return `${prefixCls}-spanPhone`;
        }
    },
    created() {
        this.init();
    },
    mounted() {
        
    },
    updated() {
        // console.log(this);
        if(this.first){
            // this.updateplacement();
            this.first =false;
        }
        
    },
    beforeDestroy() {

    },
    watch: {


    },
    methods: {
        catplace(data){
            var pretext = data.type==1?'请选择':'请输入';
            return pretext +data.title;
        },
        findLable(list,id){
            var arr = list.filter(item=>{
                return item.value == id;
            })
            return arr.length?arr[0].label:"";
        },
        returnLabel(data){
            if(data&&data.model&&data.model.label){
                return data.model.label
            }
            return '';
        },
        updateplacement(){
            var selectDom = this.$el.querySelectorAll(".spui-b-infoBox-li");
            var windowHeight = document.body.scrollHeight;
            for(var i=0,len=selectDom.length;i<len;i++){
                if(windowHeight-selectDom[i].offsetTop<240){
                    this.placementArr.push("top")
                }else{
                    this.placementArr.push("bottom")
                }
            }
        },
        setDataItem(data) {
            let _this = this;
            let obj = {};
            if (data.type == 1) {
                obj = {
                    dataType: data.itemType,
                    value: data.default,
                    label: null
                };
                this.getDataLabel(obj, data);
            } else {
                obj = {
                    dataType: data.itemType,
                    value: data.default
                };
            }
            if (data.type == 2) {
                this.$nextTick(()=>{
                    let dateDate = data.default;
                    obj.value = dateDate.getFullYear() + "-" + (dateDate.getMonth() + 1) + "-" + dateDate.getDate();
                    data.default = obj.value;
                    _this.$emit("datacallback", obj);
                });
            } else {
                this.$emit("datacallback", obj);
            }
            setTimeout(function () {
                _this.toDataModel();
            }, 0);
        },
        //根据返回
        init() {
            this.toDataModel();
        },
        toDataModel() {
            let list = this.infoData.dataList;
            let arr = [];
            for (let i = 0; i < list.length; i++) {
                let obj = {};
                if (list[i].type == 1) {
                    obj = {
                        dataType: list[i].itemType,
                        value: list[i].default,
                        label: null
                    }
                    this.getDataLabel(obj, list[i]);
                } else if ((list[i].type == 5)) {
                    //todo 多级联动选择未完成
                } else {
                    obj = {
                        dataType: list[i].itemType,
                        value: list[i].default
                    }
                }
                arr.push(obj);
            }
            this.$emit("arrcallback", arr);
        },
        getDataLabel(obj, data) {
            for (let i = 0; i < data.list.length; i++) {
                if (data.list[i].value == obj.value) {
                    obj.label = data.list[i].label;
                    return obj.label;
                }
            }
        },
        setCurrentIndex(index){
            this.oldIndex = index;
            if(!this.infoData.dataList[index].list.length){
                this.remoteMethod("");
            }
        },
        remoteMethod(query) {
            // console.log(arguments);
            // let index = arguments[1];
            // var query = arguments[0];
            var index = this.oldIndex;
            // if (!event) {
            //     index = this.oldIndex;
            // } else {
            //     index = event.target.parentElement.parentElement.getAttribute("index");
            //     this.oldIndex = index;
            // }
            if (!index) {
                return;
            }
            // if (query.trim() == "" && query.length > 0) {
            //     return;
            // }
            query = query.trim();
            var _this = this;
            let param = {
                Search: query
            };
            
            _this.search = true;
            this.debounce(function () {
                let url = _this.infoData.dataList[index].url + "?search=";
                Axios.get(encodeURI(url + query)).then(function (res) {
                    var data = res;
                    if (data && data.status) {
                        var tempList = [];
                        if (!res.data.Data.List.length) {
                            tempList.push({
                                value: "emptyData",
                                label: "暂无数据",
                                disabled: true,
                            })
                        }
                        else {
                            res.data.Data.List.map(function (item, index) {
                                tempList.push({
                                    label: item.Name||'',
                                    value: item.Id,
                                    phone: item.Phone||'',
                                    disabled: false,
                                    children:item.UserName?item.UserName.split(',').map(item=>{
                                        return {
                                            value:item,
                                            label:item
                                        }
                                    }):[]
                                })
                            })

                            //数据超过50条，添加自定义文案
                            if (res.data.Data.List.length >= 50) {
                                tempList.push({
                                    value: "abadon",
                                    label: "【更多选项请输入更多关键词】",
                                    disabled: true
                                })
                            }
                        }
                        _this.infoData.dataList[index].list = tempList;
                    }
                    _this.search = false;
                })
            }, 500, "onSearch")
        },
        debounce(func, timeout, type) {

            this.debounceObj[type] && clearTimeout(this.debounceObj[type]);
            this.debounceObj[type] = setTimeout(() => {
                func()
            }, timeout);

        },
        //todo 多级联动选择未完成
        getMultistepData(data) {
            var _this = this;
            // // let index = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("index");
            // let index = this.oldIndex;
            // let obj = {
            //     dataType: _this.infoData.dataList[index].itemType,
            //     value: data.length > 0 ? data[0] : "",
            //     label: data.length > 0 ? data[1] : ""
            // }
            // this.$emit("datacallback", obj);
            // //todo 多级联动选择未完成
            // _this.toDataModel();
            let index = _this.oldIndex;
            _this.infoData.dataList[index].default = data[0];
            _this.infoData.dataList[index].default2 = data[1]||"";
        },
        countHeight(index){
            return this.placementArr[index];
        },
        loadData(item, callback) {
            item.loading = true;
            setTimeout(() => {
                if (item.value === 'beijing') {
                    item.children = [
                        {
                            value: 'talkingdata',
                            label: 'TalkingData'
                        },
                        {
                            value: 'baidu',
                            label: '百度'
                        },
                        {
                            value: 'sina',
                            label: '新浪'
                        }
                    ];
                } else if (item.value === 'hangzhou') {
                    item.children = [
                        {
                            value: 'ali',
                            label: '阿里巴巴'
                        },
                        {
                            value: '163',
                            label: '网易'
                        }
                    ];
                }
                item.loading = false;
                callback();
            }, 1000);
        }
    }
};

</script>
