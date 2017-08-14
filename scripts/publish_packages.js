var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var shell = require('shelljs');

const pkgPath = path.resolve(__dirname, '../packages')
fs.readdirSync(pkgPath)
    .filter(file => fs.lstatSync(`${pkgPath}/${file}`).isDirectory())
    .forEach(file => {
        let dirPath = `${pkgPath}/${file}`
        let files = fs.readdirSync(dirPath)
        if (files.indexOf('package.json') >= 0) {
            shell.exec(`npm publish ${dirPath}`, function() {
                console.log(chalk.green(`publish ${file} success`))
            })
        }
    })