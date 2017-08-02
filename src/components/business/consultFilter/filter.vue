<template>
    <div :class="classes">
        <ul>
            <!-- 自定义内容区域 -->
            <li :class="custom" v-if="customData">
            <slot name="customLeft"></slot>
            
                <span id="customLeft" :class="customArea.buttonLeft.styleName" @click="customArea.buttonLeft.clickEvent" v-if="buttonLeftShow" v-html="customArea.buttonLeft.template">
                </span>
                <span id="customCenter" :class="customArea.buttonCenter.styleName" @click="customArea.buttonCenter.clickEvent" v-if="buttonCenterShow" v-html="customArea.buttonCenter.template">
                </span>
                <span id="customRight" :class="customArea.buttonRight.styleName" @click="customArea.buttonRight.clickEvent" v-if="buttonRightShow" v-html="customArea.buttonRight.template">
                </span>
            
            </li>
            <li :class="flortRight">
                <!-- 搜索内容区域 -->
                <div :class="search" v-if="searchData">
                    <Select :value="searchSelectInitVal" @on-change="setSearchItem" label-in-value style="width:100px">
                        <Option v-for="item in searchData.data" :value="item.value" :key="item">{{ item.text }}</Option>
                    </Select>
                    <Input type="text" icon="search" v-model="searchArea.searchInput" :placeholder="`请输入${searchArea.selected.text}`" @on-click="doSearch" @on-enter="doSearch"></Input>
                </div>
    
                <!-- 筛选组件按钮区域 -->
                <div :class="filterBtn" v-clickoutside="hidefilterContainer">
                    <Badge :count="filterResultAmount">
                        <div class="ivu-select-selection" @click="toggleContainer">
                            <input type="text" value="筛选" class="ivu-select-input" disabled>
                            <i class="ivu-icon ivu-icon-arrow-down ivu-select-arrow" style="display:block"></i>
                        </div>
                    </Badge>
                    <!-- 下拉组件区域 -->
                    <div :class="filterContainer" :style="{display:status.isContainerShow ? 'block': 'none'}">
                        <!-- 单选组件 -->
                        <consult-filter-single :model="singleModel"></consult-filter-single>
                        <!-- 联动组件 -->
                        <consult-filter-union :model="unionModel"></consult-filter-union>
                        <!-- 多选组件 -->
                        <consult-filter-multi :model="multiModel"></consult-filter-multi>
                    </div>
                </div>
            </li>
    
        </ul>
    
        <!-- 筛选内容展示区域 -->
        <div :class="fitlerResult" :style="{display:  filterResult.length > 0 ? 'block': 'none'}">
            <ul>
                <li v-for="(data,dataIndex) in filterResult" :key="data">
                    <span :class="sortName">{{data.sortName}}：</span>
                    <Tooltip v-for="(label, labelIndex) in data.label" :key="label" :content="label.text" :disabled="label.isAvoidToolTip" ref="sortLabel" placement="top">
                        <Tag :class="sortLabel" :data-id="'sortLabel-'+ data.sortValue" closable @on-close="closeTag(data,labelIndex)">{{label.text}}</Tag>
                    </Tooltip>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>

const prefixCls = "spui-b-consultFilter";
import Emiter from './emiter.vue';
import iSelect from '../../select';
import iInput from '../../input';
import Tag from '../../tag';
import Badge from '../../badge';
import Tooltip from '../../tooltip';
import filterSingle from './filter-single.vue';
import filterUnion from './filter-union.vue';
import filterMulti from './filter-multi.vue';

import clickoutside from '../../../directives/clickoutside';

export default {
    name: 'consultFilter',
    components: { iSelect, iInput, Tag, Badge, Tooltip, filterSingle, filterUnion, filterMulti },
    directives: { clickoutside },
    props: {
        filterData: {
            type: Object,
            default: null
        },
        searchData: {
            type: [Boolean, Object],
            default: false
        },
        customData: {
            type: [Boolean, Object],
            default: false
        },
        selected: {
            type: Function,
            default: null
        }
    },
    data() {
        return {
            testModel: {
                modelList: []
            },
            status: {
                isContainerShow: false,
                isCustomLeftShow: true,
                isCustomCenterShow: true,
                isCustomRightShow: true,
            },

            filterResult: [],
            searchArea: {
                initValue: "",
                selected: {
                    "text": "",
                    "value": ""
                },
                searchInput: "",
            },
            customArea: {
                buttonLeft: {
                    styleName: `${prefixCls}-customLeft`,
                    template: "新增咨询",
                    clickEvent: function () { }
                },
                buttonCenter: {
                    styleName: `${prefixCls}-customCenter`,
                    template: "导入",
                    clickEvent: function () { }
                },
                buttonRight: {
                    styleName: `${prefixCls}-customRight`,
                    template: "导出",
                    clickEvent: function () { }
                }
            },
            debounceObj: {},
        };
    },
    computed: {
        classes() {
            return `${prefixCls}`;
        },
        sortName() {
            return `${prefixCls}-sortName`
        },
        sortLabel() {
            return `${prefixCls}-label`
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
        },
        filterResultAmount() {

            var count = 0;
            for (let i = 0, len = this.filterResult.length; i < len; i++) {
                count += this.filterResult[i].label.length ? this.filterResult[i].label.length : 0;
            }
            return count;
        },
        flortRight() {
            return `${prefixCls}-flortRight`
        },
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
        buttonLeftShow() {
            return this.customData.buttonLeft.isShow;
        },
        buttonCenterShow() {
            return this.customData.buttonCenter.isShow;
        },
        buttonRightShow() {
            return this.customData.buttonRight.isShow;
        },

        singleModel() {

            //清空操作传入空值
            if (this.filterData.isClear) {
                return {
                    class: "",
                    modelList: []
                }
            }

            return {
                class: "",
                modelList: this.filterData.data.singleModel ? this.filterData.data.singleModel.modelList : []
            }
        },
        unionModel() {

            //清空操作传入空值
            if (this.filterData.isClear) {
                return {
                    class: "",
                    modelList: []
                }
            }

            return {
                class: "",
                modelList: this.filterData.data.unionModel ? this.filterData.data.unionModel.modelList : []
            }
        },
        multiModel() {

            //清空操作传入空值
            if (this.filterData.isClear) {
                return {
                    class: "",
                    modelList: []
                }
            }

            return {
                class: "",
                modelList: this.filterData.data.multiModel ? this.filterData.data.multiModel.modelList : []
            }
        },
    },
    created() {
        this.observeEvent();
    },
    mounted() {
        this.init();
    },
    updated() {
        this.setToolTipVisible();
    },
    beforeDestroy() {
        //移除二级联动模块change事件
        Emiter.$off("union-change", this.onUnionChange);
        //移除二级单选模块change事件
        Emiter.$off("single-change", this.onSingleChange);
        //移除二级多选模块change事件
        Emiter.$off("multi-change", this.onUnionChange);
    },
    watch: {

        "filterData": {
            deep: true,
            handler: function (oldv, newv) {
                if (newv.isClear === true) {
                    this.clearAllData();
                    return;
                }

                //数据返回结构存在时
                if (newv.data.singleModel) {
                    this.debounce(() => {
                        this.uiModeltoBizModel();
                    }, 800, "filterDataChange")

                }

            }
        },
        "searchData": {
            deep: true,
            handler: function (oldv, newv) {

                if (!this.searchData.opts.defaultSearchKey && this.searchData.opts.defaultSearchValue) {
                    console.warn("注意：请给传入默认搜索项传入一个指定类型，否则将默认使用第一个搜索类型去查找数据！")
                }

                this.searchArea.searchInput = newv.opts.defaultSearchValue

            }
        }

    },
    methods: {

        /****************************自定义区域相关*********************************/
        setCustomStyleName() {

            var
                leftStyleName = this.customData.buttonLeft.styleName,
                centerStyleName = this.customData.buttonCenter.styleName,
                rightStyleName = this.customData.buttonRight.styleName;

            leftStyleName ? this.customArea.buttonLeft.styleName = leftStyleName : false;
            centerStyleName ? this.customArea.buttonCenter.styleName = centerStyleName : false;
            rightStyleName ? this.customArea.buttonRight.styleName = rightStyleName : false;

        },

        setCustomTemplate() {

            var
                tplLeft = this.customData.buttonLeft.template,
                tplCenter = this.customData.buttonCenter.template,
                tplRight = this.customData.buttonRight.template;

            tplLeft ? this.customArea.buttonLeft.template = tplLeft : false;
            tplCenter ? this.customArea.buttonCenter.template = tplCenter : false;
            tplRight ? this.customArea.buttonRight.template = tplRight : false;

        },

        setCustomCallBack() {
            var
                leftCallBack = this.customData.buttonLeft.clickEvent,
                centerCallBack = this.customData.buttonCenter.clickEvent,
                rightCallBack = this.customData.buttonRight.clickEvent;

            if (leftCallBack && !(typeof leftCallBack === "function")) {
                throw new Error("请给buttonLeft点击事件传入正确的函数")
            }
            leftCallBack ? this.customArea.buttonLeft.clickEvent = leftCallBack : false;

            if (centerCallBack && !(typeof centerCallBack === "function")) {
                throw new Error("请给buttonCenter点击事件传入正确的函数")
            }
            centerCallBack ? this.customArea.buttonCenter.clickEvent = centerCallBack : false;

            if (rightCallBack && !(typeof rightCallBack === "function")) {
                throw new Error("请给buttonRight点击事件传入正确的函数")
            }
            rightCallBack ? this.customArea.buttonRight.clickEvent = rightCallBack : false;
        },


        /****************************搜索项相关*********************************/

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

        doSearch() {

            //搜索结果互斥时，清空筛选项
            if (this.searchData.opts.isResetFilter) {
                this.emptyTag();

            } else {
                this.debounce(() => {
                    this.uiModeltoBizModel();
                }, 500, "doSearch")
            }
        },

        /****************************筛选项相关*********************************/

        uiModeltoBizModel() {

            var filterRes = {};
            var searchRes = {
                key: this.searchArea.selected.value,
                value: this.searchArea.searchInput
            }

            this.filterResult.map(function (sortItem) {

                filterRes[sortItem.sortValue] = [];
                sortItem.label.map(function (labelItem) {
                    if (Object.prototype.toString.call(labelItem.value).toLowerCase() === "[object array]") {
                        filterRes[sortItem.sortValue] = labelItem.value;
                    } else {
                        filterRes[sortItem.sortValue].push(labelItem.value)
                    }
                })
            })

            var outPutFn = this.filterData.callback["selected"];

            if (outPutFn && !(Object.prototype.toString.call(outPutFn).toLowerCase() === "[object function]")) {
                throw new Error("请传入有效的函数类型回调")
            }

            outPutFn(filterRes, searchRes);
        },

        //将外部传入数据组装成二级组件需要的数据结构
        // convertModel() {
        //     this.singleModel = this.filterData.singleModel;
        //     this.unionModel = this.filterData.unionModel;
        //     this.multiModel = this.filterData.multiModel;
        // },
        //显示下拉项层
        toggleContainer() {
            this.status.isContainerShow = !this.status.isContainerShow;
        },
        hidefilterContainer() {
            this.status.isContainerShow = false;
        },

        //计算溢出需要显示tooltip的文字
        setToolTipVisible() {

            if (this.filterResult.length == 0) {
                return;
            }

            var labelInstances = this.$refs.sortLabel,
                sameSortStartI = -1,//记录同一类型起始位置的索引
                labelSortOld = "",
                arr = [];//保存匹配到的筛选分类的分类名和索引

            //找到内容溢出的tag
            for (let i = 0, len = labelInstances.length; i < len; i++) {
                var labelSortNew = /sortLabel-([^]*)/.exec(labelInstances[i].$el.querySelector(`.${prefixCls}-label`).dataset.id)[1];
                var labelWidth = labelInstances[i].$el.querySelector('.ivu-tag-text').clientWidth;

                //初始化时给labelSortOld赋新值,并记录当前的起始索引位置,切换分类后旧值和新值不同，重新记录起始位置
                if (labelSortOld == "undefined" || labelSortOld != labelSortNew) {
                    sameSortStartI = i;
                }
                //给旧值赋值
                labelSortOld = labelSortNew
                //内容溢出记录当前分类和相对位置（实际位置）索引
                if (labelWidth >= 250) {
                    arr.push({ sortValue: `${labelSortNew}`, index: i - sameSortStartI });
                }
            }


            //给内容溢出的tag设置状态
            var queryData = this.filterResult;
            for (let i = 0, len = queryData.length; i < len; i++) {

                //开启指定ToolTip
                for (let j = 0, len = arr.length; j < len; j++) {

                    var matchedSortValue = arr[j].sortValue;
                    var matchedIndex = arr[j].index;

                    if (arr[j].sortValue == queryData[i].sortValue) {
                        queryData[i].label[matchedIndex].isAvoidToolTip = false;
                    }
                }

            }
        },
        //销毁数据实例
        clearAllData() {
            //清空已选择的数据
            this.filterResult = [];
            //清空下拉数据和搜索项
            this.searchArea = {
                initValue: "",
                selected: {
                    "text": "",
                    "value": ""
                },
                searchInput: "",
            };
        },
        // 清空所有标签
        emptyTag() {
            //每次初始化赋值的时候先清空原先筛选项数据
            var filterResult = this.filterResult,
                me = this;

            if (filterResult.length) {
                filterResult.map(function (sortItem, itemIndex) {
                    Emiter.$emit(sortItem.sortValue + "-change", [], []);
                })
            }

        },
        // 删除筛选标签
        closeTag(sortItem, labelIndex) {

            sortItem.label.splice(labelIndex, 1);
            var value = [],
                label = [];

            sortItem.label.map(function (item) {
                value.push(item.value);
                label.push(item.text);
            })

            //向基础组件发起数据变动通知
            Emiter.$emit(sortItem.sortValue + "-change", value, label);

        },
        onUnionChange(data) {
            var _this = this,
                isEmpty = false,
                isFinish = false;
            if (data.label.length == 0) {
                isEmpty = true;
                this.filterResult.map(function (item, index) {
                    if (item.sortValue == data.sortValue) {
                        _this.filterResult.splice(index, 1);
                    }
                })
            }
            if (isEmpty) {
                return;
            }
            var _this = this,
                len = this.filterResult.length;

            //如果filterResult没有数据直接放入数据
            if (len === 0) {
                this.filterResult.push(data);
                return;
            }

            this.filterResult.map(function (item, index) {
                if (isFinish) {
                    return;
                }
                if (item.sortValue === data.sortValue) {
                    //给多选和单选添加tooltip属性
                    data.label.map(function (item, index) {
                        item.isAvoidToolTip = true;
                    });

                    item.label = data.label;
                    isFinish = true;
                }
                else if (index === len - 1) {
                    //给多选和单选添加tooltip属性
                    data.label.map(function (item, index) {
                        item.isAvoidToolTip = true;
                    });

                    _this.filterResult.push(data);
                }
            })
        },
        onSingleChange(data) {

            var _this = this,
                len = this.filterResult.length;

            //hack 给所有传入数据加一个toolTip属性实现vue绑定
            data.label[0].isAvoidToolTip = true;

            if (len === 0) {
                this.filterResult.push(data);
                return;
            }

            var emptySort = "";
            var isSortExist = false;
            //修改
            this.filterResult.map(function (item, index) {
                if (item.sortValue === data.sortValue) {
                    if (!data.label[0].value) {
                        emptySort = data.sortValue;
                    }
                    item.label = data.label;
                    isSortExist = true;
                }
            })
            //添加
            !isSortExist && data.label[0].value && _this.filterResult.push(data);
            //删除
            this.filterResult = this.filterResult.filter(function (item, index) {
                return item.sortValue != emptySort;
            })

        },
        observeEvent() {
            //监听二级联动模块change事件
            Emiter.$on("union-change", this.onUnionChange);
            //监听二级单选模块change事件
            Emiter.$on("single-change", this.onSingleChange);
            //监听二级多选模块change事件
            Emiter.$on("multi-change", this.onUnionChange);
        },

        debounce: function (func, timeout, type) {

            this.debounceObj[type] && clearTimeout(this.debounceObj[type]);
            this.debounceObj[type] = setTimeout(() => {
                func()
            }, timeout);

        },
        //根据返回
        init() {

            //设置初始化自定义区域显示
            if (this.customData) {
                //传入customData时
                if (!this.customData.buttonLeft || !this.customData.buttonCenter || !this.customData.buttonRight) {
                    throw new Error("请传入正确格式的customData配置项");
                }
                this.setCustomTemplate();
                this.setCustomStyleName();
                this.setCustomCallBack();
            }
        }
    }
};

</script>
