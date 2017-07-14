<template>
    <div>
        <h2>switch</h2>
        <br/>
        <h3>基本状态</h3>
        <i-switch v-model="m1">
            <span slot="open"></span>
            <span slot="close"></span>
        </i-switch>
        <h4>不可用状态</h4>
         <i-switch disabled="disabled">
            <span slot="open"></span>
            <span slot="close"></span>
        </i-switch>
        <br/><br/>
        <h3>文字状态</h3>
        <i-switch v-model="m2">
            <span slot="open">开</span>
            <span slot="close">关</span>
        </i-switch>
        <h4>不可用状态</h4>
         <i-switch disabled="disabled">
            <span slot="open">开</span>
            <span slot="close">关</span>
        </i-switch>
        <br/><br/>
         <h3>带图标状态</h3>
        <i-switch v-model="m3">
            <Icon type="checkmark" slot="open"></Icon>
            <Icon type="close" slot="close"></Icon>
        </i-switch>
        <h4>不可用状态</h4>
         <i-switch disabled="disabled">
             <Icon type="checkmark" slot="open"></Icon>
            <Icon type="close" slot="close"></Icon>
        </i-switch>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                m1: false,
                m2: false,
                m3: false
            }
        },
        methods: {
            change (status) {
                console.log(status)
            }
        }
    }
</script>
