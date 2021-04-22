/* eslint-disable */

const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

const mock = require('./dev/api.mock.json')
const mockAbout = require('./dev/about.mock.json')
const fs = require('fs')

const config = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    historyApiFallback: true,
    compress: true,
    open: false,
    before: function(app, server, compiler) {
      app.get('/api/config/projectMetadata', function(req, res) {
        setTimeout(() => {
          res.json(mock)
        }, 800)
      })
      app.get('/api/about', function(req, res) {
        setTimeout(() => {
          res.json(mockAbout)
        }, 800)
      })
      app.get('/api/project', function(req, res) {
        fs.readFile(path.resolve('./dev/starter.mock.zip'), (err, data) => {
          if (err) return sendError(err, res)
          setTimeout(() => {
            res.send(data)
          }, 800)
        })
      })
    },
  },
}

module.exports = merge(common, config)
