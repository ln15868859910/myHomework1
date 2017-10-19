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
    return gulp.src('../assets/xbIconSvg/*.svg')
        .pipe(svgSprite({
            templates: {
                css: require('fs').readFileSync('../assets/templates/svgSprite.less', 'utf-8')
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
        .pipe(gulp.dest('../src/styles/sprites'));
});
//生成图标字体文件
gulp.task('Iconfont', function () {
    return gulp.src(['../assets/iconfontSvg/*.svg'])
        .pipe(iconfontCss({
            fontName: 'spicons', //字体名 
            path: '../assets/templates/iconFont.less', //模板文件路径 
            targetPath: '../_spicons-icons.less',
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
        .pipe(gulp.dest('../src/styles/common/iconfont/fonts'));
});
// 编译less
gulp.task('css', ['sprites','Iconfont'], function () {
    gulp.src('../src/styles/index.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie > 8']
        }))
        .pipe(cleanCSS())
        .pipe(rename('spui.css'))
        .pipe(gulp.dest('../dist/styles'));
});
// 拷贝字体文件
gulp.task('fonts', ['Iconfont'],function () {
    gulp.src('../src/styles/common/iconfont/fonts/*.*')
        .pipe(gulp.dest('../dist/styles/fonts'));
});

// 拷贝svg雪碧图
gulp.task('copySprite', ['sprites'], function () {
    gulp.src('../src/styles/sprites/svgSprite.svg')
        .pipe(gulp.dest('../dist/styles'));
});

gulp.task('default', ['css', 'fonts', 'sprites','Iconfont', 'copySprite']);