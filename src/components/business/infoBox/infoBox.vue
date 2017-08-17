<template>
    <div :class="classes">
        <div :class="boxTitle">经办信息</div>
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
                    <div v-else>
                        <label :class="label">{{data.title}}</label>
                        <Input v-model="data.value" :disabled="data.isDisabled" :style="data.style || 'width:160px'" :maxlength="data.maxlength||100" @on-change="setDataItem(data)"></Input>
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
            debounceObj: {}
        };
    },
    computed: {
        classes() {
            return `${prefixCls}`;
        },
        boxTitle() {
            return `${prefixCls}-boxTitle`;
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
            let outPutFn = this.callback["infoBoxData"];
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
                    outPutFn(obj);
                }, 0);
            } else {
                outPutFn(obj);
            }
            setTimeout(function () {
                _this.toDataModel();
            }, 0);
        },
        //根据返回
        init() {
            console.log("init");
            this.toDataModel();
        },
        toDataModel() {
            let outPutFn = this.callback["infoBoxDataList"];
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
                } else {
                    obj = {
                        dataType: list[i].itemType,
                        value: list[i].default
                    }
                }
                arr.push(obj);
            }
            outPutFn(arr);
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
            console.log(query);
            if (!event) {
                return;
            }
            let index = event.target.parentElement.parentElement.getAttribute("index");
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
            console.log(param);

            this.debounce(function () {
                _this.search = true;
                let url = _this.infoData.dataList[index].url;
                Axios.post(url, JSON.stringify(param)).then(function (res) {
                    var data = res.data;
                    data.Data = {
                        itemType: "sman",
                        List: [
                            {
                                value: -1,
                                label: '1全部员工',
                                phone: '158*****1234'
                            },
                            {
                                value: 123,
                                label: '2高富帅',
                                phone: '158*****1234'
                            },
                            {
                                value: 234,
                                label: '3事实上',
                                phone: '158*****1234'
                            },
                            {
                                value: 444,
                                label: '4去去去',
                                phone: ''
                            }
                        ],
                    }
                    if (data && data.Status) {
                        //优化：修改遍历时同时进行插入操作的bug by tianyu.chen
                        var tempList = [];
                        if (!data.Data.List.length) {
                            tempList.push({
                                value: "emptyData",
                                label: "暂无数据",
                                disabled: true
                            })
                        }
                        else {
                            data.Data.List.map(function (item, index) {
                                tempList.push({
                                    label: item.label,
                                    value: item.value,
                                    phone: item.phone,
                                    disabled: false
                                })
                            })

                            //数据超过50条，添加自定义文案
                            if (data.Data.List.length >= 50) {
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
                }).catch(function (err) {

                    var Data = {
                        itemType: "sman",
                        List: [
                            [
                                {
                                    value: -1,
                                    label: ' qwe  s',
                                    phone: '158*****1234'
                                },
                                {
                                    value: 123,
                                    label: '好好睡',
                                    phone: '158*****1234'
                                },
                                {
                                    value: 234,
                                    label: '天赋',
                                    phone: '158*****1234'
                                },
                                {
                                    value: 444,
                                    label: '水电气热',
                                    phone: ''
                                }
                            ],
                            [
                                {
                                    value: -1,
                                    label: '1全部员工',
                                    phone: '158*****1234'
                                },
                                {
                                    value: 123,
                                    label: '2高富帅',
                                    phone: '158*****1234'
                                },
                                {
                                    value: 234,
                                    label: '3事实上',
                                    phone: '158*****1234'
                                },
                                {
                                    value: 444,
                                    label: '4去去去',
                                    phone: ''
                                }
                            ],
                            [
                                {
                                    value: -1,
                                    label: ' qwe  s',
                                    phone: '158*****1234'
                                },
                                {
                                    value: 123,
                                    label: '好好睡',
                                    phone: '158*****1234'
                                },
                                {
                                    value: 234,
                                    label: '天赋',
                                    phone: '158*****1234'
                                },
                                {
                                    value: 444,
                                    label: '水电气热',
                                    phone: ''
                                }
                            ]
                        ],
                    }
                    var tempList = [];
                    if (!Data.List.length) {
                        tempList.push({
                            value: "emptyData",
                            label: "暂无数据",
                            disabled: true
                        })
                    }
                    else {
                        Data.List[index].map(function (item, index) {
                            tempList.push({
                                label: item.label,
                                value: item.value,
                                phone: item.phone,
                                disabled: false
                            })
                        })

                        //数据超过50条，添加自定义文案
                        if (Data.List.length >= 3) {
                            tempList.push({
                                value: "abadon",
                                label: "【更多选项请输入更多关键词】",
                                disabled: true
                            })
                        }
                    }
                    _this.infoData.dataList[index].list = tempList;
                    _this.search = false;
                })
            }, 500, "onSearch")
        },
        debounce(func, timeout, type) {

            this.debounceObj[type] && clearTimeout(this.debounceObj[type]);
            this.debounceObj[type] = setTimeout(() => {
                func()
            }, timeout);

        }
    }
};

</script>
