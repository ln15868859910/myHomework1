<template>
    <div :class="classes" :style="styles">
        <div :class="[prefixCls + '-headWrap']" :style="[fixedHeaderStyle,centerTableStyle]" ref="fixedHeaderEle">
            <div :class="[prefixCls + '-title']" ref="title">
                <slot name="header"></slot>
            </div>
            <div style="padding:0 20px;">
                <XbScrollbar @on-barScroll="handleBarScroll" ref="scrollBar" noresize>
                    <div :style="[tableStyle]" :class="[prefixCls+'-scrollBar']"></div>
                </XbScrollbar>
                <div style="position:relative">
                    <div :class="[prefixCls + '-header']" v-if="showHeader" ref="header">

                        <table-head 
                        :styleObject="tableStyle" 
                        :columns="cloneColumns" 
                        :columns-width="columnsWidth" 
                        :data="rebuildData">
                        </table-head>

                    </div>
    
                    <div :class="[prefixCls + '-fixed']" :style="fixedTableStyle" v-if="isLeftFixed" style="height:50px;">
                        <div :class="[prefixCls + '-fixed-header']" v-if="showHeader">
                            <table-head 
                            fixed="left" 
                            :styleObject="fixedTableStyle" 
                            :columns="leftFixedColumns" 
                            :columns-width="columnsWidth" 
                            :data="rebuildData">
                            </table-head>
                        </div>
                    </div>
                    <div :class="[prefixCls + '-fixed-right']" :style="fixedRightTableStyle" v-if="isRightFixed" style="height:50px;">
                        <div :class="[prefixCls + '-fixed-header']" v-if="showHeader">
                            <table-head 
                            fixed="right" 
                            :styleObject="fixedRightTableStyle" 
                            :columns="rightFixedColumns" 
                            :columns-width="columnsWidth" 
                            :data="rebuildData">
                            </table-head>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div :class="[prefixCls + '-bodywrap']">
            <div style="position:relative" ref="mainTable">
                <div :class="[prefixCls + '-tip']" v-show="(!rebuildData || rebuildData.length === 0)">
                    <!--无数据样式slot-->
                    <slot name="emptyData"></slot>
                </div>
                <div :class="[prefixCls + '-body']" :style="bodyStyle" ref="centerBody" @scroll="handleBodyScroll" v-show="(rebuildData && rebuildData.length >0)">
                    <table-body 
                    ref="tbody" 
                    :styleObject="tableStyle" 
                    :columns="cloneColumns" 
                    :data="rebuildData" 
                    :columns-width="columnsWidth">
                    </table-body>
                </div>
                <div :class="[prefixCls + '-fixed']" :style="fixedTableStyle" v-if="isLeftFixed" style="top:0" v-show="(rebuildData && rebuildData.length >0)">
                    <div :class="[prefixCls + '-fixed-body']" :style="fixedBodyStyle" ref="fixedBody">
                        <table-body 
                        fixed="left" 
                        :styleObject="fixedTableStyle" 
                        :columns="leftFixedColumns" 
                        :data="rebuildData" 
                        :columns-width="columnsWidth">
                        </table-body>
                    </div>
                </div>
                <div :class="[prefixCls + '-fixed-right']" :style="fixedRightBodyTableStyle" v-if="isRightFixed" style="top:0" v-show="(rebuildData && rebuildData.length >0)">
                    <div :class="[prefixCls + '-fixed-body']" :style="fixedBodyStyle" ref="fixedRightBody">
                        <table-body 
                        fixed="right" 
                        :styleObject="fixedRightBodyTableStyle" 
                        :columns="rightFixedColumns" 
                        :data="rebuildData" 
                        :columns-width="columnsWidth">
                        </table-body>
                    </div>
                </div>
            </div>
        </div>
        <div :class="[prefixCls + '-footer']" ref="footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
<script>
import tableHead from './table-head.vue';
import tableBody from './table-body.js';
import XbScrollbar from '../xb-scrollbar/main.js';
import { oneOf, getStyle, deepCopy, getScrollBarSize } from '../../utils/assist';
import { on, off } from '../../utils/dom';
import Locale from '../../mixins/locale';

const prefixCls = 'spui-table';

let rowKey = 1;
let columnKey = 1;

export default {
    name: 'Table',
    mixins: [Locale],
    components: { tableHead, tableBody },
    props: {
        data: {
            type: Array,
            default() {
                return [];
            }
        },
        columns: {
            type: Array,
            default() {
                return [];
            }
        },
        fixHeader: {
            type: Boolean,
            default: false
        },
        fixedTop: {
            type: [Number, String]
        },
        fixedScrollTop: {
            type: [Number, String]
        },
        width: {
            type: [Number, String]
        },
        height: {
            type: [Number, String]
        },
        stripe: {
            type: Boolean,
            default: false
        },
        border: {
            type: Boolean,
            default: false
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        //列头问号tooltip提示
        tipContent:{
            type:String
        },
        rowClassName: {
            type: Function,
            default() {
                return '';
            }
        },
        spanMethod: {
            type: Function,
            default() {
                return '';
            }
        },
        //默认排序参数
        defaultSort: {
            type: Object,
            default() {
                return {
                    key: '',
                    order: ''
                };
            }
        }
    },
    data() {
        return {
            ready: false,
            addFixedStyle: false,//是否添加固定表头样式
            tableWidth: 0,//表格宽度，可能超出父层宽度
            centerWidth: 0,//除去padding的表格包裹层宽度
            containerWidth:0,//$el宽度
            columnsWidth: {},
            prefixCls: prefixCls,
            rebuildData: [],
            cloneColumns: this.makeColumns(),
            bodyHeight: 0,
            bodyRealHeight: 0,
            scrollBarWidth: getScrollBarSize(),
            fixedColumnsBodyRowsHeight: [],
            selections: [],
            sortKey: this.defaultSort.key,//排序参数
            sortOrder: this.defaultSort.order || "desc"
        };
    },
    computed: {
        hasScrollBar() {
            return this.bodyHeight > 0 && this.bodyHeight < this.bodyRealHeight;
        },
        classes() {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-border`]: this.border,
                    [`${prefixCls}-stripe`]: this.stripe,
                    [`${prefixCls}-hide`]: !this.ready,
                    [`${prefixCls}-with-fixed-top`]: !!this.height
                }
            ];
        },
        styles() {
            let style = {};
            if (this.height) {
                const height = (this.isLeftFixed || this.isRightFixed) ? parseInt(this.height) + this.scrollBarWidth : parseInt(this.height);
                style.height = `${height}px`;
            }
            if (this.width) style.width = `${this.width}px`;
            return style;
        },
        tableStyle() {
            let style = {};
            if (this.tableWidth !== 0) {
                let width = '';
                if (this.bodyHeight === 0) {
                    width = this.tableWidth;
                } else {
                    if (this.bodyHeight < this.bodyRealHeight && this.tableWidth > this.centerWidth) {
                        width = this.tableWidth + this.scrollBarWidth;
                    } else {
                        width = this.tableWidth;
                    }
                }
                style.width = `${width}px`;
            }
            return style;
        },
        leftFixedColumns() {
            let left = [];
            this.cloneColumns.forEach((col) => {
                if (col.fixed && col.fixed === 'left') {
                    left.push(col);
                }
            });
            return left;
        },
        rightFixedColumns() {
            let right = [];
            this.cloneColumns.forEach((col) => {
                if (col.fixed && col.fixed === 'right') {
                    right.push(col);
                }
            });
            return right;
        },
        fixedTableStyle() {
            let style = {};
            let width = 0;
            this.cloneColumns.forEach((col) => {
                if (col.fixed && col.fixed === 'left') width += col._width;
            });
            style.width = `${width}px`;
            return style;
        },
        fixedRightTableStyle() {
            let style = {};
            let width = 0;
            this.cloneColumns.forEach((col) => {
                if (col.fixed && col.fixed === 'right') width += col._width;
            });
            if (this.hasScrollBar) {
                width += this.scrollBarWidth;
            }
            style.width = `${width}px`;
            return style;
        },
        fixedRightBodyTableStyle() {
            let style = {};
            let width = 0;
            this.cloneColumns.forEach((col) => {
                if (col.fixed && col.fixed === 'right') width += col._width;
            });
            if (this.hasScrollBar) {
                style.right = this.scrollBarWidth + "px";
            }
            style.width = `${width}px`;
            return style;
        },
        bodyStyle() {
            let style = {};
            if (this.bodyHeight !== 0) {
                // add a height to resolve scroll bug when browser has a scrollBar in fixed type and height prop
                const height = (this.isLeftFixed || this.isRightFixed) ? this.bodyHeight + this.scrollBarWidth : this.bodyHeight;
                style.height = `${height}px`;
            }
            return style;
        },
        fixedBodyStyle() {
            let style = {};
            if (this.bodyHeight !== 0) {
                let height = this.bodyHeight + this.scrollBarWidth - 1;

                // #2102 里，如果 Table 没有设置 width，而是集成父级的 width，固定列也应该不包含滚动条高度，所以这里直接计算表格宽度
                const tableWidth = parseInt(getStyle(this.$refs.mainTable, 'width')) - 1;
                if ((this.width && this.width < this.tableWidth) || tableWidth < this.tableWidth) {
                    height = this.bodyHeight;
                }
                //                    style.height = this.scrollBarWidth > 0 ? `${this.bodyHeight}px` : `${this.bodyHeight - 1}px`;
                style.height = this.scrollBarWidth > 0 ? `${height}px` : `${height - 1}px`;
            }
            return style;
        },
        isLeftFixed() {
            return this.leftFixedColumns.length;
        },
        isRightFixed() {
            return this.rightFixedColumns.length;
        },
        centerTableStyle() {
            var style = {};
            style.width = this.containerWidth + "px";
            return style;
        },
        fixedHeaderStyle() {
            var style = {};
            if (this.addFixedStyle) {
                style.position = "fixed";
                style.top = this.fixedTop + "px";
            }
            return style;
        }
    },
    methods: {
        rowClsName(index) {
            return this.rowClassName(this.data[index], index);
        },
        //计算表格内容单元格高度，处理fixed列单元格高度和表格内容单元格高度一致
        syncFixedTableRowHeight() {
            this.$nextTick(() => {
                var bodyRows = this.$refs.centerBody.querySelectorAll('tbody tr') || [];
                var fixedColumnsBodyRowsHeight = [].map.call(bodyRows, function (row) {
                    return row.getBoundingClientRect().height || 'auto';
                });
                this.fixedColumnsBodyRowsHeight = fixedColumnsBodyRowsHeight;
            });
        },
        handleResize() {
            this.$nextTick(() => {
                this.centerWidth = parseInt(getStyle(this.$refs.mainTable, 'width'));
                this.containerWidth = parseInt(getStyle(this.$el, 'width'));
                console.log(this.containerWidth);
                const allWidth = !this.columns.some(cell => !cell.width);    // 每一个列都设置宽度时，table宽度为总和
                if (allWidth) {
                    var allColumWidth = this.columns.map(cell => cell.width).reduce((a, b) => a + b);
                    this.tableWidth = allColumWidth > this.centerWidth ? allColumWidth : this.centerWidth;
                } else {
                    this.tableWidth = this.centerWidth;
                }

                this.columnsWidth = {};
                if (!this.$refs.tbody) return;
                this.$nextTick(() => {
                    let columnsWidth = {};

                    if (this.data.length) {
                        const $td = this.$refs.tbody.$el.querySelectorAll('tbody tr')[0].children;
                        for (let i = 0; i < $td.length; i++) {    // can not use forEach in Firefox
                            const column = this.cloneColumns[i];

                            let width = parseInt(getStyle($td[i], 'width'));
                            if (column.width) width = column.width;

                            this.cloneColumns[i]._width = parseInt(getStyle($td[i], 'width'));

                            columnsWidth[column._index] = {
                                width: width
                            };
                        }
                        this.columnsWidth = columnsWidth;
                    }
                                    this.$refs.scrollBar.update();
                });
                // 高度小于表格真实高度时显示纵向滚动条
                this.bodyRealHeight = parseInt(getStyle(this.$refs.tbody.$el, 'height'));
            });
        },
        handleMouseIn(_index) {
            if (this.rebuildData[_index]._hover) return;
            this.rebuildData[_index]._hover = true;
        },
        handleMouseOut(_index) {
            this.rebuildData[_index]._hover = false;
        },
        toggleSelect(row) {
            row._checked = !row._checked;
            var index = this.selections.indexOf(row);
            if (row._checked) {
                if (index === -1) {
                    this.selections.push(row);
                }
            }
            else {
                this.selections.splice(index, 1);
            }
            this.$emit('on-select', this.selections, row);
            this.$emit('on-selection-change', this.selections);
        },
        toggleExpand(_index) {
            let data = this.rebuildData[_index];
            const status = !data._expanded;
            data._expanded = status;
            this.$emit('on-expand', JSON.parse(JSON.stringify(data)), status);
        },
        selectAll(status) {
            for (const data of this.rebuildData) {
                if (data._disabled) {
                    continue;
                } else {
                    data._checked = status;
                }
            }
            this.selections = status ? deepCopy(this.rebuildData) : [];
            if (status) {
                this.$emit('on-select-all', this.selections);
            }
            this.$emit('on-selection-change', this.selections);
        },
        fixedHeader() {
            if (this.height) {
                this.$nextTick(() => {
                    const titleHeight = parseInt(getStyle(this.$refs.title, 'height')) || 0;
                    const headerHeight = parseInt(getStyle(this.$refs.header, 'height')) || 0;
                    const footerHeight = parseInt(getStyle(this.$refs.footer, 'height')) || 0;
                    this.bodyHeight = this.height - titleHeight - headerHeight - footerHeight;
                });
            } else {
                this.bodyHeight = 0;
            }
        },
        //固定表头效果
        addScrollEffect(event) {
            var t = document.documentElement.scrollTop || document.body.scrollTop;
            if (t > this.fixedScrollTop) {
                this.addFixedStyle = true;
            }
            else {
                this.addFixedStyle = false;
            }
        },
        handleBodyScroll(event) {
            if (this.isLeftFixed) this.$refs.fixedBody.scrollTop = event.target.scrollTop;
            if (this.isRightFixed) this.$refs.fixedRightBody.scrollTop = event.target.scrollTop;
        },
        //横向滚动条事件处理
        handleHorizontalScroll(event) {
            if (this.showHeader) this.$refs.header.scrollLeft = event.target.scrollLeft;
            this.$refs.centerBody.scrollLeft = event.target.scrollLeft;
        },
        handleBarScroll(scrollObj){
            if (this.showHeader) this.$refs.header[scrollObj.scroll] = scrollObj.distance;
            this.$refs.centerBody[scrollObj.scroll] = scrollObj.distance;
        },
        sortData(data, type, index) {
            if (!this.cloneColumns[index]) {
                return data;
            }
            const key = this.cloneColumns[index].key;
            data.sort((a, b) => {
                if (this.cloneColumns[index].sortMethod) {
                    return this.cloneColumns[index].sortMethod(a[key], b[key], type);
                } else {
                    if (type === 'asc') {
                        return a[key] > b[key] ? 1 : -1;
                    } else if (type === 'desc') {
                        return a[key] < b[key] ? 1 : -1;
                    }
                }
            });
            return data;
        },
        handleSort(index, type) {
            const key = this.cloneColumns[index].key;
            this.sortKey = key;
            this.sortOrder = type;
            if (this.cloneColumns[index].sortable !== 'custom') {
                this.rebuildData = this.sortData(this.rebuildData, type, index);
            }
            this.$emit('on-sort-change', {
                column: this.cloneColumns[index],
                key: key,
                order: type
            });
        },
        makeData() {
            let data = deepCopy(this.data);
            data.forEach((row, index) => {
                row._index = index;
                row._rowKey = rowKey++;
                row._hover = false;
                row._checked = row._checked || false;
                row._disabled = row._disabled || false;
                row._expanded = row._expanded || false
            });
            return data;
        },
        makeDataWithSort() {
            let data = this.makeData();
            let sortColumn = {};
            let sortIndex = -1;
            if (this.sortKey) {
                sortColumn = this.cloneColumns.filter((data, index) => data.key === this.sortKey);
            }
            if (sortColumn && sortColumn.sortable !== 'custom') {
                sortIndex = this.cloneColumns.indexOf(sortColumn);

                data = this.sortData(data, this.sortKey, sortIndex);
            }
            return data;
        },
        makeColumns() {
            let columns = deepCopy(this.columns);
            let left = [];
            let right = [];
            let center = [];

            columns.forEach((column, index) => {
                column._index = index;
                column._columnKey = columnKey++;
                column._width = column.width ? column.width : '';    // update in handleResize()

                if (column.fixed && column.fixed === 'left') {
                    left.push(column);
                } else if (column.fixed && column.fixed === 'right') {
                    right.push(column);
                } else {
                    center.push(column);
                }
            });
            return left.concat(center).concat(right);
        }
    },
    created() {
        this.rebuildData = this.makeDataWithSort();
    },
    mounted() {
        this.handleResize();
        this.fixedHeader();
        this.$nextTick(() => {
            this.ready = true
        });
        if (this.fixHeader) {
            on(window, 'scroll', this.addScrollEffect);
        }
        on(window, 'resize', this.handleResize);
    },
    beforeDestroy() {
        if (this.fixHeader) {
            off(window, 'scroll', this.addScrollEffect);
        }
        off(window, 'resize', this.handleResize);
    },
    watch: {
        data: {
            handler() {
                const oldDataLen = this.rebuildData.length;
                this.rebuildData = this.makeDataWithSort();
                this.handleResize();
                if (!oldDataLen) {
                    this.fixedHeader();
                }
            },
            deep: true
        },
        columns: {
            handler() {
                this.cloneColumns = this.makeColumns();
                // this.rebuildData = this.makeDataWithSort();
                this.handleResize();
            },
            deep: true
        },
        height() {
            this.fixedHeader();
        },
        tableWidth() {
            this.syncFixedTableRowHeight();
        }
    }
};
</script>
