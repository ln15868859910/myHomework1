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
    
            <!-- 搜索内容区域 -->
            <li :class="search" v-if="searchData">
                <Select :value="searchArea.selected.text" @on-change="setSearchItem" label-in-value style="width:100px">
                    <Option v-for="item in searchData.data" :value="item.value" :key="item">{{ item.text }}</Option>
                </Select>
                <Input type="text" icon="search" :placeholder="`请输入${this.searchArea.selected.text}`" @on-click="doSearch"></Input>
            </li>
    
            <!-- 筛选组件按钮区域 -->
            <li :class="filterBtn" @click="showContainer">
                <Badge :count="filterResultAmount">
                    <div class="ivu-select-selection">
                        <input type="text" value="筛选" class="ivu-select-input" disabled>
                        <i class="ivu-icon ivu-icon-arrow-down ivu-select-arrow" style="display:block"></i>
                    </div>
                </Badge>
            </li>
        </ul>
    
        <!-- 筛选内容展示区域 -->
        <div :class="fitlerResult" :style="{display:filterResult.length > 0 ? 'block': 'none'}">
            <ul>
                <li v-for="data in filterResult" :key="data">
                    <span :class="sortName">{{data.sortName}}：</span>
                    <Tooltip v-for="(label, index) in data.label" :key="label" :content="label.text" :disabled="label.isAvoidToolTip" ref="sortLabel" placement="top">
                        <Tag :class="[sortLabel, 'sortLabel-'+ data.sortValue]" closable @on-close="closeTag(data.sortValue,index)">{{label.text}}</Tag>
                    </Tooltip>
                </li>
            </ul>
        </div>
    
        <!-- 下拉组件区域 -->
        <div :class="filterContainer" :style="{display:status.isContainerShow ? 'block': 'none'}">
            <!-- 单选组件 -->
            <consult-filter-single></consult-filter-single>
            <!-- 联动组件 -->
            <consult-filter-union :model-list="unionModelList"></consult-filter-union>
            <!-- 多选组件 -->
            <consult-filter-multi></consult-filter-multi>
        </div>
    </div>
</template>
<script>

const prefixCls = "spui-b-consultFilter";

import iSelect from '../../select';
import iInput from '../../input';
import Tag from '../../tag';
import Badge from '../../badge';
import Tooltip from '../../tooltip';
import filterSingle from './filter-single.vue';
import filterUnion from './filter-union.vue';
import filterMulti from './filter-multi.vue';

export default {
    name: 'consultFilter',
    components: { iSelect, iInput, Tag, Badge, Tooltip, filterSingle, filterUnion, filterMulti },
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
            status: {
                isContainerShow: false,
                isCustomLeftShow: true,
                isCustomCenterShow: true,
                isCustomRightShow: true
            },

            filterResult: [{//mock数据
                sortName: "跟进状态",
                sortValue: "1",
                label: [{
                    "text": "跟进中",
                    "value": "11",
                    "isAvoidToolTip": true
                }, {
                    "text": "待跟进",
                    "value": "13",
                    "isAvoidToolTip": true
                }],
            }, {//mock数据
                sortName: "跟进",
                sortValue: "2",
                label: [{
                    "text": "跟进中",
                    "value": "11",
                    "isAvoidToolTip": true
                }, {
                    "text": "待跟进",
                    "value": "12",
                    "isAvoidToolTip": true
                }, {
                    "text": "待跟进",
                    "value": "12",
                    "isAvoidToolTip": true
                }, {
                    "text": "待跟进",
                    "value": "12",
                    "isAvoidToolTip": true
                }, {
                    "text": "待跟进",
                    "value": "12",
                    "isAvoidToolTip": true
                }, {
                    "text": "待跟进",
                    "value": "12",
                    "isAvoidToolTip": true
                }, {
                    "text": "待跟进",
                    "value": "12",
                    "isAvoidToolTip": true
                }, {
                    "text": "待跟进",
                    "value": "12",
                    "isAvoidToolTip": true
                }, {
                    "text": "待跟进",
                    "value": "12",
                    "isAvoidToolTip": true
                }, {
                    "text": "待跟进",
                    "value": "12",
                    "isAvoidToolTip": true
                }, {
                    "text": "待跟进少时诵诗书所所所所所所所所所所所所所所所三生三世少时诵诗书所所所",
                    "value": "12",
                    "isAvoidToolTip": true
                }, {
                    "text": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                    "value": "12",
                    "isAvoidToolTip": true
                }, {
                    "text": "待跟进",
                    "value": "12",
                    "isAvoidToolTip": true
                }, {
                    "text": "待跟进",
                    "value": "12",
                    "isAvoidToolTip": true
                }, {
                    "text": "待跟进",
                    "value": "12",
                    "isAvoidToolTip": true
                }],
            }],
            searchArea: {
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
            unionModelList: [
                {
                    type: 1,
                    optionList: [
                        {
                            value: "beijing",
                            label: "北京"
                        },
                        {
                            value: "hangzhou",
                            label: "杭州"
                        }
                    ]
                },
                {
                    type: 1,
                    optionList: [
                        {
                            value: "beijing",
                            label: "北京"
                        },
                        {
                            value: "hangzhou",
                            label: "杭州"
                        }
                    ]
                }
            ]

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
        filterResultAmount(){

            var count = 0;

            for(let i=0, len = this.filterResult.length; i<len; i++){

                count += this.filterResult[i].label.length
            }

            return count;
        }
    },
    mounted() {
        this.init();
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
        //显示下拉项层
        showContainer() {
            this.status.isContainerShow = !this.status.isContainerShow;
        },
        //设置已筛选的筛选项
        setFilterResult() {

        },
        setLabelMaxWidth() {

        },
        //计算溢出需要显示tooltip的文字
        setToolTipVisible() {

            var labelInstances = this.$refs.sortLabel,
                sameSortStartI = -1,//记录同一类型起始位置的索引
                labelSortOld = "",
                arr = [];//保存匹配到的筛选分类的分类名和索引

            //找到内容溢出的tag
            for (let i = 0, len = labelInstances.length; i < len; i++) {
                var labelSortNew = /sortLabel-([^]*)/.exec(labelInstances[i].$el.querySelector(`.${prefixCls}-label`).className)[1];
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

                for (let j = 0, len = arr.length; j < len; j++) {

                    var matchedSortValue = arr[j].sortValue;
                    var matchedIndex = arr[j].index;

                    if (arr[j].sortValue == queryData[i].sortValue) {
                        queryData[i].label[matchedIndex].isAvoidToolTip = false;
                    }
                }

            }

        },

        closeTag(sortValue, index) {

            //每次循环判断当前分类下选中项是否为空
            var CurrentSortEmptyIndex = -1;

            for (let i = 0, len = this.filterResult.length; i < len; i++) {
                //找到对应的当前分类
                if (this.filterResult[i].sortValue == sortValue) {
                    this.filterResult[i].label.splice(index, 1);
                    if (this.filterResult[i].label.length == 0) {
                        CurrentSortEmptyIndex = i;
                    }
                }
            }

            //循环结束删除选项为空的分类
            if (CurrentSortEmptyIndex != -1) {
                this.filterResult.splice(CurrentSortEmptyIndex, 1);
                CurrentSortEmptyIndex = -1;
            }

        },

        init() {
            //设置初始化搜索值
            if (this.searchData) {
                this.searchArea.selected = {
                    "text": this.searchData.data[0].text,
                    "value": this.searchData.data[0].value,
                }
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
            this.setToolTipVisible();
        }



    }
};

</script>
