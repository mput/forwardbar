import '@babel/polyfill';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import getMenu from './utils/menuLoader';
import { getMenu as getLunchMenu } from './utils/lunchMenuParserAndLoader';


const devMode = process.env.NODE_ENV !== 'production';
const localDev = process.env.LOCAL === 'true';

const menuData = getMenu();
// 'make load-menu' to load lunch menu
const lunchMenuData = getLunchMenu(); // if false - lunch menu outdated or wasn't loaded.

export default {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',

  devServer: {
    host: '0.0.0.0',
    port: '5656',
    disableHostCheck: true,
    public: localDev ? '' : 'wdc.babudan.ru:443',
    watchOptions: {
      poll: true,
    },
  },

  entry: ['./views/main.js', './views/styles.scss'],
  output: {
    filename: '[name].js',
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: { inline: false },
          discardComments: { removeAll: true } },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },

      {
        test: /\.scss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: !!devMode,
            },
          }, {
            loader: 'postcss-loader',
          }, {
            loader: 'resolve-url-loader',
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },

      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true,
        },
      },

      {
        test: /\.(png|jpg|gif|svg|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 60,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-85',
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
      },

      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
          },
        }],
      },
    ],
  },


  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './views/index.pug',
      inject: false,
      ...menuData,
      lunchMenu: lunchMenuData,
      devMode,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
