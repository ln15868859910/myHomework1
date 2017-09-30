<template>
    <div style="margin-left:150px">
        <div>
            <div>溢出:</div>
            <xb-overflow-tip :content="content1" innnerClass="themess"></xb-overflow-tip>
            <button @click="change()"></button>
        </div>
        <br>
        <div>
            <div>未溢出:</div>
            <xb-overflow-tip :content="content2" width="210px"></xb-overflow-tip>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            content1: "溢出溢出溢出溢出溢出溢出溢出溢出溢出溢出溢出溢出溢出溢出溢出溢出溢出溢出",
            content2: "哈啊啊啊啊啊啊"
        }
    },
    methods: {
        change(){
            this.content1="哈啊啊啊啊啊啊"
        }
    }
}
</script>
<style>
    .themess{
        border:1px solid #aaa;
        border-radius:3px;
        height:30px;
        line-height:30px;
        max-width:150px;
        padding:0 5px;
    }
</style>
