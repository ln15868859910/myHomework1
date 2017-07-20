<template>
    <div>
        <component v-for="(item,index) in model" key="index" :model="item" :is="currentView">
    
        </component>
    </div>
</template>
<script>

import Emiter from './emiter.vue';
import { Select, Option, OptionGroup } from '../../select';

const MultiFilterSlotComponent = {
    props: {
        model: {
            type: Object,
            require: true
        }
    },
    data() {
        return {
        }
    },
    render(h) {
        var _this = this;
        //select组件
        if (this.model.type == 1) {
            return h(
                Select, 
                {
                    props: {
                        value: this.model.defaultValue,
                        multiple: true,
                        disabled: this.model.disabled,
                        filterable: this.model.filterable,
                        placeholder: this.model.placeholder,
                        clearable: true,
                        "label-in-value": true
                    },
                    on: {
                        "on-change": function (value) {
                            var data = {
                                type: _this.model.type,
                                sortKey: _this.model.sortName,
                                multiple: _this.model.multiple,
                                value: value
                            }
                            if (!_this.model.sonSortKey) {
                                Emiter.$emit("multi-change-slot", data);
                            }
                            else {
                                _this.model.callback["on-change"](_this.model);
                            }

                        },
                        "on-query-change": function () {
                        }
                    }
                },
                [
                    this.model.optionList.map(function (item) {
                        return h(Option, {
                            props: {
                                label: item.label,
                                value: item.value
                            }
                        })
                    })

                ])
        }
    }

};

export default {
    name: 'consultFilterUnion',
    props: {
        model: {
            require: true
        }
    },
    components: {
    },
    data() {
        return {
            currentView: MultiFilterSlotComponent,
        };
    },
    computed: {

    },
    mounted() {
        this.init();
    },
    methods: {
        init() {

        },
        observeEvent() {
            //监听联动模块子组件change事件
            Emiter.$on("multi-change-slot", this.onChange);
        },
        onChange(params) {
            var _this = this;
            if (params.type == 1) {
                var data = {
                    sortKey: params.sortName,
                    label: []
                }
                if (params.multiple) {
                    params.value.map(function (value, index) {
                        var model = {
                            value: value.value,
                            text: value.label
                        }
                        data.label.push(model);
                    })
                }
                else {
                    var model = {
                        value: params.value,
                        text: params.label
                    }
                    data.label.push(model);
                }

            }
            Emiter.$on("multi-change", this.onChange);
        }

    }
};

</script>
