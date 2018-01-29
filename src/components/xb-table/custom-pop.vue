<template>
    <Modal v-model="value" :closable="false" :mask-closable="false" class-name="vertical-center-modal" width="680" :class="[prefixCls+'-custom-pop']">
        <p slot="header"  style="text-align:center">
            自定义选项
        </p>
        <div>
            <p :class="[prefixCls+'-custom-subtitle']">
                <Checkbox label="全选" v-model="selectalltag" @on-change="selectAll()" :class="[prefixCls+'-custom-select-all']">全选</Checkbox>
            </p>
            <div :class="[prefixCls+'-custom-subcontent']">
                <Checkbox-group v-model="showculumns">
                    <Checkbox v-for="(column,index) in data" :key="index"  :label="column.key" :class="[prefixCls+'-custom-columns']">{{column.title}}</Checkbox>
                </Checkbox-group>
            </div>
        </div>
        <div slot="footer">
            <Button type="ghost" @click="cancel">取消</Button>
            <Button type="primary" @click="ok">确定</Button>
        </div>
    </Modal>
</template>
<script>
    export default {
        name:'custom-pop',
        props:{
            value:{
                type:Boolean,
                default:false
            },
            data:{
                type:Array,
                default(){
                    return [];
                }
            }
        },
        data () {
            return {
                prefixCls: 'spui-table',
                culumns: false,
                selectalltag:false,
                showculumns:this.getshowcol()
            };
        },
        methods: {
            ok () {
                // this.modal1 = false;
                //把不显示的扔出去？？
                let hidecol = [], colobj = {};
                this.data.forEach(col=>{
                    if(this.showculumns.indexOf(col.key)==-1){
                        hidecol.push(col.key);
                        colobj[col.key] = false;
                    }else{
                        colobj[col.key] = true;
                    }
                });
                this.$emit('showcol',hidecol,colobj);
                this.$emit('input',false);
            },
            selectAll(){
                if(this.selectalltag){
                    this.showculumns = this.data.map(col=>{
                        return col.key;
                    });
                }else{
                    this.showculumns = [];
                }
               
            },
            cancel () {
                this.$emit('input',false);
            },
            getshowcol(){
                var arr = [];
                this.data.forEach(col=>{
                    if(col.show){
                        arr.push(col.key);
                    }
                });
                return arr;
            }
        },
        watch: {
            data: {
                handler() {
                    this.showculumns=this.getshowcol();
                },
                deep: true
            },
            value(val){
                if(val){
                    this.showculumns=this.getshowcol();
                }
            },
            showculumns:{
                handler() {
                    this.selectalltag = this.showculumns.length === this.data.length;
                },
                deep: true
            }
        }
    };
</script>