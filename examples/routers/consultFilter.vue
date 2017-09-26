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
            //↓ searchData 搜索区域，传入null该对象则整块区域隐藏
            searchData: {
                // ↓ searchData.data 必填，搜索下拉项，至少一项。其中的text会成为搜索框的placeholder，例： “请选择 + 学员姓名”
                data: [{"text": "学员姓名","value": "1"}, {"text": "学员电话","value": "2"}],
                // ↓ searchData.opts 必填，没有配置传入空对象{}，否则报错给你看 _(:з」∠)_
                opts: {
                    "defaultSearchKey": "", //← 非必填，默认搜索类型（iview only：搜索类型必须在下拉项中），不填取默认第一项
                    "defaultSearchValue": "", //← 非必填：搜索默认值，不填取默认第一项
                    "isHideOptsList": false,//← 非必填：是否隐藏搜索栏边上的下拉列表，默认：false
                    "isResetFilter": false //← 非必填：搜索时结果是否与筛选项互斥，默认：false
                }
            },

            //筛选项数据，必传
            filterData: {
                //↓ filterData.isClear 是否清空数据，true：是，false：否
                isClear: false,
                data: {
                    // ↓ filterData.data.singleModel 单选筛选项数据结构
                    singleModel: {
                        class: "",//自定义样式名,不会替换援用样式
                        modelList: [
                            {
                                "sortName": "录入时间",
                                "sortValue": "Adddate",
                                "parentSortValue": null,
                                "sonSortValue": null,
                                "componentType": "daterange",
                                "componentConfig": {
                                    "value": ["2017-08-01","2017-08-07"],
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
                            {
                                "sortName": "意向度",
                                "sortValue": "Interest",
                                "parentSortValue": null,
                                "sonSortValue": null,
                                "componentType": "select",
                                "componentConfig": {
                                    "value": ["高"],
                                    "filterable": false,
                                    "multiple": false,
                                    "clearable": true,
                                    "itemCount": 0,
                                    "optionList": [
                                        {
                                            "label": "高",
                                            "value": "高"
                                        },
                                        {
                                            "label": "中",
                                            "value": "中"
                                        },
                                        {
                                            "label": "低",
                                            "value": "低"
                                        },
                                        {
                                            "label": "？",
                                            "value": "？"
                                        }
                                    ]
                                },
                                "RemoteUrl": null
                            },
                        ],//异步返回
                    },
                    // ↓ filterData.data.unionModel 联动筛选项数据结构
                    unionModel: {
                        class: "",//自定义样式名,不会替换援用样式
                        modelList: [
                            [
                                {
                                    sortName: "省份",
                                    sortValue: "group1_a",
                                    parentSortValue: "",
                                    sonSortValue: "group1_b",
                                    componentType: "select",
                                    componentConfig: {
                                        value: [],
                                        multiple: true,
                                        disabled: false,
                                        filterable: true,
                                        clearable: true,
                                        optionList: [
                                            {
                                                value: "nj",
                                                label: "南京"
                                            },
                                            {
                                                value: "zj",
                                                label: "浙江"
                                            }
                                        ]
                                    },
                                    "RemoteUrl": null

                                },
                                {
                                    sortName: "城市",
                                    sortValue: "group1_b",
                                    parentSortValue: "group1_a",
                                    sonSortValue: "",
                                    componentType: "select",
                                    componentConfig: {
                                        value: [],
                                        multiple: true,
                                        disabled: false,
                                        filterable: true,
                                        clearable: true,
                                        optionList: []
                                    },
                                    "RemoteUrl": null
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
                                        value: ["beijing1"],
                                        multiple: false,
                                        disabled: false,
                                        filterable: true,
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
                                    },
                                    "RemoteUrl": null
                                },
                                {
                                    sortName: "多选",
                                    sortValue: "group2_b",
                                    parentSortValue: "group2_a",
                                    sonSortValue: "group2_c",
                                    componentType: "select",
                                    componentConfig: {
                                        value: [],
                                        multiple: true,
                                        disabled: false,
                                        filterable: true,
                                        clearable: true,
                                        optionList: []
                                    },
                                    "RemoteUrl": null
                                },
                                {
                                    sortName: "多选",
                                    sortValue: "group2_c",
                                    parentSortValue: "group2_b",
                                    sonSortValue: "group2_a",
                                    componentType: "select",
                                    componentConfig: {
                                        value: [],
                                        multiple: true,
                                        disabled: false,
                                        filterable: true,
                                        clearable: true,
                                        optionList: []
                                    },
                                    "RemoteUrl": null
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
                                        clearable: true,
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
                                    "RemoteUrl": null
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
                                        clearable: true,
                                        optionList: []
                                    },
                                    "RemoteUrl": null
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
                                        clearable: true,
                                        optionList: []
                                    },
                                    "RemoteUrl": null
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
                                        clearable: true,
                                        optionList: []
                                    },
                                    "RemoteUrl": null
                                }

                            ]

                        ]
                    },
                    // ↓ filterData.data.multiModel 多选筛选项数据结构
                    multiModel: {
                        class: "",//自定义样式名,不会替换援用样式
                        modelList: [
                            {
                                sortName: "多选组件",
                                sortValue: "mm",
                                componentType: "select",
                                componentConfig: {
                                    value: ["beijing1", "hangzhou1"],
                                    multiple: true,
                                    filterable: true,
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
                                },
                                "RemoteUrl": null
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


