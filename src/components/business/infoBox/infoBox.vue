<template>
    <div :class="classes">
        <div :class="boxTitle">经办信息</div>
        <div :class="content">
            <li :class="li" v-for="(data,dataIndex) in infoData.dataList" :key="data">
                <div v-if="data.type==1">
                    <label :class="label">{{data.title}}</label>
                    <Select v-if="data.isShowPhone" v-model="data.default" :class="selectMan" :filterable="data.isSearch" :disabled="data.isDisabled" :placeholder="data.placeholder||'请选择'" @on-change="setDataItem(data)" label-in-value>
                        <Option v-for="item in data.list" :value="item.value" :key="item" :label="item.name">
                            <span :class="spanName" :title="item.name">{{ item.name }}</span>
                            <span :class="spanPhone">{{item.phone}}</span>
                        </Option>
                    </Select>
                    <Select v-else v-model="data.default" :class="select" :filterable="data.isSearch" :disabled="data.isDisabled" :placeholder="data.placeholder||'请选择'" @on-change="setDataItem(data)" label-in-value>
                        <Option v-for="item in data.list" :value="item.value" :key="item">{{ item.name }}</Option>
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
        setDataItem(obj, date) {
            let _this = this;
            let outPutFn = this.callback["infoBoxData"];
            let data = {
                dataType: obj.itemType,
                value: obj.default
            };
            if (date) {
                setTimeout(function () {
                    let dateDate = obj.default;
                    obj.default = data.value = dateDate.getFullYear() + "-" + (dateDate.getMonth() + 1) + "-" + dateDate.getDate();
                    outPutFn(data);
                }, 0);
            } else {
                outPutFn(data);
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
                let obj = {
                    dataType: list[i].itemType,
                    value: list[i].default
                }
                arr.push(obj);
            }
            outPutFn(arr);
        }
    }
};

</script>
