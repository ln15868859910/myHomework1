<template>
    <transition name="xb-message-fade">
        <div :class="[messageClass,typeClass,customClass]" v-show="visible" @mouseenter="clearTimer" @mouseleave="startTimer" :style="topstyles">
            <span :class="iconClasses" v-if="showIcon">
                <Icon :type="iconTypeUi"></Icon>
            </span>
            <span v-if="title" :class="[titleClass]">{{title}}</span>
            <span :class="descClasses">{{message}}</span>
            <Icon type="close" v-if="showClose" :class="[closeIconClass]" @click.native="close()"></Icon>
        </div>
    </transition>
</template>

<script>
const prefixCls = 'ivu-xbmessage';

export default {
    data() {
        return {
            visible: false,
            message: '',
            title:'',
            duration: 3000,
            top:300,
            type: 'info',
            customClass: '',
            onClose: null,
            width:450,
            showIcon: false,//是否显示左侧图标
            iconType:"",//图标类名
            showClose: false,
            closed: false,
            timer: null,
            dangerouslyUseHTMLString: false
        };
    },

    computed: {
        typeClass() {
            return prefixCls+'-'+this.type;
        },
        messageClass() {
            return [
                prefixCls + '-message',
                {
                    [`${prefixCls}-with-icon`]: this.showIcon,
                    [`${prefixCls}-with-title`]: this.title,
                }
            ];
        },
        descClasses(){
            return prefixCls+'-desc';
        },
        closeIconClass(){
            return prefixCls+'-close';
        },
        iconClasses(){
            return prefixCls+'-icon';
        },
        titleClass(){
            return prefixCls+'-title';
        },
        topstyles(){
            return {
                top: `${this.top}px`,
                width:`${this.width}px`,
            };
        },
        iconTypeUi() {
            let type = '';
            if (this.iconType) {
                type = this.iconType;
            }
            else {
                switch (this.type) {
                    case 'success':
                        type = 'checkmark-filled';
                        break;
                    case 'info':
                        type = 'information-filled';
                        break;
                    case 'warning':
                        type = 'alert-filled';
                        break;
                    case 'error':
                        type = 'close-filled';
                        break;
                }
            }
            return type;
        }
    },

    watch: {
        closed(newVal) {
            if (newVal) {
                this.visible = false;
                this.$el.addEventListener('transitionend', this.destroyElement);
            }
        }
    },

    methods: {
        destroyElement() {
            this.$el.removeEventListener('transitionend', this.destroyElement);
            this.$destroy(true);
            this.$el.parentNode.removeChild(this.$el);
        },

        close() {
            this.closed = true;
            if (typeof this.onClose === 'function') {
                this.onClose(this);
            }
        },

        clearTimer() {
            clearTimeout(this.timer);
        },

        startTimer() {
            if (this.duration > 0) {
                this.timer = setTimeout(() => {
                    if (!this.closed) {
                        this.close();
                    }
                }, this.duration);
            }
        },
        keydown(e) {
            if (e.keyCode === 46 || e.keyCode === 8) {
                this.clearTimer(); // detele 取消倒计时
            } else if (e.keyCode === 27) {
                // esc关闭消息
                if (!this.closed) {
                    this.close();
                }
            } else {
                this.startTimer(); // 恢复倒计时
            }
        }
    },
    mounted() {
        this.startTimer();
        document.addEventListener('keydown', this.keydown);
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.keydown);
    }
};
</script>
