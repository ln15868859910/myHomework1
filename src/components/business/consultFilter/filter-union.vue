<template>
    <div>
        <component v-bind:model="model"  v-bind:is="currentView">
    
        </component>
    </div>
</template>
<script>
import { Select, Option, OptionGroup } from '../../select';

const ConsultFilterUnionComponent = {
    //template: '<h3 v-for="item in items">{{ item.c}}</h3>',
    props: {
        model: {
            require: true
        }
    },
    data() {
        return {
            //items : myData
        }
    },
    render: function (createElement) {
        if (this.model.type == 1) {
            return createElement(Select)
        }
        if (this.model.type == 2) {
            return createElement(Select)
        }

    }

};
export default {
    name: 'consultFilterUnion',
    props: {
        myModel:{
            require:true
        }
    },
    components: {
        ConsultFilterUnionComponent
    },
    data() {
        return {
            model: {
                type: 1,
                key: "single",
                text: "单选"
            },
            currentView: ConsultFilterUnionComponent
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
