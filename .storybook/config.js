import React from 'react'
import { configure, setAddon } from '@storybook/react'
import infoAddon from '../helper/addon-info'
import { setOptions } from '@storybook/addon-options'

setAddon(infoAddon)
setOptions({
    name: 'xian',
    url: 'https://github.com/Hesiir/xian.git',
    goFullScreen: false,
    showLeftPanel: true,
    showDownPanel: true,
    showSearchBox: false,
    downPanelInRight: true,
})

configure(() => require('./stories'), module)