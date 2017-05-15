var fs = require('fs')
var path = require('path')
var chalk = require('chalk')
var rimraf = require('rimraf')
var updateComponentList = require('./update_component_list')
var cmd = require('./parse_cmd')

const component_path = path.resolve(__dirname, `../packages/${cmd.path}`)
if (!fs.existsSync(component_path)) {
    console.log(chalk.yellow(`[file] ${cmd.path} is not exists`))
    process.exit(1)
}

rimraf(component_path, () => {
    updateComponentList()
    console.log(chalk.green(`[file] remove ${cmd.path} success`))
})