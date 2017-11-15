<template>
    <div>
        <Modal v-model="model" :closable="false" class-name="vertical-center-modal" :width="width" @on-cancel="cancel">
            <p slot="header" :class="[prefixCls+'-header']" style="text-align:center">
                <span style="color: #fff;">{{title[0]}}</span>
            </p>
            <div style="height:200px;">
                <div style="padding:0;" :class="[prefixCls+'-popup-con']">
                    <div class="" :class="[prefixCls+'-clearfix']">
                        <div :class="[prefixCls+'-pop-book']" style="float:left;">
                            <div :class="[prefixCls+'-pop-b-header']" >{{title[1]}}</div>
                            <div :class="[prefixCls+'-pop-b-search']" >
                                <i-input v-model="searchvalue" :maxlength=100 icon="search" :class="[prefixCls+'-new-search']"  @on-change="onSearch"></i-input>
                            </div>
                            <div :class="[prefixCls+'-pop-b-con',prefixCls+'-copyScroll',prefixCls+'-popup-con']"  id="transferBox">
                                <Collapse accordion v-model="defaultIndex" v-if="!searchTag">
                                    <Panel :name="''+index" v-for="(data,index) in allData" :key="index">
                                        <span :class="[prefixCls+'-spanName']" >{{data.name}}</span>
                                        <div slot="content">
                                            <ul :class="[prefixCls+'-book-ul']">
                                                <li v-for="(item,jindex) in data.list" :key="jindex" v-if="!item.select" @click="selectThis(item)">{{item.Name}}</li>
                                            </ul>
                                        </div>
                                    </Panel>
                                </Collapse>
                                <Collapse accordion v-model="defaultIndex" v-if="searchTag">
                                    <Panel :name="''+index" v-for="(data,index) in searchListData" :key="index">
                                        <span :class="[prefixCls+'-spanName']" >{{data.name}}</span>
                                        <div slot="content">
                                            <ul :class="[prefixCls+'-book-ul']">
                                                <li v-for="(item,jindex) in data.list" :key="jindex" v-if="!item.select" @click="selectThis(item)">{{item.Name}}</li>
                                            </ul>
                                        </div>
                                    </Panel>
                                </Collapse>
                            </div>
                        </div>
                        <div :class="[prefixCls+'-pop-book']" style="float:right;" >
                            <div :class="[prefixCls+'-pop-b-header']">{{title[2]}}</div>
                            <div :class="[prefixCls+'-pop-b-sub']">
                                已选
                                <i>{{innerSelectData.length}}</i>
                            </div>
                            <div>
                                <transferselect :all-data="allData" :select-ids="innerSelectData" @ondelete="onchangeAll()"></transferselect>
                            </div>
                        </div>
                    </div>
                </div>
                <Checkbox v-if="showselectAll" v-model="selectAllTag" label="全选" @on-change="selectAll()" style="float: left;">全选</Checkbox>
            </div>
            <div slot="footer">
                <i-button type="ghost" @click="cancel">取消</i-button>
                <i-button type="primary" @click="ok">确定</i-button>
            </div>
        </Modal>
    </div>
</template>
<script>

// import Locale from '../../mixins/locale';
// import Emitter from '../../mixins/emitter';
import transferselect from './transferselect.vue';
import { throttle } from './../../utils/throttle';

const prefixCls = 'ivu-xbtransfer';

export default {
    name: 'XbTransfer',
    // mixins: [Emitter, Locale],
    components: { transferselect },
    props: {
        title: {
            type: Array
        },
        allData: {
            type: Array
        },
        selectData: {
            type: Array
        },
        showselectAll: {
            type: Boolean
        },
        showmodal: {
            type: Boolean
        },
        width: {
            type: Number,
            default: 790
        }
    },
    data() {
        return {
            prefixCls: prefixCls,
            listData: [],
            defaultIndex: '0',
            searchTag: false,
            searchvalue: '',
            allDataLength: 0,
            selectAllTag: false,
            searchListData: []
        };
    },
    computed: {
        classes() {
            return [
                `${prefixCls}`
            ];
        },
        model() {
            return this.showmodal;
        },
        innerSelectData() {
            var arr = [];
            this.selectData.map((item) => {
                arr.push(item.Id);
            });
            return arr;
        }
    },
    created: function() {
        // console.log("created");
        this.initSelectData();
        this.onchangeAll();
        this.throttlefunc = throttle(this.filterData, 300);
    },
    methods: {
        initSelectData() {
            // 初始化数据
            var that = this;
            this.allData.map((data) => {
                data.list.map((item) => {
                    if (this.find(that.selectData,item.Id)) {
                        item.select = true;
                    } else {
                        item.select = false;
                    }
                });
                that.allDataLength += data.list.length;
            });
        },
        find(Arr, id) {
            var arr = Arr.filter((item) => {
                return item.Id == id||item.ItemId == id;
            });
            return arr.length;
        },
        selectThis(item) {
            //选择某一项
            item.select = true;
            this.innerSelectData.push(item.Id);
            this.onchangeAll();
        },
        cancel() {
            // 点击取消
            this.$emit('oncancle');
        },
        ok() {
            // 点击确认
            var arr = [];
            this.allData.map((data) => {
                data.list.map((item) => {
                    if (item.select) {
                        arr.push(item);
                    }
                });
            });
            this.cancel();
            this.$emit('onconfirm', arr);
        },
        onSearch() {
            this.searchTag = !!this.searchvalue; //查询框有值时 为搜索状态
            if (this.searchvalue) {
                this.throttlefunc();
            }
        },
        filterData() {
            var that = this,
                arr = [];
            this.allData.map((data) => {
                arr.push({
                    name: data.name,
                    list: data.list.filter((item) => {
                        return item.Name.indexOf(that.searchvalue) > -1;
                    })
                });
            });
            this.searchListData = arr;
        },
        selectAll() {
            var that = this;
            this.allData.map((data) => {
                data.list.map((item) => {
                    item.select = that.selectAllTag;
                    if (that.selectAllTag) {
                        if (that.innerSelectData.indexOf(item.Id) === -1) {
                            that.innerSelectData.push(item.Id);
                        }
                    }
                });
            });
            if (!that.selectAllTag) {
                that.innerSelectData.splice(0, that.innerSelectData.length);
            }
        },
        onchangeAll() {
            this.selectAllTag = this.innerSelectData.length === this.allDataLength;
        }
    }
};
</script>
