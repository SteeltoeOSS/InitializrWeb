/* eslint-disable */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const CopyPlugin = require('copy-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'

const CODE = `<script defer src="https://www.googletagmanager.com/gtag/js?id={{ID}}"></script><script>window.dataLayer=window.dataLayer || []; function gtag(){dataLayer.push(arguments);}gtag('js', new Date()); gtag('config', '{{ID}}');</script>`

class WebpackGoogleTagManager {
  constructor(id) {
    this.id = id
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('gtag', compilation => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(
        'gtag',
        ({ html }) => {
          if (this.id) {
            html = html.replace(
              '</body>',
              CODE.replace(new RegExp('{{ID}}', 'g'), this.id) + '</body>'
            )
            return {
              html,
            }
          }
        }
      )
    })
  }
}

const config = {
  entry: path.resolve(__dirname, 'src/App.js'),
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    filename: 'main-[hash].js',
    chunkFilename: 'chunk-[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[hash].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'static'),
        to: path.resolve(__dirname, 'public'),
      },
    ]),
    new HtmlWebpackPlugin({
      minify: isDev
        ? false
        : {
            collapseWhitespace: true,
            removeComments: true,
            useShortDoctype: true,
            minifyCSS: true,
          },
      template: './static/index.html',
      title: 'Steeltoe Initializr',
      description: 'Steeltoe Initializr generates Steeltoe DotNet projects with just what you need to start quickly!',
      url: 'https://start.steeltoe.io',
      twitter: '@SteeltoeOSS',
      image: 'https://start.steeltoe.io/images/steeltoe-card.png',
      theme: '#0066cc',
    }),
    new WebpackGoogleTagManager(process.env.GOOGLE_TAGMANAGER_ID),
    new WebpackPwaManifest({
      name: 'steeltoe-initializr',
      short_name: 'Start',
      description: 'Steeltoe Initializr generates Steeltoe DotNet projects with just what you need to start quickly!',
      background_color: '#0066cc',
      inject: true,
      fingerprints: true,
      ios: true,
      start_url: '/',
      crossorigin: null,
      icons: [
        {
          src: path.resolve('src/images/steeltoe-icon.png'),
          sizes: [48, 72, 96, 144, 192, 256, 384, 512],
        },
      ],
    }),
  ],
}

module.exports = config
