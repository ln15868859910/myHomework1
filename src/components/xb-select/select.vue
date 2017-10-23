<template>
    <div :class="classes" v-clickoutside="hideMenu" style="position: relative;">
        <div class="ivu-select-selection" @click="toggleMenu" :class="[prefixCls2 + '-selection']">
            <span class="ivu-select-placeholder" v-if="!query">请选择</span>
            <input class="ivu-select-input" type="text" v-model="query" style="width:100%;" v-show="filterable" @input="onchange" @on-enter="search" @blur="handleBlur">
            <input class="ivu-select-input" type="text" v-model="query" readonly style="width:100%;" v-show="!filterable">
            <Icon type="close" :class="[prefixCls + '-arrow']" v-show="showdelete&&query" @click.native.stop="deleteSelect"></Icon>
            <Icon type="arrow-down" :class="[prefixCls + '-arrow']" v-show="!remote"></Icon>
        </div>

        <transition :name="transitionName">
            <div class="ivu-select-dropdown" x-placement="bottom" v-if="visible" style="width:100%;position: absolute;padding:10px;">
                <ul class="ivu-select-not-found" v-if="listData.length==0||(searching&&!this.searchlistData.length)">
                    <li>无匹配数据</li>
                </ul>
                <ul class="ivu-select-dropdown-list" v-show="!searching">
                    <li class="ivu-select-item" v-for="item in listData" :key="item[valueKey]" @click="selectThis(item)">
                        <slot :data="item" name="lislot">{{item[labelKey]}}</slot>
                    </li>
                    <li class="ivu-select-item ivu-select-item-disabled" v-if="remote&&remoteMethod">【更多选项请搜索】</li>
                </ul>
                <ul class="ivu-select-dropdown-list" v-show="searching">
                    <li class="ivu-select-item" v-for="item in searchlistData" :key="item[valueKey]" @click="selectThis(item)">
                        <slot :data="item" name="lislot">{{item[labelKey]}}</slot>
                    </li>
                </ul>
                <ul class="ivu-select-loading" v-show="loading">加载中</ul>
            </div>
        </transition>
    </div>
</template>
<script>
import Icon from '../icon';
import clickoutside from '../../directives/clickoutside';
import Emitter from '../../mixins/emitter';
import Locale from '../../mixins/locale';
const prefixCls = 'ivu-select';
const prefixCls2 = 'ivu-xbselect';

export default {
    name: 'XbSelect',
    mixins: [Emitter, Locale],
    components: { Icon },
    directives: { clickoutside },
    props: {
        value:{
            type:[String,Number]
        },
        listData: {
            //下拉列表
            type: Array
        },
        selectedData: {
            //选择的数据、默认数据
            type: Object
        },
        filterable:{
            type:Boolean,
            default:false
        },
        remoteMethod: {
            type: Function
        },
        filterMethod:{
            type: Function
        },
        remote: {
            type: Boolean,
            default: false
        },
        showdelete:{
            type: Boolean,
            default: true
        },
        valueKey:{
            type:String,
            default:'id'
        },
        labelKey:{
            type:String,
            default:'name'
        },
        loading:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            prefixCls: prefixCls,
            prefixCls2:prefixCls2,
            query: '',
            disabled: false,
            visible: false,
            showClose: false,
            searching: false,//过滤状态
            lastData: {},
            nullble:false,
            model:'',
            searchlistData:[]
        };
    },
    computed: {
        classes() {
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
        transitionName: function() {
            return 'slide-up';
        },
        showCloseIcon () {
            return !this.multiple && this.showdelete;
        },
        currentLable(){
            if(this.value){
                return this.findValueLabel();
            }else{
                return this.selectedData[this.labelKey];
            }
        }
    },
    created: function() {
        this.lastData = Object.assign({}, this.selectedData);
    },
    methods: {
        findValueLabel(){
            var obj = this.listData.filter(item=>{
                var id = this.model;
                return item[this.valueKey] === id;
            });
            return obj.length ? obj[0][this.labelKey] : '';
        },
        handleBlur() { 
            this.visible = false;
            this.searching = false;
            this.updateQuery();
        },
        resetInputState() {
            this.inputLength = this.$refs.input.value.length * 12 + 20;
        },
        handleInputDelete() {
            
        },
        toggleMenu() {
            if (this.disabled) {
                return false;
            }
            this.visible = !this.visible;
        },
        hideMenu() {
            this.visible = false;
            this.showClose = false;
            // this.focusIndex = 0;
        },
        selectThis(data) {
            this.visible = false;
            this.showClose = false;
            this.lastData = Object.assign({}, data);
            this.$emit('input', data[this.valueKey]);
            this.model = data[this.valueKey];
            if(this.nullble){
                this.updateQuery();
            }
            this.$emit('confirm', data);
        },
        onchange(){
            this.searching = true;
            //只有本地搜索时才会实时？？
            if(this.remoteMethod){
                return;
            }
            if(!this.remote){
                return;
            }
            this.search();
        },
        search() {
            if (this.remoteMethod && typeof this.remoteMethod == 'function') {
                this.remoteMethod(this.query);
            } else if (this.remote) {
                if(this.filterMethod && typeof this.filterMethod == 'function'){
                    this.searchlistData = this.listData.filter(this.filterFnc);
                }else{
                    this.searchlistData = this.listData.filter((text) => {
                        return text[this.labelKey].indexOf(this.query) > -1;
                    });
                }

            }
        },
        deleteSelect() {
            var obj = Object.assign({}, this.lastData);
            obj[this.labelKey] = '';
            obj[this.valueKey]= 0;

            this.model = 0;
            this.updateQuery();
            this.$emit('confirm', obj);
        },
        updateQuery(){
            if((this.value===''||this.value===undefined)&&!this.selectedData){
                this.nullble = true;
                this.query = this.findValueLabel();
                return;
            }
            if(this.value===0){
                this.query = '';
                this.model = 0;
            }
            this.query =  (this.value!==''&&this.value!==undefined)? this.findValueLabel() : this.selectedData[this.labelKey];
        }
    },
    mounted(){
        this.updateQuery();
    },
    watch: {
        selectedData(){
            this.updateQuery();
        },
        value(val){
            if(val!==''||val!==undefined){
                this.updateQuery();
            }
        }
    }
};
</script>
