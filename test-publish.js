/* eslint-disable */
const git = require('git-last-commit');
const webpack = require('webpack');
const webpackConfig = require('./build/webpack.dist.prod.config.js');
const fs = require('fs');
const path = require('path');
const request = require("request");
let compiler = webpack(webpackConfig);






//gulp
var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var less = require('gulp-less');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var svgSprite = require('gulp-svg-sprites');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
//生成svg雪碧图
gulp.task('sprites', function () {
    return gulp.src('./assets/xbIconSvg/*.svg')
        .pipe(svgSprite({
            templates: {
                css: require('fs').readFileSync('./assets/templates/svgSprite.less', 'utf-8')
            },
            cssFile: 'sprite.less',
            svg: {
                sprite: 'svgSprite.svg'
            },
            baseSize: 16,
            svgPath: './svgSprite.svg',
            common: 'xb-icon',
            selector: 'xb-icon-%f'
        }))
        .pipe(gulp.dest('./src/styles/sprites'));
});
//生成图标字体文件
gulp.task('Iconfont', function () {
    return gulp.src(['./assets/iconfontSvg/*.svg'])
        .pipe(iconfontCss({
            fontName: 'spicons', //字体名 
            path: './assets/templates/iconFont.less', //模板文件路径 
            targetPath: './_spicons-icons.less',
            cssClass: 'ivu-icon', //样式类名 
            fontPath: '/fonts/'
        }))
        .pipe(iconfont({
            fontName: 'spicons', // required
            prependUnicode: false, // recommended option
            formats: ['ttf', 'eot', 'woff', 'svg'],
            normalize: true,
            fontHeight: 1001 // default, 'woff2' and 'svg' are available
        }))
        .pipe(gulp.dest('./src/styles/common/iconfont/fonts'));
});
// 编译less
gulp.task('css', ['sprites', 'Iconfont'], function () {
    gulp.src('./src/styles/index.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie > 8']
        }))
        .pipe(cleanCSS())
        .pipe(rename('spui.css'))
        .pipe(gulp.dest('./dist/styles'));
});
// 拷贝字体文件
gulp.task('fonts', ['Iconfont'], function () {
    gulp.src('./src/styles/common/iconfont/fonts/*.*')
        .pipe(gulp.dest('./dist/styles/fonts'));
});
// 拷贝svg雪碧图
gulp.task('copySprite', ['sprites'], function () {
    gulp.src('./src/styles/sprites/svgSprite.svg')
        .pipe(gulp.dest('./dist/styles'));
});


var gitPromise = new Promise(function (resolve, reject) {
    git.getLastCommit(function (err, commit) {
        // read commit object properties 
        console.log("读取git信息结束");
        resolve(commit)
    });
});
var gulpPromise = new Promise(function (resolve, reject) {
    gulp.task('default', ['css', 'fonts', 'sprites', 'Iconfont', 'copySprite'], function () {
        console.log("完成gulp任务");
        resolve()
    });
    gulp.start.apply(gulp, ['default'])
    //gulp
});
var webpackPromise = new Promise(function (resolve, reject) {
    compiler.run(function (error, stats) {
        console.log("完成webpack");
        resolve()
    });
}
);
// var allPromise =Promise.all([gitPromise,gulpPromise,webpackPromise]).then(function(arr){
var allPromise = Promise.all([gitPromise, gulpPromise, webpackPromise]).then(function (arr) {
    let gitMessage = arr[0];
    let formData = {
        branch: gitMessage.notes,
        author: gitMessage.author.name,
        hash: gitMessage.hash,
        subject: gitMessage.subject,
        paths: []
    };
    let allFileMsg = [];
    let promiseArr = [];

    let getFile = function (src) {
        // 读取目录中的所有文件/目录
        let paths = fs.readdirSync(src);
        paths.forEach(function (path) {
            let _src = src + '/' + path;
            let msg = {
                filename: "",
                size: 0,
                path: ""
            }
            var st = fs.statSync(_src);
            // 判断是否为文件
            if (st.isFile()) {
                msg.filename = path;
                msg.size = st.size;
                msg.path = _src;
                allFileMsg.push(msg);
                // 创建读取流

            }
            // 如果是目录则递归调用自身
            else if (st.isDirectory()) {
                getFile(_src);
            }
        });
    };
    getFile("./dist");
    console.log("上传dist目录中的文件")
    allFileMsg.forEach(function (item) {
        //创建文件流
        formData[item.filename.replace(".", "")] = fs.createReadStream(item.path);
        //记录dist的地址
        formData.paths.push(item.path.replace("./", ""))
    })
    request.post({ url: 'http://192.168.5.119:3000/spui', formData: formData }, function optionalCallback(err, httpResponse, body) {
        console.log("已接收服务器到信息")
        if (!body) return console.error('服务器未返回结果');
        let data = JSON.parse(body);
        if (!data.State) {
            return console.error('从服务器端返回的错误信息:', data.ErrorObject.message, "||stack:", data.ErrorObject.stack);
        } else {
            console.log('发布成功,其中一个资源地址为：', data.Data);
        }
    });
})




