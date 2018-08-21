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
            <Xb-Page :total="total" :current="current" :page-size="size" show-sizer placement="top" @on-change="pageCallback" @on-page-size-change="pageSizeCallback" @on-pager-change="pagerChange"></Xb-Page>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            total:1001,
            current:1,
            size:50
        };
    },
    methods:{
        pageCallback(data){
            this.current = data;
            this.fetchData();
        },
        pageSizeCallback(data){
            this.size = data;
            this.current = 1;
            this.fetchData();
        },
        fetchData(){
            console.log(`FetchData:Size:${this.size},Index:${this.current}`);
        },
        pagerChange(obj){
            console.log(obj);
        }
    }
};
</script>
