<style>
.custumclass {
    left: 30px;
}
.floatright {
    margin-right: 30px;
}
.filterResult{
    padding: 20px 30px;
}
</style>
<template>
<div>
    <consult-filter :search-data="searchData" :filter-data="filterData" :callback="callback" :custum-class="custumclass">
        <div style="float:left" slot="customLeft">
            <i-button type="primary" @click="addConsult()" style="margin-right:10px">新建咨询</i-button>
            <i-button type="ghost" @click="showUploadPop()" style="margin-right:10px">导入</i-button>
            <i-button type="ghost" @click="exportExcel()">导出</i-button>
        </div>
    </consult-filter> -->

    <consult-filter :search-data="filterConfig.searchData" :filter-data="filterConfig.filterData" :callback="filterConfig.callback" ref="classFilter" :containerStyle="containerStyle"
            style="margin-bottom:0">
            <div class="filter-button-box floatL" slot="customLeft">
                <i-button type="primary" @click="addConsult()"  style="width:100px">新建班级</i-button>
                <i-button type="ghost" @click="showUploadPop()"  style="width:100px">导入班级</i-button>
            </div>
        </consult-filter>
        <xb-icon type='class'></xb-icon>
        </div>

</template>
<script>
export default {
    props: {},
    data() {
        return {
            custumclass: {
                custom: 'custumclass',
                floatright: 'floatright',
                filterResult:'filterResult'
            },
            //↓ searchData 搜索区域，传入null该对象则整块区域隐藏
            searchData: {
                // ↓ searchData.data 必填，搜索下拉项，至少一项。其中的text会成为搜索框的placeholder，例： “请选择 + 学员姓名”
                data: [
                    {
                        text: '学员姓名',
                        value: '1'
                    },
                    {
                        text: '学员电话',
                        value: '2'
                    }
                ],
                // ↓ searchData.opts 必填，没有配置传入空对象{}，否则报错给你看 _(:з」∠)_
                opts: {
                    defaultSearchKey: '', //← 非必填，默认搜索类型（iview only：搜索类型必须在下拉项中），不填取默认第一项
                    defaultSearchValue: '', //← 非必填：搜索默认值，不填取默认第一项
                    isHideOptsList: false, //← 非必填：是否隐藏搜索栏边上的下拉列表，默认：false
                    isResetFilter: false //← 非必填：搜索时结果是否与筛选项互斥，默认：false
                }
            },
            containerStyle:{
                type:"horizontal",
                ratio:{
                    multi:4,
                    single:12,
                    union:8
                }
            },
            //筛选项数据，必传
            filterData: {
                //↓ filterData.isClear 是否清空数据，true：是，false：否
                isClear: false,
                data: {
                    // ↓ filterData.data.singleModel 单选筛选项数据结构
                    singleModel: {
                        class: '', //自定义样式名,不会替换援用样式
                        modelList: [
                            {
                                sortName: '录入时间',
                                sortValue: 'Adddate',
                                parentSortValue: null,
                                sonSortValue: null,
                                componentType: 'daterange',
                                componentConfig: {
                                    value: ['2017-08-01', '2017-08-07'],
                                    filterable: false,
                                    multiple: false,
                                    clearable: true,
                                    itemCount: 0,
                                    optionList: [
                                        {
                                            label: '一周内',
                                            value: '2017-08-01,2017-08-07'
                                        },
                                        {
                                            label: '一个月内',
                                            value: '2017-07-09,2017-08-07'
                                        },
                                        {
                                            label: '三个月内',
                                            value: '2017-05-10,2017-08-07'
                                        },
                                        {
                                            label: '半年内',
                                            value: '2017-02-09,2017-08-07'
                                        },
                                        {
                                            label: '一年内',
                                            value: '2016-08-08,2017-08-07'
                                        }
                                    ]
                                },
                                remoteUrl: null
                            },
                            {
                                sortName: '意向度',
                                sortValue: 'Interest',
                                parentSortValue: null,
                                sonSortValue: null,
                                componentType: 'select',
                                componentConfig: {
                                    value: '',
                                    filterable: true,
                                    multiple: false,
                                    clearable: true,
                                    itemCount: 0,
                                    optionList: [
                                        {
                                            label: '高',
                                            value: '1'
                                        },
                                        {
                                            label: '中',
                                            value: '2'
                                        },
                                        {
                                            label: '低',
                                            value: '3'
                                        },
                                        {
                                            label: '？',
                                            value: '4'
                                        }
                                    ]
                                },
                                remoteUrl: {
                                    onSearch: '/api/GetData'
                                }
                            }
                        ] //异步返回
                    },
                    // ↓ filterData.data.unionModel 联动筛选项数据结构
                    unionModel: {
                        class: '', //自定义样式名,不会替换援用样式
                        modelList: [
                            [
                                {
                                    sortName: '省份',
                                    sortValue: 'group1_a',
                                    parentSortValue: '',
                                    sonSortValue: 'group1_b',
                                    componentType: 'select',
                                    componentConfig: {
                                        value: ['js'],
                                        multiple: true,
                                        disabled: false,
                                        filterable: true,
                                        clearable: true,
                                        optionList: [
                                            {
                                                value: 'js',
                                                label: '江苏'
                                            },
                                            {
                                                value: 'zj',
                                                label: '浙江'
                                            }
                                        ]
                                    },
                                    RemoteUrl: null
                                },
                                {
                                    sortName: '城市',
                                    sortValue: 'group1_b',
                                    parentSortValue: 'group1_a',
                                    sonSortValue: '',
                                    componentType: 'select',
                                    componentConfig: {
                                        value: ['yz'],
                                        label: ['扬州'],
                                        parentvalue: ['js'],
                                        multiple: true,
                                        disabled: false,
                                        filterable: true,
                                        clearable: true,
                                        optionList: [
                                            {
                                                value: 'nj',
                                                label: '南京'
                                            },
                                            {
                                                value: 'sz',
                                                label: '苏州'
                                            }
                                        ]
                                    },
                                    remoteUrl: {
                                        onSearch: function(data) {
                                            console.log(data);
                                        }
                                    }
                                }
                            ],
                            [
                                {
                                    sortName: '单选',
                                    sortValue: 'group2_a',
                                    parentSortValue: '',
                                    sonSortValue: 'group2_b',
                                    componentType: 'select',
                                    componentConfig: {
                                        value: ['wuhan'],
                                        label: ['武汉'],
                                        multiple: false,
                                        disabled: false,
                                        filterable: true,
                                        clearable: true,
                                        optionList: [
                                            {
                                                value: 'beijing1',
                                                label: '北京1'
                                            },
                                            {
                                                value: 'hangzhou1',
                                                label: '杭州1'
                                            }
                                        ]
                                    },
                                    remoteUrl: {
                                        onSearch: function(data) {
                                            console.log(data);
                                        }
                                    }
                                },
                             
                            ],
                            [
                                {
                                    sortName: '录入时间',
                                    sortValue: 'group3_a',
                                    parentSortValue: '',
                                    sonSortValue: 'group3_b',
                                    componentType: 'select',
                                    componentConfig: {
                                        value: ['wuhan'],
                                        label: ['武汉'],
                                        multiple: true,
                                        disabled: false,
                                        filterable: true,
                                        clearable: true,
                                        optionList: [
                                            {
                                                value: 'beijing',
                                                label: '北京'
                                            },
                                            {
                                                value: 'hangzhou',
                                                label: '杭州'
                                            }
                                        ]
                                    },
                                    remoteUrl: {
                                        onSearch: function(data) {
                                            console.log('data');
                                        }
                                    }
                                },
                                {
                                    sortName: '跟进',
                                    sortValue: 'group3_b',
                                    parentSortValue: 'group3_a',
                                    sonSortValue: 'group3_c',
                                    componentType: 'select',
                                    componentConfig: {
                                        value: [],
                                        multiple: true,
                                        disabled: false,
                                        filterable: true,
                                        clearable: true,
                                        optionList: []
                                    },
                                    RemoteUrl: null
                                },
                                {
                                    sortName: '跟进',
                                    sortValue: 'group3_c',
                                    parentSortValue: 'group3_b',
                                    sonSortValue: 'group3_d',
                                    componentType: 'select',
                                    componentConfig: {
                                        value: [],
                                        multiple: true,
                                        disabled: false,
                                        filterable: true,
                                        clearable: true,
                                        optionList: []
                                    },
                                    RemoteUrl: null
                                },
                                {
                                    sortName: '跟进',
                                    sortValue: 'group3_d',
                                    parentSortValue: 'group3_c',
                                    sonSortValue: '',
                                    componentType: 'select',
                                    componentConfig: {
                                        value: [],
                                        multiple: true,
                                        disabled: false,
                                        filterable: true,
                                        clearable: true,
                                        optionList: []
                                    },
                                    RemoteUrl: null
                                }
                            ]
                        ]
                    },
                    // ↓ filterData.data.multiModel 多选筛选项数据结构
                    multiModel: {
                        class: '', //自定义样式名,不会替换援用样式
                        modelList: [
                            {
                                sortName: '多选组件',
                                sortValue: 'mm',
                                componentType: 'select',
                                componentConfig: {
                                    value: ['huzhou', 'beijing1'],
                                    label: ['湖州', '北京1'],
                                    multiple: true,
                                    filterable: true,
                                    optionList: [
                                        {
                                            value: 'beijing1',
                                            label: '北京1'
                                        },
                                        {
                                            value: 'hangzhou1',
                                            label: '杭州1'
                                        }
                                    ]
                                },
                                remoteUrl: {
                                    onSearch: function(data) {
                                        console.log('data');
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            filterConfig: {
                //搜索区域
                searchData: {
                    data: [],
                    opts: {
                        defaultSearchKey: '', //默认搜索类型（iview only：搜索类型必须在下拉项中）
                        defaultSearchValue: '', //搜索默认值
                        isResetFilter: true //默认：false，搜索时结果是否与筛选项互斥
                    }
                },

                filterData: {
                    isClear: false,
                    data: {}
                },
                //筛选按钮选中回调
                callback: {
                    selected: function(filterObj, searchObj) {
                        // me.filterParam = filterObj;
                        // me.searchParam.SearchKey = searchObj.key;
                        // me.searchParam.SearchValue = searchObj.value;
                        // me.pageParam.pageIndex = 1; //重置分页参数
                        // me.fetchData();
                        console.log(filterObj);
                    }
                }
            },
            //筛选按钮选中回调
            callback: {
                selected: function(filterObj, searchObj) {
                    console.log(JSON.stringify(filterObj), JSON.stringify(searchObj));
                }
            }
        };
    },
    computed: {},
    mounted() {},
    created() {
        this.getFilterData();
    },
    methods: {
        firstStrlowerCase(obj) {
            var strObj = JSON.stringify(obj);
            var strObj2 = strObj.replace(/(\")(\w*)(\"\:)/g, function($0, $1, $2, $3) {
                return $1 + $2.substring(0, 1).toLowerCase() + $2.substring(1) + $3;
            });
            return JSON.parse(strObj2);
        },
        addConsult: function() {
            console.log('新增咨询');
        },
        showUploadPop: function() {
            console.log('导入');
        },
        exportExcel: function() {
            console.log('导出');
        },
        getFilterData() {
            var me = this;
            var res = {
                Status: true,
                ErrorCode: 0,
                ErrorMessage: '',
                Data: {
                    SingleModel: {
                        ModelList: [
                            {
                                SortName: '开班日期',
                                SortValue: 'StartDate',
                                ParentSortValue: null,
                                SonSortValue: null,
                                ComponentType: 'daterange',
                                ComponentConfig: {
                                    Value: [],
                                    Filterable: false,
                                    Multiple: false,
                                    Clearable: true,
                                    ItemCount: 0,
                                    OptionList: [
                                        {
                                            Label: '一周内',
                                            Value: '2018-03-01,2018-03-07'
                                        },
                                        {
                                            Label: '一个月内',
                                            Value: '2018-02-06,2018-03-07'
                                        },
                                        {
                                            Label: '三个月内',
                                            Value: '2017-12-08,2018-03-07'
                                        },
                                        {
                                            Label: '半年内',
                                            Value: '2017-09-09,2018-03-07'
                                        },
                                        {
                                            Label: '一年内',
                                            Value: '2017-03-08,2018-03-07'
                                        }
                                    ],
                                    MaxSpan: 31
                                },
                                RemoteUrl: null
                            },
                            {
                                SortName: '结班日期',
                                SortValue: 'EndDate',
                                ParentSortValue: null,
                                SonSortValue: null,
                                ComponentType: 'daterange',
                                ComponentConfig: {
                                    Value: [],
                                    Filterable: false,
                                    Multiple: false,
                                    Clearable: true,
                                    ItemCount: 0,
                                    OptionList: [
                                        {
                                            Label: '一周内',
                                            Value: '2018-03-01,2018-03-07'
                                        },
                                        {
                                            Label: '一个月内',
                                            Value: '2018-02-06,2018-03-07'
                                        },
                                        {
                                            Label: '三个月内',
                                            Value: '2017-12-08,2018-03-07'
                                        },
                                        {
                                            Label: '半年内',
                                            Value: '2017-09-09,2018-03-07'
                                        },
                                        {
                                            Label: '一年内',
                                            Value: '2017-03-08,2018-03-07'
                                        }
                                    ],
                                    MaxSpan: 31
                                },
                                RemoteUrl: null
                            },
                            {
                                SortName: '收费模式',
                                SortValue: 'ClassMode',
                                ParentSortValue: null,
                                SonSortValue: null,
                                ComponentType: 'select',
                                ComponentConfig: {
                                    Value: ['1'],
                                    Filterable: false,
                                    Multiple: false,
                                    Clearable: true,
                                    ItemCount: 3,
                                    OptionList: [
                                        {
                                            Label: '按课时',
                                            Value: '1'
                                        },
                                        {
                                            Label: '按时间',
                                            Value: '2'
                                        },
                                        {
                                            Label: '按期',
                                            Value: '3'
                                        }
                                    ],
                                    MaxSpan: 0
                                },
                                RemoteUrl: null
                            },
                            {
                                SortName: '招生状态',
                                SortValue: 'Enrolling',
                                ParentSortValue: null,
                                SonSortValue: null,
                                ComponentType: 'select',
                                ComponentConfig: {
                                    Value: [],
                                    Filterable: false,
                                    Multiple: false,
                                    Clearable: true,
                                    ItemCount: 3,
                                    OptionList: [
                                        {
                                            Label: '停止招生',
                                            Value: '0'
                                        },
                                        {
                                            Label: '开放招生',
                                            Value: '1'
                                        }
                                    ],
                                    MaxSpan: 0
                                },
                                RemoteUrl: null
                            },
                            {
                                SortName: '班级状态',
                                SortValue: 'Status',
                                ParentSortValue: null,
                                SonSortValue: null,
                                ComponentType: 'select',
                                ComponentConfig: {
                                    Value: [],
                                    Filterable: false,
                                    Multiple: false,
                                    Clearable: true,
                                    ItemCount: 3,
                                    OptionList: [
                                        {
                                            Label: '未开班',
                                            Value: '0'
                                        },
                                        {
                                            Label: '开班中',
                                            Value: '1'
                                        },
                                        {
                                            Label: '已结班',
                                            Value: '2'
                                        }
                                    ],
                                    MaxSpan: 0
                                },
                                RemoteUrl: null
                            }
                        ]
                    },
                    MultiModel: {
                        ModelList: [
                            
                            {
                                SortName: '学年',
                                SortValue: 'AcademicYear',
                                ParentSortValue: null,
                                SonSortValue: null,
                                ComponentType: 'select',
                                ComponentConfig: {
                                    Value: [],
                                    Filterable: false,
                                    Multiple: false,
                                    Clearable: true,
                                    ItemCount: 2,
                                    OptionList: [
                                        {
                                            Label: '2017',
                                            Value: '15334'
                                        },
                                        {
                                            Label: '2018',
                                            Value: '23097'
                                        },
                                        {
                                            Label: '2019',
                                            Value: '23098'
                                        }
                                    ],
                                    MaxSpan: 0
                                },
                                RemoteUrl: null
                            }
                        ]
                    },
                    UnionModel: {
                        ModelList: [
                            [
                                {
                                    SortName: '课程类型',
                                    SortValue: 'LessonClassId',
                                    ParentSortValue: null,
                                    SonSortValue: 'LessonId',
                                    ComponentType: 'select',
                                    ComponentConfig: {
                                        // Value:[],
                                        // Label:[],
                                        Value: ['4691', '469'],
                                        Label: ['dsaddsadasdd', '模特f'],
                                        Filterable: true,
                                        Multiple: true,
                                        Clearable: true,
                                        ItemCount: 478,
                                        OptionList: [
                                            {
                                                Label: '专业化"大类B',
                                                Value: '1201'
                                            },
                                            {
                                                Label: '模特f',
                                                Value: '469'
                                            },
                                            {
                                                Label: '艺智课堂',
                                                Value: '292'
                                            },
                                            {
                                                Label: '陶艺手工',
                                                Value: '293'
                                            }
                                        ],
                                        MaxSpan: 0
                                    },
                                    RemoteUrl: {
                                        OnChange: '/Teaching/GetLessonWithSearchSubassembly',
                                        OnSearch: '/Api/Lesson/GetLessonClassWithSearch'
                                    }
                                },
                                {
                                    SortName: '课程',
                                    SortValue: 'LessonId',
                                    ParentSortValue: 'LessonClassId',
                                    SonSortValue: null,
                                    ComponentType: 'select',
                                    ComponentConfig: {
                                        Value: [],
                                        Filterable: true,
                                        Multiple: true,
                                        Clearable: true,
                                        ItemCount: 0,
                                        OptionList: [],
                                        MaxSpan: 0
                                    },
                                    RemoteUrl: {
                                        OnChange: null,
                                        OnSearch: '/Teaching/GetLessonWithSearchSubassembly'
                                    }
                                }
                            ],
                            [
                                {
                                    SortName: '上课星期',
                                    SortValue: 'LessonDate',
                                    ParentSortValue: null,
                                    SonSortValue: 'LessonTime',
                                    ComponentType: 'select',
                                    ComponentConfig: {
                                        Value: [],
                                        Filterable: false,
                                        Multiple: true,
                                        Clearable: true,
                                        ItemCount: 0,
                                        OptionList: [
                                            {
                                                Label: '周一',
                                                Value: '1'
                                            },
                                            {
                                                Label: '周二',
                                                Value: '2'
                                            },
                                            {
                                                Label: '周三',
                                                Value: '3'
                                            },
                                            {
                                                Label: '周四',
                                                Value: '4'
                                            },
                                            {
                                                Label: '周五',
                                                Value: '5'
                                            },
                                            {
                                                Label: '周六',
                                                Value: '6'
                                            },
                                            {
                                                Label: '周日',
                                                Value: '7'
                                            }
                                        ],
                                        MaxSpan: 0
                                    },
                                    RemoteUrl: {
                                        OnChange: '/api/Teaching/GetLessonTimeSubassembly',
                                        OnSearch: null
                                    }
                                },
                                {
                                    SortName: '上课时段',
                                    SortValue: 'LessonTime',
                                    ParentSortValue: 'LessonDate',
                                    SonSortValue: null,
                                    ComponentType: 'select',
                                    ComponentConfig: {
                                        Value: [],
                                        Filterable: true,
                                        Multiple: true,
                                        Clearable: true,
                                        ItemCount: 0,
                                        OptionList: [
                                            {
                                                Label: '上午',
                                                Value: '1'
                                            },
                                            {
                                                Label: '下午',
                                                Value: '2'
                                            }
                                        ],
                                        MaxSpan: 0
                                    },
                                    RemoteUrl: null
                                }
                            ]
                        ]
                    }
                }
            };
            setTimeout(() => {
                me.filterConfig.filterData.isClear = false;
                var filterRawData = me.firstStrlowerCase(res.Data);
                me.filterConfig.filterData.data = filterRawData;
            }, 1000);
        }
    }
};
</script>
