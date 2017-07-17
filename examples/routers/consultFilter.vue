<style>
body {
    /*height: 2000px;*/
}
</style>
<template>
    <consult-Filter :searchData="searchData" :filterData="filterData">
    </consult-Filter>
</template>
<script>
export default {

    props: {},
    data() {
        return {
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
