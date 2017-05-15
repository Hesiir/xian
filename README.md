# Xian [![Build Status](https://travis-ci.org/Hesiir/xian.svg?branch=master)](https://travis-ci.org/Hesiir/xian)
---  

Xian is a collection of React(ReactNative) component with awesome UI dev-environment by **[React Storybook](https://github.com/storybooks/react-storybook)**  

> React Storybook is a UI development environment for your React components. With it, you can visualize different states of your UI components and develop them interactively.  

## Getting Started

``` bash
  yarn && yarn start
```

## Docs & Help

 - [add a new component](#add-a-new-component)
 - [use actions logger](#use-actions-logger)
 - [use route](#use-route)
 - [keyboard shortcuts](#keyboard-shortcuts)  

### add a new component

``` bash
  yarn create [(@type/name)]
```

### use actions logger

Import the ```action``` function and use it to create actions handlers. When creating action handlers, provide a name to make it easier to identify
``` javascript
  import { action } from '@kadira/storybook'

  const Banner = (props) => <div onClick={action('banner click', handle => handle)}>
    {props.children}
  </div>
```

### use route

### Keyboard Shortcuts

⌘ ⇧ P/  ⌃ ⇧ PToggle Search Box  
⌘ ⇧ J/  ⌃ ⇧ JToggle Action Logger position  
⌘ ⇧ F/  ⌃ ⇧ FToggle Fullscreen Mode  
⌘ ⇧ L/  ⌃ ⇧ LToggle Left Panel  
⌘ ⇧ D/  ⌃ ⇧ DToggle Down Panel  
⌘ ⇧ →/  ⌃ ⇧ →Next Story  
⌘ ⇧ ←/  ⌃ ⇧ ←Previous Story  
