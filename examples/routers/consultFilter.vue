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
                callback: function (obj) {
                    console.log("我搜索了" + obj.key + "下的" + obj.value)
                }
            },

            //筛选项数据
            filterData: {
                isClear: false,
                singleModel: {
                    class: "",//自定义样式名
                    modelList: [],//异步返回
                },
                unionModel: {
                    class: "",
                    modelList: [
                        [
                            {
                                sortName: "录入时间",
                                sortValue: "group1_a",
                                parentSortValue: "",
                                sonSortValue: "group1_b",
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
                                        modifyModel.componentConfig.value = [];
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
                                sortValue: "group1_b",
                                parentSortValue: "group1_a",
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
                            }
                        ],
                        [
                            {
                                sortName: "单选",
                                sortValue: "group2_a",
                                parentSortValue: "",
                                sonSortValue: "group2_b",
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
                                sortValue: "group2_b",
                                parentSortValue: "group2_a",
                                sonSortValue: "group2_c",
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
                            },
                            {
                                sortName: "多选",
                                sortValue: "group2_c",
                                parentSortValue: "group2_b",
                                sonSortValue: "group2_a",
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
                        ],
                        [
                            {
                                sortName: "录入时间",
                                sortValue: "group3_a",
                                parentSortValue: "",
                                sonSortValue: "group3_b",
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
                                        modifyModel.componentConfig.value = [];
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
                                sortValue: "group3_b",
                                parentSortValue: "group3_a",
                                sonSortValue: "group3_c",
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
                                sortName: "跟进",
                                sortValue: "group3_c",
                                parentSortValue: "group3_b",
                                sonSortValue: "group3_d",
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
                                sortName: "跟进",
                                sortValue: "group3_d",
                                parentSortValue: "group3_c",
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
                            }
                        ]

                    ]
                },
                multiModel: {
                    class: "",
                    modelList: [
                        {
                            sortName: "多选组件",
                            sortValue: "mm",
                            componentType: "select",
                            componentConfig: {
                                value: ["beijing1", "hangzhou1"],
                                multiple: true,
                                filterable: true,
                                placeholder: "城市",
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
                // 输出：选中项回调
                callback: {
                    "selected": function (obj) {
                        console.log(obj)
                    }
                }
            }
        };
    },
    computed: {},
    mounted() {

        // 模拟异步
        setTimeout(() => {
            var ajaxData = [
                {
                    "SortName": "录入时间",
                    "SortValue": "time", // 筛选项类目值，
                    "ComponentType": "daterange",
                    "ComponentConfig": {
                        Value: ["2017/07/13", "2017/07/20"],
                        Format: "",
                        OptionList: [{
                            "Label": "开始时间",
                            "Value": ""
                        }, {
                            "Label": "结束时间",
                            "Value": ""
                        }]
                    },
                    "Callback": function (val) { },
                },
                {
                    "sortName": "意向度",
                    "SortValue": "trend", // 筛选项类目值，
                    "ComponentType": "select",
                    "ComponentConfig": {
                        Value: ["high"],
                        Filterable: true,
                        Clearable: true,
                        OptionList: [{
                            "Label": "高少",
                            "Value": "high"
                        }, {
                            "Label": "中",
                            "Value": "middle"
                        }, {
                            "Label": "低",
                            "Value": "low"
                        }]
                    },
                    "Callback": function (val) { },
                }

            ];

            this.filterData.singleModel.modelList = this.firstStrlowerCase(ajaxData);

            console.log("ajax获取数据计时器结束")

            setTimeout(() => {
                console.log("执行数据删除操作");
                // this.filterData.isClear = true;


            }, 3000)

        }, 3000)


    },
    methods: {
        firstStrlowerCase(obj) {

            var strObj = JSON.stringify(obj)
            var strObj2 = strObj.replace(/(\")(\w*)(\"\:)/g, function ($0, $1, $2, $3) {
                return $1 + $2.substring(0, 1).toLowerCase() + $2.substring(1) + $3;
            })

            return JSON.parse(strObj2);
        }
    }


};
</script>


