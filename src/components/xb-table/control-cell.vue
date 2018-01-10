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
            <Poptip normal placement="bottom-end" v-model="showdrop" trigger="hover">
               <i-button :class="[prefixCls+'-control-btn']" type="text">更多
                   <Icon :type="showdrop?'arrow-up':'arrow-down'"></Icon>
               </i-button>
               <div slot="content">
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
           </Poptip>
        </template>
    </div>
</template>

<script>
import Cell from './expand';
import Poptip from '../poptip/poptip.vue';
import clickoutside from '../../directives/clickoutside';
export default {
    name: 'ControlCell',
    components: { Cell,Poptip},
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
                this.showdrop = false;
                btn.func(this.row,this.index);
            }
        }
    }
};
</script>

<style>

</style>
