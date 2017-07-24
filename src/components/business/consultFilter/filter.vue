<template>
    <div :class="classes">
        <ul>
            <!-- 自定义内容区域 -->
            <li :class="custom" v-if="customData">
                <span id="customLeft" :class="customArea.buttonLeft.styleName" @click="customArea.buttonLeft.clickEvent" :style="{display:status.isCustomLeftShow ? 'inline-block': 'none'}">
                </span>
                <span id="customCenter" :class="customArea.buttonCenter.styleName" @click="customArea.buttonCenter.clickEvent" :style="{display:status.isCustomCenterShow ? 'inline-block': 'none'}">
                </span>
                <span id="customRight" :class="customArea.buttonRight.styleName" @click="customArea.buttonRight.clickEvent" :style="{display:status.isCustomRightShow ? 'inline-block': 'none'}">
                </span>
            </li>
            <li :class="flortRight">
                <!-- 搜索内容区域 -->
                <div :class="search" v-if="searchData">
                    <Select :value="searchArea.initValue" @on-change="setSearchItem" label-in-value style="width:100px">
                        <Option v-for="item in searchData.data" :value="item.value" :key="item">{{ item.text }}</Option>
                    </Select>
                    <Input type="text" icon="search" :placeholder="`请输入${searchArea.selected.text}`" @on-click="doSearch"></Input>
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
        <div :class="fitlerResult" :style="{display:filterResult.length > 0 ? 'block': 'none'}">
            <ul>
                <li v-for="(data,dataIndex) in filterResult" :key="data">
                    <span :class="sortName">{{data.sortName}}：</span>
                    <Tooltip v-for="(label, labelIndex) in data.label" :key="label" :content="label.text" :disabled="label.isAvoidToolTip" ref="sortLabel" placement="top">
                        <Tag :class="sortLabel" :data-id="'sortLabel-'+ data.sortValue" closable @on-close="closeTag(data,dataIndex,labelIndex)">{{label.text}}</Tag>
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
                isCustomRightShow: true
            },

            filterResult: [
                //    {//mock数据
                //     sortName: "跟进",
                //     sortValue: "2",
                //     label: [ {
                //         "text": "待跟进少时诵诗书所所所所所所所所所所所所所所所三生三世少时诵诗书所所所",
                //         "value": "12",
                //         "isAvoidToolTip": true
                //     }, {
                //         "text": "aaaaaaaaa",
                //         "value": "12",
                //         "isAvoidToolTip": true
                //     }],
                // }
            ],
            searchArea: {
                initValue: "",
                selected: {
                    "text": "",
                    "value": ""
                }
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
            singleModel: {
                class: "",//自定义样式名
                modelList: [],
            },
            unionModel: {
                class: "",
                modelList: []
            },
            multiModel: {
                class: "",
                modelList: []
            }
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
        flortRight(){
            return `${prefixCls}-flortRight`
        }
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
                tplRight = this.customData.buttonRight.template,

                tplLeftDefult = this.customArea.buttonLeft.template,
                tplCenterDefult = this.customArea.buttonCenter.template,
                tplRightDefult = this.customArea.buttonRight.template;

            tplLeft ? tplLeftDefult = tplLeft : false;
            tplCenter ? tplCenterDefult = tplCenter : false;
            tplRight ? tplRightDefult = tplRight : false;

            this.$el.querySelector("#customLeft").innerHTML = tplLeftDefult;
            this.$el.querySelector("#customCenter").innerHTML = tplCenterDefult;
            this.$el.querySelector("#customRight").innerHTML = tplRightDefult;
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
            this.searchArea.selected = {
                "text": obj.label,
                "value": obj.value,
            }
            // console.log(this.searchArea.selected.text);
        },

        doSearch() {
            if (typeof this.searchData.callback == "function") {
                this.searchData.callback();
            } else {
                throw new Error("请传入正确的搜索回调！")
            }
        },

        /****************************筛选项相关*********************************/

        //复制外部model
        convertModel() {
            this.singleModel.modelList = this.filterData.singleModel.modelList.map(function (item) { return item });
            this.unionModel = this.filterData.unionModel;
            this.multiModel = this.filterData.multiModel;
            console.log(this.singleModel)
        },
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

            // console.log(this.filterResult)
        },

        // 删除筛选标签
        closeTag(item, itemIndex, labelIndex) {

            item.label.splice(labelIndex, 1);

            if (item.label.length == 0) {
                this.filterResult.splice(itemIndex, 1);
            }

            var data = [];
            item.label.map(function (item) {
                data.push(item.value);
            })
            //向基础组件发起数据变动通知
            Emiter.$emit(item.sortValue + "-change", data);
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
        onMultiChange() {
        },
        observeEvent() {
            //监听二级联动模块change事件
            Emiter.$on("union-change", this.onUnionChange);
            //监听二级单选模块change事件
            Emiter.$on("single-change", this.onSingleChange);
            //监听二级多选模块change事件
            Emiter.$on("multi-change", this.onUnionChange);
        },
        //根据返回
        init() {

            //设置初始化搜索值
            if (this.searchData) {
                this.searchArea.initValue = this.searchData.data[0].value;
            }
            //设置初始化自定义区域显示
            if (this.customData) {
                this.status.isCustomLeftShow = this.customData.buttonLeft.isShow === false ? false : true;
                this.status.isCustomCenterShow = this.customData.buttonCenter.isShow === false ? false : true;
                this.status.isCustomRightShow = this.customData.buttonRight.isShow === false ? false : true;

                //传入customData时
                if (!this.customData.buttonLeft || !this.customData.buttonCenter || !this.customData.buttonRight) {
                    throw new Error("请传入正确格式的customData配置项");
                }
                this.setCustomTemplate();
                this.setCustomStyleName();
                this.setCustomCallBack();
            }
            this.convertModel();
        }
    }
};

</script>
