export function getscrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
}
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
export function scrollTop(offsetTop) {
    document.documentElement.scrollTop = offsetTop;
    document.body.scrollTop = offsetTop;
}
export function getViewportHeight(element) {
    if (element === document.body) {
        return window.innerHeight || document.documentElement.clientHeight;
    } else {
        return element.clientHeight;
    }
}

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

export function scrollto(reactheight) {
    var totalHeigth = getContentHeight(document.body);
    var screenHeight = getViewportHeight(document.body);

    var scrollH = totalHeigth - screenHeight;
    var offsetTop = scrollH * reactheight / totalHeigth;
    jump(offsetTop+2);
}