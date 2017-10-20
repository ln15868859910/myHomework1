<template>
  <li @click.stop="selectOptionClick"
    :class="classes"
    v-show="visible"
    >
    <slot>
      <span>{{ labelname }}</span>
    </slot>
  </li>
</template>

<script>
import Emitter from './../../mixins/emitter';
const prefixCls = 'ivu-select-item';

export default {
    name: 'XbOption',
    mixins: [Emitter],
    componentName: 'XbOption',
    props: {
        value:{
            type:[String,Object,Number]
        },
        disabled:{
            type:Boolean,
            default:false 
        },
        label:String
    },
    data() { 
        return{
            visible:true
        };
    },
    methods:{
        selectOptionClick(){//选中当前项
            if(!this.disabled){
                this.dispatch('XbDroplist','handleOptionClick',this);
            }
        },
        contains(arr = [], target) {
            if (!this.isObject) {
                return arr.indexOf(target) > -1;
            } else {
                const valueKey = this.parent.valueKey;
                return arr.some(item => {
                    return item[valueKey]==target[valueKey];
                });
            }
        },
        isEqual(a, b) {
            if (!this.isObject) {
                return a === b;
            } else {
                const valueKey = this.parent.valueKey;
                return a[valueKey] === b[valueKey];
            }
        },
        queryChange(query) {
            if(!this.onquery){
                this.visible = true;
                return;
            }
            // query 里如果有正则中的特殊字符，需要先将这些字符转义
            let parsedQuery = String(query).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
            this.visible = new RegExp(parsedQuery, 'i').test(this.labelname);
            if (this.visible) {
                this.parent.optioncount++;
            }
        }
    },
    computed:{
        parent(){
            let result = this.$parent;
            while (!result.IsDroplist) {
                result = result.$parent;
            }
            return result;
        },
        classes () {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-disabled`]: this.disabled,
                    [`${prefixCls}-selected`]: this.itemSelected,
                    [`${prefixCls}-focus`]: this.isFocus
                }
            ];
        },
        labelname(){
            return  this.isObject ? this.value[this.parent.labelKey] : this.label;
        },
        itemSelected() {
            if (!this.parent.multiple) {
                return this.isEqual(this.value, this.parent.value);
            } else {
                return this.contains(this.parent.value, this.value);
            }
        },
        isObject(){
            return Object.prototype.toString.call(this.value).toLowerCase() === '[object object]';
        },
        onquery(){
            return this.parent.onquery;
        },
        querytext(){
            return this.parent.query;
        }
    },
    created(){
        // console.log('create');
        this.parent.optioncount++;
    },
    beforeDestroy() {
        // console.log('remove');
        this.parent.optioncount--;
    },
    watch:{
        querytext(val){
            if(!this.parent.remote){
                this.queryChange(val);
            }
            
        }
    }
};
</script>

<style>

</style>
