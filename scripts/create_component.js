let fs = require('fs')
let path = require('path')
let chalk = require('chalk')
let mkdirp = require('mkdirp')

let new_package_name = process.argv[2],
    folder_name = '' + new_package_name,
    isfunctionly = process.argv[3] && process.argv[3] === 'f' || false,
    hump_package_name
if (!new_package_name) {
    console.error(chalk.red('fail!'),
        `package name is required! \n\n      ${chalk.cyan('try "yarn new [packagename] [-f(functionly component)]"')} \n`
    )
    process.exit(0)
} else if (/[^a-z|0-9|-]/i.test(new_package_name)) {
    console.log(chalk.red('fail!'),
        `only "a-z", "-", "0-9" is allow to name the package \n\n${chalk.cyan('we recommend to name the package with lowercase characters, number and "-"\nwe will convert it to hump-named type')} \n`
    )
    process.exit(0)
} else {
    trasform()
}

function trasform() {
    hump_package_name = '' + new_package_name
    hump_package_name = hump_package_name.split('-')
    hump_package_name.map((n, i) => hump_package_name[i] = n.charAt(0).toUpperCase() + n.substr(1))
    hump_package_name = hump_package_name.join('')
}

let updateComponentList = require('./update_component_list')
const packages_path = path.resolve(__dirname, '../packages', folder_name)
    // const upper_component_name = new_package_name.join('').slice(0, 1).toUpperCase() + new_package_name.join('').slice(1)
const declare = `Copyright 2017-present, Hesiir, Inc.`

const stateless_component = `import React from 'react'
import classNames from 'classnames/bind'
import style from './style.css'

const S = classNames.bind(style)
const ${hump_package_name} = ({
  classname,
  children
}) => {
  return (<div className={S('${new_package_name}', classname)}>{children}</div>)
}

export default ${hump_package_name}

`
const normal_component = `import React, { Component } from 'react'
import { string } from 'prop-types'
import classNames from 'classnames/bind'
import style from './style.css'

const S = classNames.bind(style)
class ${hump_package_name} extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  static PropTypes = {
    classname: string
  }

  componentDidMount(){}

  componentWillReciveProps(nextProps){}

  render(){
    const { classname, children } = this.props
    return (<div className={S('${new_package_name}', classname)}>{children}</div>)
  }
}

export default ${hump_package_name}

`
const test_file = `import React, { Component } from 'react'
import { action, decorateAction } from '@storybook/addon-actions'
import { withKnobs, text } from '@storybook/addon-knobs'
import ${hump_package_name} from './index'

export default (storybook) => {
  storybook('${hump_package_name}', module)
    .addDecorator(withKnobs)
    .addWithInfo('basic use', () => (<${hump_package_name}>{text('name', 'simple use')}</${hump_package_name}>), { header: false, inline: true })
}

`
const readme = `# ${hump_package_name}  `
const style_file = `.${new_package_name}{}`
const package_file = `{
  "name": "${new_package_name}",
  "version": "0.1.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Hesiir/xian.git"
  },
  "author": "Orlo Wang",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/Hesiir/xian/issues"
  },
  "homepage": "https://github.com/Hesiir/xian#readme"
}`

if (fs.existsSync(packages_path)) {
    console.error(chalk.red('error'), `the package '${new_package_name}' already exists! \n\n      ${chalk.cyan('try "yarn delete [(name|@type/name)]" if you want to drop it')} \n`)
    process.exit(1)
}

mkdirp.sync(packages_path)
updateComponentList()
const Component = isfunctionly ? stateless_component : normal_component
fs.writeFile(`${packages_path}/index.jsx`, Component, 'utf8', err => { if (err) throw (err) })
fs.writeFile(`${packages_path}/test.jsx`, test_file, 'utf8', err => { if (err) throw (err) })
fs.writeFile(`${packages_path}/style.css`, style_file, 'utf8', err => { if (err) throw (err) })
fs.writeFile(`${packages_path}/README.md`, readme, 'utf8', err => { if (err) throw (err) })
fs.writeFile(`${packages_path}/package.json`, package_file, 'utf8', err => { if (err) throw (err) })

let tree = `-${new_package_name}
 |-index.jsx
 |-test.jsx
 |-style.css
 |-package.json
  \`-README.md`
console.log(`\ncreate new component ${hump_package_name} success \n`, chalk.green(tree))