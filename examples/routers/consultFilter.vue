<style></style>
<template>
    <consult-Filter :customData="customData" :searchData="searchData" :filterData="filterData">
    </consult-Filter>
</template>
<script>
export default {

    props: {},
    data() {
        return {
            //自定义内容区域
            customData: {
                buttonLeft: {
                    isShow: true,//不传默认为true
                    styleName:"",//自定义样式名，不传则使用默认样式名
                    template: "",
                    clickEvent: function(){console.log("我点了左边自定义区域按钮")}
                },
                buttonCenter: {
                    isShow: true,//不传默认为true
                    styleName:"",//自定义样式名，不传则使用默认样式名
                    template: "",
                    clickEvent: function(){console.log("我点了中间自定义区域按钮")}
                },
                buttonRight: {
                    isShow: true,//不传默认为true
                    styleName:"",//自定义样式名，不传则使用默认样式名
                    template: "",
                    clickEvent: function(){console.log("我点了右边自定义区域按钮")}
                }
            },

            //搜索区域
            searchData: {
                data: [{
                    "text": "学员姓名",
                    "value": "学员姓名"
                }, {
                    "text": "学员电话",
                    "value": "学员电话"
                }],
                opts: {
                    "isResetFilter": false //默认：false，搜索时结果是否与筛选项互斥
                },
                callback: function () {
                    console.log("我是搜索回调")
                }
            },

            //筛选项数据
            filterData: {

            }
        };
    },
    computed: {},
    methods: {}


};
</script>
