<template>
    <div style="width:500px;"> 
        <div>基本状态</div>
        <Alert>成功提示文案</Alert>
        <Alert type="success">成功提示文案</Alert>
        <Alert type="warning">警告提示文案</Alert>
        <Alert type="error">错误提示文案</Alert>
        <div>含图标基本状态</div>
        <Alert show-icon>成功提示文案</Alert>
        <Alert type="success" show-icon>成功提示文案</Alert>
        <Alert type="warning" show-icon>警告提示文案</Alert>
        <Alert type="error" show-icon>错误提示文案</Alert>
        <div>含描述信息</div>
        <Alert type="success">
            成功提示文案
            <span slot="desc">成功的提示描述文案成功的提示描述文案成功的提示描述文案成功的提示描述文案成功的提示描述文案</span>
        </Alert>
        <Alert type="warning">
            警告提示文案
            自定义slot="desc"描述内容
            <template slot="desc">
                警告的提示描述文案警告的提示描述文案警告的提示描述文案
            </template>
        </Alert>
        <Alert type="error">
            错误提示文案
            <!-- 自定义辅助性内容 -->
            <span slot="desc">
                自定义错误描述文案。
                <Icon type="help-circled" size="14"></Icon>
            </span>
        </Alert>
        <div>可关闭</div>
        <Alert type="success" closable>成功提示文案</Alert>
        <Alert type="error" show-icon closable>
            成功提示文案
            <!-- desc警告提示辅助性文字介绍 -->
            <span slot="desc">成功的提示描述文案成功的提示描述文案成功的提示描述文案成功的提示描述文案成功的提示描述文案</span>
        </Alert>
        <!-- closable是否可以关闭 -->
        <Alert type="warning" closable>
            自定义关闭内容
            <!-- close自定义内容关闭 -->
            <span slot="close">不再提示</span>
        </Alert>
        <div>表单提示</div>
        <!-- dot小点 -->
        <Alert dot class="ivu-alert-fromalert ivu-alert-fromalert-info">提示文案</Alert>
        <Alert dot class="ivu-alert-fromalert">成功提示文案</Alert>
        <Alert dot class="ivu-alert-fromalert ivu-alert-fromalert-tip">警告提示文案</Alert>
        <Alert dot class="ivu-alert-fromalert ivu-alert-fromalert-error">错误提示文案</Alert>
    </div>
</template>
<script>
// import { Alert, Icon } from 'spui';
export default {
    // components: { Alert, Icon }
}
</script>

