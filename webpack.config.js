const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/js/canvas.js',
  output: {
    path: __dirname + '/dist/',
    filename: './js/canvas.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images' // Путь, куда будут скопированы изображения после сборки
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'videos' // Путь, куда будут скопированы видеофайлы после сборки
            }
          }
        ]
      },
      {
        test: /\.(mp3)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'audio' // Путь, куда будут скопированы аудиофайлы после сборки
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['dist'] },
      files: ['./dist/*'],
      notify: false
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: 'favicon.ico',
      template: 'src/index.html'
    })
  ],
  watch: true,
  devtool: 'source-map'
};
