<template>
    <div>
        <Button type="primary" @click="modal1 = true">基本状态</Button>
        <Button type="primary" @click="modal2 = true">表单对话框</Button>
    
        <Modal v-model="modal1" :closable="false" class-name="vertical-center-modal" width="380">
            <p slot="header" style="text-align:center">
                <span style="color: #fff;">提示</span>
            </p>
            <div style="text-align:center;">
                解除绑定q？
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
        <Button @click="confirm">标准</Button>
        <Button @click="custom">自定义按钮文字</Button>
        <Button @click="async">异步关闭</Button>
    
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
        },
        confirm() {
            this.$Modal.confirm({
                title: '确认对话框标题',
                content: '<p>一些对话框内容</p><p>一些对话框内容</p>',
                onOk: () => {
                    this.$Message.info('点击了确定');
                },
                onCancel: () => {
                    this.$Message.info('点击了取消');
                }
            });
        },
        custom() {
            this.$XbConfirm.confirm({
                title: '确认对话框标题',
                content: '<p>一些对话框内容</p><p>一些对话框内容</p>',
                showIcon: true,
                okText: 'OK',
                cancelText: 'Cancel'
            });
        },
        async() {
            this.$XbConfirm.confirm({
                title: '确认对话框标题',
                content: '<p>对话框将在 2秒 后关闭</p>',
                loading: true,
                onOk: () => {
                    setTimeout(() => {
                        this.$XbConfirm.remove();
                        this.$Message.info('异步关闭了对话框');
                    }, 2000);
                }
            });
        }
    }
}
</script>
