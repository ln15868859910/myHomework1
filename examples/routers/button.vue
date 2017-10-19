<template>
    <div>
    <div>
    <span>主要按钮</span>
    <Button type="primary">我的账号</Button>
    <Button type="primary" disabled>我的账号</Button>
    </div>
    <br><br>
    <div>
    <span>警告按钮</span>
    <Button type="warning">退出</Button>
    <Button type="warning" disabled>退出</Button>
    </div>
    <br><br>
    <div>
    <span>错误按钮</span>
    <Button type="error">error</Button>
    <Button type="error" disabled>error</Button>
    </div>
    <br><br>
    <div>
    <span>线框按钮</span>
    <Button type="ghost">ghost</Button>
    <Button type="ghost" disabled>ghost</Button>
    </div>
    <br><br>
    <div>
    <span>带图标</span>
    <Button type="ghost" icon="search">搜索</Button>
    <Button type="ghost" icon="search" disabled>搜索</Button>
    </div>
    <br><br>
    <div>
    <span>小按钮</span>
    <Button type="primary" size="small">充值</Button>
    <Button type="primary" size="small" disabled>充值</Button>
    </div>
    <br><br>
    <div>
    <span>文字按钮</span>
    <Button type="text">Primary</Button>
    <Button type="text" disabled>Primary</Button>
    </div>
    <br><br>
    <br><br>
        <h4>基本</h4>
        <br><br>
        <Button-group>
            <Button>取消</Button>
            <Button type="primary">确定</Button>
        </Button-group>
        <Button-group>
            <Button disabled>昨日</Button>
            <Button disabled>今日</Button>
            <Button disabled>明日</Button>
        </Button-group>
        <Button-group>
            <Button type="primary">L</Button>
            <Button>M</Button>
            <Button type="ghost">M</Button>
            <Button type="dashed">R</Button>
        </Button-group>
        <br><br>
        <h4>配合图标</h4>
        <br><br>
        <Button-group>
            <Button type="primary">
                <Icon type="chevron-left"></Icon>
                前进
            </Button>
            <Button type="primary">
                后退
                <Icon type="chevron-right"></Icon>
            </Button>
        </Button-group>
        <Button-group>
            <Button type="primary" icon="skip-back"></Button>
            <Button type="primary" icon="skip-forward"></Button>
        </Button-group>
        <br><br>
        <h4>圆角</h4>
        <br><br>
        <Button-group shape="circle">
            <Button type="primary">
                <Icon type="chevron-left"></Icon>
                前进
            </Button>
            <Button type="primary">
                后退
                <Icon type="chevron-right"></Icon>
            </Button>
        </Button-group>
        <Button-group shape="circle">
            <Button type="primary" icon="skip-back"></Button>
            <Button type="primary" icon="skip-forward"></Button>
        </Button-group>
        <br><br>
        <h4>尺寸</h4>
        <br><br>
        <Button-group size="large">
            <Button type="ghost">Large</Button>
            <Button type="ghost">Large</Button>
        </Button-group>
        <Button-group>
            <Button type="ghost">Default</Button>
            <Button type="ghost">Default</Button>
        </Button-group>
        <Button-group size="small">
            <Button type="ghost">Small</Button>
            <Button type="ghost">Small</Button>
        </Button-group>
        <br><br>
        <Button-group size="large" shape="circle">
            <Button type="ghost">Large</Button>
            <Button type="ghost">Large</Button>
        </Button-group>
        <Button-group shape="circle">
            <Button type="ghost">Default</Button>
            <Button type="ghost">Default</Button>
        </Button-group>
        <Button-group size="small" shape="circle">
            <Button type="ghost">Small</Button>
            <Button type="ghost">Small</Button>
        </Button-group>
        <Xb-Icon type="tag-balance"></Xb-Icon>
        <Icon type="android-alert"></Icon>
    </div>
</template>
<script>
    export default {

    }
</script>
