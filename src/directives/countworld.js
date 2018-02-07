function getTarget(el){
    var target;
    if(el.__vue__){
        target = el.__vue__.$el.querySelectorAll("input")[0];
    }else{
        target = el;
    }
    return target;
}

function insertSpan(el){
    if(!el.parentElement.querySelectorAll("span.xbcountworld").length){
        var span = document.createElement("span");
        span.classList.add("xbcountworld");
        span.innerHTML = el.value.length+'/'+el.maxLength||0;
        el.parentElement.append(span);
    }
}
export default {
    bind (el, binding, vnode) {
        var target = getTarget(el);
        insertSpan(target);
        function changeHandler(event){
            var len = target.value&&target.value.length||0;
            var inserttarget = target.parentElement.querySelectorAll("span.xbcountworld");
            if(!inserttarget.length){
                inserttarget = insertSpan(target);
            }
            inserttarget[0].innerHTML = len+'/'+target.maxLength||0;
        }
        target.__vueChangeHandler__ = changeHandler;
        target.addEventListener('input',changeHandler);
        console.log(target);
    },
    update () {

    },
    unbind (el, binding) {
        var type = 'input';
        var target = getTarget(el);
        target.removeEventListener(type, target.__vueChangeHandler__);  
        delete target.__vueChangeHandler__;
    }
};