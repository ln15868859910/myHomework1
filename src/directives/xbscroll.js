/**
 * 滚动锚点定位
 */
import { countHeight,scrollto } from './../utils/scroll';

export default {
    bind (el, binding, vnode) {
        if(binding.modifiers.target){
            el.setAttribute("xb-target",binding.value);

            el.__vueClickOutside__ = scrollHandler;
            document.addEventListener('scroll', scrollHandler);
        }else if(binding.modifiers.anchor){
            el.setAttribute("xb-anchor","anchor");
            el.setAttribute("xb-anchor-value",binding.value);

            el.__vueClickOutside__ = clickHandler;
            el.addEventListener('click', clickHandler);
        }

        function removeAllCurrent(){
            var nodeList = document.querySelectorAll("[xb-anchor='anchor']");
            for(var i=0,len=nodeList.length;i<len;i++){
                nodeList[i].classList.remove("current");
            }
        }

        function scrollHandler (e) {
            if(countHeight(el)){
                removeAllCurrent();
                var targetNode = document.querySelectorAll("[xb-anchor-value='"+binding.value+"']")[0];
                if(!targetNode){
                    console.warn("target与Anchor不匹配");
                    return;
                }
                targetNode.classList.add("current")
            }
        }
        function clickHandler (e) {
            //获取目标节点
            if(el.classList.contains("current")){
                return;
            }
            removeAllCurrent();
            el.classList.add("current");
            var targetNode = document.querySelectorAll("[xb-target='"+binding.value+"']")[0];
            if(!targetNode){
                console.warn("target与Anchor不匹配");
                return;
            }
            scrollto(targetNode.offsetTop)
        }

    },
    update () {

    },
    unbind (el, binding) {
        var type = binding.modifiers.target?'scroll':'click';
        document.removeEventListener(type, el.__vueClickOutside__);  
        delete el.__vueClickOutside__;
    }
};