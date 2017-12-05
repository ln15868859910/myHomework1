<style>
.markerWrap .vue-tree-root>ol>li>div.vue-tree-handle .tree-drag-disabled :hover{
  color:#30404F;
}
.markerWrap .vue-tree-root>ol>li>div.vue-tree-handle .tree-drop-disabled{
  border-color:transparent;
  background-color:transparent;
  color:#30404F;
}
h1{
  margin: 50px 0 10px 0
}
.noDataDiv{
    font-size: 14px;
    color: #adb4bc;
    padding: 150px 0 0 0;
    background: url('http://pro.schoolpal.cn/common/images_newui/page-icon91.png') no-repeat center top;
    text-align: center;
    margin: 30px auto;
    line-height: 1;
    margin-top: 55px;
}
</style>

<template>
  <div class="markerWrap">
    
    <h1>树型拖拽组件</h1>
    <vue-tree 
      :data-list="treeData" 
      draggable 
      @on-edit="onEdit" 
      @on-add="onAdd" 
      @on-delete="onDelete"
      @on-drop="getDropData"
      :load-data="loadData"
    >
    <div slot="noData">
      <div class="noDataDiv">没有子节点</div>
    </div>
    </vue-tree>
    
    <h1>树型多选框组件</h1>
    <checkbox-tree :data-list="treeData2" :title="aa" ref="checkboxTree"></checkbox-tree>
    <Button type="primary" @click="getSelectedData1">获取当前勾选数据</Button>

    <h1>单选组件</h1>
    <radio-tree :data-list="treeData3" ref="radioTree"></radio-tree>
    <Button type="primary" @click="getSelectedData2">获取当前勾选数据</Button>
  </div>
</template>

<script>

import  { checkboxTree, vueTree, radioTree }  from 'spui';

export default {
  components: {
    vueTree,
    checkboxTree,
    radioTree
  },
  data() {
    return {
      treeData: [
        {
          id: 1,
          title: "西湖区校宝教育机构",
          isUseIcon:false,
          isIconAtRight:false,
          isHiddenCollapseIcon:true,
          iconType:"",
          prop: {
             noDrag: true,
             noDrop:true
          },
          handleList:[
            {key:"add",isShow:true, text:"添加", iconType:"plus-circled", isUseIcon:true},
          ],
          nodes: [
            {
              id: 3,
              title: "西湖校区",
               handleList:[
                {key:"common",isShow:true, toolTipDisable:false, toolTipText:"点击合并", text:"合并", iconType:"merge", isUseIcon:true,callback:function(){console.log("合并回调")}},
                {key:"add",isShow:true, toolTipDisable:false, toolTipText:"点击添加", text:"添加子节点", iconType:"plus-circled", isUseIcon:true},
                {key:"edit",isShow:true, toolTipDisable:false, toolTipText:"点击编辑", text:"编辑", iconType:"edit", isUseIcon:true},
                {key:"delete",isShow:true, toolTipDisable:false, toolTipText:"点击删除", text:"删除", iconType:"minus-circled", isUseIcon:true},
              ],     
              nodes: [
                {
                  id: 5,
                  title: "西zi校区",
                  isUseIcon:true,
                  iconType:"document",
                  prop: {
                    noDrag: true
                  },
                   handleList:[
                      {key:"common",isShow:false, text:"合并", iconType:"", isUseIcon:false,callback:function(){console.log("合并回调")}},
                      {key:"add",isShow:true, text:"添加子节点", iconType:"", isUseIcon:false},
                      {key:"edit",isShow:true, text:"重命名", iconType:"", isUseIcon:false},
                      {key:"delete",isShow:true, text:"删除", iconType:"", isUseIcon:false},
                    ],
                  nodes: []
                }
              ]
            },
            {
              id: 4,
              title: "下沙校区",
               handleList:[
                {key:"common",isShow:true, text:"合并", iconType:"", isUseIcon:false,callback:function(){console.log("回调")}},
                {key:"add",isShow:true, text:"添加", iconType:"", isUseIcon:false},
                {key:"edit",isShow:true, text:"编辑", iconType:"", isUseIcon:false},
                {key:"delete",isShow:true, text:"删除", iconType:"", isUseIcon:false},
              ],
              nodes: [],
              prop:{
                isExpand: false
              },
              loading: false
            }
          ]
        }
      ],

      treeData2: [
        {
          id: 1,
          title: "禁用的样式",
          prop: {
            isDisabled: true,
            isChecked: true,
            checkable: true
          },
          nodes: [
            {
              id: 3,
              title: "西湖校区",
              prop: {
                checkable: true
              },
              nodes: [
                {
                  id: 5,
                  title: "西zi校区",
                  prop: {
                    checkable: true
                  },
                  nodes: [
                    {
                      id: 3,
                      title: "西湖校区",
                      prop: {
                        checkable: true
                      },
                      nodes: [
                        {
                          id: 5,
                          title: "西zi校区",
                          prop: {
                            checkable: true
                          },
                          nodes: []
                        }
                      ]
                    },
                    {
                      id: 4,
                      title: "下沙校区",
                      prop: {
                        checkable: true
                      },
                      nodes: []
                    }
                  ]
                }
              ]
            },
            {
              id: 4,
              title: "下沙校区",
              prop: {
                checkable: true
              },
              nodes: []
            }
          ]
        }
      ],

      treeData3: [
        {
          id: 1,
          title: "禁用的样式",
          prop: {
            isDisabled: true,
            isChecked: true,
            checkable: true
          },
          nodes: [
            {
              id: 3,
              title: "西湖校区",
              prop: {
                checkable: true
              },
              nodes: [
                {
                  id: 5,
                  title: "西zi校区",
                  prop: {
                    checkable: true
                  },
                  nodes: [
                    {
                      id: 3,
                      title: "西湖校区",
                      prop: {
                        checkable: true
                      },
                      nodes: [
                        {
                          id: 5,
                          title: "西zi校区",
                          prop: {
                            checkable: true
                          },
                          nodes: []
                        }
                      ]
                    },
                    {
                      id: 4,
                      title: "下沙校区",
                      prop: {
                        checkable: true
                      },
                      nodes: []
                    }
                  ]
                }
              ]
            },
            {
              id: 4,
              title: "下沙校区",
              prop: {
                checkable: true
              },
              nodes: []
            }
          ]
        }
      ],
      aa:"",
    };
  },
  created() {},
  mounted() {
    setTimeout(()=>{
      console.log(1)
      this.aa="XXXX教育机构"
    },3000)
  },

  methods: {
    getSelectedData1(){
      console.log(this.$refs.checkboxTree.getSelectedNodeData())
    },
    getSelectedData2(){
      console.log(this.$refs.radioTree.getSelectedNodeData())
    },
    onEdit(data) {
      console.log(data);
    },
    onAdd(data){
      console.log(data);
    },
    onDelete(data,promise){
      console.log(data, promise);
      promise.resolve();
    },
    loadData(item, callback) {
      setTimeout(() => {
        const data = [
                {
                  id: 10,
                  title: "异步加载",
                   handleList:[
                      {key:"common",isShow:false, text:"合并", iconStyle:"", isUseIcon:false,callback:function(){console.log("合并回调")}},
                      {key:"add",isShow:true, text:"添加", iconStyle:"", isUseIcon:false},
                      {key:"edit",isShow:true, text:"编辑", iconStyle:"", isUseIcon:false},
                      {key:"delete",isShow:true, text:"删除", iconStyle:"", isUseIcon:false},
                    ],
                  nodes: []
                }
              ];
        callback(data);
      }, 1000);
    },
    getDropData(info) {
      var dragData=info.dragNode.nodeData;
      var dragParent=info.dragNode.parentNode;
      var dropData=info.dropNode.nodeData;
      var dropParent=info.dropNode.parentNode;
      var dropPosition = info.dropPosition; //0作为子级，-1放在目标节点前面，1放在目标节点后面

      //把拖拽元素从父节点中删除
      dragParent.nodes.splice(dragParent.nodes.indexOf(dragData),1);
      if(dropPosition === 0){
        dropData.nodes.push(dragData);
      }
      else{
        var index=dropParent.nodes.indexOf(dropData);
        if (dropPosition === -1) {
          dropParent.nodes.splice(index, 0, dragData);
        } else {
          dropParent.nodes.splice(index + 1, 0, dragData);
        }
      }
    }
  }
};
</script>