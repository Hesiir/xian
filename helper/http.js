import http from 'http';
import path from 'path';
import fileExists from 'file-exists';
import fs from 'fs';
import express from 'express';
import webpack from 'webpack';
import chalk from "chalk";
import morgan from 'morgan';
import { dllConf } from './dlls.config';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackDevServer from 'webpack-dev-server';
import getManifast from './get_manifast';
import cors from 'cors';
import { 
  getDepsVersion
} from './get_manifast';

const dllsfile = path.join(__dirname, '../.__DLLs/dllsVersion.json');
if(!fileExists(dllsfile)){
  console.log(`${chalk.bgYellow(chalk.white(' webpack '))} starting build dlls bundle`);
  new webpack(dllConf, () => {
    getManifast(dllConf.entry, startSrv)
  });
} else {
  fs.readFile(dllsfile, 'utf8', (err, data) => {
    // rebuild DLLs if DLLs'version is out of date.
    let version = JSON.parse(data).version;
    if (version != deps.version) {
      console.log(`${chalk.bgYellow(chalk.white(' webpack '))} will be update dlls bundle`);
      new webpack(dllConf, () => {
        getManifast(dllConf.entry, startSrv)
      });
    } else {
      startSrv()
    }
  })
}

let deps = getDepsVersion(dllConf.entry);
let whitelist = ['http://dev.local:9090'];
let corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if(whitelist.indexOf(req.header('Origin')) !== -1){
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  }else{
    corsOptions = { origin: false }; // disable CORS for this request
  }
  corsOptions.credentials = true; // credentials 设置为true，当使用fetch时只设置Access-Control-Allow-Origin无法通过安全校验
  callback(null, corsOptions); // callback expects two parameters: error and options
};

let startSrv = () => {
  let conf = require('./config').wpConf;
  conf.entry.app.unshift('webpack-dev-server/client?http://localhost:9090', 'webpack/hot/only-dev-server', 'react-hot-loader/patch');
  const srv = new webpackDevServer(new webpack(conf), {
    noInfo: false,
    hot: true,
    quiet: false,
    stats: {
      color: true,
      chunks: false
    }
  });
  srv.use(morgan('dev'));
  srv.use(cors(corsOptionsDelegate));
  srv.listen(9090, () => 
  console.log(`${chalk.bgGreen(chalk.white(' express '))} Server is start on http://localhost:/9090, waitng for bundle...`))
};

