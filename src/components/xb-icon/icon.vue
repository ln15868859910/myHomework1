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
        scale: String,
        attachClass: String //支持传入自定义样式 add by tianyu.chen @2017年10月20日13:09:25
    },
    computed: {
        classes() {
            return [
                `${prefixCls}`,
                `${prefixCls}-${this.type}`,
                {
                    [this.attachClass]: !!this.attachClass
                }
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
