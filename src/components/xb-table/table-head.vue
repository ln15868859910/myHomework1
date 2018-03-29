<template>
    <table cellspacing="0" cellpadding="0" border="0" :style="styleObject">
        <colgroup>
            <col v-for="(column, index) in columns" :width="setCellWidth(column)" v-show="column.show" :key="index">
        </colgroup>
        <thead>
            <tr>
                <th v-for="(column, index) in columns" :class="alignCls(column,true)" :style="thStyle(column)" v-show="column.show" :key="index" @mousemove="handleMouseMove($event,column)" @mousedown="handleMouseDown($event,column)" @mouseout="handleMouseOut">
                    <div :class="cellClasses(column)">
                        <template v-if="column.type === 'expand'">
                            <span v-if="!column.renderHeader">{{ column.title || '' }}</span>
                            <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
                        </template>
                        <template v-else-if="column.type === 'selection'">
                            <label class="ivu-checkbox-wrapper" :class="isSelectAll?'ivu-checkbox-wrapper-checked':''">
                                <span class="ivu-checkbox" :class="isSelectAll?'ivu-checkbox-checked':''">
                                    <span class="ivu-checkbox-inner"></span>
                                    <input type="checkbox" class="ivu-checkbox-input" @click="selectAll">
                                </span>
                            </label>
                            <!-- <Checkbox :value="isSelectAll" @on-change="selectAll"></Checkbox> -->
                        </template>
                        <template v-else>
                            <span v-if="!column.renderHeader">{{ column.title || '' }}</span>
                            <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
                            <span :class="[prefixCls+'-head-tip']" v-if="column.tipContent">
                                <Tooltip :placement="column.tipPlacement?column.tipPlacement:'top'" :content="column.tipContent" transfer>
                                    <Icon class="question-icon1" type="help-circled" size="22"></Icon>
                                    <Icon class="question-icon2" type="help-filled" size="22"></Icon>
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
        }
    },
    data() {
        return {
            prefixCls: 'spui-table',
            dragState: {},
            ondrag:false,
            dragcolumn:null,
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
                if (this.$parent.selectionPkeys.indexOf(this.data[i]._pkey)==-1 && !this.data[i]._disabled) {
                    isSelectAll = false;
                    break;
                }
            }
            return isSelectAll;
        }
    },
    methods: {
        handleMouseDown(event, column) {
            if (this.dragcolumn) {
                const table = this.$parent;
                const tableEl = table.$refs.mainTable;
                const tableLeft = tableEl.getBoundingClientRect().left;
                const columnEl = event.target;
                const columnRect = columnEl.getBoundingClientRect();
                const minLeft = columnRect.left - tableLeft + column.defaultwidth;

                this.ondrag = true;
                table.resizetag = true;
                this.dragState = {
                    startMouseLeft: event.pageX,
                    startLeft: columnRect.right - tableLeft,
                    startColumnLeft: columnRect.left - tableLeft,
                    tableLeft
                };
                document.onselectstart = function () { return false; };
                document.ondragstart = function () { return false; };
                const resizeProxy = table.$refs.resizeline;
                const resizeProxy2 = table.$refs.resizeline2;
                resizeProxy.style.left = this.dragState.startLeft + 'px';
                resizeProxy2.style.left = this.dragState.startLeft + 'px';

                var that = this;
                function onMouseUp(event2) {
                    if (that.ondrag) {
                        table.resizetag = false;
                        that.ondrag = false;
                        document.body.style.cursor = '';
                        that.dragcolumn = null;
                        var width = event2.pageX - that.dragState.startMouseLeft + column._width;
                        column.width = width < column.defaultwidth ? column.defaultwidth : width
                        table.doLayout();
                        table.saveColumnWidth();
                    }
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    document.onselectstart = null;
                    document.ondragstart = null;
                }
                function onMouseMove(event2) {
                    if (that.dragcolumn) {
                        var left = Math.max(minLeft, event2.pageX - that.dragState.startMouseLeft + that.dragState.startLeft) + 'px';
                        resizeProxy.style.left = left;
                        resizeProxy2.style.left = left;
                    }
                }
                document.addEventListener('mouseup', onMouseUp);
                document.addEventListener('mousemove', onMouseMove);
            }
        },
        handleMouseMove(event, column) {
            if (!this.$parent.resizeable) return;
            if (!this.ondrag) {
                let target = event.target;
                while (target && target.tagName !== 'TH') {
                    target = target.parentNode;
                }
                let rect = target.getBoundingClientRect();
                let bodyStyle = document.body.style;
                if (rect.width >= column.defaultwidth && rect.right - event.pageX < 5) {
                    bodyStyle.cursor = 'col-resize';
                    // bodyStyle.cursor = 'url("http://cdn.schoolpal.cn/schoolpal/resource/ci/schoolpal-protest/preview/common/crm-images/crm-consult-arrow2.png"),auto';
                    this.dragcolumn = column;
                } else if (!this.ondrag) {
                    bodyStyle.cursor = '';
                    this.dragcolumn = null;
                }
            }
        },
        handleMouseOut(){
            const bodyStyle = document.body.style;
            bodyStyle.cursor = '';
        },
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
