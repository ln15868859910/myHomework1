<template>
    <div>
        <component :model="model" :is="currentView">
    
        </component>
    </div>
</template>
<script>
import { Select, Option, OptionGroup } from '../../select';
const FilterSlotComponent = {
    props: {
        model: {
            require: true
        }
    },
    data() {
        return {
        }
    },
    render(h) {
        if (this.model.type == 1) {
            return h(
                Select,
                {
                    props: {
                        value: this.model.value,
                        multiple: this.model.multiple,
                        disabled: this.model.disabled,
                        filterable: this.model.filterable,
                        placeholder: this.model.placeholder,
                        clearable:true
                    },
                },
                [
                    this.model.optionList.map(function (item) {
                        return h(Option, {
                            attrs: {
                                id: 'foo'
                            },
                            props: {
                                label: item.label,
                                value: item.value
                            }
                        })
                    })

                ]
            )
            // return h(Select, {
            //     value: "s",
            //     disabled: true,
            //     cityList: [
            //         {
            //             value: 'beijing',
            //             label: '北京市'
            //         },
            //         {
            //             value: 'shanghai',
            //             label: '上海市'
            //         },
            //         {
            //             value: 'shenzhen',
            //             label: '深圳市'
            //         },
            //         {
            //             value: 'hangzhou',
            //             label: '杭州市'
            //         },
            //         {
            //             value: 'nanjing',
            //             label: '南京市'
            //         },
            //         {
            //             value: 'chongqing',
            //             label: '重庆市'
            //         }
            //     ]

            // });
        }
        if (this.model.type == 3) {
            var me = this;
            return h(
                Select,
                {
                    props: {
                        value: this.model.defaultSelectValue,
                        multiple: this.model.multiple,
                        disabled: this.model.disabled,
                        filterable: this.model.filterable,
                        placeholder: this.model.placeholder,
                        clearable:true
                    },
                    on:{
                        "on-change": function(a){
                            // me.model.callback(a)
                            console.log(me)
                            me.$emit("aa","aa")
                        }
                    }
                },
                [
                    this.model.lables.map(function (item) {
                        return h(Option, {
                            attrs: {
                                id: 'foo'
                            },
                            props: {
                                label: item.text,
                                value: item.value
                            }
                        })
                    })

                ]
            )
        }
        if (this.model.componentType == 1) {
            return createElement(Select);
        }
        else if (this.model.componentType == 2) {
            return createElement(Select);
        }
        else {
            return createElement(Select);
        }
    }

};
export default {
    name: 'filterSlot',
    props: {
        model: {
            require: true
        }
    },
    data() {
        return {
            currentView: FilterSlotComponent
        };
    },
    computed: {

    },
    mounted() {

    },
    methods: {

    }
};

</script>
