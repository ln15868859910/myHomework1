<template>
    <div>
        <common-slot v-for="(model,index) in modelList" :key="index" :model="model"></common-slot>
    </div>
</template>

<script>

import CommonSlot from './filter-slot.vue';
export default {
    name: 'consultFilterSingle',
    props: {

        modelList: {
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
        this.$on("aa",this.fn);
    },
    methods: {
        fn(aa) {
            console.log(aa);
        }
    }
};

</script>
