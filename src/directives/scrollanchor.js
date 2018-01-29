/**
 * 滚动锚点定位
 */

import { scrollto } from './../utils/scroll';
export default {
    bind (el, binding, vnode) {
        el.setAttribute("spui-anchor","anchor");
        el.setAttribute("spui-anchor-value",binding.value);
        function clickHandler (e) {
            //获取目标节点
            if(el.classList.contains("current")){
                return;
            }
            document.querySelectorAll("[spui-anchor='anchor']").forEach(dom=>{
                dom.classList.remove("current");
            })
            el.classList.add("current");
            var targetNode = document.querySelectorAll("[spui-target='"+binding.value+"']")[0];
            scrollto(targetNode.offsetTop);
        }
        el.__vueClickOutside__ = clickHandler;
        el.addEventListener('click', clickHandler);
    },
    update () {

    },
    unbind (el, binding) {
        document.removeEventListener('click', el.__vueClickOutside__);  
        delete el.__vueClickOutside__;
    }
};