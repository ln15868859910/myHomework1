<template>
    <div :class="unionItemWrap" :style="{display:model.modelList.length?'block':'none'}">
        <union-group-component :model="item" v-for="(item,index) in model.modelList" :key="index"></union-group-component>
    
    </div>
</template>
<script>
import emitter from "./emit";
import UnionGroupComponent from './union-group-component.vue';
import { Select, Option, OptionGroup } from '../../components/select';


const prefixCls = "spui-b-consultFilter";

export default {
    name: 'consultFilterUnion',
    mixins:[emitter],
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
             return [`${prefixCls}-unionItemWrap`,{
                [this.model.class]: this.model.class
            }];
        }
    },
    created () {
        this.$on("union-change-slot", this.onChange);
    },
    beforeDestroy() {
        //移除联动模块子组件change事件
        this.$off("union-change-slot", this.onChange);
    },
    methods: {

        onChange(params,type) {
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
            this.dispatch("consultFilter","union-change", data,type);
        }

    }
};

</script>
