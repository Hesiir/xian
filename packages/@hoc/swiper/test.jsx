import React, { Component } from 'react'
import { action, decorateAction } from '@kadira/storybook-addon-actions'
import { withKnobs, text } from '@kadira/storybook-addon-knobs'
import Swiper from './index'

export default (storybook) => {
  storybook('Swiper', module)
    .addDecorator(withKnobs)
    .addWithInfo('basic use', () => (<Swiper>{text('name', 'simple use')}</Swiper>), { header: false, inline: true })
}

