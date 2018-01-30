<template>
  <div :class="['hoverpoper-wraper',customClass]">
      <div class="poper-wraper" v-if="visible" :style="customStyle">
          <div class="poper">
              <slot name="poper"></slot>
          </div>
      </div>
      <div  ref="hover" 
            @mouseenter="handleMouseenter"
            @mouseleave="handleMouseleave"
            @click="handleClick" 
            @mousedown="handleFocus(false)"
            @mouseup="handleBlur(false)">
          <slot name="hover"></slot>
      </div>
      
  </div>
</template>

<script>
import { oneOf } from '../../utils/assist';
export default {
    props:{
        placement:{ //偏移方向
            type: String,
            default: 'top',
            validator (value) {
                return oneOf(value, ['top', 'bottom']);
            },
        },
        top:{//偏移距离
            type: Number,
            default: 20
        },
        trigger:{//触发方式
            type:String,
            default:'hover',
            validator (value) {
                return oneOf(value, ['hover', 'click', 'focus']);
            },
        },
        customClass:String  //自定义样式
    },
    computed:{
        customStyle(){
            if(this.placement=='top'){
                return {
                    bottom:this.top + this.hoverHeight + 'px',
                    'min-width':this.minWidth + 'px',
                };
            }else{
                return {
                    top:this.top + this.hoverHeight - 10 + 'px',
                    'min-width':this.minWidth + 'px',
                };
            }
        }
    },
    data(){
        return{
            hoverHeight: 0,
            visible: false
        };
    },
    methods:{
        handleMouseenter(){
            if(this.trigger!=='hover'){
                return;
            }
            this.visible = true;
        },
        handleMouseleave(){
            if(this.trigger!=='hover'){
                return;
            }
            this.visible = false;
        },
        handleClick(){
            if(this.trigger!=='click'){
                return;
            }
            this.visible = !this.visible;
        },
        handleFocus(){
            if(this.trigger!=='focus'){
                return;
            }
            this.visible = true;
        },
        handleBlur(){
            if(this.trigger!=='focus'){
                return;
            }
            this.visible = false;
        }

    },
    mounted(){
        this.hoverHeight = this.$refs.hover.offsetHeight;
        this.minWidth = this.$refs.hover.offsetWidth;
    }
};
</script>

<style scoped>
.hoverpoper-wraper{
    position: relative;
    display: inline-block;
}
.poper{
    background: #fff;
    box-shadow: 0 10px 20px 0 rgba(6, 46, 95, 0.3);
    border-radius: 10px;
    min-height: 30px;
    padding: 10px;
    width: auto;
}
.poper-wraper{
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    margin-left: 0;
    z-index: 2015;
}
</style>
