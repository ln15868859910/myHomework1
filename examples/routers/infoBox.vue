<style></style>
<template>
    <info-Box :info-data="infoData" @dataCallBack="callback11" @arrCallBack="callback22">
    </info-Box>
</template>
<script>
export default {

    props: {},
    data() {
        return {
            infoData: {
                dataList: [
                    {
                        type: 1,//type,决定组件的样式，type：1 select类型；type：2 datepicker类型； tyoe：3 input类型
                        itemType: "schoolid",
                        title: "经办校区",//选项标题
                        isDisabled: false,//是否不能改变
                        isSearch: false,//是否开启搜索
                        placeholder: "请选择校区",//placeholder，默认值为请选择
                        default: "",//默认值
                        list: [//数据数组
                            {
                                value: 'all',
                                label: '全部校区'
                            },
                            {
                                value: 'beijing',
                                label: '北海校区'
                            },
                            {
                                value: 'shanghai',
                                label: '上海市校区'
                            },
                            {
                                value: 'shenzhen',
                                label: '深圳市校区'
                            },
                            {
                                value: 'hangzhou',
                                label: '杭州市校区'
                            },
                            {
                                value: 'nanjing',
                                label: '南京市校区'
                            },
                            {
                                value: 'chongqing',
                                label: '重庆市校区重庆市校区重庆市校区重庆市校区重庆市校区'
                            }
                        ]
                    },
                    {
                        type: 1,//type,决定组件的样式，type：1 select类型；type：2 datepicker类型； tyoe：3 input类型
                        itemType: "sman",
                        url: "http",
                        title: "销售员",//选项标题
                        isShowPhone: true,//开启后可以显示 phone数据
                        isDisabled: false,//是否不能改变
                        isSearch: true,//是否开启搜索
                        default: "",//默认值
                        list: [//数据数组
                            {
                                value: -1,
                                label: '全部员工',
                                phone: '158*****1234'
                            },
                            {
                                value: 123,
                                label: '高富帅',
                                phone: '158*****1234'
                            },
                            {
                                value: 234,
                                label: '事实上',
                                phone: '158*****1234'
                            },
                            {
                                value: 444,
                                label: '去去去',
                                phone: ''
                            },
                            {
                                value: 222,
                                label: '嗯嗯嗯',
                                phone: '158*****1234'
                            },
                            {
                                value: 221,
                                label: '去去去人',
                                phone: '158*****1234'
                            },
                            {
                                value: 66,
                                label: '爱上对方过后就哭了',
                                phone: '158*****1234'
                            },
                            {
                                value: 66,
                                label: '爱上对方过后就哭了',
                                phone: '158*****1234'
                            },
                            {
                                value: 663,
                                label: '爱上对方过后就哭了',
                                phone: '158*****1234'
                            },
                            {
                                value: 662,
                                label: '爱上对方过后就哭了',
                                phone: '158*****1234'
                            },
                            {
                                value: 661,
                                label: '爱上对方过后就哭了',
                                phone: '158*****1234'
                            },
                            {
                                value: -2,
                                label: '更多销售员信息请搜索',
                                phone: '',
                                disabled: true
                            }
                        ]
                    },
                    {
                        type: 1,//type,决定组件的样式，type：1 select类型；type：2 datepicker类型； tyoe：3 input类型
                        itemType: "sman1",
                        url: "http",
                        title: "采购员",//选项标题
                        isShowPhone: true,//开启后可以显示 phone数据
                        isDisabled: false,//是否不能改变
                        isSearch: true,//是否开启搜索
                        default: "",//默认值
                        list: [//数据数组
                            {
                                value: -1,
                                label: '全部员工',
                                phone: '158*****1234'
                            },
                            {
                                value: 123,
                                label: '高富帅',
                                phone: '158*****1234'
                            },
                            {
                                value: 234,
                                label: '事实上',
                                phone: '158*****1234'
                            },
                            {
                                value: 444,
                                label: '去去去',
                                phone: ''
                            },
                            {
                                value: 222,
                                label: '嗯嗯嗯',
                                phone: '158*****1234'
                            },
                            {
                                value: 221,
                                label: '去去去人',
                                phone: '158*****1234'
                            },
                            {
                                value: 66,
                                label: '爱上对方过后就哭了',
                                phone: '158*****1234'
                            },
                            {
                                value: 66,
                                label: '爱上对方过后就哭了',
                                phone: '158*****1234'
                            },
                            {
                                value: 663,
                                label: '爱上对方过后就哭了',
                                phone: '158*****1234'
                            },
                            {
                                value: 662,
                                label: '爱上对方过后就哭了',
                                phone: '158*****1234'
                            },
                            {
                                value: 661,
                                label: '爱上对方过后就哭了',
                                phone: '158*****1234'
                            },
                            {
                                value: -2,
                                label: '更多销售员信息请搜索',
                                phone: '',
                                disabled: true
                            }
                        ]
                    },
                    {
                        type: 1,//type,决定组件的样式，type：1 select类型；type：2 datepicker类型； tyoe：3 input类型
                        itemType: "salesMan",
                        title: "销售员",//选项标题
                        isDisabled: true,//是否不能改变
                        isSearch: false,//是否开启搜索
                        default: 123,//默认值
                        list: [//数据数组
                            {
                                value: -1,
                                label: '全部员工'
                            },
                            {
                                value: 123,
                                label: '高富帅'
                            }
                        ]
                    },
                    {
                        type: 2,//type,决定组件的样式，type：1 select类型；type：2 datepicker类型； tyoe：3 input类型
                        itemType: "dateTime",
                        title: "经办日期",//选项标题
                        isDisabled: false,//是否不能改变
                        default: "",//默认值
                    },
                    {
                        type: 2,//type,决定组件的样式，type：1 select类型；type：2 datepicker类型； tyoe：3 input类型
                        itemType: "dateTime",
                        title: "经办日期",//选项标题
                        isDisabled: false,//是否不能改变
                        default: "2017-8-16",//默认值
                    },
                    {
                        type: 2,//type,决定组件的样式，type：1 select类型；type：2 datepicker类型； tyoe：3 input类型
                        itemType: "dateTime",
                        title: "经办日期",//选项标题
                        isDisabled: true,//是否不能改变
                        default: "2017-8-22",//默认值
                    },
                    {
                        type: 3,//type,决定组件的样式，type：1 select类型；type：2 datepicker类型； tyoe：3 input类型
                        itemType: "salesForm",
                        title: "销售来源",//选项标题
                        isDisabled: false,//是否不能改变，灰底
                        default: "",//默认值
                        maxlength: 20,//如果传值则根据该值设定，不传，默认maxlength=100
                        style: "width:200px" //如果传值则根据该值设定，不传，默认width:160px
                    },
                    {
                        type: 3,//type,决定组件的样式，type：1 select类型；type：2 datepicker类型； tyoe：3 input类型
                        itemType: "salesMan",
                        title: "经办人",//选项标题
                        isDisabled: false,//是否不能改变，灰底
                        default: "最大长度为默认值100",//默认值
                        style: "width:150px" //如果传值则根据该值设定，不传，默认width:160px
                    },
                    {
                        type: 3,//type,决定组件的样式，type：1 select类型；type：2 datepicker类型； tyoe：3 input类型
                        itemType: "salesMan",
                        title: "嘻嘻哈哈",//选项标题
                        isDisabled: false,//是否不能改变，灰底
                        default: "最大长度7",//默认值
                        maxlength: 7 //如果传值则根据该值设定，不传，默认maxlength=100
                    },
                    {
                        type: 3,//type,决定组件的样式，type：1 select类型；type：2 datepicker类型； tyoe：3 input类型
                        itemType: "salesMan",
                        title: "备注",//选项标题
                        isDisabled: true,//是否不能改变，灰底
                        default: "最大长度为默认值100",//默认值
                    },
                    {
                        type: 4,//type,决定组件的样式，type：1 select类型；type：2 datepicker类型； tyoe：3 input类型
                        itemType: "creator",
                        title: "创建者",//选项标题
                        isDisabled: true,//是否不能改变，灰底
                        default: 6889,//默认值 id
                        value: "jiebo"
                    }
                ],
            }
        };
    },
    computed: {},
    mounted() { },
    methods: {
        callback11(obj) {
            console.log(obj)

        },
        callback22(obj) {
            console.log(obj)
        }
    }


};
</script>


