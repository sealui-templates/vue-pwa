'use strict'
const path              = require('path')
const webpack           = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const utils             = require('./utils')
const config            = require('../config')
const vueLoaderConfig   = require('./vue-loader.conf')
const pkg               = require('../package.json');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var banner = [
	' '+pkg.name + ' v'+pkg.version,
	' Author    : '+pkg.author,
	' Copyright : '+new Date().getFullYear()+' SealUI'
	].join('\n');

{{#lint}}const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
}){{/lint}}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/entry.js',
    common : require.resolve('./polyfills')
  },
  output: {
		path              : config[process.env.NODE_ENV]['assetsRoot'],
		filename          : '[name].js',
		sourceMapFilename : '[file].map',
		chunkFilename     : '[name].js',
		library           : 'SealUI',
		libraryTarget     : 'umd',
		umdNamedDefine    : true,
		publicPath        : config[process.env.NODE_ENV]['assetsPublicPath']
		//publicPath        : process.env.NODE_ENV === 'production' ? config.prod.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions : ['.js', '.jsx', '.json','.css','.less','.vue'],
    alias: {
      {{#if_eq build "standalone"}}
      'vue$'       : 'vue/dist/vue.esm.js',
      {{/if_eq}}
			'@'          : resolve('src'),
			'components' : resolve('src/components'),
			'utils'      : resolve('src/utils'),
			'mixins'     : resolve('src/mixins'),
			'plugins'    : resolve('src/plugins'),
			'packages'   : resolve('packages'),
			'views'      : resolve('src/views'),
			'res'        : resolve('src/assets')
    }
  },
  module: {
    rules: [
      {{#lint}}
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {{/lint}}
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name='+utils.assetsPath('img/[hash:16].[ext]'), {
            loader: 'image-webpack-loader',
            options: {
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              mozjpeg: {
                progressive: true,
                quality: 75
              },
              // Specifying webp here will create a WEBP version of your JPG/PNG images
              webp: {
                quality: 100
              }
            }
          }
        ]
      },
      {
				test: /\.html$/,
				loader: 'html-loader?minimize'
			},
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
  	new webpack.BannerPlugin(banner),
  	new CopyWebpackPlugin([
      {
        from           : path.resolve(__dirname, '../public'),
        to             : config[process.env.NODE_ENV]['assetsSubDirectory'],
        ignore         : ['*.html','*.json','*.tpl','*.php','.*'],
        copyUnmodified : true
      },{
        from           : path.resolve(__dirname, '../public/manifest.json'),
        to             : utils.assetsPath('manifest.json'),
        copyUnmodified : true
      }
    ])
  ],
  node: {
		setImmediate  : false,
		dgram         : 'empty',
		fs            : 'empty',
		net           : 'empty',
		tls           : 'empty',
		child_process : 'empty'
  }
}
