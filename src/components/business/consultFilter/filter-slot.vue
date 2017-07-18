<template>
    <div>
        <component v-bind:model="model" v-bind:is="currentView">
    
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
        if (this.model.componentType == 1) {
            return h(
                Select,
                {
                    props: {
                        value: 'hangzhou',
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
