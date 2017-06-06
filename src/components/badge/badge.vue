<template>
    <span v-if="dotImg" :class="classes" ref="badge">
        <slot></slot>
        <sup :class="dotImgClasses" v-show="badge"></sup>
    </span>
    <span v-else-if="dotFont" :class="classes" ref="badge">
        <slot></slot>
        <sup :class="dotFontClasses" v-show="badge"></sup>
    </span>
    <span v-else :class="classes" ref="badge">
        <slot></slot>
        <sup v-if="count" :class="countClasses" v-show="badge">{{ finalCount }}</sup>
    </span>
</template>
<script>
const prefixCls = 'ivu-badge';

export default {
    name: 'Badge',
    props: {
        count: [Number, String],
        dotImg: {
            type: Boolean,
            default: false
        },
        dotFont: {
            type: Boolean,
            default: false
        },
        overflowCount: {
            type: [Number, String],
            default: 99
        },
        className: String
    },
    computed: {
        classes() {
            return `${prefixCls}`;
        },
        dotImgClasses() {
            return `${prefixCls}-dotImg`;
        },
        dotFontClasses() {
            return `${prefixCls}-dotFont`;
        },
        countClasses() {
            return [
                `${prefixCls}-count`,
                {
                    [`${this.className}`]: !!this.className,
                    [`${prefixCls}-count-alone`]: this.alone
                }
            ];
        },
        finalCount() {
            return parseInt(this.count) >= parseInt(this.overflowCount) ? `${this.overflowCount}+` : this.count;
        },
        badge() {
            let status = false;

            if (this.count) {
                status = !(parseInt(this.count) === 0);
            }

            if (this.dotImg) {
                status = true;
                if (this.count) {
                    if (parseInt(this.count) === 0) {
                        status = false;
                    }
                }
            }

            if (this.dotFont) {
                status = true;
                if (this.count) {
                    if (parseInt(this.count) === 0) {
                        status = false;
                    }
                }
            }
            return status;
        }
    },
    data() {
        return {
            alone: false
        };
    },
    mounted() {
        const child_length = this.$refs.badge.children.length;
        if (child_length === 1) {
            this.alone = true;
        }
    }
};
</script>
