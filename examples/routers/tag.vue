<template>
    <div>
        <h2>Tag标签</h2>
        <br/>
        <h3>基本状态 / closable</h3>
        <Tag @on-close="close" closable>杭州</Tag>
        <br/>
        <br/>
         <h3>基本状态 / 无closable</h3>
        <Tag >杭州</Tag>
        <br/>
        <br/>
        <h3>样式类型 / closable</h3>
        <Tag type='bigBorder'  @on-close="close" closable>杭州</Tag>
        <br/>
        <br/>
        <h3>样式类型 / 无closable</h3>
        <Tag type='bigBorder' @on-close="close">杭州</Tag>
        <br/>
        <br/>
        <h3>动态添加 / closable</h3>
        <Tag v-for="item in count" :key="item" :name="item" @on-close="close" closable>杭州</Tag>
        <Button icon="ios-plus-empty" type="dashed" size="small" @click="count += 1">添加</Button>
    </div>
</template>
<script>
  export default {
        data () {
            return {
                count: 3
            }
        },
        methods: {
            close (e, name) {
                console.log(e);
                console.log(name);
            }
        }
    }
</script>
