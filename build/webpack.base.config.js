/**
 * 公共配置
 */
var path = require('path');
var SpritesmithPlugin = require('webpack-spritesmith');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
var templateFunction = function (data) {
    var shared = '.xb-icon { background-image: url(I);display:inline-block; }'.replace('I', data.sprites[0].image);
    var perSprite = data.sprites.map(function (sprite) {
        return '.xb-icon-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }'
           .replace('N', sprite.name)
           .replace('W', sprite.width)
           .replace('H', sprite.height)
           .replace('X', sprite.offset_x)
           .replace('Y', sprite.offset_y);
     }).join('\n');
return shared + '\n' + perSprite;
};

module.exports = {
    // 加载器
    module: {
        // https://doc.webpack-china.org/guides/migrating/#module-loaders-module-rules
        rules: [{
            // https://vue-loader.vuejs.org/en/configurations/extract-css.html
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    css: 'vue-style-loader!css-loader',
                    less: 'vue-style-loader!css-loader!less-loader'
                },
                postLoaders: {
                    html: 'babel-loader'
                }
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
                'autoprefixer-loader'
            ]
        }, {
            test: /\.less$/,
            use: [
                'style-loader',
                'css-loader',
                'less-loader'
            ]
        }, {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader?sourceMap'
            ]
        }, {
            test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
            loader: 'url-loader?limit=8192',
            exclude: /assets\/xbicons/
        }, {
            test: /\.(html|tpl)$/,
            loader: 'html-loader'
        }]
    },
    plugins: [
        new SpritesmithPlugin({
            // 目标小图标
            src: {
                cwd: path.resolve(__dirname, '../assets/xbicons'),
                glob: '*.png'
            },
            // 输出雪碧图文件及样式文件
            target: {
                image: path.resolve(__dirname, '../src/styles/sprites/sprite.png'),
                css: [[path.resolve(__dirname, '../src/styles/sprites/sprite.less'), {
                    format: 'function_based_template'
                }
                ]]
            },
            customTemplates: {
                'function_based_template': templateFunction
            },
            // 样式文件中调用雪碧图地址写法
            apiOptions: {
                cssImageRef: '../sprites/sprite.png'
            },
            spritesmithOptions: {
                padding: 5,
                algorithm: 'binary-tree'
            }
        })
    ],
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    }
};