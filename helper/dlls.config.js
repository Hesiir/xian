import path from 'path';
import webpack from 'webpack';

export const dllConf = {
  entry: ['react'],
  devtool: 'cheap-module-eval-source-map',
  output: {
    filename: 'dlls.js',
    path: path.join(__dirname, '../.__DLLs'),
    library: 'dlls',
  },
  plugins: [
    new webpack.DllPlugin({
      name: 'dlls',
      path: path.join(__dirname, '../.__DLLs/dlls.json')
    })
  ]
};
