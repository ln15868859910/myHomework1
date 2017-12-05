<style>

</style>

<template>
    <vue-tree-core 
        :data-list="treeData" 
        :config="config"
        :loadData="loadData"

    ref="vueTreeCore">
    <!-- 无数据图片 -->
      <div v-if="treeData.length && treeData[0].nodes.length===0" slot="noDataSlot">
        <slot name='noData'></slot>
      </div>
    </vue-tree-core>

</template>

<script>
import vueTreeCore from "../../components/vue-tree-core";

export default {
  name:"vueTree",
  components: {
    vueTreeCore
  },
  props: {
    dataList: {
      type: Array,
      default:[]
    },
    draggable:{
      type:Boolean
    },
    loadData:{
      type:Function
    }
  },
  computed:{
    treeData(){
      return this.dataList;
    }
  },
  created(){
  },
  mounted(){
      /**
       * 事件中继
       * **/
      //编辑事件
      this.$refs.vueTreeCore.$on("on-edit",(data, dataTree)=>{
          this.$emit("on-edit", data, dataTree);
      });

      //添加事件
      this.$refs.vueTreeCore.$on("on-add",(data, dataTree)=>{
          this.$emit("on-add", data, dataTree);
      });

      //删除事件
      this.$refs.vueTreeCore.$on("on-delete",(data, promise)=>{
          this.$emit("on-delete", data, promise);
      });
      this.$refs.vueTreeCore.$on("on-drop",(obj)=>{
          this.$emit("on-drop",obj)
      });
  },
  data() {
    return {
      config: {
        singleSelect: false, //是否支持单选，默认false
        // modification: true, //是否支持节点的增删改查，默认false
        draggable:this.draggable,//是否支持拖拽
        styles: {
          //节点样式
          treeWrap: "", //父层包裹层
          mainTitle:"",
          nodeHandle: "", //每一项节点样式名
          //勾选框样式
          checkbox: "", //勾选框样式（未勾选）
          checkboxSelected: "", //勾选框样式（已勾选）
          checkDisabled: "", //单项禁用样式（勾选框父级）
          titleWrap: "", //文字和checkbox包裹层
          titleText: "", //文字样式

          //折叠图标样式
          iconCollapse: "", //图标折叠样式
          iconExpanded: "" //图标展开样式
        }
      }
    };
  },

  methods:{

  }
};
</script>