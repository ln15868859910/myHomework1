

<template>
    <div style="margin-left:150px;">
        <h3>xb-TransFer</h3>
        <anchorscroll>
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
                <div  class="cate-item">
                    <div  :style="getClass()"> AAAAA</div>
                </div>
            </section>
        </anchorscroll>
    </div>
</template>
<script>
import anchorscroll from './../../src/b-component/anchorscroll/anchorscroll';

export default {
    components:{
        anchorscroll
    },
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