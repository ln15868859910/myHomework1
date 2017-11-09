import XbConfirm from './confirm';

let modalInstance;

function getModalInstance () {
    modalInstance = modalInstance || XbConfirm.newInstance({
        closable: false,
        maskClosable: false,
        footerHide: false
    });

    return modalInstance;
}

function confirm (options) {
    let instance  = getModalInstance();

    options.onRemove = function () {
        modalInstance = null;
    };

    instance.show(options);
}

XbConfirm.info = function (props = {}) {
    props.icon = 'info';
    props.showCancel = false;
    return confirm(props);
};

XbConfirm.success = function (props = {}) {
    props.icon = 'success';
    props.showCancel = false;
    return confirm(props);
};

XbConfirm.warning = function (props = {}) {
    props.icon = 'warning';
    props.showCancel = false;
    return confirm(props);
};

XbConfirm.error = function (props = {}) {
    props.icon = 'error';
    props.showCancel = false;
    return confirm(props);
};

XbConfirm.confirm = function (props = {}) {
    props.icon = 'confirm';
    props.showCancel = true;
    return confirm(props);
};

XbConfirm.remove = function () {
    if (!modalInstance) {   // at loading status, remove after Cancel
        return false;
    }

    const instance = getModalInstance();

    instance.remove();
};

export default XbConfirm;