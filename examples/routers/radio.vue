<template>
<div>
    <div>
    <span>基本状态</span>
        <Radio-group v-model="date.sex">
            <Radio label="male"></Radio>
            <Radio label="female"></Radio>
        </Radio-group>
        &nbsp;&nbsp;
        <span>不可用状态</span>
        <Radio-group v-model="date.sex">
            <Radio label="male" disabled></Radio>
            <Radio label="female" disabled></Radio>
        </Radio-group>
    </div>
    <div>
    <br>
    <span>按钮类型</span>
        <Radio-group v-model="date.button" type="button">
            <Radio label="杭州"></Radio>
            <Radio label="上海"></Radio>
            <Radio label="南京"></Radio>
        </Radio-group>
        &nbsp;&nbsp;
        <span>不可用状态</span>
        <Radio-group v-model="date.button" type="button">
            <Radio label="杭州" disabled></Radio>
            <Radio label="上海" disabled></Radio>
            <Radio label="南京" disabled></Radio>
        </Radio-group>
    </div>
    <br>
    <div>
    <span>纵向排列</span>
        <Radio-group v-model="date.sex" vertical>
            <Radio label="male"></Radio>
            <Radio label="female"></Radio>
        </Radio-group>
        &nbsp;&nbsp;
        <span>不可用状态</span>
        <Radio-group v-model="date.sex" vertical>
            <Radio label="male" disabled></Radio>
            <Radio label="female" disabled></Radio>
        </Radio-group>
    </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                date: {
                    sex: 'male',
                    button:'杭州'
                },
            }
        },
        methods: {
        }
    }
</script>
