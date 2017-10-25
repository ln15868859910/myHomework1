

<template>
    <div style="margin-left:150px">
        <h3>xb-Select</h3>
        <br/><br/>
        <div>{{JSON.stringify(selectdata,null,4)}}</div>
         本地搜索
        <Xb-Select :list-data="listdata" :selected-data="selectdata" @confirm="selectdone" remote></Xb-Select>

        正常下拉 无搜索
        <Xb-Select :list-data="listdata" :selected-data="selectdata" @confirm="selectdone"></Xb-Select>

Model
        <Xb-Select :list-data="listdata" v-model="selectdata.value"></Xb-Select>


        <h2>自定义</h2>
        <Xb-Select :list-data="options4" :selected-data="selectdcity"  valueKey="value" labelKey="label" remote :remoteMethod="remoteMethod" @confirm="selectthiscity">
            <template slot='head'>
                <span style="display:inline-block;background:#aaa;">姓名</span>
                <span style="display:inline-block;background:#bbb;">年龄</span>
            </template>
            <template slot="lislot" scope="item">
                    <span style="display:inline-block;background:#aaa;">{{item.data.label}}</span>
                    <span style="display:inline-block;background:#bbb;">{{item.data.value}}</span>
            </template>
        </Xb-Select>
        
        <Xb-Select :list-data="listdata"  valueKey="value" v-model="value.a" :showdelete="false"></Xb-Select>

        <Button @click='setnew()' type='primary'>SetNew</Button>
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

            },
            list:[],
            states: ['Alabama', 'Alaska', 'Arizona',
                'Arkansas', 'California', 'Colorado',
                'Connecticut', 'Delaware', 'Florida',
                'Georgia', 'Hawaii', 'Idaho', 'Illinois',
                'Indiana', 'Iowa', 'Kansas', 'Kentucky',
                'Louisiana', 'Maine', 'Maryland',
                'Massachusetts', 'Michigan', 'Minnesota',
                'Mississippi', 'Missouri', 'Montana',
                'Nebraska', 'Nevada', 'New Hampshire',
                'New Jersey', 'New Mexico', 'New York',
                'North Carolina', 'North Dakota', 'Ohio',
                'Oklahoma', 'Oregon', 'Pennsylvania',
                'Rhode Island', 'South Carolina',
                'South Dakota', 'Tennessee', 'Texas',
                'Utah', 'Vermont', 'Virginia',
                'Washington', 'West Virginia', 'Wisconsin',
                'Wyoming'],
            options4:[],
            selectdcity: {
                value: '',
                label: ''
            },
        };
    },
    created(){
        // console.log(this);
    },
    mounted() {
            this.list = this.states.map(item => {
                return { value: item, label: item };
            });
        },
    methods: {
        selectdone(data) {
            this.value.a = data.value;
            console.log(data);
            this.selectdata =  data;
        },
        cancel() {

        },
        setnew(){
            this.selectdata =  {};
            this.selectdcity = {};
        },
        selectthiscity(data){
            this.selectdcity = data;
        },
        remoteMethod(query) {
            this.loading = true;
            if (query !== '') {
                
                setTimeout(() => {
                    this.loading = false;
                    this.options4 = this.list.filter(item => {
                        return item.label.toLowerCase()
                            .indexOf(query.toLowerCase()) > -1;
                    });
                }, 200);
            } else {
                this.options4 = [];
                setTimeout(() => {
                    this.loading = false;
                    this.options4 = this.list; 
                },200);
                
            }
        }
    }
}
</script>