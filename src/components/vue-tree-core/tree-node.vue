<style>
.vue-tree-fl {
  float: left;
}
.vue-tree-fr {
  float: right;
}
.vue-tree-clearfix {
  *zoom: 1;
}
.vue-tree-clearfix:after {
  content: "";
  display: table;
  clear: both;
}
.vue-tree-handle {
  margin: 10px;
  padding: 10px 10px;
  border: 1px solid #dae2ea;
  background: #f8faff;
  color: #7c9eb2;
}
/* .vue-tree-handle:hover{
        cursor:move;
    } */
.vue-tree-placeholder {
  border: 1px dashed #bbb;
  text-align: center;
  background-color: #e5e5e5;
}
.vue-node-dragging {
  z-index: 9999;
  position: absolute;
  width: 100%;
  display: block;
  margin-top: -10px; /*bfc fix*/
}
/*折叠框样式*/
.vue-node-collapse,
.vue-node-expand {
  cursor: pointer;
  display: inline-block;
  height: 17px;
  width: 20px;
  position: relative;
  font-style: normal;
}
.vue-node-collapse:before {
  position: absolute;
  content: "▷";
  transform: rotate(0deg);
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  transition: all 0.3s ease;
}
.vue-node-expand:before {
  position: absolute;
  content: "▷";
  transform: rotate(90deg);
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  transition: all 0.3s ease;
}
/*checkbox样式 开始*/
.vue-tree-checkbox {
  width: 12px;
  height: 12px;
  display: inline-block;
  border: 1px solid #ccc;
}
.vue-tree-checkbox-selected {
  background: #7c9eb2;
}
.vue-tree-checkbox-disabled {
  background: rgba(0, 0, 0, 0.2);
}
/*checkbox样式 结束*/
/*拖拽样式 开始*/
.drag-over {
  background-color: #5295E7;
  color: white;
  border: 1px #5295E7 solid;
  opacity: 0.8;
}
.drag-over-gap-top {
  border-top: 2px #5295E7 solid;
}
.drag-over-gap-bottom {
  border-bottom: 2px #5295E7 solid;
}
.drag-selected{
  background:#DEEAF7;
}
/*拖拽样式 开始*/
</style>

<template>
<li ref="draggAbleEle" :class="draggingClass" data-wrap>
    <!-- <li ref="draggAbleEle" @mouseup="endDrag($event)" :class="draggingClass" v-bind:vue-tree-id="nodeData._hash" data-wrap> -->
        <!-- 拖动标题 -->
        <!-- <div class="vue-tree-handle clearfix" @mousedown="startDrag($event)" data-handle> -->
          <!--这里onDragStart事件和接收目标上的事件不能绑在同一个元素上，否则真机IE10下 会无法触发接收事件-->
        <div @dragenter='onDragEnter' @dragover='onDragOver' @dragleave='onDragLeave' @drop="onDrop" @dragend='onDragEnd'>
        <div class="vue-tree-clearfix" :class="[nodeHandleClass,dragOverClass]" data-handle draggable='true' @dragstart='onDragStart'>
            <span class="vue-tree-fl">
                <span :class="treeTitleWrap">
                    <i v-show="nodeData.nodes.length" :class="collapseStatus" @click="toggleCollapseStatus"></i>
                    <i v-if="nodeData.prop.checkable" :class="checkboxClass" v-show="!isCurNodeStatus('edit') && nodeData.prop.checkable"   @click="toggleChecbox"></i>
                    <span :class="treeTitleClass">{{nodeData.title}}</span>
                </span>
            </span>
            <span v-if="rootData.globalConfig.modification" class="vue-tree-fr">
                <span><a href="javascript:;" @click="addNode()">添加子部门</a></span>
                <span><a href="javascript:;" @click="editThisNode()">编辑</a></span>
                <span><a v-if="isCurNodeStatus('delete')" href="javascript:;" @click="deleteThisNode()">删除</a></span>
            </span>
        </div>
        </div>
        <!-- 子节点 -->
        <ol v-show="nodeData.nodes.length && nodeData.prop.isExpand">
            <vue-tree-node v-for="(node,index) in nodeData.nodes" 
            :key="index" 
            :node-data="node" 
            :parent-node-data="nodeData"
            :root-data="rootData"
            ></vue-tree-node>
        </ol>
    <!-- 拖动释放展示区域 -->
    <!-- <div class="vue-tree-placeholder" :style="placeholderStyle" v-show="params.flag">释放拖动</div> -->
</li>

</template>

<script>
import { throttle, debounce } from '../../utils/throttle';
export default {
  name: "vueTreeNode",
  props: {
    nodeData: {
      type: Object
    },
    parentNodeData: {
      type: Object,
      default: null
    },
    rootData:{
      type: Object,
      default: null
    }
  },
  created() {
    /**
         * 每次初始化实例时执行构建树的操作
         * **/
    //遍历第一层的的时候
    if (!this.parentNodeData) {
      this.nodeData._hash = this.generateHash();
      this.rootData._UITreeMap = {};
      this.rootData._UITreeMap[this.nodeData._hash] = {};

      /**
       * 给全局配置添加内部属性
       * **/
      //初始化是否有选中项
      this.$set(this.rootData.globalConfig, "_hasSelected", false);
    }
    this.setInitNodeValue();
    this.setTreeNodeMap();
  },
  mounted() {},
  computed: {
    treeTitleWrap(){
        typeof this.rootData.globalConfig.styles === "undefined" ? this.rootData.globalConfig.styles = {}:false;
        
        return this.rootData.globalConfig.styles.titleWrap
        ? this.rootData.globalConfig.styles.titleWrap
        : "vue-tree-titleWrap";
    },
    treeTitleClass(){
      typeof this.rootData.globalConfig.styles === "undefined" ? this.rootData.globalConfig.styles = {}:false;

      return this.rootData.globalConfig.styles.titleText
        ? this.rootData.globalConfig.styles.titleText
        : "vue-tree-title";
    },
    draggingClass() {
      return {
        "vue-node-dragging": this.params.flag
      };
    },
    nodeHandleClass() {

      typeof this.rootData.globalConfig.styles === "undefined" ? this.rootData.globalConfig.styles = {}:false;

      return this.rootData.globalConfig.styles.nodeHandle
        ? this.rootData.globalConfig.styles.nodeHandle
        : "vue-tree-handle";
    },
    checkboxClass() {

      typeof this.rootData.globalConfig.styles === "undefined" ? this.rootData.globalConfig.styles = {}:false;

      return [
        this.rootData.globalConfig.styles.checkbox
          ? this.rootData.globalConfig.styles.checkbox
          : "vue-tree-checkbox",
        this.rootData.globalConfig.styles.checkboxSelected
          ? {
              [this.rootData.globalConfig.styles.checkboxSelected]: this.nodeData
                .prop.isChecked
            }
          : { "vue-tree-checkbox-selected": this.nodeData.prop.isChecked },
        this.rootData.globalConfig.styles.checkDisabled
          ? {
              [this.rootData.globalConfig.styles.checkDisabled]: this.nodeData.prop
                .isDisabled
            }
          : { "vue-tree-checkbox-disabled": this.nodeData.prop.isDisabled }
      ];
    },
    // placeholderStyle() {
    //   return {
    //     width: this.draggingData.placeholderSize.width,
    //     height: this.draggingData.placeholderSize.height,
    //     margin: "10px"
    //   };
    // },
    collapseStatus() {

      typeof this.rootData.globalConfig.styles === "undefined" ? this.rootData.globalConfig.styles = {}:false;

      return [
        this.rootData.globalConfig.styles.iconCollapse
          ? {
              [this.rootData.globalConfig.styles.iconCollapse]: !this.nodeData.prop
                .isExpand
            }
          : { "vue-node-collapse": !this.nodeData.prop.isExpand },
        this.rootData.globalConfig.styles.iconExpanded
          ? {
              [this.rootData.globalConfig.styles.iconExpanded]: this.nodeData.prop
                .isExpand
            }
          : { "vue-node-expand": this.nodeData.prop.isExpand }
      ];
    },
    dragOverClass() {
      var isDragOverMe = this.rootData.dragOverStatus.overNodeKey === this.nodeData._hash;
      var pos = this.rootData.dragOverStatus.dropPosition;
      return [
              {
                  ["drag-over"]: isDragOverMe && pos===0,
                  ["drag-over-gap-top"]: isDragOverMe && pos===-1,
                  ["drag-over-gap-bottom"]: isDragOverMe && pos===1,
                  ["drag-selected"]: this.dragNodeHighlight
              }
       ];
    }
  },
  data() {
    return {
      currentDepth: 0,
      currentEditValue: "",
      params: {
        left: 0,
        top: 0,
        currentX: 0,
        currentY: 0,
        flag: false
      },
      draggingData: {
        placeholderSize: {
          width: "0px",
          height: "0px"
        },
        nodeData: null
      },
      dragNodeHighlight:false //拖拽元素是否高亮
    };
  },
  methods: {
    /**
     * 给传入节点赋予默认值
     **/
    setInitNodeValue() {
        //【prop属性类型校验】
        if (
          "prop" in this.nodeData &&
          !this.checkThisType(this.nodeData.prop, "object")
        ) {
          throw new Error("传入prop的类型必须为对象");
        }

        //【无传入prop对象时默认创建prop对象】
        if (!("prop" in this.nodeData)) {
          this.$set(this.nodeData, "prop", {
            isExpand: true,
            deletable: true,
            checkable: true,
            isDisabled: false,
            isChecked: false,
            _isEdit: false
          });
          return;
        }

        //【有传入prop对象时检查默认值】
        //赋予内部属性
        this.$set(this.nodeData.prop, "_isEdit", false);

        //赋予可扩展属性和默认值
        //  是否展开this.nodeData.prop.isExpand
        this.checkAndSetInitValue("isExpand",this.nodeData.prop,"boolean", true);
        //  是否可删除this.nodeData.prop.deletable
        this.checkAndSetInitValue("deletable",this.nodeData.prop,"boolean",true);
        //  是否可选中this.nodeData.prop.checkable
        this.checkAndSetInitValue("checkable",this.nodeData.prop,"boolean",true);
        //  是否禁用this.nodeData.prop.checkbox
        this.checkAndSetInitValue("isDisabled",this.nodeData.prop,"boolean",false);
        // 是否默认选中this.nodeData.prop.isChecked
        this.checkAndSetInitValue("isChecked",this.nodeData.prop,"boolean",false);

        //【赋予全局冲突逻辑校验】
        //开启了单选但是传入数据又勾选了多个的情况不予通过
        if (this.rootData.globalConfig.singleSelect &&this.rootData.globalConfig._hasSelected &&this.nodeData.prop.isChecked) {
          throw new Error("不能在开启单选配置的情况下又让勾选项大于1项");
        }

        //【赋予全局内部变量值】
        if (this.nodeData.prop.isChecked === true) {
          this.rootData.globalConfig._hasSelected = true;
        }
      },

      /**
       * 给当前节点数据模型写入唯一hash标识，建立dom -> hash -> 数据 的标识
       * */
      setTreeNodeMap() {
        //给当前节点的子节点生成一份hash,并保留内存空间
        var childHashKeyList = this.nodeData.nodes.map(item => (item._hash = this.generateHash()));
        childHashKeyList.map(eachHashKey => (this.rootData._UITreeMap[eachHashKey] = {}));

        //针对添加节点操作，本身是没有hashkey的，这个时候在初始化的时候增加hashKey
        if(this.nodeData._hash === undefined){
          this.nodeData._hash = this.generateHash();
          this.rootData._UITreeMap[this.nodeData._hash] = {};
        }

        /**
         *  额外维护一份 hash值映射=>数据模型的表，方便后期做拖拽扩展，减少遍历性能开销
         * */
        //保存当前节点的数据模型
        this.rootData._UITreeMap[this.nodeData._hash].model = this.nodeData;
        //添加节点和数据
        this.rootData._UITreeMap[this.nodeData._hash].addNode = this.addNode;
        //删除当前节点和子节点，同时子节点的删除数据
        this.rootData._UITreeMap[this.nodeData._hash].remove = this.remove;
        //在兄弟节点中找到自己的索引
        this.rootData._UITreeMap[this.nodeData._hash].getIndexInSiblings = this.getIndexInSiblings;
        //父亲节点
        this.rootData._UITreeMap[this.nodeData._hash].parent = this.parentNodeData ?this.rootData._UITreeMap[this.parentNodeData._hash] :null;
        //子节点，空指针（此时子节点还没生成）
        this.rootData._UITreeMap[this.nodeData._hash].children = childHashKeyList.length ? childHashKeyList.map(eachHashKey => this.rootData._UITreeMap[eachHashKey]) :null;
        //获取当前节点的深度
        this.rootData._UITreeMap[this.nodeData._hash].getDepth = this.getDepth;
      },

      startDrag(event) {
        // console.log(this.rootData._UITreeMap[this.nodeData._hash].children);
        // 只有元素是vue-tree-handle是才执行拖动
        if (!("handle" in event.target.dataset)) return;

        //拖动时计算placeholder区域宽高
        var draggingAreaWidth = this.getCss(this.$refs.draggAbleEle, "width");
        this.draggingData.placeholderSize.width = +draggingAreaWidth.slice(0, draggingAreaWidth.indexOf("px")) - 20 + "px";
        this.draggingData.placeholderSize.height = this.getCss(this.$refs.draggAbleEle, "height");
        //拿到正在拖拽区域的nodeData
        this.draggingData.nodeData = $.extend(true, {}, this.nodeData);
        this.params.flag = true;

        if (!event) {
          event = window.event;
          event.target.onselectstart = function () {
            return false;
          };
        }
        var e = event;
        this.params.currentX = e.clientX;
        this.params.currentY = e.clientY;
        // console.log(`起始元素位置X:${e.clientX},Y:${e.clientY}`)

        //执行拖拽交互
        document.onmousemove = event => {
          var e = event ? event : window.event;
          if (this.params.flag) {
            var nowX = e.clientX,
                nowY = e.clientY;
            var disX = nowX - this.params.currentX,
                disY = nowY - this.params.currentY;

            this.$refs.draggAbleEle.style.left = parseInt(this.params.left) + disX + "px";
            this.$refs.draggAbleEle.style.top = parseInt(this.params.top) + disY + "px";
            // console.log(`当前元素的值：left:${this.$refs.draggAbleEle.style.left},right:${this.$refs.draggAbleEle.style.top}`)
            if (event.preventDefault) {event.preventDefault();}
            return false;
          }
        };
      },

      endDrag() {
        this.params.flag = false;
        //拖拽结束，回复原先坐标
        this.$refs.draggAbleEle.style = "";
      },
      //切换勾选状态
      toggleChecbox() {
        
        if (this.nodeData.prop.isDisabled) {
          return;
        }
        //检查全局配置，是单选又有至少一项选中项，且当前选中项为假的不予通过
        if (this.rootData.globalConfig.singleSelect && this.rootData.globalConfig._hasSelected && !this.nodeData.prop.isChecked ) {
          return;
        }

        this.nodeData.prop.isChecked = !this.nodeData.prop.isChecked;

        //在全局配置中标出选中项
        if (this.nodeData.prop.isChecked === true) {
          this.rootData.globalConfig._hasSelected = true;
        } else {
          //每次取消勾选都去判断是否已经取消勾选完并设置全局flag状态。
          for (var p in this.rootData._UITreeMap) {
            if (this.rootData._UITreeMap[p].model.prop.isChecked == true) {
              this.rootData.globalConfig._hasSelected = true;
              break;
            } else {
              this.rootData.globalConfig._hasSelected = false;
            }
          }
        }

        var arr = [];
        for (var p in this.rootData._UITreeMap) {
          if (this.rootData._UITreeMap[p].model.prop.isChecked) {
            arr.push(this.rootData._UITreeMap[p].model);
          }
        }
        console.log(arr);
      },

      //切换折叠状态
      toggleCollapseStatus() {
        this.nodeData.prop.isExpand = !this.nodeData.prop.isExpand;
      },
      //添加子节点
      addNode() {
        this.rootData.rootInstance.$emit("on-add",this.nodeData, this.rootData._UITreeMap[this.nodeData._hash])
      },

      
      deleteThisNode() {
        var defer = this.defered();
        //这里隔离数据，返回的数据和原有的数据不再有关联，防止操作数据引起的节点树未删除的情况
        var data = JSON.parse(JSON.stringify(this.nodeData));
        delete data.nodes;
        delete data.prop;
        this.rootData.rootInstance.$emit("on-delete",data,defer);
        defer.promise.then(()=>{this.remove()})
      },

      //删除自身和子树,同时删除其数据模型
      remove(){
         var i = this.parentNodeData.nodes.findIndex(item => {
           item._hash == this.nodeData._hash;
         });

         //如果不存在子树
         if (!this.nodeData.nodes.length) {
           this.rootData._UITreeMap[this.nodeData._hash] = null;
           delete this.rootData._UITreeMap[this.nodeData._hash];
         } else {
           //找到树中删除所有建立的索引
           this.nodeData.nodes.map(item => item._hash).map(hashKey => {
             this.rootData._UITreeMap[hashKey].remove();
             this.rootData._UITreeMap[hashKey] = null;
             delete this.rootData._UITreeMap[hashKey];
           });
        }

        //最后删除数据
        this.parentNodeData.nodes.splice(i, 1);
      },

      //编辑当前节点
      editThisNode() {
        this.rootData.rootInstance.$emit("on-edit",this.nodeData, this.rootData._UITreeMap[this.nodeData._hash])
        this.nodeData.prop._isEdit = true;
      },

      // //确认修改
      // commitThisEditing() {
      //   //对比前后修改是否一致，一致则不作处理保存

      //   this.nodeData.title = this.currentEditValue;
      //   this.nodeData.prop._isEdit = false;
      //   this.currentEditValue = "";
      //   //发送数据给后端
      // },

      // //取消修改
      // cancelThisEditing() {
      //   this.nodeData.prop._isEdit = false;
      //   this.currentEditValue = "";
      // },

      //获取当前节点的状态
      isCurNodeStatus(type) {
        //没有针对node的配置项，默认显示
        if (!this.nodeData.prop) return true;

        //传入了对象的情况下判断是否为对象
        if (!this.checkThisType(this.nodeData.prop, "object")) {
          throw new Error("请传入一个对象");
          return;
        }

        //当前检查的属性是是否可以被删除
        if (type == "delete") {
          //该对象能删除，返回真，该对象不能删除，返回假
          if (this.nodeData.prop.deletable) {
            return true;
          } else {
            return false;
          }
        } 
      },

      //获取当前节点在父层的索引
      getIndexInSiblings() {
        if (!this.parentNodeData) {
          return -1;
        } else {
          return this.parentNodeData.nodes.findIndex(
            item => item._hash == this.nodeData._hash
          );
        }
      },

      //vue树相关：递归获取当前节点的深度
      getDepth() {
        var depth = 1,
          curParentNode = this.rootData._UITreeMap[this.nodeData._hash].parent;

        while (curParentNode) {
          curParentNode = curParentNode.parent;
          depth++;
        }
        return depth;
      },

      //检查属性的类型并且设置默认值
      checkAndSetInitValue(prop, Obj, type, initValue) {
        if (!(prop in Obj)) {
          this.$set(Obj, prop, initValue);
        } else if (!this.checkThisType(Obj[prop], type)) {
          var typeMap = {
            boolean: "布尔值"
          };

          throw new Error(`树型组件传入prop.${prop}必须为${typeMap[type]}`);
        }
      },
    //拖拽处理-huijuan
    //计算拖拽节点的放置方式0（作为目标节点的子节点），-1（放置在目标节点的前面）,1（放置在目标节点的后面）
    calDropPosition(e) {
      var offsetTop = e.target.offsetTop;
      var offsetHeight = e.target.offsetHeight;
      var pageY = e.pageY;
      var gapHeight = 0.2 * offsetHeight;
      if (pageY > offsetTop + offsetHeight - gapHeight) {//放在目标节点后面-同级
        return 1;
      }
      if (pageY < offsetTop + gapHeight) {//放在目标节点前面-同级
        return -1;
      }
      //放在目标节点里面-作为子节点
      return 0;
    },
    //获取放置位置
    getDropPosition: throttle(function (e) {
      this.rootData.dragOverStatus.dropPosition = this.calDropPosition(e);//放置标识0，-1,1
    }, 200),
    //拖拽处理-huijuan
    //拖拽开始
    onDragStart(e) {
      e.stopPropagation();
      e.dataTransfer.effectAllowed = "move";
      this.nodeData.prop.isExpand = false;
      this.rootData.dragOverStatus.dragNode = this.nodeData;
      this.dragNodeHighlight= true;
      try {
         e.dataTransfer.setData('text/plain', '');
      } catch (error) {
      }
      this.rootData.rootInstance.$emit('dragStart', { treeNode: this.nodeData, event: e });
    },
    //进入目标节点
    onDragEnter(e) {
      e.preventDefault();
      e.stopPropagation();
      if(!this.rootData.dragOverStatus.dragNode || !this.rootData.dragOverStatus.dragNode._hash){
        return;
      }
      this.rootData.dragOverStatus.overNodeKey="";
      this.rootData.dragOverStatus.dropPosition=null;
      //拖拽节点与目标节点是同一个，return掉
      if (this.nodeData._hash === this.rootData.dragOverStatus.dragNode._hash) {
        return;
      }
      this.nodeData.prop.isExpand = true;
      this.rootData.dragOverStatus.overNodeKey = this.nodeData._hash;//当前经过的可放置的节点的key
      this.rootData.rootInstance.$emit('dragEnter', { treeNode: this.nodeData, event: e });
    },
    onDragOver(e) {
      e.preventDefault();
      e.stopPropagation();
      this.getDropPosition(e);
      // this.dispatch('vueTree', 'dragOver', { treeNode: this.nodeData, event: e });
      this.rootData.rootInstance.$emit('dragOver', { treeNode: this.nodeData, event: e });
      return false;
    },
    onDragLeave(e) {
      e.stopPropagation();
      this.rootData.rootInstance.$emit('dragLeave', { treeNode: this.nodeData, event: e });
    },
    onDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      this.rootData.dragOverStatus.overNodeKey = "";
      //拖拽节点与目标节点是同一个，不做任何操作
      if (this.rootData.dragOverStatus.dragNode._hash === this.nodeData._hash) {
        return;
      }
      var res = {
        event: e,
        dragNode: this.rootData.dragOverStatus.dragNode,
        dropNode: this.nodeData,
        dropPosition: this.rootData.dragOverStatus.dropPosition
      };
      this.rootData.rootInstance.$emit('drop', res);
    },
    onDragEnd(e) {
      e.stopPropagation();
      e.preventDefault();
      this.rootData.dragOverStatus.dragNode=null;
      this.rootData.dragOverStatus.overNodeKey = "";
      this.dragNodeHighlight= false;
      this.rootData.rootInstance.$emit('dragEnd', { treeNode: this.nodeData, event: e });
    },

      //统计选中项的数量

      /****************工具方法 ****************/

      generateHash(num = 6) {
        var collectStr = "abcdefghijklmnopqrstuvwxyz0123456789",
          i = 0,
          str = "";
        while (i < num) {
          str += collectStr[Math.round(Math.random() * 35)];
          i++;
        }
        return str;
      },

      defered(){
        var resolve,reject;
        return {
          promise:new Promise(function(res,rej){resolve = res;reject = rej;}),
          resolve:resolve,
          reject:reject
          }
      },

      getCss(o, key) {
        return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
      },
      //检查当前值类型
      checkThisType(data, type) {
        //基本类型
        if (type === "boolean") {
          return typeof data == "boolean";
        }

        //引用类型:对象
        if (type === "object") {
          return (Object.prototype.toString.call(data).toLowerCase() == "[object object]");
        }
      }
    }
    };
</script>

