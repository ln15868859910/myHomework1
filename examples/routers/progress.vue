<template>
    <div>
        <i-progress :percent="percent" :stroke-width="6"></i-progress>
        <Button-group>
            <Button icon="plus" @click.native="add"></Button>
            <Button icon="minus" @click.native="minus"></Button>
        </Button-group>
        <br>
        <Progress :percent="70" status="wrong" :stroke-width="6"></Progress>
        <br>
        <Progress :percent="70" status="wrong" :stroke-width="6">上传失败</Progress>
        <br>
        <Progress :percent="45" status="active" :stroke-width="6"></Progress>
        <br>
        <i-progress :percent="25" :stroke-width="6"></i-progress>
        <br>
        <i-progress :percent="100" :stroke-width="6">
            <Icon type="checkmark-circled"></Icon>
            <span>成功</span>
        </i-progress>
        <br>
        <i-progress :percent="70" :stroke-width="6" status="wrong">
            <Icon type="close-circled"></Icon>
            <span>上传失败</span>
        </i-progress>
        <br>
        <Progress :percent="70" :stroke-width="6" hide-info></Progress>
    </div>
</template>
<script>
export default {
    data() {
        return {
            percent: 0
        }
    },
    methods: {
        add() {
            if (this.percent >= 100) {
                return false;
            }
            this.percent += 10;
        },
        minus() {
            if (this.percent <= 0) {
                return false;
            }
            this.percent -= 10;
        }
    }
}
</script>
