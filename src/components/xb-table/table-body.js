import Expand from './expand.js';
import Mixin from './mixin';
import { hasClass, addClass, removeClass } from '../../utils/dom';

import ControlCell from './control-cell';
import InputCell from './input-cell';
import Icon from '../icon/icon.vue';
import Checkbox from '../checkbox/checkbox.vue';

const column_map={
    index:{
        render (h,rowIndex,row,column) {
            return h('span',rowIndex + 1)
        }
    },
    selection:{
        render (h,rowIndex,row,column){
            var that=this;
            return h('label',{
                class:[
                    'ivu-checkbox-wrapper',
                    that.rowChecked(rowIndex)?'ivu-checkbox-wrapper-checked':''
                ]
            },[h('span',{
                class:[
                    'ivu-checkbox',
                    that.rowChecked(rowIndex)?'ivu-checkbox-checked':''
                ]
            },[
                h('span',{class:'ivu-checkbox-inner'}),
                h('input',{
                    attrs:{
                        type:'checkbox',
                    },
                    class:'ivu-checkbox-input',
                    on:{
                        'click':function(){
                            let status = !that.rowChecked(rowIndex);//变化的目标
                            if(typeof column.preselect == 'function'){
                                if(column.preselect(row,status,'one')){
                                    that.$parent.toggleSelect(row);
                                }
                            }else{
                                that.$parent.toggleSelect(row);
                            }
                        }
                    }
                })
            ])]);
        }
    },
    normal:{
        render(h, rowIndex, row, column) {
            return h('span', row[column.key])
        }
    },
    selfRender:{
        render(h, rowIndex, row, column) {
            return h('Expand', {
                props: {
                    row: row,
                    column: column,
                    index: row._index,
                    render: column.render
                }
            })
        }
    },
    radio:{
        render (h,rowIndex,row,column){
            return h('span',{
                class:this.prefixCls+'-radio-box'
            },[
                h('Icon',{
                    props:{
                        type:"checkmark",
                        size:22
                    }
                })
            ])
        }
    },
    expand:{
        render (h,rowIndex,row,column){
            var that=this;
            if(row._disableExpand){
                return "";
            }
            return h('div',{
                class:[this.prefixCls+'-cell-expand',this.rowExpanded(row._index)?this.prefixCls+'-cell-expand-expanded':''],
                on:{
                    click:function(){that.$parent.toggleExpand(row._index)}
                }
            },[h('Icon',{
                props:{
                    type:"ios-arrow-right"
                }
            })])
        }
    },
    input:{
        render(h, rowIndex, row, column) {
            return h('Input-cell', {
                props: {
                    row: row,
                    column: column,
                    index: row._index,
                    render: column.render
                }
            })
        }
    },
    control:{
        render(h, rowIndex, row, column) {
            return h('Control-cell', {
                props: {
                    row: row,
                    column: column,
                    index: row._index,
                    render: column.render
                }
            })
        }
    }
}

export default {
    name: 'TableBody',
    mixins: [Mixin],
    components: {
        Expand,
        Icon,
        Checkbox, ControlCell, InputCell
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
        control:Object
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
                        style: !column.show?'display:none':'display:table-column',
                        domProps: {
                            width: that.setCellWidth(column)
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
                            },
                            click:($event)=>{
                                if(typeof that.columns[0].preselect == 'function'&&that.columns[0].preselect(row)||!that.columns[0].preselect){
                                    that.clickCurrentRow(rowIndex,row)
                                }
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
                                    class: [that.alignCls(column, false,row),column.type==='link'?`${that.prefixCls}-link-hover`:''],
                                    style: {
                                        'display':!column.show?'none':'table-cell',
                                        'border-bottom-color':that.rowExpanded(row._index)?'#5295e7':'#d4dfe5'
                                    },
                                    key: column._columnKey,
                                    domProps: {
                                        rowSpan: rowspan,
                                        colSpan: colspan
                                    },
                                    on:{
                                        click:($event)=>{
                                            if(column.type==='link'){
                                                if($event.target.nodeName==='TD'){
                                                    var link = $event.target.querySelector('a');
                                                    if(link){
                                                        link.click();
                                                        $event.stopPropagation();
                                                        $event.preventDefault();    
                                                    }
                                                }
                                            }
                                            
                                        }
                                    }
                                }, [
                                    h('div',{
                                        class:[that.prefixCls+'-cell',column.breakWord?that.prefixCls+'-cell-noEllipsis':'',column.type==='expand'?that.prefixCls+'-cell-with-expand':''],
                                        style:that.ellipsisStyle(column),
                                        on: {
                                            mouseenter: ($event) => {
                                                if (column.showOverflowTip) {
                                                    var target = $event.target;
                                                    if (target.offsetWidth < target.scrollWidth || target.offsetHeight < target.scrollHeight) {
                                                        target.title = row[column.key];
                                                    }
                                                }
                                            },
                                            mouseleave: ($event) => {
                                                var target = $event.target;
                                                target.title = "";
                                            }
                                        },
                                    },[
                                        column_map[column.renderType].render.call(that,h,rowIndex,row,column)
                                    ])
                                ]
                                )
                            }
                        })
                    ]),
                        that.rowExpanded(row._index)?
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
        ellipsisStyle(column) {
            let style = {};
            if (column.breakWord && column.lineClamp) {
                style.display = "-webkit-box";
                style.webkitBoxOrient = "vertical";
                style.webkitLineClamp = column.lineClamp;
                style.maxHeight = 24 * column.lineClamp + "px";
            }
            return style;
        },
        rowClasses(_index) {
            return [
                `${this.prefixCls}-row`,
                this.rowClsName(_index),
                this.rowChecked(_index)?`${this.prefixCls}-row-checked`:''
            ];
        },
        rowClsName(_index) {
            return this.$parent.rowClassName(this.data[_index], _index);
        },
        rowChecked(_index) {
        //  return this.data[_index]._checked;
            return this.$parent.selectionPkeys.indexOf(this.data[_index]._pkey)>-1 ;
        },
        rowDisabled(_index) {
            return this.data[_index]._disabled;
        },
        rowExpanded(_index) {
            return this.$parent.expandArr[_index] && this.$parent.expandArr[_index].expanded;
        },
        handleMouseIn(_index,event) {
            this.$parent.handleMouseIn(_index,event);
        },
        handleMouseOut(_index,event) {
            this.$parent.handleMouseOut(_index,event);
        },
        clickCurrentRow (_index,row) {
            this.$parent.setCurrentRow(_index,row);
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
    },
    "$parent.currentClickRow"(newVal, oldVal) {
        if(!this.$parent.isRadio){
            return;
        }
        const el = this.$el;
        if (!el) return;
        const tr = el.querySelector('tbody').children;
        const rows = [].filter.call(tr, row => hasClass(row, `${this.prefixCls}-row`));
        const oldRow = rows[oldVal];
        const newRow = rows[newVal];
        if (oldRow) {
            removeClass(oldRow, `${this.prefixCls}-row-checked`);
        }
        if (newRow) {
            addClass(newRow, `${this.prefixCls}-row-checked`);
        }
    }
    }
};