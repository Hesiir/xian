import path from 'path';
import fs from 'fs';
import chalk from "chalk";
import crypto from 'crypto';
import _ from 'lodash';
import getNowDatetime from './utils/datetime';
import dependencies from './utils/dependencies';

export default (deps, callback) => {
  let data = _.assign(getDepsVersion(deps), {"createtime": getNowDatetime()});
  // append data to 'self_deps.json', auto creating the file if it does not yet exist!
  fs.writeFile(path.join(__dirname, '../.__DLLs/dllsVersion.json'), JSON.stringify(data), 'utf8', (err) => {
    if (err) throw `${chalk.bgRed(chalk.white(' Dlls Build ERR!'))} ${err}`;
    console.log(`${chalk.bgGreen(chalk.white(' webpack '))} build dlls bundle `);
    callback()
  })
}

export let getDepsVersion = (deps) => {
  let manifast = {};
  _.mapKeys(deps, (dep) => {
    if(!_.has(dependencies, dep)){
      const err = `${chalk.bgRed(chalk.white(' Dlls Build ERR!'))} ${dep} is not found! try 'npm i --save ${dep}'`;
      throw err;
    }
    manifast[dep] = _.get(dependencies, dep)
  })

  return {
    version: crypto.createHash('md5').update(String(manifast)).digest("hex"),
    manifast: manifast
  }
}
