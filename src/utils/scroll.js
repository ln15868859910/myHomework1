/**
 * 当前滚动高度
 */
export function getscrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
}
/**
 * 滚动方法
 * 
 * @export
 * @param {number} total 滚动的总高度
 */
export function jump(total) {
    var distance = getscrollTop();
    let step = total / 10;

    if (total > distance) {
        smoothDown();
    } else {
        let newTotal = distance - total;
        step = newTotal / 10;
        smoothUp();
    }
    function smoothDown() {
        if (distance < total) {
            distance += step;
            scrollTop(distance);
            setTimeout(smoothDown, 10);
        } else {
            scrollTop(total);
        }
    }
    function smoothUp() {
        if (distance > total) {
            distance -= step;
            scrollTop(distance);
            setTimeout(smoothUp, 10);
        } else {
            scrollTop(total);
        }
    }
}
/**
 * 判断滚动位置对应的是否是当前节点
 * 
 * @export
 * @param {HTMLElement} el 判断的节点
 * @returns 
 */
export function countHeight(el) {
    var height = getscrollTop();
    var totalHeigth = getContentHeight(document.body);
    var screenHeight = getViewportHeight(document.body);

    var scrollH = totalHeigth - screenHeight;
    var offsettop = el.offsetTop;
    var offsetheight = el.offsetHeight;

    if (height >= scrollH * offsettop / totalHeigth &&height <= scrollH * (offsettop+offsetheight) / totalHeigth){
        return true;
    }
    return false;
}
/**
 * 滚动方法
 * 
 * @export
 * @param {number} offsetTop 滚动的高度
 */
export function scrollTop(offsetTop) {
    document.documentElement.scrollTop = offsetTop;
    document.body.scrollTop = offsetTop;
}
/**
 * 获取Dom总高度
 * 
 * @export
 * @param {HTMLElement} element Dom
 * @returns 
 */
export function getViewportHeight(element) {
    if (element === document.body) {
        return window.innerHeight || document.documentElement.clientHeight;
    } else {
        return element.clientHeight;
    }
}
/**
 * 获取Dom总滚动高度
 * @param {HTMLElement} element Dom
 */
export function getContentHeight(element) {
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
/**
 * 滚到对应高度
 * 
 * @export
 * @param {number} reactheight 
 */
export function scrollto(reactheight) {
    var totalHeigth = getContentHeight(document.body);
    var screenHeight = getViewportHeight(document.body);

    var scrollH = totalHeigth - screenHeight;
    var offsetTop = scrollH * reactheight / totalHeigth;
    jump(offsetTop+2);
}