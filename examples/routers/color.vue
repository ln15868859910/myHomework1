<template>
    <div>
        <div v-for="(item,index) in colorArr" :key="index"  class="box">
            <div v-for="(i,jj) in 10" :style="calcateStyle(item,i)" class="littlebox">
            {{item}}
            </div>
        </div>
        <div>
            
        </div>
    </div>
</template>

<script>
export default {
    name: 'color',
    data() {
        return {
            colorArr: [
                '#129CA9',
                '#21467A',
                '#285899',
                '#3766A6',
                '#49B3FF',
                '#5295E7',
                '#536DDA',
                '#59C06C',
                '#61BDFF',
                '#6CA77B',
                '#A27DD7',
                '#B9BEC5',
                '#F86665',
                '#FC8F8F',
                '#FFB51F'
            ]
        };
    },
    methods: {
        calcateStyle(color, index) {
            return {
                background: color,
                opacity: index / 10,
                color: `rgba(55, 102, 166,${index / 10})`
            };
        }
    }
};
</script>

<style>
.box {
    height: 100px;
    display: inline-block;
}
.littlebox {
    width: 100px;
    height: 100%;
    display: inline-block;

    font-size: 16px;
    line-height: 50px;
    text-align: center;
}
</style>
