<style>

</style>

<template>
  <div>
    
    <h1>树型拖拽组件</h1>
    <vue-tree 
      :data-list="treeData" 
      draggable 
      @on-edit="onEdit" 
      @on-add="onAdd" 
      @on-delete="onDelete"
      @on-drop="getDropData"
      :load-data="loadData"
    ></vue-tree>
    
    <h1>树型多选框组件</h1>
    <checkbox-tree :data-list="treeData2" :title="'XXXX英语培训班'"></checkbox-tree>

  </div>
</template>

<script>

import  { checkboxTree, vueTree }  from 'spui';

export default {
  components: {
    vueTree,
    checkboxTree
  },
  data() {
    return {
      treeData: [
        {
          id: 1,
          title: "西湖区校宝教育机构",
          isUseIcon:true,
          isIconAtRight:false,
          iconType:"home",
          prop: {
            isDragDisabled:true,
          },
          handleList:[
            {key:"add",isShow:true, text:"添加", iconClass:"", isUseIcon:false},
          ],
          nodes: [
            {
              id: 3,
              title: "西湖校区",
              
               handleList:[
                {key:"common",isShow:false, text:"合并", iconClass:"", isUseIcon:false,callback:function(){console.log("合并回调")}},
                {key:"add",isShow:true, text:"添加", iconClass:"", isUseIcon:false},
                {key:"edit",isShow:true, text:"编辑", iconClass:"", isUseIcon:false},
                {key:"delete",isShow:true, text:"删除", iconClass:"", isUseIcon:false},
              ],     
              nodes: [
                {
                  id: 5,
                  title: "西zi校区",
                   handleList:[
                      {key:"common",isShow:false, text:"合并", iconClass:"", isUseIcon:false,callback:function(){console.log("合并回调")}},
                      {key:"add",isShow:true, text:"添加", iconClass:"", isUseIcon:false},
                      {key:"edit",isShow:true, text:"编辑", iconClass:"", isUseIcon:false},
                      {key:"delete",isShow:true, text:"删除", iconClass:"", isUseIcon:false},
                    ],
                  nodes: []
                }
              ]
            },
            {
              id: 4,
              title: "下沙校区",
               handleList:[
                {key:"common",isShow:true, text:"合并", iconClass:"", isUseIcon:false,callback:function(){console.log("回调")}},
                {key:"add",isShow:true, text:"添加", iconClass:"", isUseIcon:false},
                {key:"edit",isShow:true, text:"编辑", iconClass:"", isUseIcon:false},
                {key:"delete",isShow:true, text:"删除", iconClass:"", isUseIcon:false},
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
      ]
    };
  },
  created() {},
  mounted() {},

  methods: {
    onEdit(data, dataTree) {
      console.log(data, dataTree);
    },
    onAdd(data,dataTree){
      console.log(data, dataTree);
    },
    onDelete(dataCopy,promise){
      console.log(dataCopy, promise);
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
      console.log(info);
      var dragKey = info.dragNode._hash;
      var dropKey = info.dropNode._hash;
      var dropPosition = info.dropPosition; //0作为子级，-1放在目标节点前面，1放在目标节点后面
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item._hash === key) {
            return callback(item, index, arr);
          }
          if (item.nodes) {
            return loop(item.nodes, key, callback);
          }
        });
      };
      let dragObj;
      loop(this.treeData, dragKey, (item, index, arr) => {
        arr.splice(index, 1); //把拖拽元素从父节点中删除
        dragObj = item;
      });
      if (dropPosition === 0) {
        loop(this.treeData, dropKey, item => {
          item.nodes = item.nodes || [];
          item.nodes.push(dragObj);
        });
      } else {
        let ar;
        let i;
        loop(this.treeData, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
    }
  }
};
</script>