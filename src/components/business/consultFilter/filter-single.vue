<template>
    <div>
        <common-slot v-for="(model,index) in model" :key="index" :model="model" ></common-slot>
    </div>
</template>

<script>

import CommonSlot from './filter-slot.vue';
import Emiter from './emiter.vue';

export default {
    name: 'consultFilterSingle',
    props: {

        model: {
            require: true
        }

    },
    components: {
        CommonSlot
    },
    data() {
        return {
            value: "筛选子组件-单选"
        };
    },
    computed: {

    },
    mounted() {
        Emiter.$on("single-change",this.fn);
    },
    methods: {
        fn(aa) {
            console.log(aa);
        }
    }
};

</script>
