import Notification from '../base/notification';

const prefixCls = 'ivu-message';
const iconPrefixCls = 'ivu-icon';
const prefixKey = 'ivu_message_key_';

let defaultDuration = 1.5;
let top;
let messageInstance;
let name = 1;

function getMessageInstance () {
    messageInstance = messageInstance || Notification.newInstance({
        prefixCls: prefixCls,
        styles: {
            top: `${top}px`
        }
    });

    return messageInstance;
}

function notice (content, duration = defaultDuration, type, onClose) {
    if (!onClose) {
        onClose = function () {

        };
    }

    // if loading
    const loadCls = type === 'loading' ? 'mine-spin-loading mine-spin-loading-s' : '';

    let instance = getMessageInstance();

    instance.notice({
        name: `${prefixKey}${name}`,
        duration: duration,
        styles: {},
        transitionName: 'move-up',
        content: `
            <div class="${prefixCls}-custom-content ${prefixCls}-${type}">
                <i class="${iconPrefixCls} ${loadCls}"></i>
                <span>${content}</span>
            </div>
        `,
        onClose: onClose
    });

    // 用于手动消除
    return (function () {
        let target = name++;

        return function () {
            instance.remove(`${prefixKey}${target}`);
        };
    })();
}

export default {
    info (content, duration, onClose) {
        return notice(content, duration, 'info', onClose);
    },
    success (content, duration, onClose) {
        return notice(content, duration, 'success', onClose);
    },
    warning (content, duration, onClose) {
        return notice(content, duration, 'warning', onClose);
    },
    error (content, duration, onClose) {
        return notice(content, duration, 'error', onClose);
    },
    loading (content, duration, onClose) {
        return notice(content, duration, 'loading', onClose);
    },
    config (options) {
        if (options.top) {
            top = options.top;
        }
        if (options.duration) {
            defaultDuration = options.duration;
        }
    },
    destroy () {
        let instance = getMessageInstance();
        messageInstance = null;
        instance.destroy();
    }
};