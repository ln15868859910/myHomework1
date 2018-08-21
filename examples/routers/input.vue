<template>
    <div style="width: 800px;">
        <div>
            <span>基本状态</span>
            <Input v-model="value" placeholder="请输入..." style="width: 200px;"></Input>
            <Input v-model="value" disabled placeholder="请输入..." style="width: 200px;"></Input>
        </div>
        <br>
        <div>
            <span>带Icon</span>
            <Input v-model="value" icon="clock" placeholder="请输入..." style="width: 200px;"></Input>
            <Input v-model="value" disabled icon="clock" placeholder="请输入..." style="width: 200px;"></Input>
        </div>
        <br>
        <div>
            <span>文本域</span>
            <Input v-model="value" type="textarea" placeholder="请输入..." style="width: 200px;"></Input>
            <Input v-model="value" disabled type="textarea" placeholder="请输入..." style="width: 200px;"></Input>
        </div>
        <br><br><br>
        <i-input v-model="value11" icon="clock">
            <!-- <span slot="prepend">.com</span> -->
        </i-input>
        <i-input v-model="value11" icon="clock" :autofocus="autofocus">
            <!-- <span slot="append">.com</span> -->
        </i-input>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                value:'',
                value11: '',
                value12: '',
                value13: '',
                select1: 'http',
                select2: 'com',
                select3: 'day',
                autofocus: true
            }
        }
    }
</script>
