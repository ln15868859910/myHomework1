<template>
    <div class="ivu-select-dropdown" :style="{ minWidth: minWidth }"><slot></slot></div>
</template>
<script>
    // import { getStyle } from '../../utils/assist';
    import Popper from '../../utils/vue-popper';

    export default {
        name: 'Dropdown',
        mixins: [Popper],
        props: {
            placement: {
                default: 'bottom-start'
            },
        },
        data () {
            return {
                minWidth: ''
            };
        },
        methods: {
        },
        created () {

        },
        mounted() {
            this.referenceElm = this.$parent.$refs.reference;
            this.$parent.popperElm = this.popperElm = this.$el;
            this.$on('onupdatepopper', () => {
                if (this.$parent.visible){
                    this.updatePopper();
                }

            });
            this.$on('ondestroypopper', this.destroyPopper);
        },
        watch: {
            '$parent.inputWidth'(val) {
                this.minWidth = val;
            }
        }
    };
</script>
