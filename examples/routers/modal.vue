<template>
    <div>
        <Button type="primary" @click="modal1 = true">基本状态</Button>
        <Button type="primary" @click="modal2 = true">表单对话框</Button>
    
        <Modal v-model="modal1" :closable="false" class-name="vertical-center-modal" width="380">
            <p slot="header" style="text-align:center">
                <span style="color: #fff;">提示</span>
            </p>
            <div style="text-align:center;height:30px;font-size: 14px;line-height: 30px;">
                解除绑定？
            </div>
            <div slot="footer">
                <Button type="ghost" @click="cancel">取消</Button>
                <Button type="primary" @click="ok">确定</Button>
            </div>
        </Modal>
    
        <Modal v-model="modal2" :closable="false" class-name="vertical-center-modal" width="380">
            <p slot="header" style="text-align:center">
                <span style="color: #fff;">修改手机号</span>
            </p>
            <div>
                <div class="form-item">
                    <label class="form-label">密码</label>
                    <Input class="form-input" v-model="value" placeholder=""></Input>
                </div>
                <div class="form-item">
                    <label class="form-label">新手机号</label>
                    <Input class="form-input" v-model="value" placeholder=""></Input>
                </div>
                <div class="form-item">
                    <label class="form-label">验证码</label>
                    <Input class="form-input" style="width:82px;margin-right:6px;" v-model="value" placeholder=""></Input>
                    <Button type="primary" @click="countDown">{{ code }}</Button>
                </div>
            </div>
            <div slot="footer">
                <Button type="ghost" @click="cancel2">取消</Button>
                <Button type="primary" @click="ok2">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    data() {
        return {
            modal1: false,
            modal2: false,
            value: "",
            code: "获取验证码"
        }
    },
    methods: {
        ok() {
            this.modal1 = false;
        },
        cancel() {
            this.modal1 = false;
        },
        ok2() {
            this.modal2 = false;
        },
        cancel2() {
            this.modal2 = false;
        },
        countDown() {
        }
    }
}
</script>
