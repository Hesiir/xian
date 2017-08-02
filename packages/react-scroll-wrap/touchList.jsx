import React, { Component } from 'react'
import { string, func, bool, number, object } from 'prop-types'
import classNames from 'classnames/bind'
import ScrollWrap from './core'
import style from './style.css'

const S = classNames.bind(style)
class TouchList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.dom
    this.refresh = {
      type: null,
      leng: 0
    }
  }

  static propTypes = {
    classname: string,
    disablePointer: bool,
    startX: number,
    startY: number,
    // Note that scrollX/Y: true has the same effect as overflow: auto. Setting one direction to false helps to spare some checks and thus CPU cycles
    scrollX: bool,
    scrollY: bool,
    directionLockThreshold: number,
    // TODO: ??
    momentum: bool,
    freeScroll: bool,
    scrollbars: bool,
    probeType: number,
    // When not in use the scrollbar fades away. Leave this to false to spare resources
    fadeScrollbars: bool,
    // The scrollbar becomes draggable and user can interact with it.
    interactiveScrollbars: bool,
    resizeScrollbars: bool,
    // 
    shrinkScrollbars: bool,

    bounce: bool,
    bounceTime: number,
    bounceEasing: string,

    preventDefault: bool,
    preventDefaultException: object,
    // TODO: ??
    eventPassthrough: string,
    keyBindings: bool,
    invertWheelDirection: bool,
    mouseWheel: bool,
    tap: bool,

    HWCompositing: bool,
    useTransition: bool,
    bindToWrapper: bool,

    onScroll: func,
    dropDownRefresh: func,
    loadMoreValve: number,
    loadMore: func
  }

  static defaultProps = {
    startX: 0,
    startY: 0,
    scrollY: true,
    directionLockThreshold: 5,
    momentum: true,

    bounce: true,
    bounceTime: 600,
    bounceEasing: '',
    // Normally when you start scrolling in one direction the other is locked
    freeScroll: false,
    resizeScrollbars: false,

    preventDefault: true,
    // increaes performance by add translateZ(0)
    HWCompositing: true,
    // android >= 4.4 IE >= 10, commond to us transition, better effect
    useTransition: true,
    tap: false,
    refreshView: (type, leng) => {
      let text = ''
      let h = '64px'
      switch(type){
        case 'loading':
          text = 'Todo refresh'
          break;
        case 'done':
          text = 'now to refresh'
      }
      console.log(text)
      return `<div style="position: absolute; top: -${h}; height: ${h}; transform: translate(0, -${h}px)">
          ${text}
        </div>`
    }
  }

  componentDidMount(){
    this.dom = this.refs.scroller.refs.wrapper
    console.log(this)
  }

  onScrollHandlder = (pos) => {
    this.refresh.leng = pos.y
    if (pos.y > 0) {
      this.refresh.type = pos.y > 30 ? 'done' : 'loading'
    }
    let child = document.createElement('div')
    child.setAttribute('id', 'refresh')
    child.innerHTML = this.props.refreshView(this.refresh.type, this.refresh.leng)
    this.dom && !document.getElementById('refresh') && this.dom.insertBefore(child, this.refs.scroller.refs.scroller)
  }

  render() {
    const { classname, children } = this.props
    return (<ScrollWrap ref='scroller' className={S(classname)}
      onScroll={this.onScrollHandlder}
      probeType={3}
      useTransition={false}
    >{children}</ScrollWrap>)
  }
}

export default TouchList
