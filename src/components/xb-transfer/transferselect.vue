<script>
const prefixCls = 'ivu-xbtransfer';
export default {
    mixins: [],
    name:'transferselect',
    render(createElement) {
        var that = this;
        var dom = createElement(
        'ul',
            {
                class: {
                    'ivu-xbtransfer-book-ul-r': true,
                    'ivu-xbtransfer-book-ul-h1': true,
                    'ivu-xbtransfer-copyScroll': true
                }
            },
        this.allData.map(function(data) {
            return data.list.map(function(item) {
                if (item.select) {
                    return createElement('li', 
                        {
                            style: {
                                color: '#D9D9D9',
                                backgroundColor:item.disabled ? '#aaa' : '#fff'
                            }
                        },
                        [
                            createElement('Icon', {
                                attrs: {
                                    type: 'close-filled'
                                },
                                style: {
                                    fontSize: '16px',
                                    marginRight: '10px',
                                    color: '#D9D9D9',
                                    backgroundColor:item.disabled ? '#aaa' : '#fff'
                                },
                                nativeOn: {
                                    click: function() {
                                        if(item.disabled){
                                            return;
                                        }
                                        item.select = false;
                                        var index = that.selectIds.indexOf(item.Id);
                                        that.selectIds.splice(index, 1);
                                        that.$emit('ondelete');
                                    }
                                }
                            }),
                            item.Name
                        ]);
                }
            });
        })
    );
        return dom;
    },
    props: {
        allData: {
            type: Array,
            required: true
        },
        selectIds: {
            type: Array,
            required: true
        }
    }
};
</script>