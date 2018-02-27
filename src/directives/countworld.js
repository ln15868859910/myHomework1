function getTarget(el) {
  var target;
  if (el.__vue__) {
    target =
      el.__vue__.$el.querySelectorAll("input")[0] ||
      el.__vue__.$el.querySelectorAll("textarea")[0];
  } else {
    target = el;
  }
  return target;
}

function insertSpan(el) {
  if (!getCountTarget(el).length) {
    var span = document.createElement("span");
    span.classList.add("xbcountworld");
    span.innerHTML = (countLen(el)/2) + "/" + (el.maxLength || 0) / 2;
    el.parentElement.appendChild(span);
  }
}

function getCountTarget(el) {
  return el.querySelectorAll("span.xbcountworld");
}

function countLen(target) {
  //计算总长度  中文2，非中1
  var len = 0;
  for (var i = 0; i < target.value.length; i++) {
    len = len + 2;
    var char = target.value[i];
    if (!/[^ -~]/.test(char)) {
      len--;
    }
  }
  return len;
}

function cutWorld(target) {
  var maxlen = target.maxLength,
    len = 0,
    text = "";
  for (var i = 0; i < target.value.length; i++) {
    len = len + 2;
    var char = target.value[i];
    if (!/[^ -~]/.test(char)) {
      len--;
    }
    if (len <= maxlen) {
      text += char;
    }
  }
  return text;
}

export default {
  bind(el, binding, vnode) {
    var target = getTarget(el);
    insertSpan(target);

    function changeHandler() {
      var len = countLen(target);
      var inserttarget = getCountTarget(el);
      if (len > target.maxLength) {
        target.value = cutWorld(target);
      }
      inserttarget[0].innerHTML =
        Math.ceil(countLen(target) / 2) + "/" + (target.maxLength || 0) / 2;
    }
    target.__vueChangeHandler__ = changeHandler;
    target.addEventListener("keyup", changeHandler);
  },
  update(el,dirname) {
    if(dirname.value!=dirname.oldValue){
      var target = getTarget(el);
      target.value = dirname.value;
      target.__vueChangeHandler__();
    }
  },
  unbind(el, binding) {
    var target = getTarget(el);
    target.removeEventListener("keyup", target.__vueChangeHandler__);
    delete target.__vueChangeHandler__;
  }
};
