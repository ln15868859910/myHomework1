<template>
    <div>
        <xb-input-number :max="10" name="he" :min="-1" v-model="v1" :autofocus="autofocus" :defaultnumber=4></xb-input-number>
        {{ v1 }}
        <div @click="c">change v1</div>
        <xb-input-number disabled :max="10" :min="1" :step="1.2" v-model="v2"></xb-input-number>

        隐藏步数 hidestep：
        <xb-input-number :max="10" name="he" :min="-1" v-model="v2" :autofocus="autofocus" hidestep></xb-input-number>

        小数位数：
        <xb-input-number  name="he" v-model="v3" :autofocus="autofocus" :fixed=2></xb-input-number>

        可为空：
        <xb-input-number :max="10" name="he" :min="-1" v-model="v4" :autofocus="autofocus" :required=false></xb-input-number>
        默认值：
        <xb-input-number :max="10" name="he" :min="-1" v-model="v5" :autofocus="autofocus" :defaultnumber=2 @input="change2"></xb-input-number>
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
            autofocus: true
        };
    },
    computed: {},
    methods: {
        c() {
            this.v1 = 5;
        },
        change2() {
            // debugger
            if (this.v5===0) {
                this.v5 = 1;
            }
        }
    }
};
</script>