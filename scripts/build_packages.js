var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var shell = require('shelljs');
var rimraf = require('rimraf');

const pkgPath = path.resolve(__dirname, '../packages')
fs.readdirSync(pkgPath)
    .filter(file => fs.lstatSync(`${pkgPath}/${file}`).isDirectory())
    .forEach(file => {
        console.log('[build]', chalk.cyan('start build package'), chalk.cyan(file))
        let dirPath = `${pkgPath}/${file}`
        rimraf(dirPath, function() {
            shell.exec(`babel ${dirPath} -d ${dirPath}/dist --ignore node_modules`, function() {
                console.log('[build]', chalk.green('build package done'))
            })
        })
    })