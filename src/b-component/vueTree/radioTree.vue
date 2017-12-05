<style>
.radioTree-wrap,
.radioTree-wrap ol {
  list-style: none;
}
.radioTree-wrap ol {
  padding-left: 30px;
}
.radioTree-wrap>ol:first-of-type{
    padding-left:0;
}
.radioTree-wrap {
  width: 320px;
  height: 308px;
  padding: 20px;
  background: #f3f8fc;
  border-radius: 5px;
  overflow: auto;
  box-sizing: border-box;
}
.radioTree-radio,
.radioTree-radio.radioSelected {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 0 10px;
  position: relative;
  vertical-align: middle;
  line-height: 1;
  top: 0;
  left: 0;
  border: 1px solid #b9bec5;
  border-radius: 50%;
  background-color: #fff;
  box-sizing: border-box;
  cursor: pointer;
  transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
}
.radioTree-radio:hover {
  border-color: #5295e7;
}
.radioTree-radio.radioSelected {
  background-color: #5295e7;
  border-color: #5295e7;
}
.radioTree-radio:after,
.radioTree-radio.radioSelected:after,
.radioTree-radio.radioSelected.radioDisabled:after {
  content: "";
  display: table;
  width: 6px;
  height: 6px;
  position: absolute;
  left: 4px;
  top: 4px;
  border-radius: 6px;
  background-color:#fff;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
}
.radioTree-radio:after {
  -ms-transform: rotate(45deg) scale(0);
  transform: rotate(45deg) scale(0);
}
.radioTree-radio.radioSelected:after {
  -ms-transform: rotate(45deg) scale(1);
  transform: rotate(45deg) scale(1);
}
.radioTree-radio.radioSelected.radioDisabled:after {
  background-color: #ccc;
  -ms-transform: rotate(45deg) scale(1);
  transform: rotate(45deg) scale(1);
}
.radioTree-title {
  vertical-align: middle;
  font-family: "PingFangSC-Regular";
  font-size: 14px;
  color: #3d4c5a;
  cursor: default;
}
.radioTree-title>span{
  vertical-align: initial;
}
.radioTree-titleWrap {
  font-size: 0;
  white-space: nowrap;
}
.radioTree-handle {
  line-height: 1;
  margin-bottom: 13px;
}

.radioTree-radio.radioDisabled {
  background: #f6f6f6;
  border-color: #ccc;
  cursor:no-drop;
}
.radioTree-radio.radioDisabled + .radioTree-title {
  color: #ccc;
  cursor:no-drop;
}
.radioTree-mainTitle{
    font-weight:normal;
    font-family: "PingFangSC-Regular";
    font-size: 14px;
    color: #3D4C5A;
    text-align: left;
    margin:0;
}
</style>

<template>
    <vue-tree-core :data-list="dataList" :config="config" ref="vueTreeCore"></vue-tree-core>
</template>

<script>
import vueTreeCore from "../../components/vue-tree-core";

export default {
  name:"radioTree",
  components: {
    vueTreeCore
  },
  props: {
    dataList: {
      type: Array,
      default:[]
    }
  },
  created(){
      this.config.title = this.title;
  },
  data() {
    return {
      config: {
        singleSelect: true, //是否支持单选，默认false
        styles: {
          //节点样式
          treeWrap: "radioTree-wrap", //父层包裹层
          mainTitle:"radioTree-mainTitle",
          nodeHandle: "radioTree-handle", //每一项节点样式名
          //勾选框样式
          checkbox: "radioTree-radio", //勾选框样式（未勾选）
          checkboxSelected: "radioSelected", //勾选框样式（已勾选）
          checkDisabled: "radioDisabled", //单项禁用样式（勾选框父级）
          titleWrap: "radioTree-titleWrap", //文字和checkbox包裹层
          titleText: "radioTree-title", //文字样式

          //折叠图标样式
          iconCollapse: "", //图标折叠样式
          iconExpanded: "" //图标展开样式
        }
      }
    };
  },
  methods:{
    
    //获得所有勾选数据，默认[]
    getSelectedNodeData(){
      return this.$refs.vueTreeCore.getSelectedNodeData();
    },

    //获取所有节点数据（已通过索引优化）
    getAllNodeData(){
      return this.$refs.vueTreeCore.getAllNodeData();
    },
    //清楚所有勾选数据
    clearAllCheckedData(){
      return this.$refs.vueTreeCore.clearAllCheckedData();
    }
  }
};
</script>