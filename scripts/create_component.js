var fs = require('fs')
var path = require('path')
var chalk = require('chalk')
var mkdirp = require('mkdirp')
var cmd = require('./parse_cmd')

var updateComponentList = require('./update_component_list')
const packages_path = path.resolve(__dirname, '../packages', cmd.path)
const upper_component_name = cmd.name.slice(0, 1).toUpperCase() + cmd.name.slice(1)
const declare = `Copyright 2016-present, Jnfinity, Inc.`

const stateless_component = `import React from 'react'
import classNames from 'classnames/bind'
import style from './style.css'

const S = classNames.bind(style)
const ${upper_component_name} = ({
  classname,
  children
}) => {
  return (<div className={S('${cmd.name}', classname)}>{children}</div>)
}

export default ${upper_component_name}

`
const normal_component = `import React, { Component } from 'react'
import { string } from 'prop-types'
import classNames from 'classnames/bind'
import style from './style.css'

const S = classNames.bind(style)
class ${upper_component_name} extends Component {
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
    return (<div className={S('${cmd.name}', classname)}>{children}</div>)
  }
}

export default ${upper_component_name}

`
const test_file = `import React, { Component } from 'react'
import { action, decorateAction } from '@kadira/storybook-addon-actions'
import { withKnobs, text } from '@kadira/storybook-addon-knobs'
import ${upper_component_name} from './index'

export default (storybook) => {
  storybook('${upper_component_name}', module)
    .addDecorator(withKnobs)
    .addWithInfo('basic use', () => (<${upper_component_name}>{text('name', 'simple use')}</${upper_component_name}>), { header: false, inline: true })
}

`
const readme = `# ${upper_component_name}  `
const style_file = `.${cmd.name}{}`
const package_file = `{
  "name": "${cmd.path}",
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
  "homepage": "https://github.com/Hesiir/xian#readme",
  "devDependencies": {
    "react": "^15.5.4",
    "classnames": "^2.2.5"
  }
}`

if (fs.existsSync(packages_path)) {
    console.error(chalk.red('error'), `the package '${cmd.name}' already exists! \n\n      ${chalk.cyan('try "yarn delete [(name|@type/name)]" if you want to drop it')} \n`)
    process.exit(1)
}

mkdirp.sync(packages_path)
updateComponentList()
const Component = cmd.isStateLess ? stateless_component : normal_component
fs.writeFile(`${packages_path}/index.jsx`, Component, 'utf8', err => { if (err) throw (err) })
fs.writeFile(`${packages_path}/test.jsx`, test_file, 'utf8', err => { if (err) throw (err) })
fs.writeFile(`${packages_path}/style.css`, style_file, 'utf8', err => { if (err) throw (err) })
fs.writeFile(`${packages_path}/README.md`, readme, 'utf8', err => { if (err) throw (err) })
fs.writeFile(`${packages_path}/package.json`, package_file, 'utf8', err => { if (err) throw (err) })

let tree = '-'
if (cmd.type) {
    tree += `-${cmd.type}\n \``
}
tree += `-${cmd.name}
 ${cmd.type ? ' ' : ''}|-index.jsx
 ${cmd.type ? ' ' : ''}|-test.jsx
 ${cmd.type ? ' ' : ''}|-style.css
 ${cmd.type ? ' ' : ''}|-package.json
 ${cmd.type ? ' ' : ''}\`-README.md`
console.log(chalk.green(`\n[file] create ${upper_component_name} success \n${tree}`))