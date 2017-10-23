

<template>
    <div style='margin-left:150px'>
        <h3>xb-Droplist</h3>
        <br/><br/> 
        <h1>键值字符绑定</h1>
        <div ></div>
        <xb-droplist :value='selectdata.value' :label='selectdata.name' valueKey='name' @change='selectdone' style='width: 200px;'>
            <xb-option  disabled>哈哈哈</xb-option>
            <xb-option v-for='item in listdata' :key='item.value' :value='item.value' :label='item.name'>{{item.name}}</xb-option>
        </xb-droplist>
        <h1>只传Id</h1>
        <xb-droplist :value='selectdata.value'  valueKey='value' @change='selectdone' style='width: 200px;'>
            <xb-option  disabled>哈哈哈</xb-option>
            <xb-option v-for='item in listdata' :key='item.value' :value='item.value' :label='item.name'>{{item.name}}</xb-option>
        </xb-droplist>
        <br/> 
        <h1>对象绑定</h1>
        <xb-droplist v-model='selectdata' valueKey='value' labelKey='name' style='width: 200px;' placeholder='DSD'>
            <xb-option v-for='item in listdata' :key='item.value' :value='item'>{{item.name}}</xb-option>
        </xb-droplist>
        <br/> 
        <h1>本地搜索</h1>
        <xb-droplist v-model='selectdata' valueKey='value' labelKey='name' style='width: 200px;' placeholder='DSD' filterable clearable>
            <xb-option v-for='item in listdata' :key='item.value' :value='item'>{{item.name}}</xb-option>
        </xb-droplist>
        <!-- <h1>本地搜索</h1>
        <xb-droplist v-model='selectcity'   style='width: 200px;' placeholder='DSD' filterable clearable>
            <xb-option v-for='item in list' :key='item.value' :value='item'>{{item.label}}</xb-option>
        </xb-droplist> -->
        <h1>远程搜索</h1>
        <xb-droplist v-model='selectcity'   style='width: 200px;' placeholder='DSD' filterable clearable :remote-fnc='remoteMethod' remote :loading="loading">
            <xb-option v-for='item in options4' :key='item.value' :value='item'>{{item.label}}</xb-option>
        </xb-droplist>
        
        <TimePicker :value="time" format="HH:mm" type="timerange" placement="bottom-end" placeholder="选择上课时段" style="width: 160px;display:inline-block;" @on-change="setPeriodTime"></TimePicker>

        <!-- <Date-picker v-model="date" type="daterange" format="yyyy-MM-DD" confirm placeholder="选择上课时间" style="width: 220px;display:inline-block;" @on-change="setPeriodTime"></Date-picker> -->
        <DatePicker :value="date" format="yyyy-MM-DD" type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px"></DatePicker>

        <i-Input v-model='selectdata.value'></i-Input>
        <i-Input v-model='selectdata.name'></i-Input>
        <Button @click='setnew()' type='primary'>SetNew</Button>
        <Button @click='setnulltime()' type='primary'>SetNullTime</Button>
        <div>{{JSON.stringify(listdata,{},4)}}</div>
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
                value: '0',
                name: ''
            },
            selectcity:{
                value:'',
                label:''
            },
            time:[],
            date:'',
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
            loading:false
        };
    },
    created() {
        // console.log(this);
    },
    mounted() {
        this.list = this.states.map(item => {
            return { value: item, label: item };
        });
    },
    methods: {
        setnulltime(){
            this.time = [];
        },
        setPeriodTime(value){
            console.log(value);
        },
        selectdone(data) {
            // console.log(data);
            this.selectdata = {
                value: data.value,
                name: data.label
            };
        },
        cancel() {

        },
        setnew() {
            this.selectdata = {
                value: 'wuhan',
                name: '武汉'
            };
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