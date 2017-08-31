<template>
    <div style="margin-left:150px">
        <h3>xb-Poptip</h3>
        <br/><br/>
        <h4>基本状态</h4>
        <br/><br/><br/>
        <xb-Poptip normal title="提示标题" content="提示内容" placement="left" :show="visible">
            <Button @click="visible=!visible">左边</Button>
        </xb-Poptip>
        <xb-Poptip normal title="提示标题" content="提示内容" placement="top" :show="visible">
            <Button @click="visible=!visible">上边</Button>
        </xb-Poptip>
         <xb-Poptip normal title="提示标题" content="提示内容" placement="bottom" :show="visible">
            <Button @click="visible=!visible">下边</Button>
        </xb-Poptip>
         <xb-Poptip normal title="提示标题" content="提示内容" placement="right" :show="visible">
            <Button @click="visible=!visible">右边</Button>
        </xb-Poptip>
        <br/><br/><br/>
        <h4>错误信息</h4>
        <br/><br/><br/>
        <Poptip mistake title="提示标题" content="错误信息" placement="right" >
            <Button @click="visible=!visible">报错气泡</Button>
        </Poptip>
    <div style="margin: 100px;">
        <xb-Poptip
                confirm
                title="您确认删除这条内容吗？"
                :show="visible"
                @on-ok="ok"
                @on-cancel="cancel">
            <Button @click="visible=!visible">删除</Button>
        </xb-Poptip>
        <xb-Poptip
                confirm
                title="Are you sure delete this task?"
                @on-ok="ok"
                :show="visible"
                @on-cancel="cancel"
                ok-text="yes"
                cancel-text="no">
            <Button @click="visible=!visible">国际化</Button>
        </xb-Poptip>
    </div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                visible:false
            }
        },
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
