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
                    styleName: "",//自定义样式名，不传则使用默认样式名
                    template: "",
                    clickEvent: function () { console.log("我点了左边自定义区域按钮") }
                },
                buttonCenter: {
                    isShow: true,//不传默认为true
                    styleName: "",//自定义样式名，不传则使用默认样式名
                    template: "",
                    clickEvent: function () { console.log("我点了中间自定义区域按钮") }
                },
                buttonRight: {
                    isShow: true,//不传默认为true
                    styleName: "",//自定义样式名，不传则使用默认样式名
                    template: "",
                    clickEvent: function () { console.log("我点了右边自定义区域按钮") }
                }
            },

            //搜索区域
            searchData: {
                data: [{
                    "text": "学员姓名",
                    "value": "1"
                }, {
                    "text": "学员电话",
                    "value": "2"
                }],
                opts: {
                    "isResetFilter": false //默认：false，搜索时结果是否与筛选项互斥
                },
                callback: function () {
                    console.log("我是搜索回调")
                }
            },
            filterData: {
                ajaxData: [
                    // {"sortname": "录入时间", "sortvalue": "Adddate", "HasDate": false, "father": null, "son": null, "isSingle": true, "userDefined": true, "lables": [{ "lablename": "一周内", "lablevalue": "2017-07-19,2017-07-26", "IsDate": false, "IsDelete": false }, { "lablename": "一个月内", "lablevalue": "2017-06-26,2017-07-26", "IsDate": false, "IsDelete": false }, { "lablename": "三个月内", "lablevalue": "2017-04-27,2017-07-26", "IsDate": false, "IsDelete": false }, { "lablename": "半年内", "lablevalue": "2017-01-27,2017-07-26", "IsDate": false, "IsDelete": false }, { "lablename": "一年内", "lablevalue": "2016-07-26,2017-07-26", "IsDate": false, "IsDelete": false }], "lablename": null, "isShowAll": false },
                    // {"sortname":"意向度","sortvalue":"interest","HasDate":false,"father":null,"son":null,"isSingle":false,"userDefined":false,"lables":[{"lablename":"高","lablevalue":"高","IsDate":false,"IsDelete":false},{"lablename":"中","lablevalue":"中","IsDate":false,"IsDelete":false},{"lablename":"低","lablevalue":"低","IsDate":false,"IsDelete":false},{"lablename":"？","lablevalue":"？","IsDate":false,"IsDelete":false}],"lablename":null,"isShowAll":false},
                    // {"sortname":"星标","sortvalue":"isCollection","HasDate":false,"father":null,"son":null,"isSingle":true,"userDefined":false,"lables":[{"lablename":"有星标","lablevalue":"1","IsDate":false,"IsDelete":false},{"lablename":"无星标","lablevalue":"0","IsDate":false,"IsDelete":false}],"lablename":null,"isShowAll":false},
                    // {"sortname":"渠道分类","sortvalue":"channelclassification","HasDate":false,"father":null,"son":"ChannelId","isSingle":false,"userDefined":false,"lables":[{"lablename":"校宝秀活动","lablevalue":"11597","IsDate":false,"IsDelete":false},{"lablename":"校宝秀商品","lablevalue":"11598","IsDate":false,"IsDelete":false},{"lablename":"线下活动","lablevalue":"11599","IsDate":false,"IsDelete":false},{"lablename":"合作渠道","lablevalue":"11600","IsDate":false,"IsDelete":false},{"lablename":"其他","lablevalue":"11601","IsDate":false,"IsDelete":false},{"lablename":"333","lablevalue":"14667","IsDate":false,"IsDelete":false},{"lablename":"吱吱","lablevalue":"14668","IsDate":false,"IsDelete":false}],"lablename":null,"isShowAll":false},
                    // {"sortname":"渠道名称","sortvalue":"ChannelId","HasDate":false,"father":"channelclassification","son":null,"isSingle":false,"userDefined":false,"lables":[],"lablename":null,"isShowAll":false}
                    ],
                //设置各个分类配置项
                opts: {
                    singleModel: [{
                        "sortValue": "Adddate", //录入时间
                        "sortName": "录入时间",
                        "value": [],
                        "isMultiple": false,
                        "componentType": "daterange",
                        "format": "",
                        "optionList": [],
                        "callback": function (val) { }
                    },
                    {
                        "sortValue": "EditDate",
                        "sortName": "最新跟进时间",
                        "value": [],
                        "isMultiple": false,
                        "componentType": "daterange",
                        "format": "",
                        "optionList": [],
                        "callback": function (val) { }
                    },
                    {
                        "sortValue": "isCollection",
                        "sortName": "星标",
                        "value": [],
                        "isMultiple": false,
                        "filterable": true,
                        "componentType": "select",
                        "optionList": [],
                        "callback": function (val) { }
                    }
                    ],
                    unionModel: [
                        [{
                            "sortValue": "channelclassification",
                            "sortName": "渠道分类",
                            "value": [],
                            "clearable": false,
                            "isMultiple": true,
                            "filterable": true,
                            "componentType": "select",
                            "fatherSort": null,
                            "sonSort": "ChannelId",
                            "optionList": [],
                            "callback": function (val) { }
                        },
                        {
                            "sortValue": "ChannelId",
                            "sortName": "渠道名称",
                            "value": [],
                            "clearable": false,
                            "isMultiple": true,
                            "filterable": true,
                            "componentType": "select",
                            "fatherSort": "channelclassification",
                            "sonSort": null,
                            "optionList": [],
                            "callback": function (val) { }
                        }
                        ],
                        [{
                            "sortValue": "FollowUpPeopleId",
                            "sortName": "销售员",
                            "value": [],
                            "clearable": false,
                            "isMultiple": true,
                            "filterable": true,
                            "fatherSort": null,
                            "sonSort": "SalesmanHrdocId",
                            "componentType": "select",
                            "optionList": [],
                            "callback": function (val) { }
                        },
                        {
                            "sortValue": "SalesmanHrdocId",
                            "sortName": "售前人员",
                            "value": [],
                            "clearable": false,
                            "isMultiple": true,
                            "filterable": true,
                            "fatherSort": "FollowUpPeopleId",
                            "sonSort": null,
                            "componentType": "select",
                            "optionList": [],
                            "callback": function (val) { }
                        }
                        ]
                    ],
                    multiModel: [{
                        "sortValue": "followUpState",
                        "sortName": "跟进状态",
                        "value": [],
                        "isMultiple": true,
                        "filterable": true,
                        "componentType": "select",
                        "optionList": [],
                        "callback": function (val) { }
                    },
                    {
                        "sortValue": "interest",
                        "sortName": "意向度",
                        "value": [],
                        "isMultiple": true,
                        "componentType": "select",
                        "filterable": true,
                        "optionList": [],
                        "callback": function (val) { }
                    }, {
                        "sortValue": "interestLesson",
                        "sortName": "意向课程",
                        "value": [],
                        "isMultiple": true,
                        "filterable": true,
                        "componentType": "select",
                        "optionList": [],
                        "callback": function (val) { }
                    }, {
                        "sortValue": "tag",
                        "sortName": "标签",
                        "value": [],
                        "isMultiple": true,
                        "componentType": "select",
                        "filterable": true,
                        "optionList": [],
                        "callback": function (val) { }
                    }, {
                        "sortValue": "Marker",
                        "sortName": "关键词",
                        "value": [],
                        "isMultiple": true,
                        "filterable": true,
                        "componentType": "select",
                        "optionList": [],
                        "callback": function (val) { }
                    }, {
                        "sortValue": "schoolId",
                        "sortName": "咨询校区",
                        "value": [],
                        "isMultiple": true,
                        "filterable": true,
                        "componentType": "select",
                        "optionList": [],
                        "callback": function (val) { }
                    }, {
                        "sortValue": "method",
                        "sortName": "方式",
                        "value": [],
                        "isMultiple": true,
                        "filterable": true,
                        "componentType": "select",
                        "optionList": [],
                        "callback": function (val) { }
                    }, {
                        "sortValue": "scene",
                        "sortName": "场景",
                        "value": [],
                        "isMultiple": true,
                        "filterable": true,
                        "componentType": "select",
                        "optionList": [],
                        "callback": function (val) { }
                    }
                    ]

                }
            }
            //筛选项数据
            // filterData: {
            //     singleModel: {
            //         class: "",//自定义样式名
            //         modelList: [
            //             {
            //                 "sortValue": "time", // 筛选项类目值，
            //                 "componentType": "daterange",
            //                 "componentConfig": {
            //                     value: ["2017/07/13", "2017/07/20"],
            //                     placeholder: "录入时间",
            //                     format: "",
            //                     optionList: [{
            //                         "label": "开始时间",
            //                         "value": ""
            //                     }, {
            //                         "label": "结束时间",
            //                         "value": ""
            //                     }]
            //                 },
            //                 "callback": function (val) { },
            //             },
            //             {
            //                 "sortValue": "trend", // 筛选项类目值，
            //                 "componentType": "select",
            //                 "componentConfig": {
            //                     value: ["high"],
            //                     filterable: true,
            //                     placeholder: "意向度",
            //                     clearable: true,
            //                     optionList: [{
            //                         "label": "高少时诵诗书所所所所所所所所所所所所所所所所所所所所所",
            //                         "value": "high"
            //                     }, {
            //                         "label": "中",
            //                         "value": "middle"
            //                     }, {
            //                         "label": "低",
            //                         "value": "low"
            //                     }]
            //                 },
            //                 "callback": function (val) { },
            //             },
            //         ],
            //     },
            //     unionModel: {
            //         class: "",
            //         modelList: [
            //             [
            //                 {
            //                     sortName: "录入时间",
            //                     sortValue: "group1_a",
            //                     parentSortValue: "",
            //                     sonSortValue: "group1_b",
            //                     componentType: "select",
            //                     componentConfig: {
            //                         value: [],
            //                         multiple: true,
            //                         disabled: false,
            //                         filterable: true,
            //                         placeholder: "录入时间",
            //                         clearable: true,
            //                         label: "hhz",
            //                         optionList: [
            //                             {
            //                                 value: "beijing",
            //                                 label: "北京"
            //                             },
            //                             {
            //                                 value: "hangzhou",
            //                                 label: "杭州"
            //                             }
            //                         ]
            //                     },
            //                     callback: {
            //                         "on-change": function (selectModel, modifyModel) {
            //                             modifyModel.componentConfig.value = [];
            //                             modifyModel.componentConfig.optionList = [];
            //                             modifyModel.componentConfig.optionList.push({
            //                                 label: "hhh",
            //                                 value: "11"
            //                             });
            //                             modifyModel.componentConfig.optionList.push({
            //                                 label: "aaa",
            //                                 value: "22"
            //                             });
            //                             modifyModel.componentConfig.optionList.push({
            //                                 label: "ss",
            //                                 value: "33"
            //                             });
            //                         }
            //                     }

            //                 },
            //                 {
            //                     sortName: "跟进",
            //                     sortValue: "group1_b",
            //                     parentSortValue: "group1_a",
            //                     sonSortValue: "",
            //                     componentType: "select",
            //                     componentConfig: {
            //                         value: [],
            //                         multiple: true,
            //                         disabled: false,
            //                         filterable: true,
            //                         placeholder: "跟进",
            //                         clearable: true,
            //                         optionList: [
            //                             {
            //                                 value: "beijing1",
            //                                 label: "北京1"
            //                             },
            //                             {
            //                                 value: "hangzhou1",
            //                                 label: "杭州1"
            //                             }
            //                         ]
            //                     }
            //                 }
            //             ],
            //             [
            //                 {
            //                     sortName: "单选",
            //                     sortValue: "group2_a",
            //                     parentSortValue: "",
            //                     sonSortValue: "group2_b",
            //                     componentType: "select",
            //                     componentConfig: {
            //                         value: "beijing1",
            //                         multiple: false,
            //                         disabled: false,
            //                         filterable: true,
            //                         placeholder: "跟进",
            //                         clearable: true,
            //                         optionList: [
            //                             {
            //                                 value: "beijing1",
            //                                 label: "北京1"
            //                             },
            //                             {
            //                                 value: "hangzhou1",
            //                                 label: "杭州1"
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 {
            //                     sortName: "多选",
            //                     sortValue: "group2_b",
            //                     parentSortValue: "group2_a",
            //                     sonSortValue: "group2_c",
            //                     componentType: "select",
            //                     componentConfig: {
            //                         value: ["beijing1"],
            //                         multiple: true,
            //                         disabled: false,
            //                         filterable: true,
            //                         placeholder: "跟进",
            //                         clearable: true,
            //                         optionList: [
            //                             {
            //                                 value: "beijing1",
            //                                 label: "北京1"
            //                             },
            //                             {
            //                                 value: "hangzhou1",
            //                                 label: "杭州1"
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 {
            //                     sortName: "多选",
            //                     sortValue: "group2_c",
            //                     parentSortValue: "group2_b",
            //                     sonSortValue: "group2_a",
            //                     componentType: "select",
            //                     componentConfig: {
            //                         value: ["beijing1"],
            //                         multiple: true,
            //                         disabled: false,
            //                         filterable: true,
            //                         placeholder: "跟进",
            //                         clearable: true,
            //                         optionList: [
            //                             {
            //                                 value: "beijing1",
            //                                 label: "北京1"
            //                             },
            //                             {
            //                                 value: "hangzhou1",
            //                                 label: "杭州1"
            //                             }
            //                         ]
            //                     }
            //                 }
            //             ],
            //             [
            //                 {
            //                     sortName: "录入时间",
            //                     sortValue: "group3_a",
            //                     parentSortValue: "",
            //                     sonSortValue: "group3_b",
            //                     componentType: "select",
            //                     componentConfig: {
            //                         value: [],
            //                         multiple: true,
            //                         disabled: false,
            //                         filterable: true,
            //                         placeholder: "录入时间",
            //                         clearable: true,
            //                         label: "hhz",
            //                         optionList: [
            //                             {
            //                                 value: "beijing",
            //                                 label: "北京"
            //                             },
            //                             {
            //                                 value: "hangzhou",
            //                                 label: "杭州"
            //                             }
            //                         ]
            //                     },
            //                     callback: {
            //                         "on-change": function (selectModel, modifyModel) {
            //                             modifyModel.componentConfig.value = [];
            //                             modifyModel.componentConfig.optionList = [];
            //                             modifyModel.componentConfig.optionList.push({
            //                                 label: "hhh",
            //                                 value: "11"
            //                             });
            //                             modifyModel.componentConfig.optionList.push({
            //                                 label: "aaa",
            //                                 value: "22"
            //                             });
            //                             modifyModel.componentConfig.optionList.push({
            //                                 label: "ss",
            //                                 value: "33"
            //                             });
            //                         }
            //                     }

            //                 },
            //                 {
            //                     sortName: "跟进",
            //                     sortValue: "group3_b",
            //                     parentSortValue: "group3_a",
            //                     sonSortValue: "group3_c",
            //                     componentType: "select",
            //                     componentConfig: {
            //                         value: [],
            //                         multiple: true,
            //                         disabled: false,
            //                         filterable: true,
            //                         placeholder: "跟进",
            //                         clearable: true,
            //                         optionList: [
            //                             {
            //                                 value: "beijing1",
            //                                 label: "北京1"
            //                             },
            //                             {
            //                                 value: "hangzhou1",
            //                                 label: "杭州1"
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 {
            //                     sortName: "跟进",
            //                     sortValue: "group3_c",
            //                     parentSortValue: "group3_b",
            //                     sonSortValue: "group3_d",
            //                     componentType: "select",
            //                     componentConfig: {
            //                         value: [],
            //                         multiple: true,
            //                         disabled: false,
            //                         filterable: true,
            //                         placeholder: "跟进",
            //                         clearable: true,
            //                         optionList: [
            //                             {
            //                                 value: "beijing1",
            //                                 label: "北京1"
            //                             },
            //                             {
            //                                 value: "hangzhou1",
            //                                 label: "杭州1"
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 {
            //                     sortName: "跟进",
            //                     sortValue: "group3_d",
            //                     parentSortValue: "group3_c",
            //                     sonSortValue: "",
            //                     componentType: "select",
            //                     componentConfig: {
            //                         value: [],
            //                         multiple: true,
            //                         disabled: false,
            //                         filterable: true,
            //                         placeholder: "跟进",
            //                         clearable: true,
            //                         optionList: [
            //                             {
            //                                 value: "beijing1",
            //                                 label: "北京1"
            //                             },
            //                             {
            //                                 value: "hangzhou1",
            //                                 label: "杭州1"
            //                             }
            //                         ]
            //                     }
            //                 }
            //             ]

            //         ]
            //     },
            //     multiModel: {
            //         class: "",
            //         modelList: [
            //             {
            //                 sortName: "多选组件",
            //                 sortValue: "mm",
            //                 componentType: "select",
            //                 componentConfig: {
            //                     value: ["beijing1", "hangzhou1"],
            //                     multiple: true,
            //                     filterable: true,
            //                     placeholder: "城市",
            //                     optionList: [
            //                         {
            //                             value: "beijing1",
            //                             label: "北京1"
            //                         },
            //                         {
            //                             value: "hangzhou1",
            //                             label: "杭州1"
            //                         }
            //                     ]
            //                 }
            //             }
            //         ]
            //     }
            // }
        };
    },
    computed: {},
    mounted(){
        // 模拟异步
        setTimeout(()=>{
            this.filterData.ajaxData =[  {"sortname": "录入时间", "sortvalue": "Adddate", "HasDate": false, "father": null, "son": null, "isSingle": true, "userDefined": true, "lables": [{ "lablename": "一周内", "lablevalue": "2017-07-19,2017-07-26", "IsDate": false, "IsDelete": false }, { "lablename": "一个月内", "lablevalue": "2017-06-26,2017-07-26", "IsDate": false, "IsDelete": false }, { "lablename": "三个月内", "lablevalue": "2017-04-27,2017-07-26", "IsDate": false, "IsDelete": false }, { "lablename": "半年内", "lablevalue": "2017-01-27,2017-07-26", "IsDate": false, "IsDelete": false }, { "lablename": "一年内", "lablevalue": "2016-07-26,2017-07-26", "IsDate": false, "IsDelete": false }], "lablename": null, "isShowAll": false },
                    {"sortname":"意向度","sortvalue":"interest","HasDate":false,"father":null,"son":null,"isSingle":false,"userDefined":false,"lables":[{"lablename":"高","lablevalue":"高","IsDate":false,"IsDelete":false},{"lablename":"中","lablevalue":"中","IsDate":false,"IsDelete":false},{"lablename":"低","lablevalue":"低","IsDate":false,"IsDelete":false},{"lablename":"？","lablevalue":"？","IsDate":false,"IsDelete":false}],"lablename":null,"isShowAll":false},
                    {"sortname":"星标","sortvalue":"isCollection","HasDate":false,"father":null,"son":null,"isSingle":true,"userDefined":false,"lables":[{"lablename":"有星标","lablevalue":"1","IsDate":false,"IsDelete":false},{"lablename":"无星标","lablevalue":"0","IsDate":false,"IsDelete":false}],"lablename":null,"isShowAll":false},
                    {"sortname":"渠道分类","sortvalue":"channelclassification","HasDate":false,"father":null,"son":"ChannelId","isSingle":false,"userDefined":false,"lables":[{"lablename":"校宝秀活动","lablevalue":"11597","IsDate":false,"IsDelete":false},{"lablename":"校宝秀商品","lablevalue":"11598","IsDate":false,"IsDelete":false},{"lablename":"线下活动","lablevalue":"11599","IsDate":false,"IsDelete":false},{"lablename":"合作渠道","lablevalue":"11600","IsDate":false,"IsDelete":false},{"lablename":"其他","lablevalue":"11601","IsDate":false,"IsDelete":false},{"lablename":"333","lablevalue":"14667","IsDate":false,"IsDelete":false},{"lablename":"吱吱","lablevalue":"14668","IsDate":false,"IsDelete":false}],"lablename":null,"isShowAll":false},
                    {"sortname":"渠道名称","sortvalue":"ChannelId","HasDate":false,"father":"channelclassification","son":null,"isSingle":false,"userDefined":false,"lables":[],"lablename":null,"isShowAll":false}
                    ]
                    console.log("ajax获取数据计时器结束")
        },3000)
    },
    methods: {}


};
</script>
