<template>
    <div>
        <Xb-Input-number :max="10" name="he" :min="-1" v-model="v1" :autofocus="autofocus" :defaultnumber="4"></Xb-Input-number>
        {{ v1 }}
        <div @click="c">change v1</div>
        <Xb-Input-number disabled :max="10" :min="1" :step="1.2" v-model="v2"></Xb-Input-number>

        隐藏步数 hidestep：
        <Xb-Input-number :max="10" name="he" :min="-1" v-model="v2" :autofocus="autofocus" hidestep></Xb-Input-number>

        小数位数：
        <Xb-Input-number name="he" v-model="v3" :autofocus="autofocus" :fixed="2" :max="10"  :min="0.01"></Xb-Input-number>

        可为空：
        
            <Xb-Input-number :max="10" name="he" :min="-1" v-model="v4" :autofocus="autofocus" :required="false" ></Xb-Input-number>
        
        
        默认值：
        <Xb-Input-number :max="10" name="he" :min="-1" v-model="v5" :defaultnumber="2" @input="change2"></Xb-Input-number>
        <xb-input-number v-model="v6" style="width: 200px" hidestep :required="false" :defaultnumber=0 :fixed="2"></xb-input-number>
    </div>
</template>
<script>
export default {
    props: {},
    data() {
        return {
            v1: 1,
            v2: 1,
            v3: 2.2,
            v4: '',
            v5: 2,
            v6: '',
            autofocus: true,
            visible:false
        };
    },
    computed: {},
    methods: {
        c() {
            this.v1 = 5;
        },
        change2() {
            // debugger
            if (this.v5 === 0) {
                this.v5 = 1;
            }
        },
        errorHandle(){
            this.visible = true;
            setTimeout(()=>{
                this.visible = false;
            },1000);
        }
    }
};
</script>