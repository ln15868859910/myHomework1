<template>
    <div style="margin-left:150px">
        <div>
            <div>溢出:</div>
            <xb-overflow-tip :content="content1" width="210px"></xb-overflow-tip>
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
    }
}
</script>
