

<template>
    <div style="margin-left:150px;">
        <h3>xb-TransFer</h3>
        <anchorscroll>
            <button v-scrollanchor="{type:'anchor',target:'last'}" >最后一个</button>
            <div slot="sidetab">

            </div>
            <section class="cate-list" slot="content">
                <div  class="cate-item">
                    <div  :style="getClass()"> AAAAA</div>
                </div>
                <div  class="cate-item">
                    <div  :style="getClass()"> AAAAA</div>
                </div>
                <div  class="cate-item">
                    <div  :style="getClass()"> AAAAA</div>
                </div>
                <div  class="cate-item">
                    <div  :style="getClass()"> AAAAA</div>
                </div>
                <div  class="cate-item">
                    <div  :style="getClass()"> AAAAA</div>
                </div>
                <div  class="cate-item" v-scrollanchor="" name="last">
                    <div  :style="getClass()"> AAAAA</div>
                </div>
            </section>
        </anchorscroll>
    </div>
</template>
<script>
import anchorscroll from './../../src/b-component/anchorscroll/anchorscroll';
import scrollanchor from './../../src/directives/scrollanchor';
export default {
    components:{
        anchorscroll
    },
    directives:{scrollanchor},
    data() {
        return {
            message:''
        };
    },
    created() {
        
    },
    methods: {
        getClass() {
            var h = Math.random(10) * 400;
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
<style>
body{
    background:#dfe3ed;
}
</style>