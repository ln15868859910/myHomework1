

<template>
    <div style="margin-left:150px">
        <h3>xb-Select</h3>
        <br/><br/>
        <div>{{JSON.stringify(selectdata,null,4)}}</div>
         本地搜索
        <Xb-Select :list-data="listdata" :selected-data="selectdata" @confirm="selectdone" remote filterable></Xb-Select>

        正常下拉 无搜索
        <Xb-Select :list-data="listdata" :selected-data="selectdata" @confirm="selectdone"></Xb-Select>

        <h2>自定义</h2>
        <Xb-Select :list-data="listdata" :selected-data="selectdata" @confirm="selectdone" valueKey="value">
            <template slot="lislot" scope="item">
                    <span style="display:inline-block;background:#aaa;">{{item.data.name}}</span>
                    <span style="display:inline-block;background:#bbb;">{{item.data.value}}</span>
            </template>
        </Xb-Select>
        
        <Xb-Select :list-data="listdata"  valueKey="value" v-model="value.a" :showdelete="false"></Xb-Select>

    </div>
</template>
<script>
export default {
    data() {
        return {
            listdata: [{
                value: 'shanghai',
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
            },
            value:{

            }
        };
    },
    created(){
        // console.log(this);
    },
    methods: {
        selectdone(data) {
            this.value.a = data.value;
            console.log(data);
            this.selectdata =  data;
        },
        cancel() {

        }
    }
}
</script>