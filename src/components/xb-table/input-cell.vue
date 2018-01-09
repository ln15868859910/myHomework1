<template>
    <div v-clickoutside="handleblur">
        <div :class="[prefixCls+'-row-canedit']" v-show="!edittag">
            <span v-if="!column.render">{{row[column.key]}}</span>
            <Cell
                v-else
                :row="row"
                :column="column"
                :index="index"
                :render="controldata[0].render"></Cell>
            <Icon type="edit-pen" style="visibility: hidden;" @click.native="handleinput"></Icon>
        </div>
        <div :class="[prefixCls+'-row-canedit']" v-show="edittag">
            <i-input v-model="row[column.key]" @on-blur="handleblur()" ref="input" :autofocus="edittag"></i-input>
        </div>
    </div>
</template>

<script>
import Cell from './expand';
import clickoutside from '../../directives/clickoutside';
export default {
    name: 'ControlCell',
    components: { Cell},
    directives: { clickoutside },
    props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
            type: Object,
            default: null
        }
    },
    data(){
        return{
            prefixCls:'spui-table',
            edittag:false,
            // editvalue:this.geteidtvalue()
        };
    },
    methods:{
        handleinput(){
            this.edittag = true;
            this.$refs.input.focus();
        },
        handleblur(){
            //是否允许批量编辑 允许则跳过  
            this.$refs.input.blur();
            if(this.column.validate){
                // this.column.validate(this.editvalue);
                console.log(this.row[this.column.key]);
            }
            this.edittag = false;
            //离焦后是否立刻保存？ 
            if(this.column.editendfunc){
                this.column.editendfunc(this.column);
            }
        },
        geteidtvalue(){
            return this.row[this.column.key];
        }
    }
};
</script>

<style>

</style>
