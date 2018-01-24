<template>
    <div :class="[prefixCls+'-control-body']">
        <template v-if="!table.isControlDrop">
            <i-button :class="[prefixCls+'-control-btn']" type="text" v-for="(btn,bindex) in controldata" :key="bindex" :disabled="btn.disabled" @click="handlecontrolclick(btn)">
                <span v-if="!btn.render">{{btn.title}}</span>
                <Cell 
                   v-else 
                   :row="row" 
                   :column="column" 
                   :index="index" 
                   :render="btn.render"></Cell>
            </i-button>
        </template>
        <template v-if="table.isControlDrop && controldata.length">
            <Dropdown @on-click="getDropData" @on-visible-change="dropVisibleChange" placement="bottom-end">
                <i-button :class="[prefixCls+'-control-btn']" type="text">操作
                    <Icon :type="showdrop?'arrow-up':'arrow-down'"></Icon>
                </i-button>
                <DropdownMenu slot="list">
                    <DropdownItem v-for="(btn,bindex) in controldata" :key="bindex" :name="bindex" :disabled="btn.disabled">
                        <span v-if="!btn.render">{{btn.title}}</span>
                        <Cell 
                           v-else 
                           :row="row" 
                           :column="column" 
                           :index="index" 
                           :render="btn.render"></Cell>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </template>
    </div>
</template>

<script>
import Cell from './expand';
import Dropdown from '../dropdown/dropdown.vue';
import { findComponentUpward } from '../../utils/assist';
export default {
    name: 'ControlCell',
    components: { Cell, Dropdown },
    props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            prefixCls: 'spui-table',
            controldata: this.initcontrol(this.column, this.row, this.index),
            showdrop: false,
            table: findComponentUpward(this, 'XbTable')
        };
    },
    methods: {
        initcontrol(column, row, index) {
            var buttons = [];
            column.handleArr.forEach(btn => {
                if (btn.ifshow && btn.ifshow(row, index)) {
                    buttons.push({
                        title: btn.title,
                        disabled: btn.disabled && btn.disabled(row, index),
                        render: btn.render ? btn.render : '',
                        func: btn.func
                    });
                }
            });
            return buttons;
        },
        dropVisibleChange(visible) {
            this.showdrop = visible;
        },
        getDropData(index) {
            this.handlecontrolclick(this.controldata[index]);
        },
        handlecontrolclick(btn) {
            if (!btn.disabled) {
                btn.func(this.row, this.index);
            }
        }
    }
};
</script>

<style>

</style>
