<template>
    <i-button type="primary" @click.native="time">打开提醒</i-button>
</template>
<script>
    export default {
        methods: {
            time () {
                this.$Notice.open({
                    title: '这是通知标题',
                    desc: '这条通知不会自动关闭，需要点击关闭按钮才可以关闭。'
                });
            }
        },
        mounted () {
            this.$Notice.config({
                top: 200,
                duration: 10
            });
        }
    }
</script>
