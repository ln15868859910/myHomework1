/**
 * 滚动锚点定位
 */
export default {
    bind (el, binding, vnode) {
        function scrollHandler (e) {
            if (el.contains(e.target)) {
                return false;
            }
            if (binding.expression) {
                // binding.value(e);
                console.log(binding.expression);
            }
        }
        el.__vueClickOutside__ = scrollHandler;
        document.addEventListener('scroll', scrollHandler);
    },
    update () {

    },
    unbind (el, binding) {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    }
};