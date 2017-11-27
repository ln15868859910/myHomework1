<style>
.vue-tree-root,
.vue-tree-root ol {
  list-style: none;
}
</style>

<template>
  <div :class="wrapClass">    
      <h1 v-if="config.title" :class="mainTitle">{{config.title}}</h1>
      <ol>
        <vue-tree-node v-for="(node,index) in dataList" 
          :key="index" 
          :node-data="node" 
          :root-data="rootData"
        >
        </vue-tree-node>
      </ol>
  </div>

</template>

<script>
import vueTreeNode from "./tree-node.vue";

export default {
  name: "vueTree",
    components: {
    vueTreeNode
  },
  props: {
    dataList: {
      type:Array
    },
    config: {
      type:Object
    }
  },
  data() {
    return {
      rootData:{
        _UITreeMap:null,
        globalConfig:null,
        dragOverStatus:{
          overNodeKey: "",
          dropPosition: "",
          dragNode:{}
        },
        rootInstance:this
      }
    };
  },
  computed:{
    wrapClass(){
      typeof this.rootData.globalConfig.styles === "undefined" ? this.rootData.globalConfig.styles = {}:false;
      return this.rootData.globalConfig.styles.treeWrap
        ? this.rootData.globalConfig.styles.treeWrap
        : "vue-tree-root";
    },
    mainTitle(){
       typeof this.rootData.globalConfig.styles === "undefined" ? this.rootData.globalConfig.styles = {}:false;
      return this.rootData.globalConfig.styles.mainTitle
        ? this.rootData.globalConfig.styles.mainTitle
        : "vue-tree-mainTitle";
    }
  },
  created() {
    //在整个组件传递参数
    this.rootData.globalConfig = this.config;

     //编辑回调
    this.$on("editNode",this.editcallback)
  },
  mounted() {
    this.$on('dragStart', () => {
      this.$emit('on-dragStart');
    });
    this.$on('dragEnter', () => {
      this.$emit('on-dragEnter');
    });
    this.$on('dragOver', () => {
      this.$emit('on-dragOver');
    });
    this.$on('dragLeave', () => {
      this.$emit('on-dragLeave');
    });
    this.$on('dragEnd', () => {
      this.$emit('on-dragEnd');
    });
    this.$on('drop', (dropInfo) => {
      this.$emit('on-drop',dropInfo);
    });
  },

  methods: {
    /**
     * 编辑回调(对外)
     * 输出：
     * **/
    editcallback(data) {
      this.$emit("on-edit", {data, tree:this.rootData._UITreeMap});
    }
  }
};
</script>