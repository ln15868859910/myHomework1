 import Cell from './cell.vue';
 import Expand from './expand.js';
 import Mixin from './mixin';
 import { hasClass, addClass, removeClass } from '../../utils/dom';

 export default {
     name: 'TableBody',
     mixins: [Mixin],
     components: {
         Cell,
         Expand
     },
     props: {
         styleObject: Object,
         columns: Array,
         data: Array, // rebuildData
         columnsWidth: Object,
         fixed: {
             type: [Boolean, String],
             default: false
         },
         control:{
             type:Array,
             default(){
                 return [];
             }
         },
         outhidecol:Array,
         hidecol:{
             type:Array,
             default(){
                 return [];
             }
         }
     },
     data() {
         return {
             prefixCls: 'spui-table'
         }
     },
     render(h) {
         var that = this;
         return h('table', {
             domProps: {
                 cellSpacing: "0",
                 cellPadding: "0",
                 border: "0"
             },
             style: that.styleObject,
         }, [
             h('colgroup', [
                 that.columns.map(function (column, columnIndex) {
                     return h('col', {
                         style: !that.checkifhide(column)?'display:none':'display:table-column',
                         domProps: {
                             width: that.setCellWidth(column, columnIndex, false)
                         }
                     });
                 })
             ]),
             h('tbody', {
                 class: [that.prefixCls + '-tbody']
             }, [
                 that.data.map(function (row, rowIndex) {
                     return [h('tr', {
                         class: that.rowClasses(rowIndex),
                         style: that.trStyles(rowIndex),
                         key: row._rowkey,
                         on: {
                             mouseenter: ($event) => {
                                 that.handleMouseIn(rowIndex,$event)
                             },
                             mouseleave: ($event) => {
                                 that.handleMouseOut(rowIndex,$event)
                             }
                         }
                     }, [
                         that.columns.map(function (column, columnIndex) {
                             const {
                                 rowspan,
                                 colspan
                             } = that.getSpan(row, column, rowIndex, columnIndex);
                             if (rowspan || colspan) {
                                 return h('td', {
                                     class: that.alignCls(column, row,rowspan),
                                     style: !that.checkifhide(column)?'display:none':'display:table-cell',
                                     domProps: {
                                         rowSpan: rowspan,
                                         colSpan: colspan
                                     }
                                 }, [
                                     h(Cell, {
                                         props: {
                                             fixed: that.fixed,
                                             row: row,
                                             column: column,
                                             key: column._columnKey,
                                             naturalIndex: rowIndex,
                                             index: row._index,
                                             checked: that.rowChecked(rowIndex),
                                             disabled: that.rowDisabled(rowIndex),
                                             expanded: that.rowExpanded(rowIndex),
                                         }
                                     })
                                 ])
                             }
                         })
                     ]),
                     that.rowExpanded(rowIndex)?
                         h('tr', {
                             class: {
                                 [that.prefixCls + '-expanded-hidden']: that.fixed
                             },
                         }, [
                             h('td', {
                                 domProps: {
                                     colSpan: that.columns.length
                                 },
                                 class: that.prefixCls + '-expanded-cell'
                             }, [
                                 h(Expand, {
                                     key:row._rowKey,
                                     props: {
                                         row: row,
                                         render: that.expandRender,
                                         index: row._index
                                     }
                                 })
                             ])
                         ]):""
                     ]
                 })
             ])
         ])
     },
     computed: {
         expandRender() {
             let render = function () {
                 return '';
             };
             for (let i = 0; i < this.columns.length; i++) {
                 const column = this.columns[i];
                 if (column.type && column.type === 'expand') {
                     if (column.render) render = column.render;
                 }
             }
             return render;
         }
     },
     methods: {
         //处理合并行列
         getSpan(row, column, rowIndex, columnIndex) {
             let rowspan = 1;
             let colspan = 1;

             const fn = this.$parent.spanMethod;
             if (typeof fn === 'function') {
                 const result = fn(
                     row,
                     column,
                     rowIndex,
                     columnIndex
                 );
                 if (result) {
                     rowspan = result.rowspan;
                     colspan = result.colspan;
                 }
             }
             return {
                 rowspan,
                 colspan
             };
         },
         //固定表格单元格高度设置与中间表格高度一致
         trStyles(_index) {
             var style = {};
             if (this.fixed && this.$parent.fixedColumnsBodyRowsHeight.length) {
                 const trHeight = this.$parent.fixedColumnsBodyRowsHeight[_index];
                 style.height = `${trHeight}px`;
             }
             return style;
         },
         rowClasses(_index) {
             return [
                 `${this.prefixCls}-row`,
                 this.rowClsName(_index)
             ];
         },
         rowClsName(_index) {
             return this.$parent.rowClassName(this.data[_index], _index);
         },
         rowChecked(_index) {
             return this.data[_index]._checked;
         },
         rowDisabled(_index) {
             return this.data[_index]._disabled;
         },
         rowExpanded(_index) {
             return this.data[_index] && this.data[_index]._expanded;
         },
         checkifhide(column){
             return this.outhidecol.indexOf(column.key)==-1&&this.hidecol.indexOf(column.key)==-1;
         },
         handleMouseIn(_index,event) {
             this.$parent.handleMouseIn(_index,event);
         },
         handleMouseOut(_index,event) {
             this.$parent.handleMouseOut(_index,event);
         }
     },
     watch:{
           "$parent.currentHoverRow"(newVal, oldVal) {
            const el = this.$el;
            if (!el) return;
            const tr = el.querySelector('tbody').children;
            const rows = [].filter.call(tr, row => hasClass(row, `${this.prefixCls}-row`));
            const oldRow = rows[oldVal];
            const newRow = rows[newVal];
            if (oldRow) {
                removeClass(oldRow, `${this.prefixCls}-row-hover`);
            }
            if (newRow) {
                addClass(newRow, `${this.prefixCls}-row-hover`);
            }
        }
     }
 };