 import Cell from './cell.vue';
 import Expand from './expand.js';
 import Mixin from './mixin';

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
         hidecol:Array
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
                         style: that.hidecol.indexOf(column.key)>-1?'display:none':'display:table-column',
                         domProps: {
                             width: that.setCellWidth(column, columnIndex, false)
                         }
                     })
                 })
             ]),
             h('tbody', {
                 class: [that.prefixCls + '-tbody']
             }, [
                 that.data.map(function (row, rowIndex) {
                     return [h('tr', {
                         class: that.rowClasses(rowIndex),
                         style: that.trStyles(row,rowIndex),
                         on: {
                             mouseenter: () => {
                                 that.handleMouseIn(rowIndex)
                             },
                             mouseleave: () => {
                                 that.handleMouseOut(rowIndex)
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
                                     class: that.alignCls(column, row),
                                     style: that.hidecol.indexOf(column.key)>-1?'display:none':'display:table-cell',
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
                 this.rowClsName(_index), {
                     [`${this.prefixCls}-row-hover`]: this.data[_index] && this.data[_index]._hover
                 }
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
             return this.hidecol.indexOf(column.key)==-1;
         },
         handleMouseIn(_index) {
             this.$parent.handleMouseIn(_index);
         },
         handleMouseOut(_index) {
             this.$parent.handleMouseOut(_index);
         }
     }
 };