<template>
<div>
<div>
    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
        <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll">全选</Checkbox>
    </div>
    <Checkbox-group  @on-change="checkAllGroupChange">
        <Checkbox label="香蕉"></Checkbox>
        <Checkbox label="苹果"></Checkbox>
        <Checkbox label="西瓜"></Checkbox>
    </Checkbox-group>
    </div>
    <br><br>
    <div>
    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
        <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll" disabled>全选</Checkbox>
    </div>
    <Checkbox-group v-model="checkAllGroup" @on-change="checkAllGroupChange">
        <Checkbox label="香蕉" disabled></Checkbox>
        <Checkbox label="苹果" disabled></Checkbox>
        <Checkbox label="西瓜" disabled></Checkbox>
    </Checkbox-group>
    <Checkbox-group v-model="checkAllGroup2" >
        <Checkbox label="1" @click.prevent.native="handleCheckThis(1)">香蕉</Checkbox>
        <Checkbox label="2" @click.prevent.native="handleCheckThis(2)">苹果</Checkbox>
        <Checkbox label="3" @click.prevent.native="handleCheckThis(3)">西瓜</Checkbox>
    </Checkbox-group>
    <Checkbox-group v-model="checkAllGroup2"  single>
        <Checkbox label="香蕉" ></Checkbox>
        <Checkbox label="苹果" ></Checkbox>
        <Checkbox label="西瓜" ></Checkbox>
    </Checkbox-group>
    </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                indeterminate: true,
                checkAll: false,
                list:["1","2","3"],
                checkAllGroup2:[],
                checkAllGroup: ['香蕉', '西瓜']
            }
        },
        methods: {
            handleCheckAll () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.checkAllGroup = ['香蕉', '苹果', '西瓜'];
                } else {
                    this.checkAllGroup = [];
                }
            },
            checkAllGroupChange (data) {
                console.log(data.length)
                if (data.length === 3) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            },
            handleCheckThis(data){
                if(''+data==this.checkAllGroup2[0]){
                    this.checkAllGroup2 = [];    
                }else{
                    this.checkAllGroup2 = [''+data];
                }
            }
        }
    }
</script>
