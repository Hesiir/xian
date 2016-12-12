import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Welcome from './Welcome';
import _ from 'lodash'

let componentsTest = new Map();
let components = require('../helper/component_list.json').components;

function self(self){
  self();
}

components.map((component, index) => {
  let cmps$index = require(`../lib/${component.type}.${component.component}/test`);
  let father$index;
  _.keys(cmps$index).forEach(cmp => {
    let father = father$index || storiesOf(`${component.component}`, module);
    console.log(father)
    father.add(`${cmp}`, () => <cmp />);
  })
})
