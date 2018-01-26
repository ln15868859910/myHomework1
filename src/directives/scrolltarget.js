/**
 * 滚动锚点定位
 */
import { countHeight } from './../utils/scroll';

export default {
    bind (el, binding, vnode) {
        el.setAttribute("spui-target",binding.value);
        function scrollHandler (e) {
            if(countHeight(el)){
                document.querySelectorAll("[spui-anchor='anchor']").forEach(dom=>{
                    dom.classList.remove("current");
                })
                var targetNode = document.querySelectorAll("[spui-anchor-value='"+binding.value+"']")[0];
                targetNode.classList.add("current")
            }
        }
        el.__vueClickOutside__ = scrollHandler;
        document.addEventListener('scroll', scrollHandler);
    },
    update () {

    },
    unbind (el, binding) {
        document.removeEventListener('scroll', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    }
};