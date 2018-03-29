<template>
    <div style="margin: 100px;">
        <div>
            <Page :total="1001" show-sizer placement="top"></Page>
        </div>
        <div style="margin-top: 100px;">
            <Page :total="1002" show-sizer placement="top" show-elevator></Page>
        </div>
        <div style="margin-top: 100px;">
            <Page :total="1001" show-sizer placement="top" simple></Page>
        </div>
        <div style="margin-top: 100px;">
            <Xb-Page :total="1001" show-sizer placement="top" ></Xb-Page>
        </div>
    </div>
</template>
<script>
export default {};
</script>
