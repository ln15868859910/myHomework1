<template>
    <div v-clickoutside="handleClose" :class="classes">
        <div :class="[prefixCls + '-selection']" @click="toggleMenu" ref="reference">
            <span :class="[prefixCls + '-placeholder']" v-show="showPlaceholder && !filterable">{{ placeholder }}</span>
            <span :class="[prefixCls + '-selected-value']" v-show="!showPlaceholder && !multiple && !filterable">{{ query }}</span>
            <input v-model="query" :placeholder="placeholder"  v-show="filterable" :class="[prefixCls + '-input']" @blur="handleBlur">
            <Icon type="close" :class="[prefixCls + '-arrow']" v-show="showCloseIcon" @click.native.stop="clearSingleSelect"></Icon>
            <Icon type="arrow-down" :class="[prefixCls + '-arrow']" v-if="!remote"></Icon>
        </div>
        <transition :name="transitionName">
            <!-- <div class="ivu-select-dropdown" v-show="visible"> -->
                <Dropdown v-show="visible" :placement="placement" ref="Dropdowndown">
                    <ul  :class="[prefixCls + '-not-found']" v-show="optioncount<1"><li>{{ placeholdText }}</li></ul>
                    <ul :class="[prefixCls + '-dropdown-list']" >
                        <slot></slot>
                    </ul>
                </Dropdown>
            <!-- </div> -->
        </transition>
    </div>
</template>

<script>
// 支持 本地搜索  远程搜索 
// 支持 默认数据不在列表数据内
// 支持 默认数据的HTML 自定义样式  和列表的自定义样式 
// 支持 多选 TODO
// 支持 列表数据 滚动加载 TODO


import Emitter from './../../mixins/emitter';
import clickoutside from './../../directives/clickoutside';
import Icon from '../icon';
import Dropdown from './dropdown.vue';
const prefixCls = 'ivu-select';

export default {
    name: 'XbDroplist',
    mixins: [Emitter],
    componentName: 'XbDroplist',
    components: { Icon , Dropdown },
    directives:{ clickoutside },
    props: {
        value:{
            required:true
        },
        label:{
            type:String,
            default:''
        },
        filterable:{
            type:Boolean,
            default:false
        },
        multiple:Boolean,
        multipleLimit:{
            default:0,
            type:Number
        },
        valueKey: {
            type: String,
            default: 'value'
        },
        labelKey: {
            type: String,
            default: 'label'
        },
        loading:{
            type: Boolean,
            default:false
        },
        clearable:Boolean,
        remote:Boolean,
        remoteFnc:Function,
        placeholder:String,
        notFoundText:{
            default: '无匹配数据',
            type: String
        },
        loadingText:{
            default: '加载中',
            type: String
        }
    },
    data() { 
        return{
            visible: false,
            prefixCls: prefixCls,
            query:'',
            IsDroplist:true,
            lastquery:'',
            onquery:false,
            optioncount:0,
            inputWidth:'',
            placement:'bottom',
            filteredOptionsCount:Infinity
        };
    },
    methods:{
        toggleMenu(){
            this.visible = !this.visible;
        },
        handleClose(){
            this.visible = false;
        },
        handleBlur(){
            this.visible = false;
            this.onquery = false;
            this.updatequery();
        },  
        isObject(value){
            return Object.prototype.toString.call(value).toLowerCase() === '[object object]';
        },
        handleOptionSelect(option){
            if(this.multiple){
                // TODO
            }else{
                this.visible = false;
                this.$emit('input', option.value);
                if(this.isObject(this.value)){
                    this.$emit('change',option.value);
                }else{
                    this.$emit('change',{
                        value: option.value,
                        label: option.labelname
                    });
                }
                
            }
            
        },
        updatequery(){
            this.query = this.isObject(this.value) ? this.value[this.labelKey]||'' : this.label||'';
            this.lastquery = this.query;
        },
        localePlaceholder () {
            if (this.placeholder === undefined) {
                return this.t('i.select.placeholder');
            } else {
                return this.placeholder;
            }
        },
        clearSingleSelect(){
            this.handleOptionSelect({value:'',labelname:''});
        }
    },
    computed:{
        classes () {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-visible`]: this.visible,
                    [`${prefixCls}-disabled`]: this.disabled,
                    [`${prefixCls}-multiple`]: this.multiple,
                    [`${prefixCls}-single`]: !this.multiple,
                    [`${prefixCls}-show-clear`]: this.showCloseIcon,
                    [`${prefixCls}-${this.size}`]: !!this.size
                }
            ];
        },
        showCloseIcon () {
            return !this.multiple && this.clearable && !this.showPlaceholder;
        },
        transitionName() {
            return this.placement === 'bottom' ? 'slide-up' : 'slide-down';
        },
        currentvalue(){
            return this.label;
        },
        showPlaceholder(){
            return !this.query;
        },
        placeholdText () {
            return this.loading ? this.loadingText : this.notFoundText;
        }
    },
    created(){
        this.updatequery();
    },
    mounted(){
        this.$on('handleOptionClick', this.handleOptionSelect);
        this.inputWidth = this.$el.style.width || (this.$el.getBoundingClientRect().width + 'px');
    },
    watch:{
        value(){
            this.updatequery();
        },
        query(val){
            let querytext = '';
            this.$nextTick(() => {
                if (this.visible) this.broadcast('Dropdown', 'onupdatepopper');
            });
            if(this.lastquery!=val){
                this.onquery = true;
                querytext = val;
            }
            if(!this.onquery){
                return;
            }
            
            if(this.remote&typeof this.remoteFnc === 'function'){ 
                this.remoteFnc(querytext);
            }else{
                this.optioncount = 0;
            }
            
        },
        visible(val){
            

            if(val){
                this.broadcast('Dropdown', 'onupdatepopper');

            }else{
                this.$nextTick(() => {
                    this.placement = this.$refs.Dropdowndown.popperElm.offsetTop > this.$refs.Dropdowndown.referenceElm.offsetTop ? 'bottom':'top';
                });
                this.broadcast('Dropdown', 'ondestroypopper');
                this.$refs.reference.querySelector('input').blur();
            }
        },
        loading(val,oldval){
            if(!val&&oldval){
                // console.log(new Date().getTime())
                this.broadcast('Dropdown', 'onupdatepopper');
                this.$nextTick(() => {
                    this.broadcast('Dropdown', 'onupdatepopper');
                });
            }
        }
    }
};
</script>

<style>

</style>
