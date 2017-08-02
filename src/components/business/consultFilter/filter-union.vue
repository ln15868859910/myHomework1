<template>
    <div :class="unionItemWrap">
        <union-group-component :model="item" v-for="(item,index) in model.modelList" :key="index"></union-group-component>
    
    </div>
</template>
<script>
import Emiter from './emiter.vue';
import UnionGroupComponent from './union-group-component.vue';
import { Select, Option, OptionGroup } from '../../select';


const prefixCls = "spui-b-consultFilter";

export default {
    name: 'consultFilterUnion',
    props: {
        model: {
            require: true
        }
    },
    components: {
        UnionGroupComponent: UnionGroupComponent
    },
    data() {
        return {
        };
    },
    computed: {
        unionItem() {
            return `${prefixCls}-unionItem`
        },
        unionItemWrap() {
            return this.model.class ? this.model.class : `${prefixCls}-unionItemWrap`;
        }
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
        //移除联动模块子组件change事件
        Emiter.$off("union-change-slot", this.onChange);
    },
    methods: {
        init() {
            this.observeEvent();
        },
        observeEvent() {
            //监听联动模块子组件change事件
            Emiter.$on("union-change-slot", this.onChange);
        },
        onChange(params) {
            var _this = this;
            var data = {};
            if (params.componentType == "select") {
                data = {
                    sortName: params.sortName,
                    sortValue: params.sortValue,
                    label: []
                }
                params.value.map(function (item, index) {
                    var model = {
                        value: item.value,
                        text: item.label
                    }
                    data.label.push(model);
                })


            }
            Emiter.$emit("union-change", data);
        }

    }
};

</script>
