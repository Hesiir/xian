import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import withReadme from 'storybook-readme/with-readme';
import { withKnobs } from '@kadira/storybook-addon-knobs';
import Markdown from 'storybook-readme/components/markdown';
// import { WithNotes } from '@kadira/storybook-addon-notes';
import _ from 'lodash';

let componentsTest = new Map();
let components = require('../helper/component_list.json').components;

storiesOf('Welcome', module)
  .add('README', () => <Markdown onClick={action('welcome')} source={require(`../README.md`)} />)

components.map((component, index) => {
  let cmps$index = require(`../lib/${component.type}.${component.component}/test`);
  let readme = require(`../src/${component.type}.${component.component}/README.md`) || null;
  let father$index;
  _.keys(cmps$index).forEach(cmp => {
    let father = father$index || storiesOf(`${component.component}`, module).addDecorator(withKnobs);
    const Cmp = cmps$index[cmp];
    father.addWithInfo(`${cmp}`, withReadme(readme, () => <Cmp />));
  })
})
