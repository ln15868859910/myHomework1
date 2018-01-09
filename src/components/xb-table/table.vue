<template>
    <div :class="classes" :style="styles">
        <div :class="[prefixCls + '-headWrap']" :style="[fixedHeaderStyle,centerTableStyle]" ref="fixedHeaderEle">
            <div :class="[prefixCls + '-title']" ref="title">
                <slot name="header"></slot>
            </div>
            <div style="padding:0 20px;">
                <XbScrollbar @on-barScroll="handleBarScroll" ref="scrollBar" noresize v-show="showVerticalBar">
                    <div :style="[tableStyle]" :class="[prefixCls+'-scrollBar']"></div>
                </XbScrollbar>
                <div style="position:relative">
                    <div :class="[prefixCls + '-header']" v-if="showHeader" ref="header">
                        <table-head 
                        :styleObject="tableStyle" 
                        :columns="cloneColumns" 
                        :columns-width="columnsWidth" 
                        :hidecol="hidecolumn"
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
                            :hidecol="hidecolumn"
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
                            :hidecol="hidecolumn"
                            :data="rebuildData">
                            </table-head>
                        </div>
                    </div>
                    <div  style="position: absolute;right: -5px;top: 12px;z-index: 10;" v-if="custumcols.length">
                        <Icon  type="more" style="font-size: 25px;transform: rotate(90deg);color: #5BABE9;"  @click.native="showmore()"></Icon>
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
                    :hidecol="hidecolumn"
                    :data="rebuildData"
                    :columns-width="columnsWidth">
                    </table-body>
                </div>
                <div :class="[prefixCls + '-fixed']" :style="fixedTableStyle" v-if="isLeftFixed" style="top:0" v-show="(rebuildData && rebuildData.length >0)">
                    <div :class="[prefixCls + '-fixed-body']" :style="bodyStyle" ref="fixedBody">
                        <table-body 
                        fixed="left" 
                        :styleObject="fixedTableStyle" 
                        :columns="leftFixedColumns"
                        :hidecol="hidecolumn" 
                        :data="rebuildData" 
                        :columns-width="columnsWidth">
                        </table-body>
                    </div>
                </div>
                <div :class="[prefixCls + '-fixed-right']" :style="fixedRightBodyTableStyle" v-if="isRightFixed" style="top:0" v-show="(rebuildData && rebuildData.length >0)">
                    <div :class="[prefixCls + '-fixed-body']" :style="bodyStyle" ref="fixedRightBody">
                        <table-body 
                        fixed="right" 
                        :styleObject="fixedRightBodyTableStyle" 
                        :columns="rightFixedColumns" 
                        :data="rebuildData"
                        :control="control"
                        :columns-width="columnsWidth">
                        </table-body>
                    </div>
                </div>
            </div>
        </div>
        <div :class="[prefixCls + '-footer']" ref="footer">
            <slot name="footer"></slot>
        </div>
        <custom-pop v-model="showmoretag" :data="custumcols" @showcol="confirmshowcol"></custom-pop>
    </div>
</template>
<script>
import tableHead from './table-head.vue';
import tableBody from './table-body.js';
import customPop from './custom-pop.vue';
import XbScrollbar from '../xb-scrollbar/main.js';
import { oneOf, getStyle, deepCopy, getScrollBarSize } from '../../utils/assist';
import { on, off } from '../../utils/dom';
import Locale from '../../mixins/locale';
import Emitter from '../../mixins/emitter';

const prefixCls = 'spui-table';

let rowKey = 1;
let columnKey = 1;

export default {
    name: 'Table',
    mixins: [Locale,Emitter],
    components: { tableHead, tableBody, customPop },
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
        control:{//操作列
            type: Array,
            default() {
                return [];
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
            showmoretag:false,
            custumcols: this.makeCustomColumns(),
            hidecolumn:[],  //隐藏的列
            sortKey: this.defaultSort.key,//排序参数
            sortOrder: this.defaultSort.order || "desc"
        };
    },
    computed: {
        hasScrollBar() {
            return this.bodyHeight > 0 && this.bodyHeight < this.bodyRealHeight;
        },
        showVerticalBar(){
            return this.tableWidth > this.centerWidth;
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
                    if (this.hasScrollBar && this.tableWidth > this.centerWidth) {
                        width = this.tableWidth;
                    } else {
                        width = this.tableWidth - this.scrollBarWidth;
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
                const height = this.bodyHeight;
                style.height = `${height}px`;
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
        showmore(){
            this.showmoretag = true;
        },
        confirmshowcol(data){
            // console.log(data);
            this.hidecolumn = data;
            this.handleResize();
            this.$nextTick(() => {
                this.broadcast('TableCell', 'on-change-overflow');
            });
        },
        handleResize() {
            this.$nextTick(() => {
                this.centerWidth = parseInt(getStyle(this.$refs.mainTable, 'width'));
                this.containerWidth = parseInt(getStyle(this.$el, 'width'));
                const allWidth = !this.columns.some(cell => !cell.width);    // 每一个列都设置宽度时，table宽度为总和
                if (allWidth) {
                    var allColumWidth = this.columns.map(cell => {
                        if(this.hidecolumn.indexOf(cell.key)==-1){
                            return cell.width;
                        }else{
                            return 0;
                        }
                    }).reduce((a, b) => a + b);
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
                column._width = column.width ? column.width : ''; 

                if (column.fixed && column.fixed === 'left') {
                    left.push(column);
                } else if (column.fixed && column.fixed === 'right') {
                    right.push(column);
                } else {
                    center.push(column);
                }
            });
            if(this.control.length){
                right.push({
                    title:'操作',
                    type:'control',
                    width:this.control.length>1?140:80,
                    fixed:'right',
                    handleArr:this.control,
                    _columnKey:columnKey++,
                    _index:columns.length,
                    _width:''
                });
            }
            return left.concat(center).concat(right);
        },
        makeCustomColumns(){
            let columns = deepCopy(this.columns);
            let custumcols = [];
            columns.forEach((column)=>{
                if(column.custom){
                    custumcols.push({
                        title:column.title,
                        key:column.key,
                        show:column.show
                    });
                }
            });
            return custumcols;
        }
    },
    created() {
        this.rebuildData = this.makeDataWithSort();
    },
    mounted() {
        this.handleResize();
        this.fixedHeader();
        this.$nextTick(() => {
            this.ready = true;
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
