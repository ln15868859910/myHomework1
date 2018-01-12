<template>
    <div >
        <div :class="[prefixCls+'-row-canedit']" v-show="!edittag">
            <span v-if="!column.render">{{row[column.key]}}</span>
            <Cell
                v-else
                :row="row"
                :column="column"
                :index="index"
                :render="column.render"></Cell>
            <Icon type="edit-pen" style="visibility: hidden;" @click.native="handleinput"></Icon>
        </div>
        <div :class="[prefixCls+'-row-canedit']" v-show="edittag">
            <i-input v-model="row[column.key]" @on-blur="handleblur()" ref="input"></i-input>
        </div>
    </div>
</template>

<script>
import Cell from './expand';
export default {
    name: 'InputCell',
    components: { Cell},
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
            //input元素所在Dom被edittag控制显示/隐藏。如果直接调用focus，该Dom并未立即显示导致聚焦失败。此处延迟调用。
            this.$nextTick(()=>{
                this.$refs.input.focus();
            });
        },
        handleblur(){
            //是否允许批量编辑 允许则跳过  
            this.$refs.input.blur();
            if(this.column.validate){
                this.column.validate(this.editvalue);
                console.log(this.row[this.column.key]);
            }
            this.edittag = false;
            //离焦后是否立刻保存？ 
            if(this.column.callback){
                this.column.callback(this.row);
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
