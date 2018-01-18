<template>
    <table cellspacing="0" cellpadding="0" border="0" :style="styleObject">
        <colgroup>
            <col v-for="(column, index) in columns" :width="setCellWidth(column, index, true)" v-show="checkifhide(column)" :key="index">
        </colgroup>
        <thead>
            <tr>
                <th v-for="(column, index) in columns" :class="alignCls(column)" :style="thStyle(column)" v-show="checkifhide(column)" :key="index">
                    <div :class="cellClasses(column)">
                        <template v-if="column.type === 'expand'">
                            <span v-if="!column.renderHeader">{{ column.title || '' }}</span>
                            <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
                        </template>
                        <template v-else-if="column.type === 'selection'">
                            <Checkbox :value="isSelectAll" @on-change="selectAll"></Checkbox>
                        </template>
                        <template v-else>
                            <span v-if="!column.renderHeader">{{ column.title || '#' }}</span>
                            <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
                            <span :class="[prefixCls+'-head-tip']" v-if="column.tipContent">
                                <Tooltip placement="top" :content="column.tipContent">
                                    <Icon class="question-icon" type="help-filled" size="22"></Icon>
                                </Tooltip>
                            </span>
                            <span :class="[prefixCls + '-sort']" v-if="column.sortable" @click="handleSort($event,index)">
                                <i class="ivu-icon ivu-icon-arrow-up-b" :class="{on: orderParam.sortKey === column.key && orderParam.sortOrder === 'asc'}"></i>
                                <i class="ivu-icon ivu-icon-arrow-down-b" :class="{on: orderParam.sortKey === column.key && orderParam.sortOrder === 'desc'}"></i>
                            </span>
                        </template>
                    </div>
                </th>
            </tr>
        </thead>
    </table>
</template>
<script>
import Checkbox from '../checkbox/checkbox.vue';
import iButton from '../button/button.vue';
import renderHeader from './header';
import Mixin from './mixin';
import Locale from '../../mixins/locale';

export default {
    name: 'TableHead',
    mixins: [Mixin, Locale],
    components: { Checkbox, iButton, renderHeader },
    props: {
        styleObject: Object,
        columns: Array,
        data: Array,    // rebuildData
        columnsWidth: Object,
        fixed: {
            type: [Boolean, String],
            default: false
        },
        outhidecol:Array,
        hidecol:Array
    },
    data() {
        return {
            prefixCls: 'spui-table'
        }
    },
    computed: {
        orderParam() {
            return {
                sortKey: this.$parent.sortKey,
                sortOrder: this.$parent.sortOrder
            }
        },
        isSelectAll() {
            let isSelectAll = true;
            if (!this.data.length) isSelectAll = false;
            for (let i = 0; i < this.data.length; i++) {
                if (!this.data[i]._checked && !this.data[i]._disabled) {
                    isSelectAll = false;
                    break;
                }
            }
            return isSelectAll;
        }
    },
    methods: {
        cellClasses(column) {
            return [
                `${this.prefixCls}-cell`,
                {
                    [`${this.prefixCls}-hidden`]: !this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right')
                }
            ];
        },
        thStyle(column) {
            let style = {};
            if (column.type === "selection") {
                style.textAlign = "left";
            }
            return style;
        },
        checkifhide(column){
            return this.outhidecol.indexOf(column.key)==-1&&this.hidecol.indexOf(column.key)==-1;
        },
        selectAll() {
            const status = !this.isSelectAll;
            this.$parent.selectAll(status);
        },
        handleSort(event, index, type) {
            event.stopPropagation();
            if (type) {
                this.$parent.handleSort(index, type);
            }
            else {
                const column = this.columns[index];
                if (column.sortable) {
                    if (this.orderParam.sortKey === column.key) {
                        var sortBy = this.orderParam.sortOrder === 'asc' ? 'desc' : 'asc';
                        this.$parent.handleSort(index, sortBy);
                    }
                    else {
                        this.$parent.handleSort(index, 'desc');
                    }
                }
            }
        }
    }
};
</script>
