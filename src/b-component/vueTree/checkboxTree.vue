<style>
.checkboxTree-wrap,
.checkboxTree-wrap ol {
  list-style: none;
}
.checkboxTree-wrap ol {
  padding-left: 30px;
}
.checkboxTree-wrap>ol:first-of-type{
    padding-left:0;
}
.checkboxTree-wrap {
  width: 320px;
  height: 308px;
  padding: 20px;
  background: #f3f8fc;
  border-radius: 5px;
  overflow: auto;
  box-sizing: border-box;
}
.checkboxTree-checkbox,
.checkboxTree-checkbox.checkboxSelected {
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
  border-radius: 3px;
  background-color: #fff;
  box-sizing: border-box;
  cursor: pointer;
  transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
}
.checkboxTree-checkbox:hover {
  border-color: #5295e7;
}
.checkboxTree-checkbox.checkboxSelected {
  background-color: #5295e7;
  border-color: #5295e7;
}
.checkboxTree-checkbox:after,
.checkboxTree-checkbox.checkboxSelected:after,
.checkboxTree-checkbox.checkboxSelected.checkboxDisabled:after {
  content: "";
  display: table;
  width: 4px;
  height: 8px;
  position: absolute;
  top: 1px;
  left: 5px;
  border: 2px solid #fff;
  border-top: 0;
  border-left: 0;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
}
.checkboxTree-checkbox:after {
  -ms-transform: rotate(45deg) scale(0);
  transform: rotate(45deg) scale(0);
}
.checkboxTree-checkbox.checkboxSelected:after {
  top: 2px;
  -ms-transform: rotate(45deg) scale(1);
  transform: rotate(45deg) scale(1);
}
.checkboxTree-checkbox.checkboxSelected.checkboxDisabled:after {
  top: 2px;
  border-color: #ccc;
  -ms-transform: rotate(45deg) scale(1);
  transform: rotate(45deg) scale(1);
}
.checkboxTree-title {
  vertical-align: middle;
  font-family: "PingFangSC-Regular";
  font-size: 14px;
  color: #3d4c5a;
  cursor: default;
}
.checkboxTree-titleWrap {
  font-size: 0;
  white-space: nowrap;
}
.checkboxTree-icon-collapse,
.checkboxTree-icon-expand {
  cursor: pointer;
  display: inline-block;
  height: 12px;
  width: 12px;
  position: relative;
  font-style: normal;
  vertical-align: middle;
}
.checkboxTree-icon-collapse:before,
.checkboxTree-icon-expand:before {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  top: 3px;
  right: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #aaa;
  transition: all 0.2s ease-in-out;
}
.checkboxTree-icon-collapse:before {
  -ms-transform: rotate(-90deg) scale(1);
  transform: rotate(-90deg) scale(1);
}
.checkboxTree-handle {
  line-height: 1;
  margin-bottom: 20px;
}

.checkboxTree-checkbox.checkboxDisabled {
  background: #f6f6f6;
  border-color: #ccc;
  cursor:no-drop;
}
.checkboxTree-checkbox.checkboxDisabled + .checkboxTree-title {
  color: #ccc;
  cursor:no-drop;
}
.checkboxTree-mainTitle{
    font-weight:normal;
    font-family: "PingFangSC-Regular";
    font-size: 14px;
    color: #3D4C5A;
    text-align: left;
    margin:0;
}
</style>

<template>
    <vue-tree-core :data-list="dataList" :config="config"></vue-tree-core>
</template>

<script>
import vueTreeCore from "../../components/vue-tree-core";

export default {
  name:"checkboxTree",
  components: {
    vueTreeCore
  },
  props: {
    dataList: {
      type: Array
    },
    title: {
      type: String
    }
  },
  created(){
      this.config.title = this.title;
  },
  data() {
    return {
      config: {
        title: "",
        styles: {
          //节点样式
          treeWrap: "checkboxTree-wrap", //父层包裹层
          mainTitle:"checkboxTree-mainTitle",
          nodeHandle: "checkboxTree-handle", //每一项节点样式名
          //勾选框样式
          checkbox: "checkboxTree-checkbox", //勾选框样式（未勾选）
          checkboxSelected: "checkboxSelected", //勾选框样式（已勾选）
          checkDisabled: "checkboxDisabled", //单项禁用样式（勾选框父级）
          titleWrap: "checkboxTree-titleWrap", //文字和checkbox包裹层
          titleText: "checkboxTree-title", //文字样式

          //折叠图标样式
          iconCollapse: "checkboxTree-icon-collapse", //图标折叠样式
          iconExpanded: "checkboxTree-icon-expand" //图标展开样式
        }
      }
    };
  }
};
</script>