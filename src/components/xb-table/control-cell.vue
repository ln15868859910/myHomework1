<template>
    <div>
        <template v-if="controldata.length<3">
            <i-button :class="[prefixCls+'-control-btn']"  type="text" v-for="(btn,bindex) in controldata" :key="bindex" :disabled="btn.disabled" @click="handlecontrolclick(btn)">
                <span v-if="!btn.render">{{btn.title}}</span>
                <Cell
                     v-else
                    :row="row"
                    :column="column"
                    :index="index"
                    :render="btn.render"></Cell>
            </i-button>
        </template>
        <template v-if="controldata.length>2">
            <i-button  :class="[prefixCls+'-control-btn']" type="text" :disabled="controldata[0].disabled" @click="handlecontrolclick(controldata[0])">
                <span v-if="!controldata[0].render">{{controldata[0].title}}</span>
                <Cell
                    v-else
                    :row="row"
                    :column="column"
                    :index="index"
                    :render="controldata[0].render"></Cell>
            </i-button>
            <i-button :class="[prefixCls+'-control-btn']" type="text" @click="dropshow" v-clickoutside="drophide">更多
                <div  :class="[prefixCls+'-control-drop']" style="" v-show="showdrop">
                    <div :class="[prefixCls+'-control-dropdown','ivu-select-dropdown']" >
                        <ul class="ivu-select-dropdown-list">
                            <li class="ivu-select-item" v-for="(btn,bindex) in controldata" :key="bindex" @click="handlecontrolclick(btn)" v-show="bindex>0">
                                <span v-if="!btn.render">{{btn.title}}</span>
                                <Cell
                                    v-else
                                    :row="row"
                                    :column="column"
                                    :index="index"
                                    :render="btn.render"></Cell>
                            </li>
                        </ul>
                    </div>
                </div>
                <Icon :type="showdrop?'arrow-up':'arrow-down'"></Icon>
            </i-button>
        </template>
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
            controldata:this.initcontrol(this.column,this.row,this.index),
            showdrop:false,
        };
    },
    methods:{
        initcontrol(column,row,index){
            var buttons = [];
            column.handleArr.forEach(btn => {
                if(btn.ifshow&&btn.ifshow(row,index)){
                    buttons.push({
                        title:btn.title,
                        disabled:btn.disabled&&btn.disabled(row,index),
                        render:btn.render?btn.render:'',
                        func:btn.func
                    });
                }
            });
            return buttons;
        },
        handlecontrolclick(btn){
            if(!btn.disabled){
                btn.func(this.row,this.index);
            }
        },
        drophide(){
            this.showdrop = false;
        },
        dropshow(){
            this.showdrop = !this.showdrop;
        }
    }
};
</script>

<style>

</style>
