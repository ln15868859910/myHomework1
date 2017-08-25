<template>
    <Xb-Poptip mistake title="提示标题" :content="errcontent" placement="top" :show="iferror">
        <div :class="wrapClasses">
            <div :class="handlerClasses" v-if="!hidestep">
                <a @click="up" @mouse.down="preventDefault" :class="upClasses">
                    <span :class="innerUpClasses" @click="preventDefault"></span>
                </a>
                <a @click="down" @mouse.down="preventDefault" :class="downClasses">
                    <span :class="innerDownClasses" @click="preventDefault"></span>
                </a>
            </div>
            <div :class="inputWrapClasses">
                <input :class="inputClasses" :disabled="disabled" autocomplete="off" :autofocus="autofocus" @focus="focus" @blur="blur" @keydown.stop="keyDown" @change="change" :name="name" :value="currentValue">
            </div>
        </div>
    </Xb-Poptip>
</template>
<script>
import { oneOf } from '../../utils/assist';
import Emitter from '../../mixins/emitter';

const prefixCls = 'ivu-input-number';
const iconPrefixCls = 'ivu-icon';

function isValueNumber(value) {
    return (/(^-?[0-9]+\.{1}\d+$)|(^-?[1-9][0-9]*$)|(^-?0{1}$)/).test(value + '');
}
function addNum(num1, num2) {
    let sq1, sq2, m;
    try {
        sq1 = num1.toString().split('.')[1].length;
    }
    catch (e) {
        sq1 = 0;
    }
    try {
        sq2 = num2.toString().split('.')[1].length;
    }
    catch (e) {
        sq2 = 0;
    }
    //        if (sq1 === 0 || sq2 === 0) {
    //            return num1 + num2;
    //        } else {
    //            m = Math.pow(10, Math.max(sq1, sq2));
    //            return (num1 * m + num2 * m) / m;
    //        }
    m = Math.pow(10, Math.max(sq1, sq2));
    return (num1 * m + num2 * m) / m;
}

export default {
    name: 'XbInputNumber',
    mixins: [Emitter],
    props: {
        max: {
            type: Number,
            default: Infinity
        },
        min: {
            type: Number,
            default: -Infinity
        },
        step: {
            type: Number,
            default: 1
        },
        value: {
            type: Number | String
        },
        size: {
            validator(value) {
                return oneOf(value, ['small', 'large']);
            }
        },
        disabled: {
            type: Boolean,
            default: false
        },
        autofocus: {
            type: Boolean,
            default: false
        },
        name: {
            type: String
        },
        defaultnumber: {//默认值
            type: Number
        },
        required: {//是否可为空
            type: Boolean,
            default: true
        },
        hidestep: {//隐藏step
            type: Boolean,
            default: false
        },
        fixed: {//小数位数
            type: Number
        }
    },
    data() {
        return {
            focused: false,
            upDisabled: false,
            downDisabled: false,
            iferror: false,
            errcontent: ''
            // currentValue: this.value
        };
    },
    computed: {
        currentValue() {
            return this.value;
        },
        wrapClasses() {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-${this.size}`]: !!this.size,
                    [`${prefixCls}-disabled`]: this.disabled,
                    [`${prefixCls}-focused`]: this.focused
                }
            ];
        },
        handlerClasses() {
            return `${prefixCls}-handler-wrap`;
        },
        upClasses() {
            return [
                `${prefixCls}-handler`,
                `${prefixCls}-handler-up`,
                {
                    [`${prefixCls}-handler-up-disabled`]: this.upDisabled
                }
            ];
        },
        innerUpClasses() {
            return `${prefixCls}-handler-up-inner ${iconPrefixCls} ${iconPrefixCls}-chevron-up`;
        },
        downClasses() {
            return [
                `${prefixCls}-handler`,
                `${prefixCls}-handler-down`,
                {
                    [`${prefixCls}-handler-down-disabled`]: this.downDisabled
                }
            ];
        },
        innerDownClasses() {
            return `${prefixCls}-handler-down-inner ${iconPrefixCls} ${iconPrefixCls}-chevron-down`;
        },
        inputWrapClasses() {
            return `${prefixCls}-input-wrap`;
        },
        inputClasses() {
            return `${prefixCls}-input`;
        }
    },
    methods: {
        preventDefault(e) {
            e.preventDefault();
        },
        up(e) {
            const targetVal = Number(e.target.value);
            if (this.upDisabled && isNaN(targetVal)) {
                return false;
            }
            this.changeStep('up', e);
        },
        down(e) {
            const targetVal = Number(e.target.value);
            if (this.downDisabled && isNaN(targetVal)) {
                return false;
            }
            this.changeStep('down', e);
        },
        changeStep(type, e) {
            if (this.disabled) {
                return false;
            }

            const targetVal = Number(e.target.value);
            let val = Number(this.currentValue);
            const step = Number(this.step);
            if (isNaN(val)) {
                return false;
            }

            // input a number, and key up or down
            if (!isNaN(targetVal)) {
                if (type === 'up') {
                    if (addNum(targetVal, step) <= this.max) {
                        val = targetVal;
                    } else {
                        return false;
                    }
                } else if (type === 'down') {
                    if (addNum(targetVal, -step) >= this.min) {
                        val = targetVal;
                    } else {
                        return false;
                    }
                }
            }

            if (type === 'up') {
                val = addNum(val, step);
            } else if (type === 'down') {
                val = addNum(val, -step);
            }
            this.setValue(val);
        },
        setValue(val) {
            this.$nextTick(() => {
                this.currentValue = val;
                this.$emit('input', val);
                this.$emit('on-change', val);
                this.dispatch('FormItem', 'on-form-change', val);
            });
        },
        focus() {
            this.focused = true;
        },
        blur() {
            this.focused = false;
            this.$emit('on-blur');
        },
        keyDown(e) {
            if (e.keyCode === 38) {
                e.preventDefault();
                this.up(e);
            } else if (e.keyCode === 40) {
                e.preventDefault();
                this.down(e);
            }
        },
        fiexdNumber(val) {
            //小数点补足原则  整数或小数未超过指定小数位数长度 不管，超过后截取指定小数位数
            var strarr = ('' + Number(val)).split('.');
            if (strarr.length == 2 && strarr[1].length > this.fixed) {
                this.setError('fixed');
            }
            if (strarr.length == 2 && this.fixed) {
                return strarr[0] + '.' + strarr[1].substring(0, this.fixed);
            } else {
                return strarr[0];
            }

        },
        setError(type) {
            var tip = '';
            switch (type) {
                case 'max':
                    tip = '最大值为' + this.max;
                    break;
                case 'min':
                    tip = '最小值为' + this.min;
                    break;
                case 'fixed':
                    tip = this.fixed === 0 ? '只能输入整数' : '只保留' + this.fixed + '位小数';
                    break;
                case 'nan':
                    tip = '只能输入合法数值';
                    break;
                default:
                    break;
            }
            this.iferror = true;
            this.errcontent = tip;
            let timer = setTimeout(() => {
                this.iferror = false;
                clearTimeout(timer);
            }, 1000);

        },
        change(event) {
            let val = event.target.value.trim();

            const max = this.max;
            const min = this.min;

            if (isValueNumber(val)) {
                val = Number(val);
                if (this.fixed > -1) {
                    val = this.fiexdNumber(val);
                }
                this.currentValue = val;

                if (val > max) {
                    this.setValue(max);
                    this.setError('max');

                } else if (val < min) {
                    this.setValue(min);
                    this.setError('min');
                } else {
                    this.setValue(val);
                }
            } else {
                this.setError('nan');
                if (this.defaultnumber != undefined) {
                    event.target.value = this.defaultnumber;
                    this.setValue(this.defaultnumber);
                } else {
                    if (this.required) {
                        event.target.value = this.currentValue;
                        this.setValue(this.currentValue);
                    } else {
                        event.target.value = '';
                        this.setValue('');
                    }
                }

            }
        },
        changeVal(val) {
            if (this.hidestep) {
                return;
            }
            if (isValueNumber(val) || val === 0) {
                val = Number(val);
                const step = this.step;

                this.upDisabled = val + step > this.max;
                this.downDisabled = val - step < this.min;
            } else {
                this.upDisabled = true;
                this.downDisabled = true;
            }
        }
    },
    mounted() {
        this.changeVal(this.currentValue);
    },
    watch: {
        currentValue(val) {
            this.changeVal(val);
        }
    }
};
</script>
