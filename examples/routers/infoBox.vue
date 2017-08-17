<style></style>
<template>
    <info-Box :info-data="infoData" :callback="callback">
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
                                name: '全部校区',
                                type: "schoolid"
                            },
                            {
                                value: 'beijing',
                                name: '北海校区',
                                type: "schoolid"
                            },
                            {
                                value: 'shanghai',
                                name: '上海市校区',
                                type: "schoolid"
                            },
                            {
                                value: 'shenzhen',
                                name: '深圳市校区',
                                type: "schoolid"
                            },
                            {
                                value: 'hangzhou',
                                name: '杭州市校区',
                                type: "schoolid"
                            },
                            {
                                value: 'nanjing',
                                name: '南京市校区',
                                type: "schoolid"
                            },
                            {
                                value: 'chongqing',
                                name: '重庆市校区重庆市校区重庆市校区重庆市校区重庆市校区',
                                type: "schoolid"
                            }
                        ]
                    },
                    {
                        type: 1,//type,决定组件的样式，type：1 select类型；type：2 datepicker类型； tyoe：3 input类型
                        itemType: "salesman",
                        title: "销售员",//选项标题
                        isShowPhone: true,//开启后可以显示 phone数据
                        isDisabled: false,//是否不能改变
                        isSearch: true,//是否开启搜索
                        default: "",//默认值
                        list: [//数据数组
                            {
                                value: -1,
                                name: '全部员工',
                                phone: '158*****1234'
                            },
                            {
                                value: 123,
                                name: '高富帅',
                                phone: '158*****1234'
                            },
                            {
                                value: 234,
                                name: '事实上',
                                phone: '158*****1234'
                            },
                            {
                                value: 444,
                                name: '去去去',
                                phone: ''
                            },
                            {
                                value: 222,
                                name: '嗯嗯嗯',
                                phone: '158*****1234'
                            },
                            {
                                value: 221,
                                name: '去去去人',
                                phone: '158*****1234'
                            },
                            {
                                value: 66,
                                name: '爱上对方过后就哭了',
                                phone: '158*****1234'
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
                                name: '全部员工'
                            },
                            {
                                value: 123,
                                name: '高富帅'
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
            },
            callback: {
                "infoBoxData": function (obj) {
                    console.log(obj)
                },
                "infoBoxDataList": function (obj) {
                    console.log(obj)
                }
            }

        };
    },
    computed: {},
    mounted() { },
    methods: {

    }


};
</script>


