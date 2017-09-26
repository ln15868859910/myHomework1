<template>
    <i :class="classes">
    </i>
</template>
<script>
const prefixCls = 'xb-icon';

export default {
    name: 'XbIcon',
    props: {
        type: String
    },
    computed: {
        classes() {
            return [
                `${prefixCls}`,
                `${prefixCls}-${this.type}`
            ];
        }
    }
};
</script>
