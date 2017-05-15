var fs = require('fs')
var path = require('path')
var chalk = require('chalk')

module.exports = function updateComponentList() {
    var dir_path = path.resolve(__dirname, '../packages')
    const component_list_path = path.join(__dirname, './component_list.json')
    if (!fs.existsSync(component_list_path)) fs.writeFileSync(component_list_path, '{"components":[]}', 'utf8')

    fs.writeFile(component_list_path, `{"components":${JSON.stringify(readComponent(dir_path))}}`, 'utf8', function(err) {
        console.log(chalk.bgGreen(chalk.white('fileupdate')) + ' update components list')
    })
}

function readComponent(path) {
    let components = []
    let files = readDirOnlySync(path)
    files.map(file => {
        if (file.indexOf('@') === 0) {
            let children = readDirOnlySync(path + '/' + file)
            console.log(children)
            children.map(child => {
                components.push({
                    type: file.slice(1),
                    component: child
                })
            })
        } else {
            components.push({
                type: null,
                component: file
            })
        }
    })
    return components
}

function readDirOnlySync(path) {
    let dir = []
    let files = fs.readdirSync(path)
    files.map(file => {
        let file_info = fs.lstatSync(path + '/' + file)
        if (file_info.isDirectory()) {
            dir.push(file)
        }
    })
    return dir
}