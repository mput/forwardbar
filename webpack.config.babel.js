import yaml from 'js-yaml';
import fs from 'fs';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const devMode = process.env.NODE_ENV !== 'production';

const menuDataRow = yaml.safeLoad(fs.readFileSync('./views/data/menu.yml', 'utf8'));

const proceedData = (data) => {
  const proceedItems = itemsData => Object.keys(itemsData)
    .map(name => ({
      name,
      description: itemsData[name].description,
      price: itemsData[name].price,
    }));
  const proceedTypes = typesData => Object.keys(typesData)
    .map(typeName => ({
      name: typeName,
      items: proceedItems(typesData[typeName]),
    }));
  return Object.keys(data).reduce((acc, chapterName) => {
    const types = proceedTypes(data[chapterName]);
    return { ...acc, [chapterName]: types };
  }, {});
};

const menuData = proceedData(menuDataRow);

// console.log(menuData);
// console.log(menuData.drinks[1]);
// console.log(menuData.drinks[0][1]);

export default {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'inline-source-map',

  devServer: {
    host: '0.0.0.0',
    port: '5656',
    disableHostCheck: true,
    public: 'wdc.babudan.ru:443',
    watchOptions: {
      poll: true,
    },
  },

  entry: ['./views/main.js', './views/styles.scss'],

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
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/',
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
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
