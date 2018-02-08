<!--<template>-->
    <!--<Row>-->
        <!--<i-col span="4">{{model}}</i-col>-->
        <!--<i-col span="8">-->
            <!--<i-select v-model="model" :label="['L Alabama', 'L Hawaii']" multiple @input="handleInput" filterable remote :remote-method="remoteMethod" :loading="loading" clearable>-->
                <!--<i-option v-for="option in options" :value="option.value" :key="new Date()">{{option.label}}</i-option>-->
            <!--</i-select>-->
        <!--</i-col>-->
    <!--</Row>-->
<!--</template>-->

<!--<script>-->
    <!--export default {-->
        <!--data () {-->
            <!--return {-->
<!--//                model: 'Alabama',-->
                <!--model: ['Alabama', 'Hawaii'],-->
                <!--options: [-->

                <!--],-->
                <!--list: [],-->
                <!--loading: false,-->
                <!--states: ["Al", "Alabama", "Alaska", "Arizona",-->
                    <!--"Arkansas", "California", "Colorado",-->
                    <!--"Connecticut", "Delaware", "Florida",-->
                    <!--"Georgia", "Hawaii", "Idaho", "Illinois",-->
                    <!--"Indiana", "Iowa", "Kansas", "Kentucky",-->
                    <!--"Louisiana", "Maine", "Maryland",-->
                    <!--"Massachusetts", "Michigan", "Minnesota",-->
                    <!--"Mississippi", "Missouri", "Montana",-->
                    <!--"Nebraska", "Nevada", "New Hampshire",-->
                    <!--"New Jersey", "New Mexico", "New York",-->
                    <!--"North Carolina", "North Dakota", "Ohio",-->
                    <!--"Oklahoma", "Oregon", "Pennsylvania",-->
                    <!--"Rhode Island", "South Carolina",-->
                    <!--"South Dakota", "Tennessee", "Texas",-->
                    <!--"Utah", "Vermont", "Virginia",-->
                    <!--"Washington", "West Virginia", "Wisconsin",-->
                    <!--"Wyoming"]-->
            <!--}-->
        <!--},-->
        <!--mounted () {-->
            <!--this.options = [-->
<!--//                {-->
<!--//                    label: '全部',-->
<!--//                    value: 0-->
<!--//                },{-->
<!--//                    label: '苹果',-->
<!--//                    value: 1-->
<!--//                },{-->
<!--//                    label: '香蕉',-->
<!--//                    value: 2-->
<!--//                },{-->
<!--//                    label: '西瓜',-->
<!--//                    value: 3-->
<!--//                }-->
            <!--];-->
        <!--},-->
        <!--methods: {-->
            <!--handleAdd () {-->
                <!--this.options = [-->
                    <!--{-->
                        <!--label: '全部',-->
                        <!--value: 0-->
                    <!--},{-->
                        <!--label: '苹果',-->
                        <!--value: 1-->
                    <!--},{-->
                        <!--label: '香蕉',-->
                        <!--value: 2-->
                    <!--},{-->
                        <!--label: '西瓜',-->
                        <!--value: 3-->
                    <!--}-->
                <!--]-->
            <!--},-->
            <!--remoteMethod (query) {-->
                <!--console.log(13)-->
                <!--if (query !== '') {-->
                    <!--this.loading = true;-->
                    <!--setTimeout(() => {-->
                        <!--this.loading = false;-->
                        <!--this.options = this.list.filter(item => {-->
                            <!--return item.label.toLowerCase()-->
                                    <!--.indexOf(query.toLowerCase()) > -1;-->
                        <!--});-->
                    <!--}, 500);-->
                <!--} else {-->
                    <!--this.options = [];-->
                <!--}-->
            <!--},-->
            <!--handleInput () {-->
<!--//                console.log(1)-->
            <!--}-->
        <!--},-->
        <!--mounted () {-->
            <!--this.list = this.states.map(item => {-->
                <!--return {-->
                    <!--value: item,-->
                    <!--label: 'L ' + item-->
                <!--};-->
            <!--});-->
        <!--}-->
    <!--}-->
<!--</script>-->

<style>
.xjw {
    width: 180px;
}

.xjw .ivu-select-dropdown {
    width: 400px !important;
    left: 40px !important
}
</style>
<template>
    <div>
        <div>基本状态：</div>
        <Select v-model="model1.data" :filterable="false" class="xjw">
            <Option v-for="item in cityList3" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <div>分组选择</div>
        <Select v-model="model2">
            <Option-group label="热门城市">
                <Option v-for="item in cityList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Option-group>
            <Option-group label="其它城市">
                <Option v-for="item in cityList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Option-group>
        </Select>
    
        <div>多选</div>
        <Select v-model="model3" filterable multiple style="width:180px;">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <div>搜索选择</div>
        <Select v-model="mode44" filterable multiple remote :remote-method="getSubjectData" >
            <Option v-for="item in cityList7" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <i-button @click="setData()">setData</i-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cityList: [
                {
                    value: 'beijing',
                    label: '北京市北京市北京市北京市北京市北京市北京市北京市北京市北京市北京市'
                },
                {
                    value: 'shanghai',
                    label: '上海市上海市'
                },
                {
                    value: 'shenzhen',
                    label: '深圳市圳市'
                },
                {
                    value: 'hangzhou',
                    label: '杭州市市'
                },
                {
                    value: 'nanjing',
                    label: '南上海市上海市'
                },
                {
                    value: 'chongqing',
                    label: '重庆上海市上海市'
                }
            ],
            cityList1: [
                {
                    value: 'beijing',
                    label: '北京市'
                },
                {
                    value: 'shanghai',
                    label: '上海市'
                },
                {
                    value: 'shenzhen',
                    label: '深圳市'
                }
            ],
            cityList2: [
                {
                    value: 'hangzhou',
                    label: '杭州市'
                },
                {
                    value: 'nanjing',
                    label: '南京市'
                },
                {
                    value: 'chongqing',
                    label: '重庆市'
                }
            ],
            cityList7:[],
            cityList3:[],
            model1: {
                data:'shanghai'
            },
            model2: "shanghai",
            model3: [],
            model4: "",
            mode44: [],
            model5: "",
            model6: "",
            model7: ""
        }
    },
    created(){
        setTimeout(()=>{
            this.cityList3 = this.cityList.concat();
        },500);
    },
    methods: {
        handleSet() {
            this.model11 = 'shanghai';
            //                this.model12 = ['beijing'];
        },
        getSubjectData(){
            setTimeout(()=>{
                this.cityList7 = this.cityList2.concat();
            });
        },
        setData(){
            this.model1.data = "shanghai";
        }
    }
}
</script>

