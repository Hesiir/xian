import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import withReadme from 'storybook-readme/with-readme'
import { withKnobs } from '@kadira/storybook-addon-knobs'
import Markdown from 'storybook-readme/components/markdown'
// import { WithNotes } from '@kadira/storybook-addon-notes'
import keys from 'lodash/keys'

let componentsTest = new Map()
let components = require('../scripts/component_list.json').components

storiesOf('Welcome', module)
    .add('README', () => React.createElement(Markdown, {
        onClick: action('welcome'),
        source: require(`../README.md`)
    }, null))

components.map((component, index) => {
    // const path = component.type ? `${component.type}/${component.component}` : component.component
    // let cmps$index = require(`../packages/${path}/test`)
    // let readme = require(`../packages/${path}/README.md`) || null
    // let father$index
    // keys(cmps$index).forEach(cmp => {
    //     let father = father$index || storiesOf(`${component.component}`, module).addDecorator(withKnobs)
    //     const Cmp = cmps$index[cmp]
    //     father.addWithInfo(`${cmp}`, withReadme(readme, () => < Cmp / > ))
    // })

    const path = component.type ? `@${component.type}/${component.component}` : component.component
    let story = require(`../packages/${path}/test`).default
    story(storiesOf)
})