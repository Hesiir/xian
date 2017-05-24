import React, { Component } from 'react'
import { action, decorateAction } from '@kadira/storybook-addon-actions'
import { withKnobs, text } from '@kadira/storybook-addon-knobs'
import TouchList from './touchList'
import Swiper from './swiper'

export default (storybook) => {
  storybook('TouchList', module)
    .addDecorator(withKnobs)
    .addWithInfo('basic use', () => (<div style={{
      width: '200px',
      height: '300px',
      overflow: 'hidden'
    }}>
      <TouchList>{text('name', 'ScrollMagic takes an object oriented approach using a controller for each scroll container and attaching multiple scenes defining what should happen at what part of the page. While this offers a great deal of control, it might be a little confusing, especially if you\'re just starting out with javascript.If the above points are not crucial for you and you are just looking for a simple solution to implement css animations I would strongly recommend taking a look at the awesome skrollr project. It almost solely relies on element attributes and thus requires minimal to no javascript knowledge.ScrollMagic takes an object oriented approach using a controller for each scroll container and attaching multiple scenes defining what should happen at what part of the page. While this offers a great deal of control, it might be a little confusing, especially if you\'re just starting out with javascript.If the above points are not crucial for you and you are just looking for a simple solution to implement css animations I would strongly recommend taking a look at the awesome skrollr project. It almost solely relies on element attributes and thus requires minimal to no javascript knowledge.ScrollMagic takes an object oriented approach using a controller for each scroll container and attaching multiple scenes defining what should happen at what part of the page. While this offers a great deal of control, it might be a little confusing, especially if you\'re just starting out with javascript.If the above points are not crucial for you and you are just looking for a simple solution to implement css animations I would strongly recommend taking a look at the awesome skrollr project. It almost solely relies on element attributes and thus requires minimal to no javascript knowledge.ScrollMagic takes an object oriented approach using a controller for each scroll container and attaching multiple scenes defining what should happen at what part of the page. While this offers a great deal of control, it might be a little confusing, especially if you\'re just starting out with javascript.If the above points are not crucial for you and you are just looking for a simple solution to implement css animations I would strongly recommend taking a look at the awesome skrollr project. It almost solely relies on element attributes and thus requires minimal to no javascript knowledge.ScrollMagic takes an object oriented approach using a controller for each scroll container and attaching multiple scenes defining what should happen at what part of the page. While this offers a great deal of control, it might be a little confusing, especially if you\'re just starting out with javascript.If the above points are not crucial for you and you are just looking for a simple solution to implement css animations I would strongly recommend taking a look at the awesome skrollr project. It almost solely relies on element attributes and thus requires minimal to no javascript knowledge.ScrollMagic takes an object oriented approach using a controller for each scroll container and attaching multiple scenes defining what should happen at what part of the page. While this offers a great deal of control, it might be a little confusing, especially if you\'re just starting out with javascript.If the above points are not crucial for you and you are just looking for a simple solution to implement css animations I would strongly recommend taking a look at the awesome skrollr project. It almost solely relies on element attributes and thus requires minimal to no javascript knowledge.')}</TouchList>
    </div>), { header: false, inline: true })
  storybook('Swiper', module)
    .addDecorator(withKnobs)
    .addWithInfo('basic use', () => (<div style={{
      width: '200px',
      overflow: 'hidden'
    }}>
      <Swiper loadMore={() => alert('go!')}>
        <div style={{ width: '50px', height: '50px', backgroundColor: 'green', margin: '4px', display: 'inline-block' }}>card</div>
        <div style={{ width: '50px', height: '50px', backgroundColor: 'green', margin: '4px', display: 'inline-block' }}>card</div>
        <div style={{ width: '50px', height: '50px', backgroundColor: 'green', margin: '4px', display: 'inline-block' }}>card</div>
        <div style={{ width: '50px', height: '50px', backgroundColor: 'green', margin: '4px', display: 'inline-block' }}>card</div>
        <div style={{ width: '50px', height: '50px', backgroundColor: 'green', margin: '4px', display: 'inline-block' }}>card</div>
        <div style={{ width: '50px', height: '50px', backgroundColor: 'green', margin: '4px', display: 'inline-block' }}>card</div>
      </Swiper>
    </div>), { header: false, inline: true })
}

