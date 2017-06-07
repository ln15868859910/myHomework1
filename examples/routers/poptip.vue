<template>
    <div style="margin-left:150px">
        <h3>Poptip</h3>
        <br/><br/>
        <h4>基本状态</h4>
        <br/><br/><br/>
        <Poptip normal title="提示标题" content="提示内容" placement="left">
            <Button>左边</Button>
        </Poptip>
        <Poptip normal title="提示标题" content="提示内容" placement="top">
            <Button>上边</Button>
        </Poptip>
         <Poptip normal title="提示标题" content="提示内容" placement="bottom">
            <Button>下边</Button>
        </Poptip>
         <Poptip normal title="提示标题" content="提示内容" placement="right">
            <Button>右边</Button>
        </Poptip>
        <br/><br/><br/>
        <h4>错误信息</h4>
        <br/><br/><br/>
        <Poptip mistake title="提示标题" content="错误信息" placement="right">
            <Button>报错气泡</Button>
        </Poptip>
    <div style="margin: 100px;">
        <Poptip
                confirm
                title="您确认删除这条内容吗？"
                @on-ok="ok"
                @on-cancel="cancel">
            <Button>删除</Button>
        </Poptip>
        <Poptip
                confirm
                title="Are you sure delete this task?"
                @on-ok="ok"
                @on-cancel="cancel"
                ok-text="yes"
                cancel-text="no">
            <Button>国际化</Button>
        </Poptip>
    </div>
    </div>
</template>
<script>
    export default {
        methods: {
            ok () {
                this.$Message.info('点击了确定');
            },
            cancel () {
                this.$Message.info('点击了取消');
            }
        }
    }
</script>
