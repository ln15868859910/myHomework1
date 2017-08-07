<style></style>
<template>
    <consult-filter :search-data="searchData" :filter-data="filterData" :callback="callback">
        <div style="float:left" slot="customLeft">
            <i-button type="primary" @click="addConsult()" style="margin-right:10px">新建咨询</i-button>
            <i-button type="ghost" @click="showUploadPop()" style="margin-right:10px">导入</i-button>
            <i-button type="ghost" @click="exportExcel()">导出</i-button>
        </div>
    </consult-filter>
</template>
<script>
export default {

    props: {},
    data() {
        return {

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
                    "defaultSearchKey": "", //默认搜索类型（iview only：搜索类型必须在下拉项中）
                    "defaultSearchValue": "", //搜索默认值
                    "isResetFilter": false //默认：false，搜索时结果是否与筛选项互斥
                },
                callback: function (obj) {
                    console.log("我搜索了" + obj.key + "下的" + obj.value)
                }
            },

            //筛选项数据
            filterData: {
                isClear: false,
                data: {
                    singleModel: {
                        class: "",//自定义样式名
                        modelList: [
                            {
                                "sortName": "录入时间",
                                "sortValue": "Adddate",
                                "parentSortValue": null,
                                "sonSortValue": null,
                                "componentType": "daterange",
                                "componentConfig": {
                                    "value": [],
                                    "filterable": false,
                                    "multiple": false,
                                    "clearable": true,
                                    "itemCount": 0,
                                    "optionList": [
                                        {
                                            "label": "一周内",
                                            "value": "2017-08-01,2017-08-07"
                                        },
                                        {
                                            "label": "一个月内",
                                            "value": "2017-07-09,2017-08-07"
                                        },
                                        {
                                            "label": "三个月内",
                                            "value": "2017-05-10,2017-08-07"
                                        },
                                        {
                                            "label": "半年内",
                                            "value": "2017-02-09,2017-08-07"
                                        },
                                        {
                                            "label": "一年内",
                                            "value": "2016-08-08,2017-08-07"
                                        }
                                    ]
                                },
                                "remoteUrl": null
                            },
                        ],//异步返回
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
                }
            },
            //筛选按钮选中回调
            callback: {
                "selected": function (filterObj, searchObj) {
                    console.log(JSON.stringify(filterObj), JSON.stringify(searchObj))
                }
            },

        };
    },
    computed: {},
    mounted() { },
    methods: {
        firstStrlowerCase(obj) {
            var strObj = JSON.stringify(obj)
            var strObj2 = strObj.replace(/(\")(\w*)(\"\:)/g, function ($0, $1, $2, $3) {
                return $1 + $2.substring(0, 1).toLowerCase() + $2.substring(1) + $3;
            })
            return JSON.parse(strObj2);
        },
        addConsult: function () {
            console.log("新增咨询");
        },
        showUploadPop: function () {
            console.log("导入");
        },
        exportExcel: function () {
            console.log("导出");
        }
    }


};
</script>


