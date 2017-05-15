var fs = require('fs')
var path = require('path')
var chalk = require('chalk')

const new_package_name = process.argv[2]
const is_stateless = process.argv[3] && process.argv[3] === 'stateless'
module.exports = Object.assign(parseName(new_package_name), { isStateLess: is_stateless || false })

function parseName(arg) {
    if (!arg) {
        console.error(chalk.red('error'), `package name is required! \n\n      ${chalk.cyan('try "yarn create [(name|@type/name)]"')} \n`)
        process.exit(1)
    }
    if (arg.indexOf('@') === 0) {
        let args = arg.slice(1).split('/')
        if (!args[0] || !args[1]) {
            console.error(chalk.red('error'), `type or name is empty!  \n\n      ${chalk.cyan('try "yarn create [@type/name)]"')} \n`)
            process.exit(1)
        }
        return {
            type: args[0],
            name: args[1],
            path: `@${args[0]}/${args[1]}`
        }
    }
    return {
        type: null,
        name: arg,
        path: arg
    }
}