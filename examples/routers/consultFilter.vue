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

            //筛选项数据
            filterData: {
                singleModel: {
                    class: "",//自定义样式名
                    modelList: [
                        {
                            "sortValue": "time", // 筛选项类目值，
                            "componentType": "daterange",
                            "componentConfig": {
                                value: ["2017/07/13", "2017/07/20"],
                                placeholder: "录入时间",
                                format: "",
                                optionList: [{
                                    "label": "开始时间",
                                    "value": ""
                                }, {
                                    "label": "结束时间",
                                    "value": ""
                                }]
                            },
                            "callback": function (val) { },
                        },
                        {
                            "sortValue": "trend", // 筛选项类目值，
                            "componentType": "select",
                            "componentConfig": {
                                value: ["high"],
                                filterable: true,
                                placeholder: "意向度",
                                clearable: true,
                                optionList: [{
                                    "label": "高少时诵诗书所所所所所所所所所所所所所所所所所所所所所",
                                    "value": "high"
                                }, {
                                    "label": "中",
                                    "value": "middle"
                                }, {
                                    "label": "低",
                                    "value": "low"
                                }]
                            },
                            "callback": function (val) { },
                        },
                    ],
                },
                unionModel: {
                    class: "",
                    modelList: [
                        {
                            sortName: "录入时间",
                            sortValue: "a",
                            parentSortValue: "",
                            sonSortValue: "b",
                            componentType: "select",
                            componentConfig: {
                                value: [],
                                multiple: true,
                                disabled: false,
                                filterable: true,
                                placeholder: "录入时间",
                                clearable: true,
                                label: "hhz",
                                optionList: [
                                    {
                                        value: "beijing",
                                        label: "北京"
                                    },
                                    {
                                        value: "hangzhou",
                                        label: "杭州"
                                    }
                                ]
                            },
                            callback: {
                                "on-change": function (selectModel, modifyModel) {
                                    modifyModel.componentConfig.optionList = [];
                                    modifyModel.componentConfig.optionList.push({
                                        label: "hhh",
                                        value: "11"
                                    });
                                    modifyModel.componentConfig.optionList.push({
                                        label: "aaa",
                                        value: "22"
                                    });
                                    modifyModel.componentConfig.optionList.push({
                                        label: "ss",
                                        value: "33"
                                    });
                                }
                            }

                        },
                        {
                            sortName: "跟进",
                            sortValue: "b",
                            parentSortValue: "a",
                            sonSortValue: "",
                            componentType: "select",
                            componentConfig: {
                                value: [],
                                multiple: true,
                                disabled: false,
                                filterable: true,
                                placeholder: "跟进",
                                clearable: true,
                                optionList: [
                                    {
                                        value: "beijing1",
                                        label: "北京1"
                                    },
                                    {
                                        value: "hangzhou1",
                                        label: "杭州1"
                                    }
                                ]
                            }
                        },
                        {
                            sortName: "单选",
                            sortValue: "c",
                            parentSortValue: "",
                            sonSortValue: "",
                            componentType: "select",
                            componentConfig: {
                                value: "beijing1",
                                multiple: false,
                                disabled: false,
                                filterable: true,
                                placeholder: "跟进",
                                clearable: true,
                                optionList: [
                                    {
                                        value: "beijing1",
                                        label: "北京1"
                                    },
                                    {
                                        value: "hangzhou1",
                                        label: "杭州1"
                                    }
                                ]
                            }
                        },
                        {
                            sortName: "多选",
                            sortValue: "d",
                            parentSortValue: "",
                            sonSortValue: "",
                            componentType: "select",
                            componentConfig: {
                                value: ["beijing1"],
                                multiple: true,
                                disabled: false,
                                filterable: true,
                                placeholder: "跟进",
                                clearable: true,
                                optionList: [
                                    {
                                        value: "beijing1",
                                        label: "北京1"
                                    },
                                    {
                                        value: "hangzhou1",
                                        label: "杭州1"
                                    }
                                ]
                            }
                        }
                    ]
                },
                multiModel: {
                    class: "",
                    modelList: [
                        {
                            sortName: "多选组件",
                            sortValue: "mm",
                            parentSortValue: "",
                            sonSortValue: "",
                            componentType: "select",
                            componentConfig: {
                                value: ["beijing1","hangzhou1"],
                                multiple: true,
                                disabled: false,
                                filterable: true,
                                placeholder: "城市",
                                clearable: true,
                                optionList: [
                                    {
                                        value: "beijing1",
                                        label: "北京1"
                                    },
                                    {
                                        value: "hangzhou1",
                                        label: "杭州1"
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        };
    },
    computed: {},
    methods: {}


};
</script>
