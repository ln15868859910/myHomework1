<template>
    <div :class="classes" v-clickoutside="hideMenu" style="position: relative;">
        <div class="ivu-select-selection" @click="toggleMenu" :class="[prefixCls2 + '-selection']">
            <span class="ivu-select-placeholder" v-if="!selectedData.name">请选择</span>
            <input class="ivu-select-input" type="text" v-model="selectedData.name" readonly style="width:100%;" @focus="showClose=true">
            <i class="ivu-icon ivu-icon-close" :class="[prefixCls2 + '-close']" v-show="selectedData.name" @click.stop.prevent="deleteSelect($event)"></i>
            <Icon type="arrow-down" class="ivu-select-arrow" style="position: absolute;right: 10px;top: 13px;display: inline-block;"></Icon>
        </div>

        <transition :name="transitionName">
            <div class="ivu-select-dropdown" x-placement="bottom" v-if="visible" style="width:100%;position: absolute;padding:10px;">
                <i-input v-model="query" placeholder="请输入..." icon="search" :maxlength=100 @blur="handleBlur" @keydown="resetInputState" @keydown.delete="handleInputDelete" @on-enter="search" @on-click="search" class="new-search" style="width:100%;" v-if="remote" @on-change="onchange"></i-input>
                <ul class="ivu-select-not-found" v-if="listData.length==0">
                    <li>无匹配数据</li>
                </ul>
                <ul class="ivu-select-dropdown-list" v-show="!searching">
                    <li class="ivu-select-item" v-for="item in listData" :key="item.id" @click="selectThis(item)">{{item.name}}</li>
                    <li class="ivu-select-item ivu-select-item-disabled" v-if="remote">【更多选项请搜索】</li>
                </ul>
                <ul class="ivu-select-dropdown-list" v-show="searching">
                    <li class="ivu-select-item" v-for="item in searchlistData" :key="item.id" @click="selectThis(item)">{{item.name}}</li>
                </ul>
                <ul class="ivu-select-loading" style="display: none;">加载中</ul>
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
        listData: {
            //下拉列表
            type: Array
        },
        selectedData: {
            //选择的数据、默认数据
            type: Object
        },
        remoteMethod: {
            type: Function
        },
        remote: {
            type: Boolean,
            default: false
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
        }
    },
    created: function() {
        this.lastData = Object.assign({}, this.selectedData);
    },
    methods: {
        handleBlur() { },
        resetInputState() {
            this.inputLength = this.$refs.input.value.length * 12 + 20;
        },
        handleInputDelete() {
            if (this.multiple && this.model.length && this.query === '') {
                this.removeTag(this.model.length - 1);
            }
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
            this.$emit('confirm', data);
        },
        onchange(){
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
            if (this.remoteMethod) {
                this.remoteMethod(this.query);
            } else if (this.remote) {
                this.searching = true;
                this.searchlistData = this.listData.filter((text) => {
                    return text.name.indexOf(this.query) > -1;
                });
            }
        },
        deleteSelect() {
            var obj = Object.assign({}, this.lastData);
            obj.name = '';
            obj.id = 0;
            obj.Id = 0;
            this.$emit('confirm', obj);
        }
    },

    watch: {
        query() {
            if (this.remoteMethod) {
                this.remoteMethod(this.query);
            }else if(this.remote){
                this.searching = !!this.query;
            }
        }
    }
};
</script>
