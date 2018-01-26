/**
 * 滚动锚点定位
 */
function countHeight(el) {
    var height = getscrollTop();
    var totalHeigth = getContentHeight(document.body);
    var screenHeight = getViewportHeight(document.body);

    var current = -1;
    var scrollH = totalHeigth - screenHeight;
    var offsettop = el.offsetTop;
    var offsetheight = el.offsetHeight;

    if (height >= scrollH * offsettop / totalHeigth &&height <= scrollH * (offsettop+offsetheight) / totalHeigth){
            return true;
    }
    return false;
}
function scrollTop(offsetTop) {
    document.documentElement.scrollTop = offsetTop;
    document.body.scrollTop = offsetTop;
}
function getViewportHeight(element) {
    if (element === document.body) {
        return window.innerHeight || document.documentElement.clientHeight;
    } else {
        return element.clientHeight;
    }
}

function getContentHeight(element) {
    if (element === document.body) {
        return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
        );
    } else {
        return element.scrollHeight;
    }
}
function getscrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

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