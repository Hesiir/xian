import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import precss from 'precss';
import { dllConf } from './dlls.config';

export const wpConf = {
  context: __dirname,
  entry: {
    app: [
      './index.js'
    ],
    vendor: dllConf.entry
  },
  output: {
    //  !! absolute path is required
    filename: '[name].js',
    chunkFilename: '[name].bundle.js'
  },
  resolve: {

  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader?passPerPreset,presets[]=stage-0,presets[]=es2015,presets[]=react,plugins[]=transform-runtime,plugins[]=react-hot-loader/babel'
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader'
      },
      {
        test: /\.styl$/,
        loaders: [
          'style-loader',
          `css-loader?{
              "sourceMap":false,
              "modules":true,
              "importLoaders": 1,
              "localIdentName":'[name]_[local]_[hash:base64:3]'",
              "minimize":false
          }`,
          'postcss',
          'stylus-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      // test: /\.xxx$/, // may apply this only for some modules
      options: {
        postcss: () => {
          return [
            precss(),
            autoprefixer({ browsers: Midfy.AUTOPREFIXER_BROWSERS })
          ]
        }
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: Infinity
    }),
    //Typically you'd have plenty of other plugins here as well
    new webpack.DllReferencePlugin({
        manifest: require(`${path.join(__dirname, '../.__DLLs/dlls.json')}`)
    }),
    // OccurrenceOrderPlugin is needed for long-term caching to work properly.
    // See http://mxs.is/googmv
    new webpack.optimize.OccurrenceOrderPlugin(true),
    // Merge all duplicate modules. !!Don’t use it in watch mode. Only for production builds
    // new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
      template: __dirname + '/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyURLs: true,
      },
      inject: true,
      debug: true
    })
  ]
};
