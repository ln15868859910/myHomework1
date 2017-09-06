<template>
  <div>
    <div>提示部分</div>
    <div>应收</div>
    <div>
      <h1>账户管理部分</h1>
      <div>账户列表
        <div>账户选择
          <div>账户下拉
            <select name="" id=""> 下拉部分
              <div>数据处理</div>
            </select>
          </div>
        </div>
        <div>实付金额</div>
        <div>对方账号</div>
        <div>流水单号</div>
        <div>收款</div>
        <div>找零</div>
        <button>删除按钮</button>
      </div>
      <button>添加账户</button>
    </div>
    <div>实付</div>
  </div>
</template>
<script>
// const prefixCls = 'spui-b-infoBox';
// import Axios from 'axios';
export default {
    name: 'peyMent',
    components: {},
    props: {
        config:{
            type:Object,
            default:{
                schoolId:0,       //校区Id
                transferId:0,     //订单Id  编辑or新建
                showStuDoc:false, //是否显示学员账户
                showScore:false,  //是否显示积分信息
                scoreRate:1,      //积分比率
                editAuthority:false,//编辑权限

            }
        }
    },
    data() {

    },
    methods: {
        /**
         * 请求账户数据
         */
        fetchAccountData() {

        },
    }
};
</script>
<style lang="less">

</style>

