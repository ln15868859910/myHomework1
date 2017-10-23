import Vue from 'vue';
import Modal from '../modal/modal.vue';
import Icon from '../icon/icon.vue';
import iButton from '../button/button.vue';
import {
    camelcaseToHyphen
} from '../../utils/assist';
import Locale from '../../mixins/locale';

const xbConfirm = {};
xbConfirm.newInstance = properties => {
    const _props = properties || {};

    let props = '';
    Object.keys(_props).forEach(prop => {
        props += ' :' + camelcaseToHyphen(prop) + '=' + prop;
    });

    const div = document.createElement('div');
    div.innerHTML = `
        <Modal${props} v-model="visible" :width="width" class-name="vertical-center-modal" :scrollable="scrollable">
            <p slot="header" style="text-align:center">
                <span style="color: #fff;" v-html="title"></span>
            </p>
            <div>  
                <Icon :type="iconName" size="20" v-show="showIcon"></Icon>
                <div style="text-align:center;" v-html="body"></div>
            </div>
            <div slot="footer">
                <i-button type="ghost" v-if="showCancel" @click.native="cancel">{{ localeCancelText }}</i-button>
                <i-button type="primary" :loading="buttonLoading" @click.native="ok">{{ localeOkText }}</i-button>
            </div>
        </Modal>
    `;

    document.body.appendChild(div);

    const modal = new Vue({
        el: div,
        mixins: [Locale],
        components: {
            Modal,
            iButton,
            Icon
        },
        data: Object.assign(_props, {
            visible: false,
            width: 380,
            title: '',
            body: '',
            iconType: '',
            iconName: '',
            okText: undefined,
            cancelText: undefined,
            showCancel: false,
            loading: false,
            buttonLoading: false,
            scrollable: false,
            showIcon:false
        }),
        computed: {
            iconNameCls() {
                return [
                    'ivu-icon',
                    `ivu-icon-${this.iconName}`
                ];
            },
            localeOkText() {
                if (this.okText) {
                    return this.okText;
                } else {
                    return this.t('i.modal.okText');
                }
            },
            localeCancelText() {
                if (this.cancelText) {
                    return this.cancelText;
                } else {
                    return this.t('i.modal.cancelText');
                }
            }
        },
        methods: {
            cancel() {
                this.$children[0].visible = false;
                this.buttonLoading = false;
                this.onCancel();
                this.remove();
            },
            ok() {
                if (this.loading) {
                    this.buttonLoading = true;
                } else {
                    this.$children[0].visible = false;
                    this.remove();
                }
                this.onOk();
            },
            remove() {
                setTimeout(() => {
                    this.destroy();
                }, 300);
            },
            destroy() {
                this.$destroy();
                document.body.removeChild(this.$el);
                this.onRemove();
            },
            onOk() {},
            onCancel() {},
            onRemove() {}
        }
    }).$children[0];

    return {
        show(props) {
            modal.$parent.showCancel = props.showCancel;
            modal.$parent.iconType = props.icon;

            switch (props.icon) {
                case 'info':
                    modal.$parent.iconName = 'information-circled';
                    break;
                case 'success':
                    modal.$parent.iconName = 'checkmark-circled';
                    break;
                case 'warning':
                    modal.$parent.iconName = 'android-alert';
                    break;
                case 'error':
                    modal.$parent.iconName = 'close-circled';
                    break;
                case 'confirm':
                    modal.$parent.iconName = 'help-circled';
                    break;
            }

            if ('width' in props) {
                modal.$parent.width = props.width;
            }

            if ('title' in props) {
                modal.$parent.title = props.title;
            }

            if ('content' in props) {
                modal.$parent.body = props.content;
            }

            if ('okText' in props) {
                modal.$parent.okText = props.okText;
            }

            if ('cancelText' in props) {
                modal.$parent.cancelText = props.cancelText;
            }

            if ('onCancel' in props) {
                modal.$parent.onCancel = props.onCancel;
            }

            if ('onOk' in props) {
                modal.$parent.onOk = props.onOk;
            }

            // async for ok
            if ('loading' in props) {
                modal.$parent.loading = props.loading;
            }

            if ('scrollable' in props) {
                modal.$parent.scrollable = props.scrollable;
            }
   
            if ('showIcon' in props) {
                modal.$parent.showIcon = props.showIcon;
            }
            // notice when component destroy
            modal.$parent.onRemove = props.onRemove;

            modal.visible = true;
        },
        remove() {
            modal.visible = false;
            modal.$parent.buttonLoading = false;
            modal.$parent.remove();
        },
        component: modal
    };
};

export default xbConfirm;