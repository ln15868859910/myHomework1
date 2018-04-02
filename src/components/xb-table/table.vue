<template>
    <div :class="classes">
        <div :class="[prefixCls + '-headWrap']" :style="[fixedHeaderStyle]" ref="fixedHeaderEle">
            <div :class="[prefixCls + '-title']" ref="title">
                <slot name="header"></slot>
            </div>
            <div :class="[prefixCls + '-tableWrap',custumClass.tableWrap]">
                <XbScrollbar @on-barScroll="handleBarScroll" ref="scrollBar" v-show="showVerticalBar" :view-style="{'float':'left'}">
                    <div :style="[tableStyle]" :class="[prefixCls+'-scrollBar']"></div>
                </XbScrollbar>
                <div style="position:relative" :class="[prefixCls + '-tableHead']">
                    <div :class="[prefixCls + '-header']" v-if="showHeader" ref="header" :style="centerHeaderStyle">
                        <table-head 
                        :styleObject="tableStyle" 
                        :columns="cloneColumns" 
                        :columns-width="columnsWidth" 
                        :data="rebuildData">
                        </table-head>
                    </div>
                    <div :class="[prefixCls + '-fixed']" :style="fixedTableStyle" v-if="isLeftFixed && showHeader">
                        <table-head 
                        fixed="left" 
                        :styleObject="fixedTableStyle" 
                        :columns="leftFixedColumns" 
                        :columns-width="columnsWidth" 
                        :data="rebuildData">
                        </table-head>
                    </div>
                    <div :class="[prefixCls + '-fixed-right']" :style="fixedRightWrapStyle" v-if="isRightFixed && showHeader">
                        <table-head 
                        fixed="right" 
                        :styleObject="fixedRightTableStyle" 
                        :columns="rightFixedColumns" 
                        :columns-width="columnsWidth"
                        :data="rebuildData">
                        </table-head>
                    </div>
                    <div v-show="resizetag" :class="[prefixCls+'-resize-line']" ref="resizeline"></div>
                    <div :class="[prefixCls + '-showmore']" v-show="custumcols.length">
                        <Icon type="more" :class="[prefixCls + '-showmore-icon']" @click.native="showmore()"></Icon>
                    </div>
                    <div :class="[prefixCls + '-gutter']" :style="{width:scrollBarWidth+'px'}" v-if="hasScrollBar"></div>
                </div>
            </div>
        </div>
        <div :class="[prefixCls + '-bodywrap',custumClass.bodywrap]" :style="bodyWrapStyle">
            <div style="position:relative" ref="mainTable" :style="bodyStyle">
                <div :class="[prefixCls + '-tip']" v-show="(!rebuildData || rebuildData.length === 0)">
                    <!--无数据样式slot-->
                    <slot name="emptyData"></slot>
                </div>
                <div :class="[prefixCls + '-body']" ref="centerBody" @scroll="handleBodyScroll" v-show="(rebuildData && rebuildData.length >0)">
                    <table-body 
                    ref="tbody" 
                    :styleObject="tableStyle" 
                    :columns="cloneColumns" 
                    :data="rebuildData"
                    :columns-width="columnsWidth">
                    </table-body>
                </div>
                <div :class="[prefixCls + '-fixed']" :style="fixedTableStyle" v-if="isLeftFixed" style="top:0" v-show="(rebuildData && rebuildData.length >0)">
                    <div :class="[prefixCls + '-fixed-body-inner']" @scroll="handleBodyScroll" ref="fixedBody">
                    <table-body 
                    fixed="left" 
                    :styleObject="fixedTableStyle" 
                    :columns="leftFixedColumns"
                    :data="rebuildData" 
                    :columns-width="columnsWidth">
                    </table-body>
                    </div>
                </div>
                <div :class="[prefixCls + '-fixed-right']" :style="fixedRightWrapStyle" v-if="isRightFixed" style="top:0" v-show="(rebuildData && rebuildData.length >0)">
                    <div :class="[prefixCls + '-fixed-body-inner']" @scroll="handleBodyScroll" ref="fixedRightBody">
                    <table-body 
                    fixed="right" 
                    :styleObject="fixedRightTableStyle" 
                    :columns="rightFixedColumns" 
                    :data="rebuildData"
                    :control="control"
                    :columns-width="columnsWidth">
                    </table-body>
                    </div>
                </div>
                <div v-show="resizetag" :class="[prefixCls+'-resize-line']" ref="resizeline2"></div>
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
import { getStyle, deepCopy, getScrollBarSize } from '../../utils/assist';
import { throttle } from '../../utils/throttle';
import { on, off } from '../../utils/dom';
import Locale from '../../mixins/locale';

const prefixCls = 'spui-table';

let rowKey = 1;
let columnKey = 1;

export default {
    name: 'XbTable',
    mixins: [Locale],
    components: { tableHead, tableBody, customPop, XbScrollbar },
    props: {
        data: {
            type: Array,
            default() {
                return [];
            }
        },
        pkey:{
            type:String|Array,
            default:'Id'
        },
        selectedPkeys:{
            type:Array,
            default() {
                return [];
            }
        },
        name:String,
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
        //固定表头时到顶部的距离
        fixedTop: {
            type: [Number, String]
        },
        //body滚动条到顶部的距离
        fixedScrollTop: {
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
        control: {//操作列
            type: Object,
            default() {
                return {
                    isDrop: true,
                    width: 60,
                    options: []
                }
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
        },
        //是否在弹窗中使用
        modal: {
            type: Boolean,
            default: false
        },
        //自定义样式
        custumClass: {
            type: Object,
            default() {
                return {};
            }
        },
        //是否可拖拽修改宽度
        resizeable: {
            type: Boolean,
            default: false
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
            custumcols:[],
            cloneColumns: [],
            leftFixedColumns:[],
            rightFixedColumns:[],
            bodyHeight: 0,
            bodyRealHeight: 0,
            scrollBarWidth: getScrollBarSize(),
            fixedColumnsBodyRowsHeight: [],
            selections: [],
            selectionPkeys: [],
            propselectedPkeys:[],
            showmoretag:false,
            sortKey: this.defaultSort.key,//排序参数
            sortOrder: this.defaultSort.order || 'desc',
            lastScrollTop:0,
            currentHoverRow:-1,
            currentClickRow:-1,
            selectTriggerByRow:false,
            isRadio: false,
            resizetag:false,
            draglineleft:0,
            expandArr: []
        };
    },
    computed: {
        isControlDrop(){
            if ("isDrop" in this.control) {
                return this.control.isDrop;
            }
            return true;
        },
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
                    [`${prefixCls}-with-fixed-top`]: !!this.height,
                    [`${prefixCls}-with-gutter`]: this.hasScrollBar,
                    [`${prefixCls}-in-modal`]: this.modal,
                    [`${prefixCls}-not-modal`]: !this.modal,
                    [`${prefixCls}-with-vertical-bar`]: this.showVerticalBar
                }
            ];
        },
        tableStyle() {
            let style = {};
            if (this.tableWidth !== 0) {
                let width = '';
                if (this.bodyHeight === 0) {
                    width = this.tableWidth;
                } else {
                    if (this.hasScrollBar) {
                        width = this.tableWidth - this.scrollBarWidth;
                    } else {
                        width = this.tableWidth;
                    }
                }
                style.width = `${width}px`;
            }
            return style;
        },
        fixedTableStyle() {
            let style = {};
            let width = 0;
            this.leftFixedColumns.forEach((col) => {
                if(col.show) width += col._width;
            });
            style.width = `${width}px`;
            return style;
        },
        centerHeaderStyle() {
            let style = {};
            if (this.hasScrollBar) {
                let width = this.centerWidth - this.scrollBarWidth;
                style.width = `${width}px`;
            }
            return style;
        },
        fixedRightWrapStyle() {
            let style = {};
            let width = 0;
            this.rightFixedColumns.forEach((col) => {
                if (col.show) width += col._width;
            });
            if (this.hasScrollBar) {
                width += this.scrollBarWidth;
            }
            style.width = `${width}px`;
            return style;
        },
        fixedRightTableStyle() {
            let style = {};
            let width = 0;
            this.rightFixedColumns.forEach((col) => {
                if (col.show) width += col._width;
            });
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
            return this.leftFixedColumns.filter(col=>col.show).length;
        },
        isRightFixed() {
            return this.rightFixedColumns.filter(col=>col.show).length;
        },
        fixedHeaderStyle() {
            var style = {};
            if (this.addFixedStyle) {
                style.position = 'fixed';
                style.top = this.fixedTop + 'px';
                style.width = this.containerWidth + "px";
            }
            return style;
        },
        bodyWrapStyle(){
            var style = {};
            if (this.addFixedStyle) {
                style.marginTop = this.$refs.fixedHeaderEle.getBoundingClientRect().height + 'px';
            }
            if (!this.rebuildData.length) {
                style.paddingBottom = 0;
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
            if(!this.isLeftFixed && !this.isRightFixed){
                return;
            }
            this.$nextTick(() => {
                var bodyRows = this.$refs.centerBody.querySelectorAll('tbody tr') || [];
                var fixedColumnsBodyRowsHeight = [].map.call(bodyRows, function (row) {
                    return row.offsetHeight && row.offsetHeight<2000? row.offsetHeight:'auto';
                });
                this.fixedColumnsBodyRowsHeight = fixedColumnsBodyRowsHeight;
            });
        },
        showmore(){
            this.showmoretag = true;
        },
        confirmshowcol(data,colobj){
            this.resetCustomShow(data);
            this.setLocalData(data,colobj);
            this.handleResize();
            this.changeCustomdata(data);
            this.$emit('on-custom-change', data);
        },
        changeCustomdata(data){
            this.custumcols.forEach((item)=>{
                if(data.indexOf(item.key)>-1){
                    item.show = false;
                }else{
                    item.show = true;
                }
            });
        },
        resetCustomShow(data){
            this.cloneColumns.forEach((column, index) => {
                if(column.custom){
                    column.show = true;
                    if(data.indexOf(column.key)>-1){
                        column.show = false;
                    }
                }
            });
        },
        doLayout() {
            var allColumWidth = this.cloneColumns.map(cell => {
                    if (cell.show) {
                        return cell.width;
                    } else {
                        return 0;
                    }
                }).reduce((a, b) => a + b);
            this.tableWidth = allColumWidth > this.centerWidth ? allColumWidth : this.centerWidth;
            this.columnsWidth = {};
            if (!this.$refs.tbody) return;
            this.$nextTick(() => {
                let columnsWidth = {};
                let $td = [];
                if (this.data.length) {
                    $td = this.$refs.tbody.$el.querySelectorAll('tbody tr')[0].children;
                }
                else {
                    $td = this.$refs.header.querySelectorAll('thead tr')[0].children;
                }
                for (let i = 0; i < $td.length; i++) {
                    const column = this.cloneColumns[i];
                    let width = parseInt(getStyle($td[i], 'width'));
                    this.cloneColumns[i]._width = width || 0;
                    columnsWidth[column._index] = {
                        width: column.width ? column.width : width
                    };
                }
                this.columnsWidth = columnsWidth;
                this.syncFixedTableRowHeight();
            });
            // 高度小于表格真实高度时显示纵向滚动条
            this.bodyRealHeight = parseInt(getStyle(this.$refs.tbody.$el, 'height'));
        },
        handleResize() {
            this.$nextTick(() => {
                this.centerWidth = parseInt(getStyle(this.$refs.mainTable, 'width'));
                this.containerWidth = parseInt(getStyle(this.$el, 'width'));
                this.throttleLayout();
            });
        },
        handleMouseIn(_index, event) {
            this.currentHoverRow = _index;
            this.$emit('row-mouse-enter', this.rebuildData[_index], event);
        },
        handleMouseOut(_index, event) {
            this.currentHoverRow = -1;
            this.$emit('row-mouse-out', this.rebuildData[_index], event);
        },
        setCurrentRow(_index,data){
            this.currentClickRow = _index;
            if(this.isRadio){
                this.selections = [data];
                this.selectionPkeys = [data._pkey];
                this.$emit('on-select', this.selections, data);
                this.$emit('on-selection-change', this.selections);
            }
            this.clickCurrentRow(data);
        },
        clickCurrentRow(data){
            if(this.selectTriggerByRow){
                this.toggleSelect(data);
            }
            this.$emit('on-row-click', data);
        },
        changeByitem(data){//未添加 preselect
            this.selectTriggerByRow = true;
            this.clickCurrentRow(data);
            this.selectTriggerByRow = false;
        },
        changeBypKey(pkey){//未添加 preselect
            this.selectTriggerByRow = true;
            this.clickCurrentRow({_pkey:pkey});
            this.selectTriggerByRow = false;
        },
        clearSelection(){
            let columns = this.cloneColumns[0];
            let preselectfn = typeof columns.preselect =='function'?columns.preselect:undefined;
            let unpasspkeys = [],unpassselections = [];
            for (let i = 0; i < this.selections.length; i++) {
                let data = this.selections[i];
                if(preselectfn&&!preselectfn(data,false,'all')){
                    unpasspkeys.push(data._pkey);
                    unpassselections.push(data);
                }
            }
            this.selectionPkeys = unpasspkeys;
            this.selections = unpassselections;
            this.$emit('on-selection-change', this.selections);
        },
        getSelections(){
            return this.selections;
        },
        getpropSelectedData(){
            return this.selectedPkeys.slice(0);
        },
        getPkey(row){
            if(Array.isArray(this.pkey)){
                let keyarr = [];
                this.pkey.split(',').forEach((k)=>{
                    keyarr.push(row[k]);
                });
                return keyarr.join('_')||rowKey++;
            }else{
                return row[this.pkey]||rowKey++;
            }
        },
        toggleSelect(row) {
            var pky = row._pkey;
            var index = this.selectionPkeys.indexOf(pky);
            if (index === -1) {
                this.selections.push(row);
                this.selectionPkeys.push(pky);
            }else {
                this.selections.splice(index, 1);
                this.selectionPkeys.splice(index, 1);
            }
            this.$emit('on-select', this.selections, row);
            this.$emit('on-selection-change', this.selections);
        },
        toggleExpand(index) {
            let data = this.data[index];
            let expandData = this.expandArr[index];
            const status = !expandData.expanded;
            expandData.expanded = status;
            this.$emit('on-expand', JSON.parse(JSON.stringify(data)), status);
        },
        selectAll(status) {
            let columns = this.cloneColumns[0];
            let preselectfn = typeof columns.preselect =='function'?columns.preselect:undefined;
            for (let i = 0; i < this.rebuildData.length; i++) {
                let data = this.rebuildData[i];
                if (data._disabled) {
                    continue;
                } else {
                    let pk = data._pkey;
                    let index = this.selectionPkeys.indexOf(pk);

                    if(status){
                        
                        if(index===-1&&(preselectfn&&preselectfn(data,true,'all')||!preselectfn)){
                            this.selectionPkeys.push(pk);
                            this.selections.push(data);
                        }
                    }else{
                        if(index!==-1&&(preselectfn&&preselectfn(data,false,'all')||!preselectfn)){
                            this.selectionPkeys.splice(index,1);
                            this.selections.splice(index,1);
                        }
                    }
                }
            }

            this.$emit('on-select-all', this.selections,status);
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
        handleBodyScroll:throttle(function(event) {
            if (this.lastScrollTop !== event.target.scrollTop) {
                if (this.isLeftFixed && event.target !== this.$refs.fixedBody) this.$refs.fixedBody.scrollTop = event.target.scrollTop;
                if (this.isRightFixed && event.target !== this.$refs.fixedRightBody) this.$refs.fixedRightBody.scrollTop = event.target.scrollTop;
                if (event.target !== this.$refs.centerBody) this.$refs.centerBody.scrollTop = event.target.scrollTop;
            }
            this.lastScrollTop = event.target.scrollTop;
            this.$emit('on-scroll', event);
            var scrollTop = event.target.scrollTop;
            var scrollHeight = event.target.scrollHeight;
            var offsetHeight =  event.target.offsetHeight;
            if (scrollTop > (scrollHeight - offsetHeight)-120) {
                this.$emit('on-load-more', event);
            }
        },10),
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
                    return this.cloneColumns[index].sortMethod(a, b, key,type);
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
            let data = this.data.slice(0);
            this.expandArr=[];
            data.forEach((row, index) => {
                row._index = index;
                row._rowKey = rowKey++;
                row._pkey = this.getPkey(row);   //数据唯一k
                row._disabled = row._disabled || false;
                row._expanded = row._expanded || false;
                if(this.propselectedPkeys.indexOf(row._pkey)>-1&&this.selectionPkeys.indexOf(row._pkey)==-1){//默认值处理
                    this.selections.push(row);
                    this.selectionPkeys.push(row._pkey);
                }
                this.expandArr.push({
                    expanded: row._expanded
                });
            });
            this.propselectedPkeys = [];
            return data;
        },
        makeDataWithSort() {
            this.propselectedPkeys = this.getpropSelectedData();
            let data = this.makeData();
            let isCustom = false;
            let sortIndex = -1;
            if (this.sortKey) {
                for (let i = 0; i < this.cloneColumns.length; i++) {
                    if (this.cloneColumns[i].key === this.sortKey) {
                        sortIndex = i;
                        isCustom = this.cloneColumns[i].sortable === 'custom';
                        break;
                    }
                }
            }
            if (!isCustom) {
                data = this.sortData(data, this.sortOrder, sortIndex);
            }
            if(this.selectedPkeys.length){
                this.$emit('on-selection-change', this.selections);
            }
            return data;
        },
        makeColumns() {
            let columns = deepCopy(this.columns);
            let custumcols=[];
            let left = [];
            let right = [];
            let center = [];
            if(this.control.options.length){
                columns.push({
                    title:'操作',
                    type:'control',
                    width:this.control.width || 60,
                    fixed:'right',
                    align:'left',
                    handleArr:this.control.options
                });
            }
            //取持久化自定义隐藏数据 并重置现有数据
            let storgedata = this.getLocalData();
            //取持久化自定义列宽数据 并重置现有数据
            let storgeWidth = this.getLocalData('width');
            columns.forEach((column, index) => {
                column._index = index;
                column._columnKey = columnKey++;
                column.width = column.width || 80;
                column._width = column.width ? column.width : '';
                column.defaultwidth = column.width;
                column.show = ("show" in column) ? column.show : true;
                column.renderType="normal";
                if(column.type && column.type!=="link"){
                    column.renderType=column.type;
                }
                else if(column.render){
                    column.renderType="selfRender";
                }
                if (column.type === "selection") {
                    this.selectTriggerByRow = column.triggerType === "row";
                }
                if (column.type === "radio") {
                    this.isRadio = true;
                }
                if(column.custom){
                    if(column.key in storgedata){
                        column.show = storgedata[column.key];
                    }
                    custumcols.push({
                        key:column.key,
                        title:column.title,
                        show:column.show
                    });
                }
                if (column.key in storgeWidth) {
                    column.width = storgeWidth[column.key]
                }
                if (column.fixed && column.fixed === 'left') {
                    left.push(column);
                } else if (column.fixed && column.fixed === 'right') {
                    right.push(column);
                } else {
                    center.push(column);
                }
            });
            this.custumcols = custumcols;
            this.leftFixedColumns = left;
            this.rightFixedColumns = right;
            this.cloneColumns = left.concat(center).concat(right);
        },
        setLocalData(data,colobj,type=''){
            if(this.name){
                localStorage.setItem('table'+this.name+type,JSON.stringify(colobj));
            }
        },
        getLocalData(type=''){
            let data;
            if(this.name){
                data = JSON.parse(localStorage.getItem('table'+this.name+type));
            }
            return data||{};
        },
        saveColumnWidth(){
            var widthData={};
            this.cloneColumns.forEach((item,index)=>{
                widthData[item.key]=item.width;
            })
            this.setLocalData(widthData,widthData,'width');
        }
    },
    created() {

        this.makeColumns();
        this.rebuildData = this.makeDataWithSort();
        this.throttleLayout= throttle(this.doLayout,200);
    },
    mounted() {
        this.fixedHeader();
        this.handleResize();
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
                this.makeColumns();
                this.handleResize();
            },
            deep: true
        },
        height() {
            this.fixedHeader();
        },
        addFixedStyle(val) {
            this.$emit('on-fixed-change', val);
            if(val){
                this.containerWidth = parseInt(getStyle(this.$el, 'width'));
            }
        }
    }
};
</script>
