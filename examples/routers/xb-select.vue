

<template>
    <div style="margin-left:150px">
        <h3>xb-Select</h3>
        <br/><br/>
         本地搜索
        <Xb-Select :list-data="listdata" :selected-data="selectdata" @confirm="selectdone" remote></Xb-Select>
        正常下拉 无搜索
        <Xb-Select :list-data="listdata" :selected-data="selectdata" @confirm="selectdone"></Xb-Select>
    </div>
</template>
<script>
export default {
    data() {
        return {
            listdata: [{
                id: 'shanghai',
                name: '上海市'
            },
            {
                value: 'shenzhen',
                name: '深圳市'
            },
            {
                value: 'hangzhou',
                name: '杭州市'
            },
            {
                value: 'nanjing',
                name: '南京市'
            },
            {
                value: 'chongqing',
                name: '重庆市'
            }],
            selectdata: {
                value: 'chengdu',
                name: '成都'
            }
        };
    },
    created(){
        // console.log(this);
    },
    methods: {
        selectdone(data) {

            console.log(data);
            this.selectdata =  data;
        },
        cancel() {

        }
    }
}
</script>