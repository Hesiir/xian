var fs = require('fs')
var path = require('path')
var chalk = require('chalk')

const new_package_name = process.argv[2]
console.log(process)
const is_function = process.argv[3] && process.argv[3] === '-f'
module.exports = Object.assign(parseName(new_package_name), { isfunctionly: is_function || false })

function parseName(arg) {
    if (!arg) {
        console.error(chalk.red('fail!'), `package name is required! \n\n      ${chalk.cyan(`try "yarn ${process.argv} [name] [-f(functionly component)]"`)} \n`)
        process.exit(0)
    }
    return {
        type: null,
        name: arg,
        path: arg
    }
}