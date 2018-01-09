<template>
    <Modal v-model="value" :closable="false" class-name="vertical-center-modal" width="680" :class="[prefixCls+'-custom-pop']">
        <p slot="header"  style="text-align:center">
            <span style="color: #fff;">自定义选项</span>
        </p>
        <div>
            <p :class="[prefixCls+'-custom-subtitle']">自定义选项</p>
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
                showculumns:this.getshowcol()
            };
        },
        methods: {
            ok () {
                // this.modal1 = false;
                //把不显示的扔出去？？
                let hidecol = [];
                this.data.forEach(col=>{
                    if(this.showculumns.indexOf(col.key)==-1){
                        hidecol.push(col.key);
                    }
                });
                this.$emit('showcol',hidecol);
                this.$emit('input',false);
            },
            cancel () {
                this.$emit('input',false);
            },
            getshowcol(){
                return this.data.map(col=>{
                    if(col.show){
                        return col.key;
                    }
                });
            }
        }
    };
</script>