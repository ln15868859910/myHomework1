

<template>
    <div style="margin-left:150px">
        <h3>xb-TransFer</h3>
        <i-button @click="schoolModal=true">穿梭组件</i-button>
        <Xb-Transfer v-if="schoolModal" :title="schooltitle" :showmodal="schoolModal" :all-data="selectBaseSchoolData" :select-data="currentSchoolData" @oncancle="schoolModal=false" @onconfirm="confirmSchool" showselect-all></Xb-Transfer>

    </div>
</template>
<script>

export default {
    data() {
        return {
            schoolModal: false,
            schooltitle: ['选择教材杂费', '课程教材', '已选教材/杂费'],
            selectBaseSchoolData: [{
                list: [
                    { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                                        { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                ], name: '啊实打实大'
            },{
                list: [
                    { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                                        { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                    { Id: 1, Name: '123' ,select:false},
                ], name: 'adasdas'
            }],
            currentSchoolData: [],
        };
    },
    created() {
        // console.log(this);
    },
    methods: {
        confirmSchool(data) {
            console.log(data);
        },
        cancel() {

        }
    }
};
</script>
<style>
/* .clearfix:after {
    content: " ";
    display: table;
    clear: both;
}

.popup-con {
    padding-top: 20px;
    background: #fff;
    text-align: left;
}

.pop-book {
    width: 355px;
    height: 355px;
    margin-bottom: 25px;
    border: 1px #dde5ee solid;
}

.pop-b-header {
    width: 100%;
    height: 38px;
    line-height: 38px;
    color: #344c67;
    background: rgb(243, 243, 243);
    text-align: center;
}

.pop-b-search {
    position: relative;
    font-size: 0;
    padding: 10px;
}

.copyScroll {
    overflow-y: auto;
}

.pop-b-h1 {
    height: 256px;
}

.pop-b-con {
    margin-bottom: 10px;
}

#transferBox .ivu-collapse-header {
    border: none;
    background: white;
}

#transferBox .ivu-collapse>.ivu-collapse-item,
#transferBox .ivu-collapse,
#transferBox .ivu-collapse-content {
    border: none;
}
.book-ul-r li {
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    list-style: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.pop-b-sub {
    line-height: 40px;
    height: 40px;
    font-size: 14px;
    border-bottom: 1px #ccc solid;
    color: #344c67;
    text-align: left;
    padding: 0 10px;
}
#transferBox .ivu-collapse-content-box {
    padding: 0;
}
.book-ul li:hover {
    cursor: pointer;
    color: #fff;
    background: #8195a7;
}
.book-ul li {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left: 40px;
    box-sizing: border-box;
    color: #344c67;
    list-style: none;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
} */
</style>