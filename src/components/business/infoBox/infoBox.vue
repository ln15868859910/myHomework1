<template>
    <div :class="classes">
        <div :class="boxTitle">
            <em :class="boxTitleEm"></em>
            经办信息
        </div>
        <div :class="content">
            <ul :class="ul">
                <li :class="li" v-for="(data,dataIndex) in infoData.dataList" :key="data">
                    <div v-if="data.type==1">
                        <label :class="label">{{data.title}}</label>
                        <Select v-if="data.isShowPhone" v-model="data.default" ref="abc" :index="dataIndex" :class="selectMan" remote :remote-method="remoteMethod" :loading="search" :filterable="data.isSearch" :disabled="data.isDisabled" :placeholder="data.placeholder||'请选择'" @on-change="setDataItem(data)" label-in-value>
                            <Option v-for="item in data.list" :value="item.value" :key="item" :label="item.label" :disabled="item.disabled">
                                <span v-if="!item.disabled" :class="spanName" :title="item.label">{{ item.label }}</span>
                                <span v-if="!item.disabled" :class="spanPhone">{{item.phone}}</span>
                                <span v-if="item.disabled">{{item.label}}</span>
                            </Option>
                        </Select>
                        <Select v-else v-model="data.default" :class="select" :filterable="data.isSearch" :disabled="data.isDisabled" :placeholder="data.placeholder||'请选择'" @on-change="setDataItem(data)" label-in-value>
                            <Option v-for="item in data.list" :value="item.value" :key="item">{{ item.label }}</Option>
                        </Select>
                    </div>
                    <div v-else-if="data.type==2">
                        <label :class="label">{{data.title}}</label>
                        <Date-picker type="date" v-model="data.default" :editable="false" :clearable="false" :disabled="data.isDisabled" style="width: 140px;display:inline-block;" @on-change="setDataItem(data,'date')"></Date-picker>
                    </div>
                    <div v-else-if="data.type==3">
                        <label :class="label">{{data.title}}</label>
                        <Input v-model="data.default" :disabled="data.isDisabled" :style="data.style || 'width:160px'" :maxlength="data.maxlength||100" @on-change="setDataItem(data)"></Input>
                    </div>
                    <div v-else-if="data.type==4">
                        <label :class="label">{{data.title}}</label>
                        <Input v-model="data.value" :disabled="data.isDisabled" :style="data.style || 'width:160px'" :maxlength="data.maxlength||100" @on-change="setDataItem(data)"></Input>
                    </div>
                    <!--todo 多级联动选择未完成-->
                    <div v-else :index="dataIndex">
                        <label :class="label">{{data.title}}</label>
                        <Cascader :data="data.list" :load-data="loadData" filterable @on-change="getMultistepData"></Cascader>
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
        }
    },
    data() {
        return {
            search: false,
            debounceObj: {},
            oldIndex: ""
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

    },
    beforeDestroy() {

    },
    watch: {


    },
    methods: {
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
                setTimeout(function () {
                    let dateDate = data.default;
                    data.default = obj.value = dateDate.getFullYear() + "-" + (dateDate.getMonth() + 1) + "-" + dateDate.getDate();
                    _this.$emit("datacallback", obj);
                }, 0);
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
        remoteMethod(query) {
            let index;
            if (!event) {
                index = this.oldIndex;
            } else {
                index = event.target.parentElement.parentElement.getAttribute("index");
                this.oldIndex = index;
            }
            if (!index) {
                return;
            }
            if (query.trim() == "" && query.length > 0) {
                return;
            }
            query = query.trim();
            var _this = this;
            let param = {
                Search: query
            };

            this.debounce(function () {
                _this.search = true;
                let url = _this.infoData.dataList[index].url + "?search=";
                Axios.get(url + query).then(function (res) {
                    var data = res;
                    if (data && data.status) {
                        var tempList = [];
                        if (!res.data.Data.List.length) {
                            tempList.push({
                                value: "emptyData",
                                label: "暂无数据",
                                disabled: true
                            })
                        }
                        else {
                            res.data.Data.List.map(function (item, index) {
                                tempList.push({
                                    label: item.Name,
                                    value: item.Id,
                                    phone: item.Phone,
                                    disabled: false
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
            let index = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("index");

            let obj = {
                dataType: _this.infoData.dataList[index].itemType,
                value: data.length > 0 ? data[0] : "",
                label: data.length > 0 ? data[1] : ""
            }
            this.$emit("datacallback", obj);
            //todo 多级联动选择未完成
            _this.toDataModel();
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
