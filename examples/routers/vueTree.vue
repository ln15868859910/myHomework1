<style>

</style>

<template>
  <div>
    
    <h1>树型拖拽组件</h1>
    <vue-tree 
      :data-list="treeData" 
      @on-edit="onEdit" 
      @on-add="onAdd" 
      @on-delete="onDelete"
      @on-drop="getDropData"
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
          prop: {
            deletable: false
          },
          nodes: [
            {
              id: 3,
              title: "西湖校区",
              nodes: [
                {
                  id: 5,
                  title: "西zi校区",
                  nodes: []
                }
              ]
            },
            {
              id: 4,
              title: "下沙校区",
              nodes: []
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