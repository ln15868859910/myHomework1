<template>
    <div style="display:inline-block">
        <Tooltip :content="content" placement="top" :disabled="!isShowTip">
            <span class="txt-hide" :style="styles" :class="innnerClass" style="display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{content}}
            </span>
        </Tooltip>
    </div>
</template>
<script>
import Tooltip from '../tooltip/tooltip.vue';

export default {
    name: 'XbOverflowTip',
    components: { Tooltip },
    props: {
        content: {
            type: String
        },
        //限制宽度，也可在innerClass里控制
        width: {
            type: String
        },
        //内部文本框的样式
        innnerClass:{
            type: String
        }
    },
    data() {
        return {
            isShowTip: false,
            textWrap: ""
        };
    },
    computed: {
        styles() {
            let style = {};
            if (this.width) {
                style.width = this.width;
            }
            return style;
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.textWrap = this.$el.querySelector('.txt-hide');
            this.setToolTipVisible();
        },
        //判断是否溢出
        setToolTipVisible() {
            if (this.textWrap.offsetWidth < this.textWrap.scrollWidth) {
                this.isShowTip = true;
            }
            else{
                this.isShowTip = false;
            }
        }
    },
    updated() {
        this.setToolTipVisible();
    }
};
</script>
