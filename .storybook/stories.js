import React from 'react'
import { storiesOf, action } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { withKnobs } from '@storybook/addon-knobs'
import Markdown from 'storybook-readme/components/markdown'
// import { WithNotes } from '@kadira/storybook-addon-notes'
import keys from 'lodash/keys'

let components = require('../scripts/component_list.json').components

storiesOf('Welcome', module)
    .add('README', () => React.createElement(Markdown, {
        onClick: action('welcome'),
        source: require(`../README.md`)
    }, null))

components.map((component, index) => {
    let story = require(`../packages/${component.component}/test`).default
    story(storiesOf)
})