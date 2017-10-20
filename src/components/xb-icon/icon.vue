<template>
    <i :class="classes" :style="styles">
    </i>
</template>
<script>
const prefixCls = 'xb-icon';
const baseFontSize = 16;
export default {
    name: 'XbIcon',
    props: {
        type: String,
        scale: String
    },
    computed: {
        classes() {
            return [
                `${prefixCls}`,
                `${prefixCls}-${this.type}`
            ];
        },
        styles() {
            let style = {};
            if (this.scale) {
                style.fontSize = this.scale * baseFontSize+"px";
            }
            return style;
        },
    }
};
</script>
