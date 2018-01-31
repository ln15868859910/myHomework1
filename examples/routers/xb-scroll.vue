

<template>
    <div style="margin-left:150px;">
        <h3>xb-TransFer</h3>
        <div  style="flex:1;-webkit-box-flex: 1;htight:100;">
            <div class="scroll">
                <ul>
                    <li v-for="(item,index) in menus2" :class="current==item?'current':''" v-xbscroll.anchor="item" class="scrolltab" >
                        {{item}}
                        <Icon type="arrow-right" class="scrollicon"></Icon>
                    </li>
                </ul>
            </div>
        </div>
        
        <section class="cate-list" slot="content">
            <div  class="cate-item" v-xbscroll.target="menus2[0]">
                <div  :style="getClass()"> AAAAA</div>
            </div>
            <div  class="cate-item" v-xbscroll.target="menus2[1]">
                <div  :style="getClass()"> AAAAA</div>
            </div>
            <div  class="cate-item" v-xbscroll.target="menus2[2]">
                <div  :style="getClass()"> AAAAA</div>
            </div>
            <div  class="cate-item" v-xbscroll.target="menus2[3]">
                <div  :style="getClass()"> AAAAA</div>
            </div>
            <div  class="cate-item" v-xbscroll.target="menus2[4]">
                <div  :style="getClass()"> AAAAA</div>
            </div>
            <div class="cate-item" v-xbscroll.target="menus2[5]">
                <div  :style="getClass()"> AAAAA</div>
            </div>
        </section>
    </div>
</template>
<script>
// import anchorscroll from './../../src/b-component/anchorscroll/anchorscroll';
import xbscroll from './../../src/directives/xbscroll';

export default {
    components:{
        // anchorscroll
    },
    directives:{xbscroll},
    data() {
        return {
            menus2: ['name1', 'name2', 'name3', 'name4', 'name5', 'name6'],
            message:'',
            current:'name1',
            scrollname:'last'
        };
    },
    created() {
        
    },
    methods: {
        setCurrent(name){
            this.current = name;
        },
        getClass() {
            var h = 300+Math.random(10) * 400;
            return {
                height: h + 'px',
                background: `rgb(${Math.ceil(Math.random(1) * 255)}, ${Math.ceil(
                Math.random(1) * 255
                )}, ${Math.ceil(Math.random(1) * 255)})`,
                width: 500 + 'px'
            };
        },
    }
};
</script>
<style scoped>
body{
    background:#dfe3ed;
}
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