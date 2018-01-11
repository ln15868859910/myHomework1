<template>
    <div :class="classes" ref="cell" :title="isOverflow?row[column.key]:''" @mouseenter="setToolTipVisible" @mouseleave="resetToolTipVisible">
        <template v-if="renderType === 'index'">{{naturalIndex + 1}}</template>
        <template v-if="renderType === 'selection'">
            <Checkbox :value="checked" @on-change="toggleSelect" :disabled="disabled"></Checkbox>
        </template>
        <template v-if="renderType === 'html'"><span v-html="row[column.key]"></span></template>
        <template v-if="renderType === 'normal'">
           <span>{{row[column.key]}}</span>
        </template>
        <template v-if="renderType === 'expand' && !row._disableExpand">
            <div :class="expandCls" @click="toggleExpand">
                <Icon type="ios-arrow-right"></Icon>
            </div>
        </template>
        <template v-if="renderType === 'input'">
             <Input-cell
                :row="row"
                :column="column"
                :index="index"
                :render="column.render"></Input-cell>
        </template>
        <template v-if="renderType === 'control'">
            <Control-cell
                :row="row"
                :column="column"
                :index="index"
                :render="column.render"></Control-cell>
        </template>
        <Cell
            v-if="renderType === 'render'"
            :row="row"
            :column="column"
            :index="index"
            :render="column.render"></Cell>
    </div>
</template>
<script>
    import Cell from './expand';
    import ControlCell from './control-cell';
    import InputCell from './input-cell';
    import Icon from '../icon/icon.vue';
    import Checkbox from '../checkbox/checkbox.vue';

    export default {
        name: 'TableCell',
        components: { Icon, Checkbox, Cell,ControlCell,InputCell },
        props: {
            row: Object,
            column: Object,
            naturalIndex: Number,    // index of rebuildData
            index: Number,           // _index of data
            checked: Boolean,
            disabled: Boolean,
            expanded: Boolean,
            fixed: {
                type: [Boolean, String],
                default: false
            }
        },
        data () {
            return {
                renderType: '',
                prefixCls:'spui-table',
                isOverflow:false
            };
        },
        computed: {
            classes () {
                return [
                    `${this.prefixCls}-cell`,
                    {
                        [`${this.prefixCls}-hidden`]: !this.fixed && this.column.fixed && (this.column.fixed === 'left' || this.column.fixed === 'right'),
                        [`${this.prefixCls}-cell-noEllipsis`]: this.column.breakWord || false,
                        [`${this.prefixCls}-cell-hideOverflow`]: this.column.showOverflowTip || false,
                        [`${this.prefixCls}-cell-with-expand`]: this.renderType === 'expand'
                    }
                ];
            },
            expandCls () {
                return [
                    `${this.prefixCls}-cell-expand`,
                    {
                        [`${this.prefixCls}-cell-expand-expanded`]: this.expanded
                    }
                ];
            }
        },
        methods: {
            toggleSelect() {
                this.$parent.$parent.toggleSelect(this.row);
            },
            toggleExpand() {
                this.$parent.$parent.toggleExpand(this.index);
            },
            //判断是否溢出
            setToolTipVisible() {
                if(this.column.showOverflowTip){
                    this.isOverflow = this.$el.offsetWidth < this.$el.scrollWidth;
                }
            },
            resetToolTipVisible(){
                this.isOverflow = false;
            }
        },
        created() {
            if (this.column.type === 'index') {
                this.renderType = 'index';
            } else if (this.column.type === 'selection') {
                this.renderType = 'selection';
            } else if (this.column.type === 'html') {
                this.renderType = 'html';
            } else if (this.column.type === 'expand') {
                this.renderType = 'expand';
            } else if (this.column.type === 'control') {//操作
                this.renderType = 'control';
            } else if (this.column.type === 'input') {//操作
                this.renderType = 'input';
            } else if (this.column.render) {
                this.renderType = 'render';
            } else {
                this.renderType = 'normal';
            }
        }
};
</script>
