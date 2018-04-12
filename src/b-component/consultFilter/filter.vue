<template>
    <div :class="classes">
        <ul>
            <!-- 自定义内容区域 -->
            <li :class="[custom,custumClass.custom]">
                <slot name="customLeft"></slot>
            </li>
    
            <li :class="[flortRight,custumClass.floatright]">
                <!-- 搜索内容区域  -->

                <xb-fuzzy-select ref="fuzzySearch" v-if="searchData && status.isInitCompleted" :search-data="searchData" :callback="{'dosearch':doSearch}" @update-search-res="updateSearchRes"></xb-fuzzy-select>
                
                <!-- 筛选组件按钮区域 -->
                
                <div :class="filterBtn" v-clickoutside="hidefilterContainer">
                    <Badge :count="filterResultAmount">
                        <div class="ivu-select-selection" @click="toggleContainer">
                            <input type="text" value="筛选" class="ivu-select-input filterBtn" disabled>
                            <i class="ivu-icon ivu-icon-arrow-down ivu-select-arrow filterBtn-icon-arrow" style="display:block"></i>
                        </div>
                    </Badge>
                    <!-- 下拉组件区域 -->
                    <transition name="slide-up">
                        <div :class="filterContainer" :style="{display:status.isContainerShow?'block':'none'}" v-if="containerStyle.type!=='horizontal'">
                            <!-- 单选组件 -->
                            <consult-filter-single :model="singleModel"></consult-filter-single>
                            <!-- 联动组件 -->
                            <consult-filter-union :model="unionModel"></consult-filter-union>
                            <!-- 多选组件 -->
                            <consult-filter-multi :model="multiModel"></consult-filter-multi>
                        </div>
                        <div :class="filterContainer" :style="{display:status.isContainerShow?'block':'none'}" v-if="containerStyle.type==='horizontal'">                       
                           <Row>
                              <Col :span="containerStyle.ratio?containerStyle.ratio.union:8" v-if="unionModel.modelList.length">
                                  <consult-filter-union :model="unionModel"></consult-filter-union>
                              </Col>
                              <Col :span="containerStyle.ratio?containerStyle.ratio.multi:8" v-if="multiModel.modelList.length">
                                  <consult-filter-multi :model="multiModel"></consult-filter-multi>
                              </Col>
                              <Col :span="containerStyle.ratio?containerStyle.ratio.single:8">
                                  <consult-filter-single :model="singleModel" v-if="singleModel.modelList.length"></consult-filter-single>
                              </Col>
                           </Row>
                        </div>
                    </transition>
                </div>
            </li>
    
        </ul>
    
        <!-- 筛选内容展示区域 -->
        <transition name="slide-up">
            <div :class="[fitlerResult,custumClass.filterResult]" v-if="filterResult.length">
                <ul style="padding-right:50px">
                    <li v-for="(data,dataIndex) in filterResult" :key="dataIndex">
                        <span :class="sortName">{{data.sortName}}：</span>
                        <Tooltip v-for="(label, labelIndex) in data.label" :key="labelIndex" :content="label.text" :disabled="label.isAvoidToolTip" ref="sortLabel" placement="top">
                            <Tag :class="sortLabel" :data-id="'sortLabel-'+ data.sortValue" closable @on-close="closeTag(data,labelIndex)">{{label.text}}</Tag>
                        </Tooltip>
                    </li>
                    <li style="position:absolute;top:0;right:-15px;margin-right:0"><i-button type="text" @click="clearFilterData">清空筛选</i-button></li>
                </ul>
            </div>
        </transition>
    </div>
</template>
<script>
const prefixCls = 'spui-b-consultFilter';
import emitter from './emit';
import iSelect from '../../components/select';
import iInput from '../../components/input';
import iButton from '../../components/button';
import XbFuzzySelect from '../../components/xb-fuzzy-select';
import Tag from '../../components/tag';
import Badge from '../../components/badge';
import Tooltip from '../../components/tooltip';
import filterSingle from './filter-single.vue';
import filterUnion from './filter-union.vue';
import filterMulti from './filter-multi.vue';

import clickoutside from '../../directives/clickoutside';

export default {
    name: 'consultFilter',
    mixins: [emitter],
    components: { iSelect, iInput, Tag, Badge, Tooltip, filterSingle, filterUnion, filterMulti, XbFuzzySelect },
    directives: { clickoutside },
    props: {
        //filterData:筛选项数据
        filterData: {
            type: Object,
            default: null
        },
        //searchData:搜索项配置
        searchData: {
            type: [Boolean, Object],
            default: false
        },
        //callback:搜索及筛选回调方法
        callback: {
            type: Object,
            default: null
        },
        //custumClass:自定义样式
        custumClass: {
            type: Object,
            default: function() {
                return {};
            }
        },
        //containerStyle:筛选项横，纵项排列样式配置
        containerStyle: {
            type: Object,
            default: function () {
                return {
                    type: "vertical",
                    ratio: {
                        multi: 8,
                        single: 8,
                        union: 8
                    }
                }
            }
        }
    },
    data() {
        return {
            testModel: {
                modelList: []
            },
            status: {
                isContainerShow: false,
                isInitCompleted: false
            },

            filterResult: [],
            searchArea: {
                selected: {
                    text: '',
                    value: ''
                },
                searchInput: ''
            },
            debounceObj: {}
        };
    },
    computed: {
        classes() {
            return `${prefixCls}`;
        },
        sortName() {
            return `${prefixCls}-sortName`;
        },
        sortLabel() {
            return `${prefixCls}-label`;
        },
        custom() {
            return `${prefixCls}-custom`;
        },
        search() {
            return `${prefixCls}-search`;
        },
        filterBtn() {
            return [
                `${prefixCls}-filterBtn`,
                {
                    [`${prefixCls}-isSelected`]: this.status.isContainerShow
                }
            ];
        },
        fitlerResult() {
            return `${prefixCls}-fitlerResult`;
        },
        filterContainer() {
            return this.containerStyle.type==="vertical"?`${prefixCls}-container`:`${prefixCls}-horizontal-container`;
        },
        filterResultAmount() {
            var count = 0;
            for (let i = 0, len = this.filterResult.length; i < len; i++) {
                count += this.filterResult[i].label.length ? this.filterResult[i].label.length : 0;
            }
            return count;
        },
        flortRight() {
            return `${prefixCls}-flortRight`;
        },

        singleModel() {
            //清空操作传入空值
            if (this.filterData.isClear) {
                return {
                    class: '',
                    modelList: []
                };
            }

            return {
                class: this.filterData.data.singleModel ? this.filterData.data.singleModel.class : '',
                modelList: this.filterData.data.singleModel ? this.filterData.data.singleModel.modelList : []
            };
        },
        unionModel() {
            //清空操作传入空值
            if (this.filterData.isClear) {
                return {
                    class: '',
                    modelList: []
                };
            }

            return {
                class: this.filterData.data.unionModel ? this.filterData.data.unionModel.class : '',
                modelList: this.filterData.data.unionModel ? this.filterData.data.unionModel.modelList : []
            };
        },
        multiModel() {
            //清空操作传入空值
            if (this.filterData.isClear) {
                return {
                    class: '',
                    modelList: []
                };
            }

            return {
                class: this.filterData.data.multiModel ? this.filterData.data.multiModel.class : '',
                modelList: this.filterData.data.multiModel ? this.filterData.data.multiModel.modelList : []
            };
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
    beforeDestroy() {
        //移除二级联动模块change事件
        this.$off('union-change', this.onUnionChange);
        //移除二级单选模块change事件
        this.$off('single-change', this.onSingleChange);
        //移除二级多选模块change事件
        this.$off('multi-change', this.onUnionChange);
    },
    watch: {
        filterData: {
            deep: true,
            handler: function(oldv, newv) {
                if (newv.isClear === true) {
                    this.clearAllData();
                    return;
                }

                //初始化调用回调
                if (newv.data.singleModel && !this.status.isInitCompleted) {
                    this.uiModeltoBizModel(this.getInitData(newv.data));
                    this.status.isInitCompleted = true;
                }
            }
        },
        searchData: {
            deep: true,
            handler: function(oldv, newv) {
                if (!this.searchData.opts.defaultSearchKey && this.searchData.opts.defaultSearchValue) {
                    console.warn('注意：请给传入默认搜索项传入一个指定类型，否则将默认使用第一个搜索类型去查找数据！');
                }
                this.searchArea.selected.value = newv.opts.defaultSearchKey;
                this.searchArea.searchInput = newv.opts.defaultSearchValue;
            }
        }
    },
    methods: {
        /****************************搜索项相关*********************************/

        doSearch(searchRes) {
            //搜索结果互斥时，清空筛选项
            if (this.searchData.opts.isResetFilter) {
                this.emptyTag();
                this.debounce(
                    () => {
                        this.uiModeltoBizModel();
                    },
                    500,
                    'doSearch'
                );
            } else {
                this.debounce(
                    () => {
                        this.uiModeltoBizModel();
                    },
                    500,
                    'doSearch'
                );
            }
        },
        updateSearchRes(obj) {
            this.searchArea.selected.value = obj.value;
            this.searchArea.selected.text = obj.text;
            this.searchArea.searchInput = obj.input;
        },

        /****************************筛选项相关*********************************/

        uiModeltoBizModel(initFilterData) {
            var filterRes = {};
            var searchRes = {
                key: this.searchArea.selected.value,
                value: this.searchArea.searchInput
            };

            var outPutFn = this.callback['selected'];

            if (outPutFn && !(Object.prototype.toString.call(outPutFn).toLowerCase() === '[object function]')) {
                throw new Error('请传入有效的函数类型回调');
            }

            if (initFilterData) {
                outPutFn(initFilterData, searchRes);
                return;
            }

            this.filterResult.map(function(sortItem) {
                filterRes[sortItem.sortValue] = [];
                sortItem.label.map(function(labelItem) {
                    if (Object.prototype.toString.call(labelItem.value).toLowerCase() === '[object array]') {
                        filterRes[sortItem.sortValue] = labelItem.value;
                    } else {
                        filterRes[sortItem.sortValue].push(labelItem.value);
                    }
                });
            });

            outPutFn(filterRes, searchRes);
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
                sameSortStartI = -1, //记录同一类型起始位置的索引
                labelSortOld = '',
                arr = []; //保存匹配到的筛选分类的分类名和索引

            //找到内容溢出的tag
            for (let i = 0, len = labelInstances.length; i < len; i++) {
                var labelSortNew = /sortLabel-(.*)/.exec(
                    $(labelInstances[i].$el.querySelector(`.${prefixCls}-label`)).attr('data-id')
                )[1];
                var labelWidth = labelInstances[i].$el.querySelector('.ivu-tag-text').clientWidth;

                //初始化时给labelSortOld赋新值,并记录当前的起始索引位置,切换分类后旧值和新值不同，重新记录起始位置
                if (labelSortOld == 'undefined' || labelSortOld != labelSortNew) {
                    sameSortStartI = i;
                }
                //给旧值赋值
                labelSortOld = labelSortNew;
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
            this.status.isInitCompleted = false;
            this.$refs.fuzzySearch.clear();
        },
        clearFilterData() {
            this.emptyTag();
            this.debounce(
                () => {
                    this.uiModeltoBizModel();
                },
                500
            );
        },
        // 清空所有标签
        emptyTag() {
            //每次初始化赋值的时候先清空原先筛选项数据
            var filterResult = this.filterResult,
                me = this;

            if (filterResult.length) {
                filterResult.map((sortItem, itemIndex) => {
                    this.broadcast('selectComponent', sortItem.sortValue + '-change', [], [], 'emptyOnly');
                });
            }
        },
        // 删除筛选标签
        closeTag(sortItem, labelIndex) {
            sortItem.label.splice(labelIndex, 1);
            var value = [],
                label = [];

            sortItem.label.map(function(item) {
                value.push(item.value);
                label.push(item.text);
            });

            //向基础组件发起数据变动通知
            this.broadcast('selectComponent', sortItem.sortValue + '-change', value, label);
        },
        onUnionChange(data, type) {
            var _this = this,
                isEmpty = false,
                isFinish = false;

            if (data.label.length == 0) {
                isEmpty = true;
            }

            if (isEmpty) {
                this.filterResult = this.filterResult.filter(function(item, index) {
                    return item.sortValue != data.sortValue;
                });
                if (type == 'fromBottom') {
                    this.debounce(
                        () => {
                            this.uiModeltoBizModel();
                        },
                        800,
                        'dataChange'
                    );
                }
                return;
            }

            var _this = this,
                len = this.filterResult.length;

            //如果filterResult没有数据直接放入数据
            if (len === 0) {
                //给多选和单选添加tooltip属性
                data.label.map(function(item, index) {
                    item.isAvoidToolTip = true;
                });
                this.filterResult.push(data);
                if (type == 'fromBottom') {
                    this.debounce(
                        () => {
                            this.uiModeltoBizModel();
                        },
                        800,
                        'dataChange'
                    );
                }
                return;
            }

            this.filterResult.map(function(item, index) {
                if (isFinish) {
                    return;
                }
                if (item.sortValue === data.sortValue) {
                    //给多选和单选添加tooltip属性
                    data.label.map(function(item, index) {
                        item.isAvoidToolTip = true;
                    });

                    item.label = data.label;
                    isFinish = true;
                } else if (index === len - 1) {
                    //给多选和单选添加tooltip属性
                    data.label.map(function(item, index) {
                        item.isAvoidToolTip = true;
                    });

                    _this.filterResult.push(data);
                }
            });

            //修改和添加事件触发回调
            if (type == 'fromBottom') {
                this.debounce(
                    () => {
                        this.uiModeltoBizModel();
                    },
                    800,
                    'dataChange'
                );
            }
        },
        onSingleChange(data, type) {
            var _this = this,
                len = this.filterResult.length,
                isSortExist = false,
                isEmpty = false;

            if (!data.label[0].value) {
                isEmpty = true;
            }

            //删除事件,清空并触发回调
            if (isEmpty) {
                this.filterResult = this.filterResult.filter(function(item, index) {
                    return item.sortValue != data.sortValue;
                });
                if (type == 'fromBottom') {
                    this.debounce(
                        () => {
                            this.uiModeltoBizModel();
                        },
                        800,
                        'dataChange'
                    );
                }
                return;
            }

            //hack 给所有传入数据加一个toolTip属性实现vue绑定
            data.label[0].isAvoidToolTip = true;

            if (len === 0) {
                this.filterResult.push(data);
                if (type == 'fromBottom') {
                    this.debounce(
                        () => {
                            this.uiModeltoBizModel();
                        },
                        800,
                        'dataChange'
                    );
                }
                return;
            }

            //修改
            this.filterResult.map(function(item, index) {
                if (item.sortValue === data.sortValue) {
                    item.label = data.label;
                    isSortExist = true;
                }
            });

            //添加
            !isSortExist && data.label[0].value && _this.filterResult.push(data);

            //修改或添加事件触发回调
            if (type == 'fromBottom') {
                this.debounce(
                    () => {
                        this.uiModeltoBizModel();
                    },
                    800,
                    'dataChange'
                );
            }
        },
        observeEvent() {
            //监听二级联动模块change事件
            this.$on('union-change', this.onUnionChange);
            //监听二级单选模块change事件
            this.$on('single-change', this.onSingleChange);
            //监听二级多选模块change事件
            this.$on('multi-change', this.onUnionChange);
        },

        debounce(func, timeout, type) {
            this.debounceObj[type] && clearTimeout(this.debounceObj[type]);
            this.debounceObj[type] = setTimeout(() => {
                func();
            }, timeout);
        },
        //获取初始化传入数据默认值
        getInitData(model) {
            var initfilterResult = {};
            var setFn = function(sortItem) {
                if (sortItem.componentConfig.value.length) {
                    initfilterResult[sortItem.sortValue] = sortItem.componentConfig.value;
                }
            };

            model.singleModel.modelList.map(function(sortItem) {
                setFn(sortItem);
            });
            model.multiModel.modelList.map(function(sortItem) {
                setFn(sortItem);
            });

            model.unionModel.modelList.map(function(sortItemList) {
                sortItemList.map(function(sortItem) {
                    setFn(sortItem);
                });
            });

            return initfilterResult;
        },
        //根据返回
        init() {}
    }
};
</script>
