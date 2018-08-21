<template>
    <div>
        <span>{{startTime}}至{{endTime}}</span>
        <Button v-if="isContinue" type="primary">进行中</Button>
        <Button v-else type="primary" disabled>已结束</Button>
        <ul v-for="(list,index) in lists" :key="index">
            <li>
                <span>{{list.title}}</span>
                <span :class="{changeColor : list.checkSelect}">{{list.tip}}</span>
            </li>
            <Checkbox-group v-if="select" v-model="answers[index]" @on-change="checkNum(list,index)">
                <Checkbox v-for="(item,indexs) in list.options" :label=item.option :key="indexs"></Checkbox>
            </Checkbox-group>
            <Checkbox-group v-else v-model="answers[index]" @on-change="checkNum(list,index)" single>
                <Checkbox v-for="(item,indexs) in list.options" :label=item.option :key="indexs"></Checkbox>
            </Checkbox-group>
        </ul>
        <Button type="primary" :disabled="isSubmit" @click="submit">提交</Button>
    </div>
</template>

<script>
 export default {
        data(){ 
        return{
          startTime:"2018-08-11 12:00",
          endTime:"2018-08-22 12:00",
          isContinue:false,
          select:true,
          label:true,
          isSubmit:false,
          answers:[[],[],[]],
          lists:[
            {title:"题目1名称很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长",
            tip:"(必选题)",
            checkSelect:false,
            options:[
                {option:"选项一",state:false},
                {option:"选项二",state:false},
                {option:"选项三",state:false},
                {option:"选项四",state:false},
            ],
            min:1,
            max:3, 
            },
            {title:"题目2名称很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长",
            tip:"(必选题)",
            checkSelect:false,
            options:[
                {option:"选项一",state:false},
                {option:"选项二",state:false},
                {option:"选项三",state:false},
                {option:"选项四",state:false},
            ],
            min:1,
            max:1
            },
            {title:"题目3名称很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长",
            tip:"(必选题)",
            checkSelect:false,
            options:[
                {option:"选项一",state:false},
                {option:"选项二",state:false},
                {option:"选项三",state:false},
                {option:"选项四",state:false},
            ],
            min:1,
            max:2
            },
            ]
        }},
        methods: {
            checkNum(list,index){            
                if(list.max === 1){
                    this.select = false;
                }    
                else{
                    this.select = true;
                    var len = this.answers[index].length;
                    var max = list.max;
                    if(len > max){                    
                        alert('最多可以选择'+max+'项!')
                        this.answers[index].pop()
                        }
                    }
               } ,
               submit(){
                   console.log(1);
                   var count = 0; 
                   let len = this.answers.length;
                   for(var i = 0;i < len ;i++){
                       console.log(this.answers[i])
                       if(this.answers[i].length === 0){
                         alert("有必选项未选择！");
                       } 
                       else{
                           count++;
                       }
                   }
                   if(count === len){
                       alert("提交成功！");
                   }
                 
               }  
              },
              watch:{
                   answers:{
                       handler(newVal,oldVal){
                           for(let i = 0;i<newVal.length;i++){
                               if(this.answers[i].length !== 0){
                                   this.lists[i].checkSelect  = false;
                               }
                               else  this.lists[i].checkSelect  = true;
                           }
                       }
                   },
                   deep:true
              },
              created:function(){
               var startTime =this.startTime.replace(/-/g,"/");
               startTime = startTime.replace(/(\.\d+)?/g,"");
               var  startDate = new Date(startTime).getTime();
        
                var endTime = this.endTime.replace(/-/g,"/");
                endTime = endTime.replace(/(\.\d+)?/g,"");
                var endDate = new Date(endTime).getTime();
            
                var nowDate=new Date().getTime();

                if(nowDate >= startDate && nowDate <= endDate){                  
                    this.isContinue = true;
                }
                else{
                    this.isSubmit = true;
                }
            },
        }  
  </script>
  <style>
  .changeColor{
      color:red;
  }
  </style>
  