<template>
    <div style="max-width:900px;padding:20px;background:#DFE3ED">
        <i-button type="primary" size="large" @click="popupData()">弹窗1</i-button>
        <i-button type="primary" size="large" @click="popupData(584029)">弹窗2</i-button>
        <i-button type="primary" size="large" @click="fetchnextData()">请求数据</i-button>
        <i-button type="primary" size="large" @click="deleteall()">清空已选</i-button>
        <xb-icon type="tag-oneToOne"></xb-icon>
        <div>
            <div v-for="(item) in selection">{{item._pkey}}  <i-button type="primary" size="large" @click="deletethis(item)">删除</i-button> </div>
        </div>
        <Xb-Table name="testtable" :custumClass="custumclass" resizeable :columns="tableHeader" :height="600" :control="control" :data="listData" fixHeader :fixedTop="0" :fixedScrollTop="122" @on-selection-change="getSelectedData" @on-select-all="changeselectAll" ref="table" :selected-pkeys="selectedArr">
            <div slot="header">
                <div style="height:60px;background:#fff;padding:15px 20px;">
                    <Button type="ghost" style="margin-right:10px;width:80px;">搜索</Button>
                    <Button type="ghost" style="margin-right:10px;width:80px;">搜索</Button>
                    <Button type="ghost" style="margin-right:10px;width:80px;">搜索</Button>
                </div>
                <div style="height:40px;line-height:40px;background:#F7FAFC;padding:0 20px">当前结果：沟通共计162条，咨询线索总计122条</div>
                <div>
                    <Checkbox v-model="tableHeader[4].show" label="SphHome" @on-change="changeSingel">是否显示校宝家关注</Checkbox>
                </div>
            </div>
            <div slot="emptyData" style="height:300px;text-align:center;line-height:300px;">无数据</div>
        </Xb-Table>
          <div style="padding:20px 0;">
            <Xb-Table :columns="columns10" :data="data9"></Xb-Table>
        </div>
        <div style="padding:20px 0;">
            <Xb-Table :columns="columns99" :data="data99"></Xb-Table>
        </div>
        <div class="test222">
            <Xb-Table :columns="columns4" :data="data1" :span-method="objectSpanMethod"></Xb-Table>
        </div>
        <Modal v-model="table1"  width="860" :closable="false" :mask-closable="false" class-name="vertical-center-modal">
            <p slot="header" style="text-align:center">
                <span style="color: #fff;">弹出表格</span>
            </p>
            <div class="modal-con" style="padding-top:0;width:800px" v-if="table1">
                <Xb-Table :data="listData" :columns="tableColumns1" :height="500" modal @on-row-click="getClickRow" :selected-pkeys="selectedArr2"></Xb-Table>
            </div>
             <div slot="footer">
                <Button type="ghost" @click="cancel">取消</Button>
                <Button type="primary" @click="ok">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    data() {
        return {
            selectedArr2: [],
            testcol: [],
            selection: [],
            table1: false,
            custumclass: {
                tableWrap: 'tableWrap',
                bodywrap: 'bodywrap'
            },
            tableColumns1: [
                {
                    type: 'radio',
                    width: 50,
                    align: 'left',
                    preselect: function(row) {
                        return row._pkey % 2;
                    }
                },
                {
                    title: '星标',
                    key: 'UserCollectionId',
                    align: 'center',
                    width: 100,
                    // fixed:"left",
                    render: function(h, params) {
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: params.row.UserCollectionId === 0 ? 'star' : 'star-filled',
                                    size: '20',
                                    color: params.row.UserCollectionId === 0 ? '#eee' : '#f5a623'
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '姓名',
                    key: 'StuName',
                    width: 120,
                    showOverflowTip: true
                },
                {
                    title: '关键词',
                    key: 'Marker',
                    width: 120
                },
                {
                    title: '意向课程',
                    key: 'InterestClassListUi',
                    width: 80
                }
            ],
            tableHeader: [
                {
                    type: 'selection',
                    width: 50,
                    fixed: 'left',
                    align: 'left',
                    preselect: function(row, status) {
                        return row._pkey % 2;
                    }
                },
                {
                    title: '星标',
                    key: 'UserCollectionId',
                    align: 'center',
                    width: 100,
                    custom: true,
                    // fixed:"left",
                    render: function(h, params) {
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: params.row.UserCollectionId === 0 ? 'star' : 'star-filled',
                                    size: '20',
                                    color: params.row.UserCollectionId === 0 ? '#eee' : '#f5a623'
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '姓名',
                    key: 'StuName',
                    sortable: true,
                    width: 200,
                    type: 'link',
                    custom: true,
                    show: true,
                    showOverflowTip: true,
                    render(h, params) {
                        return h(
                            'a',
                            {
                                attrs:{
                                    className:"testclass",
                                    href: '//www.baidu.com'
                                }
                            },
                            params.row.StuName
                        );
                    }
                },
                {
                    title: '联系电话',
                    key: 'TelPhoneUi',
                    width: 120,
                    fixed: 'left',
                    tipContent: '联系电话可通过学员应用下的权限点进行全显/隐藏控制',
                    canedit: true,
                    type: 'input',
                    validate: function(oldobj, newval) {
                        if (newval.length > 11) {
                            alert('最长只能输入11位');
                            oldobj['TelPhoneUi'] = oldobj['TelPhoneUi'];
                            return false;
                        } else if (newval.length < 8) {
                            alert('至少输入8位');
                            oldobj['TelPhoneUi'] = oldobj['TelPhoneUi'];
                            return false;
                        }
                        return true;
                    },
                    callback: function(oldobj, newval) {
                        oldobj['TelPhoneUi'] = newval;
                    }
                },
                {
                    title: '校宝家关注',
                    key: 'SphHome',
                    width: 120,
                    show: false,
                    renderHeader: function(h, params) {
                        return h(
                            'div',
                            {
                                class: 'spui-table-cell'
                            },
                            [
                                h('Icon', {
                                    props: {
                                        type: 'heart',
                                        size: '22'
                                    }
                                }),
                                h('span', params.column.title)
                            ]
                        );
                    }
                },
                {
                    title: '意向度',
                    key: 'Interest',
                    sortable: true,
                    width: 120,
                    custom: true,
                    show: false,
                    render: function(h, params) {
                        return h(
                            'div',
                            {
                                class: params.row.Interest.interestClass
                            },
                            params.row._pkey
                        );
                    }
                },
                {
                    title: '意向课程',
                    key: 'InterestClassListUi',
                    custom: true,
                    width: 120
                },
                {
                    title: '沟通记录',
                    key: 'LastCommuContent',
                    width: 120,
                    custom: true,
                    show: true,
                    showOverflowTip: true
                },
                {
                    title: '标签',
                    key: 'StuinfoTagsName',
                    width: 120,
                    custom: true,
                    show: true
                    //  fixed: "right"
                },
                {
                    title: '关键词',
                    key: 'Marker',
                    width: 120,
                    custom: true,
                    // fixed:"right",
                    show: true
                },
                {
                    title: '跟进状态',
                    key: 'FollowUpState',
                    width: 120,
                    custom: true,
                    show: true,
                    showOverflowTip: true
                },
                {
                    title: '渠道',
                    key: 'ChannelName',
                    width: 120,
                    custom: true,
                    show: true
                },
                {
                    title: '最新跟进时间',
                    key: 'EditDate',
                    custom: true,
                    width: 120
                },
                {
                    title: '咨询校区',
                    key: 'SchoolName',
                    width: 80,
                    custom: true,
                    show: true,
                    fixed: 'right'
                }
            ],
            listData: [],
            defaultId: 584027,
            selectedArr: [],
            control: {
                isDrop: true,
                width: 100,
                options: [
                    {
                        key: 'edit',
                        title: '编辑',
                        ifshow: function(cell, index) {
                            //是否显示
                            return cell._pkey % 2;
                        },
                        ifdisabled: function(cell, index) {
                            //是否禁用
                            return cell._pkey % 3;
                        },
                        func: function(cell) {
                            //具体处理方法
                            console.log(cell);
                        },
                        render: function(h, params) {
                            //自定义渲染
                            return h(
                                'span',
                                {
                                    style: 'color:red'
                                },
                                '编辑'
                            );
                        }
                    },
                    {
                        key: 'edit',
                        title: '复制',
                        ifshow: function(cell, index) {
                            return 1 == cell._pkey % 2;
                        },
                        func: function(cell) {
                            console.log(cell);
                        },
                        disabled: function() {
                            return true;
                        }
                    },
                    {
                        key: 'edit',
                        title: '删除',
                        ifshow: function(cell, index) {
                            return cell._pkey % 3;
                        },
                        func: function(cell) {
                            console.log(cell);
                        }
                    }
                ]
            },
            columns99: [
                {
                    type: 'selection'
                },
                {
                    title: '姓名',
                    key: 'name',
                    className: 'border-right'
                },
                {
                    title: '课程',
                    key: 'lesson',
                    render: function(h, params) {
                        return h(
                            'div',
                            {
                                class: 'sp-row-merge'
                            },
                            [
                                params.row.lessonList.map(function(row, index) {
                                    return h('div', {
                                        domProps: {
                                            innerText: row
                                        }
                                    });
                                })
                            ]
                        );
                    }
                },
                {
                    title: '学费',
                    key: 'fee',
                    render: function(h, params) {
                        return h(
                            'div',
                            {
                                class: 'sp-row-merge'
                            },
                            [
                                params.row.feeList.map(function(row, index) {
                                    return h('div', {
                                        domProps: {
                                            innerText: row
                                        }
                                    });
                                })
                            ]
                        );
                    }
                }
            ],
            data99: [
                {
                    name: '周周',
                    lessonList: ['数学', '英语'],
                    feeList: ['100.00', '200.00']
                },
                {
                    name: '周一',
                    lessonList: ['数学1', '英语1', '化学1'],
                    feeList: ['100.00', '200.00', '500.00']
                },
                {
                    name: '周二',
                    lessonList: ['数学2'],
                    feeList: ['100.00']
                },
                {
                    name: '周三',
                    lessonList: ['数学3', '英语3'],
                    feeList: ['100.00', '200.00']
                }
            ],
            columns4: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: 'Name',
                    key: 'name'
                },
                {
                    title: 'Age',
                    key: 'age'
                },
                {
                    title: 'Address',
                    key: 'address'
                }
            ],
            data1: [
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03'
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                    date: '2016-10-01'
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: 'Sydney No. 1 Lake Park',
                    date: '2016-10-02'
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: 'Ottawa No. 2 Lake Park',
                    date: '2016-10-04'
                }
            ],
            columns16: [
                {
                    title: '',
                    width: 50
                },
                {
                    title: 'Name',
                    key: 'name'
                },
                {
                    title: 'Age',
                    key: 'age'
                },
                {
                    title: 'Address',
                    key: 'address'
                }
            ],
            columns10: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(
                            'div',
                            {
                                class: 'testtable'
                            },
                            [
                                h('XbTable', {
                                    props: {
                                        columns: this.columns16,
                                        data: this.data9
                                    }
                                })
                            ]
                        );
                    }
                },
                {
                    title: 'Name',
                    key: 'name'
                },
                {
                    title: 'Age',
                    key: 'age'
                },
                {
                    title: 'Address',
                    key: 'address'
                }
            ],
            data9: [
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    job: 'Data engineer',
                    interest: 'badminton',
                    birthday: '1991-05-14',
                    book: 'Steve Jobs',
                    movie: 'The Prestige',
                    music: 'I Cry'
                },
                {
                    name: 'Jim Green',
                    age: 25,
                    address: 'London No. 1 Lake Park',
                    job: 'Data Scientist',
                    interest: 'volleyball',
                    birthday: '1989-03-18',
                    book: 'My Struggle',
                    movie: 'Roman Holiday',
                    music: 'My Heart Will Go On'
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: 'Sydney No. 1 Lake Park',
                    job: 'Data Product Manager',
                    interest: 'tennis',
                    birthday: '1992-01-31',
                    book: 'Win',
                    movie: 'Jobs',
                    music: 'Don’t Cry'
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: 'Ottawa No. 2 Lake Park',
                    job: 'Data Analyst',
                    interest: 'snooker',
                    birthday: '1988-7-25',
                    book: 'A Dream in Red Mansions',
                    movie: 'A Chinese Ghost Story',
                    music: 'actor'
                }
            ]
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        getClickRow(data) {
            this.selectedArr2 = [data._pkey];
            console.log(data);
        },
        changeSingel(data) {},
        popupData(key) {
            if (key) {
                this.selectedArr2 = [key];
            }
            this.table1 = true;
        },
        getSelectedData: function(selection) {
            console.log(selection);
            this.selection = selection;
        },
        changeselectAll(selection, status) {
            console.log(selection);
            console.log(status);
        },
        objectSpanMethod: function(row, column, rowIndex, columnIndex) {
            if (columnIndex === 0) {
                if (rowIndex % 2 === 0) {
                    return {
                        rowspan: 2,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        },
        //获取列表数据
        fetchData: function() {
            var that = this;
            var resultList = [];

            for (var i = 0; i < 5; i++) {
                resultList.push({
                    LessonClassName: '',
                    SecondLessonClassName: '',
                    ThirdLessonClassName: '',
                    LastCommuContent: '最大款嘟嘟嘟ududududududuudu嘟嘟嘟嘟',
                    SceneTitle: null,
                    ContentTemplateData: null,
                    UserCollectionId: 0,
                    SchoolName: '西华校区',
                    ChannelName: null,
                    SceneId: 0,
                    HrdocName: null,
                    Deleted: null,
                    SalesManViewName: '未关联账号',
                    SphHome: false,
                    SalesManList: [
                        {
                            StuInfoId: 0,
                            FollowUpPeopleId: 1,
                            FollowUpPeopleName: '采单员',
                            SalesManHrdocId: 0,
                            SalesManHrdocName: null,
                            SalesManUserName: null
                        },
                        {
                            StuInfoId: 0,
                            FollowUpPeopleId: 2,
                            FollowUpPeopleName: '电话销售',
                            SalesManHrdocId: 0,
                            SalesManHrdocName: null,
                            SalesManUserName: null
                        },
                        {
                            StuInfoId: 0,
                            FollowUpPeopleId: 3,
                            FollowUpPeopleName: '前台',
                            SalesManHrdocId: 0,
                            SalesManHrdocName: null,
                            SalesManUserName: null
                        },
                        {
                            StuInfoId: 0,
                            FollowUpPeopleId: 4,
                            FollowUpPeopleName: '销售员',
                            SalesManHrdocId: 0,
                            SalesManHrdocName: null,
                            SalesManUserName: null
                        },
                        {
                            StuInfoId: 0,
                            FollowUpPeopleId: 5,
                            FollowUpPeopleName: '副销售员',
                            SalesManHrdocId: 0,
                            SalesManHrdocName: null,
                            SalesManUserName: null
                        }
                    ],
                    StuinfoTags: [],
                    IdentityCard: null,
                    Industry: '',
                    Pofession: '',
                    Dbmarketing: '',
                    StuFileNumber: null,
                    PrimarySchool: '',
                    JuniorHighSchool: '',
                    SeniorHighSchool: '',
                    Nation: '',
                    ParentName: null,
                    Grade1: '',
                    ContractNumber: null,
                    JoinedInsurance: '',
                    TaekwondoRank: '',
                    Kindergarten: '',
                    QQNumber: null,
                    GraduationTime: null,
                    GraduationSchool: null,
                    Profession: null,
                    CompanyName: null,
                    HighestEducation: '',
                    Id: this.defaultId++,
                    OrgId: 1,
                    StuName:
                        '开会完啦啦啦啦啦啦啦啦啦啦了绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿阿拉啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦',
                    Sex: '男',
                    BirthDate: '/Date(-62135596800000)/',
                    MotherTel: '12352827621',
                    FatherTel: '',
                    OtherTel: '',
                    Enrolled: true,
                    CardId: '',
                    PubSchoolName: '',
                    PubSchoolGradeClass: '',
                    HomeAdd: '',
                    Comment: '',
                    AddDate: '/Date(1513749130000+0800)/',
                    CreatedAt: '/Date(1513749130000+0800)/',
                    SalesmanEditDate: '/Date(-62135596800000)/',
                    Cust1: null,
                    Cust2: null,
                    Cust3: null,
                    Cust4: null,
                    Cust5: null,
                    HeadImgUrl156: '//cdn.schoolpal.cn/male-small.jpg',
                    HeadImgUrl512: '//cdn.schoolpal.cn/male-small.jpg',
                    Remain: 0.0,
                    Misc: 0.0,
                    UsedCredit: 0.0,
                    UnusedCredit: 282.0,
                    SchoolId: 251,
                    WeChatId: '',
                    FollowUpState: 3,
                    EditDate: '/Date(1513913034000+0800)/',
                    IsActive: false,
                    RecentInteractiveAt: null,
                    DistrictId: 0,
                    Salesman: null,
                    SalesManHrDocId: 0,
                    Salesway: null,
                    Interest: '？',
                    Marker: null,
                    AscriptionSchoolId: 251,
                    HrDocId: 0,
                    Method: null,
                    LessonClassId: 0,
                    SecondLessonClassId: 0,
                    ThirdLessonClassId: 0,
                    User: null,
                    ChannelId: 0,
                    RegisterWay: 1005,
                    Arrearage: 0.0
                });
            }
            var list = [];
            _.each(resultList, function(item) {
                var model = that.getUiModel(item);
                list.push(model);
            });

            setTimeout(() => {
                that.selectedArr = [584027, 584028, 584029, 584030, 584031];
                that.listData = list;
            }, 1000);
        },
        getUiModel: function(bizModel) {
            var that = this;
            var model = {
                Id: 0,
                UserCollectionId: 0,
                StuName: '',
                Sex: '男',
                TelPhone: '',
                TelPhoneUi: '',
                SphHome: '', //是否关注校宝家
                Interest: {
                    interestStatus: '高',
                    interestClass: ''
                },
                InterestClassList: [], //意向课程
                InterestClassListUi: '',
                LastCommuContent: '', //沟通记录
                StuinfoTags: [], // 标签
                StuinfoTagsName: '', //标签名字
                Marker: '', //关键字
                FollowUpState: '待跟进',
                followUpPopShow: false, //控制跟进状态下拉项显示
                Age: '',
                ChannelId: '',
                ChannelName: '',
                Method: '',
                SalesManList: [],
                EditDate: '',
                SchoolId: 0,
                SchoolName: '',
                AddDate: '',
                AddUser: '',
                isSelected: false
            };
            model.Id = bizModel.Id;
            model.UserCollectionId = bizModel.UserCollectionId;
            model.StuName = bizModel.StuName;
            model.Sex = bizModel.Sex;
            model.TelPhone = bizModel.MotherTel
                ? bizModel.MotherTel
                : bizModel.FatherTel ? bizModel.FatherTel : bizModel.OtherTel;
            model.TelPhoneUi = that.formatTel(model.TelPhone, !that.hasTelphoneAuthority);
            model.SphHome = bizModel.SphHome;
            model.Interest = that.filterInterestStatus(bizModel.Interest);
            if (bizModel.LessonClassName) {
                model.InterestClassList.push({
                    name: bizModel.LessonClassName,
                    id: bizModel.LessonClassId
                });
            }
            if (bizModel.SecondLessonClassName) {
                model.InterestClassList.push({
                    name: bizModel.SecondLessonClassName,
                    id: bizModel.SecondLessonClassId
                });
            }
            if (bizModel.ThirdLessonClassName) {
                model.InterestClassList.push({
                    name: bizModel.ThirdLessonClassName,
                    id: bizModel.ThirdLessonClassId
                });
            }
            model.InterestClassListUi = 'udhfuih';
            model.LastCommuContent = bizModel.LastCommuContent;
            model.StuinfoTags = bizModel.StuinfoTags;
            model.StuinfoTagsName = _.map(model.StuinfoTags, function(item) {
                return item.Name;
            }).join('/');
            model.Marker = bizModel.Marker;
            model.followUpPopShow = false;
            model.FollowUpState = bizModel.FollowUpState;
            model.Age =
                bizModel.BirthDate === '/Date(-62135596800000)/'
                    ? '未知'
                    : moment().diff(moment(bizModel.BirthDate), 'years') + '岁';
            model.ChannelId = bizModel.ChannelId;
            model.ChannelName = bizModel.ChannelName;
            model.Method = bizModel.Method;
            model.EditDate = bizModel.EditDate;
            model.SchoolId = bizModel.AscriptionSchoolId;
            model.SchoolName = bizModel.SchoolName;
            model.AddDate = bizModel.AddDate;
            model.AddUser = bizModel.User;
            model.isSelected = false;
            // model._disabled = true;
            _.each(that.extendAttribute, function(item) {
                model[item.Column] = bizModel[item.Column];
            });
            var isMyConsult = false; //是否是我的咨询
            _.each(bizModel.SalesManList, function(item) {
                model.SalesManList.push({
                    FollowUpPeopleId: item.FollowUpPeopleId,
                    FollowUpPeopleName: item.FollowUpPeopleName,
                    SalesManViewName:
                        item.SalesManHrdocId > 0
                            ? item.SalesManHrdocName + (item.SalesManUserName ? '(' + item.SalesManUserName + ')' : '')
                            : '',
                    SalesManHrdocId: item.SalesManHrdocId,
                    SalesManHrdocName: item.SalesManHrdocName,
                    SalesManUserName: item.SalesManUserName
                });

                isMyConsult = true;
            });
            model.hasEditFollowAuthority =
                that.hasEditAllFollowAuthority || (that.hasEditMyFollowAuthority && isMyConsult); //是否有编辑该条跟进信息的权限
            _.sortBy(model.SalesManList, 'FollowUpPeopleId');
            return model;
        },
        fetchnextData: function() {
            this.defaultId = this.defaultId - 2;
            this.fetchData();
        },
        objectSpanMethod: function(row, column, rowIndex, columnIndex) {
            if (columnIndex === 0) {
                if (rowIndex % 2 === 0) {
                    return {
                        rowspan: 2,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        },
        //跟进状态通用方法
        filterFollowStatus: function(followUpStatus) {
            var followUp = {
                followUpStatus: followUpStatus,
                followUpDeacription: '',
                followUpClass: ''
            };
            switch (followUpStatus) {
                case 1:
                    followUp.followUpClass = 'followUpState-color1';
                    followUp.followUpDeacription = '待跟进';
                    break;
                case 2:
                    followUp.followUpClass = 'followUpState-color2';
                    followUp.followUpDeacription = '跟进中';
                    break;
                case 3:
                    followUp.followUpClass = 'followUpState-color3';
                    followUp.followUpDeacription = '已成交';
                    break;
                case 4:
                    followUp.followUpClass = 'followUpState-color4';
                    followUp.followUpDeacription = '已失效';
                    break;
                case 5:
                    followUp.followUpClass = 'followUpState-color5';
                    followUp.followUpDeacription = '已到访';
                    break;
                case 6:
                    followUp.followUpClass = 'followUpState-color6';
                    followUp.followUpDeacription = '已邀约';
                    break;
                case 7:
                    followUp.followUpClass = 'followUpState-color7';
                    followUp.followUpDeacription = '已试听';
                    break;
            }
            return followUp;
        },
        //意向度通用方法
        filterInterestStatus: function(interestStatus) {
            var interest = {
                interestStatus: interestStatus,
                interestClass: ''
            };
            switch (interestStatus) {
                case '高':
                    interest.interestClass = 'intention-states4';
                    break;
                case '中':
                    interest.interestClass = 'intention-states3';
                    break;
                case '低':
                    interest.interestClass = 'intention-states2';
                    break;
                default:
                    interest.interestClass = 'intention-states1';
                    break;
            }
            return interest;
        },
        deletethis: function(item) {
            //外部删除某一项 用唯一数据
            this.$refs.table.changeByitem(item);
        },
        deletethisbykey: function(item) {
            //外部删除某一项 用唯一ID
            this.$refs.table.changeBypKey(item);
        },
        deleteall: function() {
            //清空选项
            this.$refs.table.clearSelection();
        },
        formatTel: function(tel, isHide) {
            //*电话号码
            if (!tel) {
                return '';
            }
            tel = tel.replace(/-/g, '');
            if (tel.length === 11) {
                if (isHide) {
                    return tel.replace(/([0-9]{3})[0-9]{4}([0-9]{4})/, '$1****$2');
                } else {
                    return tel.replace(/(^\d{3}|\d{4}\B)/g, '$1-');
                }
            }
            return tel;
        },
        cancel() {
            this.table1 = false;
        },
        ok(data) {
            console.log(data);
            this.table1 = false;
        }
    }
};
</script>
<style>
.sp-row-merge {
    margin: -4px -10px;
}
.sp-row-merge > div {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    border-bottom: 1px solid #e9eaec;
}
.border-left-right,
.border-right {
    border-right: 1px solid #e9eaec;
}

.sp-row-merge div:hover {
    background: #f6f9fe;
}
.spui-table-not-modal .tableWrap {
    padding: 0 30px;
}
.spui-table-not-modal .bodywrap {
    padding: 0 30px;
}
</style>
