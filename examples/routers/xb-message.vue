<template>
    <div>
        <h1>改进版提示</h1>
        <i-button @click="open">显示正常</i-button>
        <i-button @click="open1">显示警告</i-button>
        <i-button @click="open2">显示成功</i-button>
        <i-button @click="open3">显示错误</i-button>
        <i-button @click="open4">显示多行</i-button>
        <i-button @click="open5">显示标题</i-button>
        <i-button @click="open6">显示关闭</i-button>
        
    <h2> 悬浮触发组件</h2>
        <i-button @click="addlist">添加选项</i-button>
        <div>
            <Xb-hoverlist :top="110">
                <div slot="poper">
                    <div v-for="i in list">{{i}}</div>
                </div>
                <div slot="hover">
                    <i-button>HHHH</i-button>
                </div>
            </Xb-hoverlist>
              <Xb-hoverlist placement="bottom" :top="10">
                <div slot="poper">
                    <div v-for="i in list">{{i}}</div>
                </div>
                <div slot="hover">
                    <i-button>HHHH</i-button>
                </div>
            </Xb-hoverlist>
            </Xb-hoverlist>
              <Xb-hoverlist trigger="focus">
                <div slot="poper">
                    <div v-for="i in list">{{i}}</div>
                </div>
                <div slot="hover">
                    <i-input v-model="inputvalue"></i-input>
                </div>
            </Xb-hoverlist>
        </div>
    </div>
</template>

<script>
import Message from './../../src/components/xb-message/message';
import XbHoverlist from './../../src/components/xb-hoverlist/index';

import Vue from 'vue';
Vue.prototype.$Message2 = Message;
export default {
    components:{XbHoverlist},
    data(){
        return{
            list:['1'],
            inputvalue:''
        };
    },
    methods: {
        addlist(){
            this.list.push(new Date().getTime());
        },
        open() {
            this.$Message2('这是一条消息提示');
        },
        open1() {
            this.$Message2({
                message: '恭喜你，这是一条警告消息',
                type: 'warning'
            });
        },
        open2() {
            this.$Message2({
                message: '恭喜你，这是一条成功消息',
                top:500,
                type: 'success'
            });
        },
        open3() {
            this.$Message2({
                message: '恭喜你，这是一条错误消息',
                type: 'error'
            });
        },
        open4() {
            this.$Message2({
                message: '恭喜你，这是一条多行消息恭喜你，这是一条多行消息恭喜你，这是一条多行消息恭喜你，这是一条多行消息恭喜你，这是一条多行消息恭喜你，这是一条多行消息',
                type: 'success'
            });
        },
        open5() {
            this.$Message2({
                message: '恭喜你，这是一条多行消息恭喜你，这是一条多行消息恭喜你，这是一条多行消息恭喜你，这是一条多行消息恭喜你，这是一条多行消息恭喜你，这是一条多行消息',
                title:'标题',
                showClose: true,
                duration: 0,
                type: 'success'
            });
        },
        open6() {
            var that = this;
            this.$Message2({
                message: '恭喜你，这是一条显示关闭的消息',
                showClose: true,
                duration: 0,
                customClass:'warning',
                type: 'success',
                onClose:function(){
                    that.$Message2({message: '你点击了删除'});
                }
            });
            
        }
    }
};
</script>

<style>
.warning{
    color:red;
}
</style>
