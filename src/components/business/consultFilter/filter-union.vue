<template>
    <div>
        <common-slot v-for="(model,index) in model"  key="index" :model="model"></common-slot>
    </div>
</template>
<script>
import CommonSlot from './filter-slot.vue';
import Emiter from './emiter.vue';
// const ConsultFilterUnionComponent = {
//     //template: '<h3 v-for="item in items">{{ item.c}}</h3>',
//     props: {
//         model: {
//             require: true
//         }
//     },
//     data() {
//         return {
//             //items : myData
//         }
//     },
//     render: function (createElement) {
//         if (this.model.type == 1) {
//             return createElement(Select)
//         }
//         if (this.model.type == 2) {
//             return createElement(Select)
//         }

//     }

// };
export default {
    name: 'consultFilterUnion',
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
            
        };
    },
    computed: {

    },
    mounted() {
         this.init();
         Emiter.$on("union-change",this.onChange);
    },
    methods: {
        init(){

        },
        onChange(obj){
           
        }

    }
};

</script>
