<template>
    <div style="display: flex;" @scroll="countHeight()">
        <div  style="flex:1;-webkit-box-flex: 1;htight:100;">
            <div class="scroll">
                <ul>
                    <li v-for="(item,index) in menus2" :class="current===index?'current':''" @click="scrollto(index)" class="scrolltab">
                        {{item}}
                        <Icon type="arrow-right" class="scrollicon"></Icon>
                    </li>
                </ul>
            </div>
        </div>
        <slot name="content">

        </slot>
    </div>
</template>

<script>
export default {
    props:{

    },
    data() {
        return {
            menus2: ['name1', 'name2', 'name3', 'name4', 'name5', 'name6'],
            offsetheight: [],
            current: 0
        };
    },
    methods: {
        countHeight() {
            var height = this.getscrollTop();
            var totalHeigth = this.getContentHeight(document.body);
            var screenHeight = this.getViewportHeight(document.body);

            var current = -1;
            var scrollH = totalHeigth - screenHeight;

            for (var i = 0, len = this.offsetheight.length; i < len; i++) {
                if (
                height >= scrollH * this.offsetheight[i] / totalHeigth &&
                height <= scrollH * this.offsetheight[i + 1] / totalHeigth
                ) {
                    current = i;
                } else if (height < scrollH * this.offsetheight[0] / totalHeigth) {
                    current = 0;
                } else if (
                height >
                scrollH * this.offsetheight[len - 1] / totalHeigth
                ) {
                    current = len - 1;
                }
            }
            this.current = current;
        },
        scrollto(index) {
            if(index==this.current){
                return;
            }
            var totalHeigth = this.getContentHeight(document.body);
            var screenHeight = this.getViewportHeight(document.body);

            var scrollH = totalHeigth - screenHeight;
            var reactheight = this.offsetheight[index];
            var offsetTop = scrollH * reactheight / totalHeigth;
            this.jump(offsetTop+2);
            // this.scrollTop(offsetTop+2);
        },
        jump(total) {
            var distance = this.getscrollTop();
            let step = total / 10;

            const _this = this;
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
                    _this.scrollTop(distance);
                    setTimeout(smoothDown, 10);
                } else {
                    _this.scrollTop(total);
                }
            }
            function smoothUp() {
                if (distance > total) {
                    distance -= step;
                    _this.scrollTop(distance);
                    setTimeout(smoothUp, 10);
                } else {
                    _this.scrollTop(total);
                }
            }
        },
        scrollTop(offsetTop) {
            document.documentElement.scrollTop = offsetTop;
            document.body.scrollTop = offsetTop;
        },
        getViewportHeight(element) {
            if (element === document.body) {
                return window.innerHeight || document.documentElement.clientHeight;
            } else {
                return element.clientHeight;
            }
        },

        getContentHeight(element) {
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
        },
        getscrollTop() {
            return window.pageYOffset || document.documentElement.scrollTop;
        }
    },
    mounted() {
        window.addEventListener('scroll', this.countHeight);
        var that = this;
        this.$el.querySelectorAll('.cate-item').forEach(function(dom, index) {
            that.offsetheight.push(dom.offsetTop);
        });
    }
};

// window.onresize = function() {
//     console.log('scrollHeight:' + document.documentElement.scrollHeight);
//     console.log('innerHeight' + window.innerHeight);
// };
</script>

<style>
.scroll {
  width: 152px;
  height: 800px;
  padding: 10px;
  top: 50px;
  left: 10px;
  position: fixed;
  background: #fff;
}
.scrolltab{
    height: 40px;
    width: 130px;
    font-size: 14px;
    line-height: 40px;
    text-align: center;
    color:#000;
    position: relative;
}
.scrollicon{
    display: none;
}
.scrolltab.current{
    background: #4A90E2;
    border-radius: 20px;
    color:#fff;
}
.scrolltab.current .scrollicon{
    display: inline-block;
    position: absolute;
    right: 10px;
    top: 13px;
}

</style>
