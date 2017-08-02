import React, { Component } from 'react'
import { string, func, bool, number, object } from 'prop-types'
import classNames from 'classnames/bind'
import Utils, { rAF } from './utils'
import style from './style.css'

const S = classNames.bind(style)
const U = new Utils()
class Scroller extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scroller: {},
      wrapper: {
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }
    }

    this.x = 0
    this.y = 0
    this.directionX = 0
    this.directionY = 0
    this.isAnimating = false
    this._events = {}

    this.HWCompositing = this.props.HWCompositing
    this.translateZ = U.hasPerspective && this.HWCompositing ? ' translateZ(0)' : ''
    // android >= 4.4 IE >= 10, commond to us transition, better effect, when onScroll is in use, switch to 'requestAnimationFrame'
    this.useTransition = U.hasTransition && !this.props.onScroll
    this.eventPassthrough = this.props.eventPassthrough === true ? 'vertical' : this.props.eventPassthrough
    this.preventDefault = !this.eventPassthrough && this.props.preventDefault

    // If you want eventPassthrough I have to lock one of the axes
    this.scrollY = this.eventPassthrough == 'vertical' ? false : this.props.scrollY
    this.scrollX = this.eventPassthrough == 'horizontal' ? false : this.props.scrollX

    // With eventPassthrough we also need lockDirection mechanism
    this.freeScroll = this.props.freeScroll && !this.eventPassthrough
    this.directionLockThreshold = this.eventPassthrough ? 0 : this.props.directionLockThreshold
    this.bounceEasing = typeof this.props.bounceEasing == 'string' ? U.ease[this.props.bounceEasing] || U.ease.circular : this.props.bounceEasing
    this.resizePolling = this.props.resizePolling === undefined ? 60 : this.props.resizePolling
    this.tap = this.props.tap ? 'tap' : null
    this.startX = this.props.startX
    this.startY = this.props.startY
    this.momentum = this.props.momentum

    this.bounce = this.props.bounce
    this.bounceTime = this.props.bounceTime
    this.preventDefaultException = this.props.preventDefaultException
    this.bindToWrapper = this.props.bindToWrapper
    this.handleEvent = this.handleEvent

    this.callback = {
      x: this.x,
      y: this.y,
      distX: this.distX,
      distY: this.distY,
      startTime: this.startTime,
      endTime: this.endTime,
      pointX: this.pointX,
      pointY: this.pointY,
      startX: this.startX,
      startY: this.startY,
      scrollerWidth: this.scrollerWidth,
      scrollerHeight: this.scrollerHeight,
      wrapperWidth: this.wrapperWidth,
      wrapperHeight: this.wrapperHeight,
      resizePolling: this.resizePolling,
      maxScrollX: this.maxScrollX,
      maxScrollY: this.maxScrollY,
      isMoving: this.moved
    }
  }

  static propTypes = {
    classname: string,
    disableTouch: bool,
    disableMouse: bool,
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
    // When not in use the scrollbar fades away. Leave this to false to spare resources
    fadeScrollbars: bool,
    // The scrollbar becomes draggable and user can interact with it.
    interactiveScrollbars: bool,
    resizeScrollbars: bool,
    // 
    shrinkScrollbars: bool,
    strictEvent: bool,

    bounce: bool,
    bounceTime: number,
    bounceEasing: string,

    preventDefault: bool,
    preventDefaultException: object,
    // TODO: ??
    eventPassthrough: string | bool,
    keyBindings: bool,
    invertWheelDirection: bool,
    mouseWheel: bool,
    tap: bool,

    HWCompositing: bool,
    bindToWrapper: bool,

    onScroll: func,
    onScrollEnd: func,
    onScrollStop: func,
    beforeScrollStart: func,
    scrollStart: func,

    needBefore: bool,
    needAfter: bool,
  }

  static defaultProps = {
    startX: 0,
    startY: 0,
    scrollY: true,
    directionLockThreshold: 5,
    momentum: true,

    bounce: false,
    bounceTime: 600,
    bounceEasing: '',
    // Normally when you start scrolling in one direction the other is locked
    freeScroll: false,
    resizeScrollbars: false,

    preventDefault: true,
    // increaes performance by add translateZ(0)
    HWCompositing: true,

    disableTouch: U.hasPointer || !U.hasTouch,
    disableMouse: U.hasPointer || U.hasTouch,
    preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },
    bindToWrapper: typeof window.onmousedown === "undefined",
    tap: false,

    onScroll: (pos) => { console.log('is moving ->', pos.isMoving) }
  }

  componentDidMount() {
    this._initScroll()
    console.log(this.props.onScroll)
  }

  componentWillReciveProps(nextProps) { }

  _initScroll = () => {
    this.initEvents()
    this.refresh()
    this.scrollTo(this.startX, this.startY)
    this.enabled = true
  }

  initEvents = (remove) => {
    let eventType = remove ? U.removeEvent : U.addEvent,
      target = this.bindToWrapper ? this.wrapper : window

    eventType(window, 'orientationchange', this)
    eventType(window, 'resize', this)

    if (this.click) eventType(this.wrapper, 'click', this, true)

    // register pointer event when it's useable
    if (U.hasPointer) {
      eventType(this.wrapper, U.__prefixPointerEvent('pointerdown'), this)
      eventType(target, U.__prefixPointerEvent('pointermove'), this)
      eventType(target, U.__prefixPointerEvent('pointercancel'), this)
      eventType(target, U.__prefixPointerEvent('pointerup'), this)
    } else if (U.hasTouch) {
      eventType(this.wrapper, 'touchstart', this)
      eventType(target, 'touchmove', this)
      eventType(target, 'touchcancel', this)
      eventType(target, 'touchend', this)
    } else {
      eventType(this.wrapper, 'mousedown', this)
      eventType(target, 'mousemove', this)
      eventType(target, 'mousecancel', this)
      eventType(target, 'mouseup', this)
    }

    eventType(this.scroller, 'transitionend', this)
    eventType(this.scroller, 'webkitTransitionEnd', this)
    eventType(this.scroller, 'oTransitionEnd', this)
    eventType(this.scroller, 'MSTransitionEnd', this)

    if (this.props.onScrollStop) this.on('scrollStop', () => {
      this.props.onScrollStop(this)
    })
  }

  setCallback = (content) => ({
    x: content.x,
    y: content.y,
    distX: content.distX,
    distY: content.distY,
    startTime: content.startTime,
    endTime: content.endTime,
    pointX: content.pointX,
    pointY: content.pointY,
    startX: content.startX,
    startY: content.startY,
    scrollerWidth: content.scrollerWidth,
    scrollerHeight: content.scrollerHeight,
    wrapperWidth: content.wrapperWidth,
    wrapperHeight: content.wrapperHeight,
    resizePolling: content.resizePolling,
    maxScrollX: content.maxScrollX,
    maxScrollY: content.maxScrollY,
    isMoving: content.moved
  })

  on = (type, fn) => {
    if (!this._events[type]) {
      this._events[type] = []
    }

    this._events[type].push(fn)
  }

  off = (type, fn) => {
    if (!this._events[type]) {
      return
    }

    let index = this._events[type].indexOf(fn)

    if (index > -1) {
      this._events[type].splice(index, 1)
    }
  }

  refresh = () => {
    U.getRect(this.state.scroller)		// Force reflow

    let rect = U.getRect(this.scroller)

    this.wrapperWidth = this.wrapper.clientWidth
    this.wrapperHeight = this.wrapper.clientHeight
    this.scrollerWidth = rect.width
    this.scrollerHeight = rect.height
    this.maxScrollX = this.wrapperWidth - this.scrollerWidth
    this.maxScrollY = this.wrapperHeight - this.scrollerHeight

    this.hasHorizontalScroll = this.scrollX && this.maxScrollX < 0
    this.hasVerticalScroll = this.scrollY && this.maxScrollY < 0

    if (!this.hasHorizontalScroll) {
      this.maxScrollX = 0
      this.scrollerWidth = this.wrapperWidth
    }

    if (!this.hasVerticalScroll) {
      this.maxScrollY = 0
      this.scrollerHeight = this.wrapperHeight
    }

    this.endTime = 0
    this.directionX = 0
    this.directionY = 0

    if (U.hasPointer) {
      // The wrapper should have `touchAction` property for using pointerEvent.
      this.wrapper.style[U.style.touchAction] = U.getTouchAction(this.eventPassthrough, true)

      // case. not support 'pinch-zoom'
      // https://github.com/cubiq/iscroll/issues/1118#issuecomment-270057583
      if (!this.wrapper.style[U.style.touchAction]) {
        this.wrapper.style[U.style.touchAction] = U.getTouchAction(this.eventPassthrough, false)
      }
    }
    this.wrapperOffset = U.offset(this.state.scroller)
    this.resetPosition()
  }

  destroy = () => {
    this._initEvents(true)
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = null
    this._execEvent('destroy')
  }

  scrollBy = (x, y, time, easing) => {
    x = this.x + x
    y = this.y + y
    time = time || 0

    this.scrollTo(x, y, time, easing)
  }

  scrollTo = (x, y, time, easing) => {
    easing = easing || U.ease.circular

    this.isInTransition = this.useTransition && time > 0
    let transitionType = this.useTransition && easing.style
    if (!time || transitionType) {
      if (transitionType) {
        this._transitionTimingFunction(easing.style)
        this._transitionTime(time)
      }
      this._translate(x, y)
    } else {
      this._animate(x, y, time, easing.fn)
    }
  }

  scrollToElement = (el, time, offsetX, offsetY, easing) => {
    el = el.nodeType ? el : this.scroller.querySelector(el)

    if (!el) return

    let pos = U.offset(el)

    pos.left -= this.wrapperOffset.left
    pos.top -= this.wrapperOffset.top

    // if offsetX/Y are true we center the element to the screen
    let elRect = U.getRect(el)
    let wrapperRect = U.getRect(this.wrapper)
    if (offsetX === true) {
      offsetX = Math.round(elRect.width / 2 - wrapperRect.width / 2)
    }
    if (offsetY === true) {
      offsetY = Math.round(elRect.height / 2 - wrapperRect.height / 2)
    }

    pos.left -= offsetX || 0
    pos.top -= offsetY || 0

    pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left
    pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top

    time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time

    this.scrollTo(pos.left, pos.top, time, easing)
  }

  resetPosition = (time) => {
    let x = this.x,
      y = this.y;

    time = time || 0

    if (!this.hasHorizontalScroll || this.x > 0) {
      x = 0
    } else if (this.x < this.maxScrollX) {
      x = this.maxScrollX
    }

    if (!this.hasVerticalScroll || this.y > 0) {
      y = 0
    } else if (this.y < this.maxScrollY) {
      y = this.maxScrollY
    }

    if (x == this.x && y == this.y) {
      return false
    }

    this.scrollTo(x, y, time, this.bounceEasing)

    return true
  }

  getComputedPosition = () => {
    let matrix = window.getComputedStyle(this.scroller, null),
      x, y;

    matrix = matrix[U.style.transform].split(')')[0].split(', ')
    x = +(matrix[12] || matrix[4])
    y = +(matrix[13] || matrix[5])

    return { x: x, y: y }
  }

  _transitionEnd = (e) => {
    if (e.target != this.scroller || !this.isInTransition) {
      return
    }

    this._transitionTime()
    if (!this.resetPosition(this.bounceTime)) {
      this.isInTransition = false
      if (this.props.onScrollEnd) this.props.onScrollEnd(this.setCallback(this))
    }
  }

  _start = (e) => {
    // React to left mouse button only
    if (U.eventType[e.type] != 1) {
      // for button property
      // http://unixpapa.com/js/mouse.html
      let button;
      if (!e.which) {
        /* IE case */
        button = (e.button < 2) ? 0 : ((e.button == 4) ? 1 : 2)
      } else {
        /* All others */
        button = e.button
      }
      if (button !== 0) {
        return
      }
    }

    if (!this.enabled || (this.initiated && U.eventType[e.type] !== this.initiated)) {
      return
    }

    if (this.preventDefault && !U.isBadAndroid && !U.preventDefaultException(e.target, this.preventDefaultException)) {
      e.preventDefault()
    }

    let point = e.touches ? e.touches[0] : e,
      pos

    this.initiated = U.eventType[e.type]
    this.moved = false
    this.distX = 0
    this.distY = 0
    this.directionX = 0
    this.directionY = 0
    this.directionLocked = 0

    this.startTime = U.nowTime()

    if (this.useTransition && this.isInTransition) {
      this._transitionTime()
      this.isInTransition = false
      pos = this.getComputedPosition()
      this._translate(Math.round(pos.x), Math.round(pos.y))
      if (this.props.onScrollEnd) this.props.onScrollEnd(this.setCallback(this))
    } else if (!this.useTransition && this.isAnimating) {
      this.isAnimating = false
      if (this.props.onScrollEnd) this.props.onScrollEnd(this.setCallback(this))
    }

    this.startX = this.x
    this.startY = this.y
    this.absStartX = this.x
    this.absStartY = this.y
    this.pointX = point.pageX
    this.pointY = point.pageY

    if (this.props.beforeScrollStart) this.props.beforeScrollStart(this.setCallback(this))
  }

  _move = (e) => {
    if (!this.enabled || U.eventType[e.type] !== this.initiated) {
      return
    }

    if (this.preventDefault) {	// increases performance on Android? TODO: check!
      e.preventDefault()
    }

    let point = e.touches ? e.touches[0] : e,
      deltaX = point.pageX - this.pointX,
      deltaY = point.pageY - this.pointY,
      timestamp = U.nowTime(),
      newX, newY,
      absDistX, absDistY

    this.pointX = point.pageX
    this.pointY = point.pageY

    this.distX += deltaX
    this.distY += deltaY
    absDistX = Math.abs(this.distX)
    absDistY = Math.abs(this.distY)

    // We need to move at least 10 pixels for the scrolling to initiate
    if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
      return
    }

    // If you are scrolling in one direction lock the other
    if (!this.directionLocked && !this.freeScroll) {
      if (absDistX > absDistY + this.directionLockThreshold) {
        this.directionLocked = 'h'		// lock horizontally
      } else if (absDistY >= absDistX + this.directionLockThreshold) {
        this.directionLocked = 'v'		// lock vertically
      } else {
        this.directionLocked = 'n'		// no lock
      }
    }

    if (this.directionLocked == 'h') {
      if (this.eventPassthrough == 'vertical') {
        e.preventDefault()
      } else if (this.eventPassthrough == 'horizontal') {
        this.initiated = false
        return
      }

      deltaY = 0
    } else if (this.directionLocked == 'v') {
      if (this.eventPassthrough == 'horizontal') {
        e.preventDefault()
      } else if (this.eventPassthrough == 'vertical') {
        this.initiated = false
        return
      }

      deltaX = 0
    }

    deltaX = this.hasHorizontalScroll ? deltaX : 0
    deltaY = this.hasVerticalScroll ? deltaY : 0

    newX = this.x + deltaX
    newY = this.y + deltaY

    // Slow down if outside of the boundaries
    if (newX > 0 || newX < this.maxScrollX) {
      newX = this.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX
    }
    if (newY > 0 || newY < this.maxScrollY) {
      newY = this.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY
    }

    this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0
    this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0

    if (!this.moved) {
      if (this.props.scrollStart) this.props.scrollStart(this.setCallback(this))
    }

    this.moved = true
    this._translate(newX, newY)

    if (timestamp - this.startTime > 300) {
      this.startTime = timestamp;
      this.startX = this.x;
      this.startY = this.y;

      if (!this.useTransition) {
        if (this.props.onScroll) this.props.onScroll(this.setCallback(this))
      }
    }

    if (!this.useTransition) {
      if (this.props.onScroll) this.props.onScroll(this.setCallback(this))
    }
  }

  _end = (e) => {
    this._execEvent('scrollStop')
    if (!this.enabled || U.eventType[e.type] !== this.initiated) {
      return
    }

    if (this.preventDefault && !U.preventDefaultException(e.target, this.preventDefaultException)) {
      e.preventDefault()
    }

    let point = e.changedTouches ? e.changedTouches[0] : e,
      momentumX,
      momentumY,
      duration = U.nowTime() - this.startTime,
      newX = Math.round(this.x),
      newY = Math.round(this.y),
      distanceX = Math.abs(newX - this.startX),
      distanceY = Math.abs(newY - this.startY),
      time = 0,
      easing = ''

    this.isInTransition = 0
    this.initiated = 0
    this.endTime = U.nowTime()

    // reset if we are outside of the boundaries
    if (this.resetPosition(this.bounceTime)) {
      return
    }

    this.scrollTo(newX, newY)	// ensures that the last position is rounded

    // we scrolled less than 10 pixels
    if (!this.moved) {
      if (this.tap) {
        U.tap(e, this.tap)
      }

      if (this.click) {
        U.click(e)
      }

      this._execEvent('scrollCancel')
      return
    }

    if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
      this._execEvent('flick')
      return
    }

    // start momentum animation if needed
    if (this.momentum && duration < 300) {
      momentumX = this.hasHorizontalScroll ? U.momentum(this.x, this.startX, duration, this.maxScrollX, this.bounce ? this.wrapperWidth : 0, this.deceleration) : { destination: newX, duration: 0 }
      momentumY = this.hasVerticalScroll ? U.momentum(this.y, this.startY, duration, this.maxScrollY, this.bounce ? this.wrapperHeight : 0, this.deceleration) : { destination: newY, duration: 0 }
      newX = momentumX.destination
      newY = momentumY.destination
      time = Math.max(momentumX.duration, momentumY.duration)
      this.isInTransition = 1
    }

    // INSERT POINT: _end

    if (newX != this.x || newY != this.y) {
      // change easing function when scroller goes out of the boundaries
      if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
        easing = U.ease.quadratic
      }

      this.scrollTo(newX, newY, time, easing)
      return
    }

    if (this.props.onScrollEnd) this.props.onScrollEnd(this.setCallback(this))
  }

  _resize = () => {
    let that = this

    clearTimeout(this.resizeTimeout)

    this.resizeTimeout = setTimeout(function () {
      that.refresh()
    }, this.resizePolling)
  }

  _execEvent = (type) => {
    if (!this._events[type]) {
      return
    }

    let i = 0,
      l = this._events[type].length

    if (!l) {
      return
    }

    for (; i < l; i++) {
      this._events[type][i].apply(this, [].slice.call(arguments, 1))
    }
  }

  _transitionTimingFunction = (easing) => {
    this.setState({
      scroller: Object.assign(this.state.scroller, {
        [U.style.transitionTimingFunction]: easing
      })
    })
    // this.style.scroller[U.style.transitionTimingFunction] = easing
  }

  _transitionTime = (time) => {
    if (!this.useTransition) {
      return
    }
    time = time || 0
    let durationProp = U.style.transitionDuration
    if (!durationProp) {
      return
    }

    this.setState({
      scroller: Object.assign(this.state.scroller, {
        [durationProp]: time + 'ms'
      })
    })
    // this.style.scroller[durationProp] = time + 'ms'

    if (!time && U.isBadAndroid) {
      this.setState({
        scroller: Object.assign(this.state.scroller, {
          [durationProp]: '0.0001ms'
        })
      })
      // this.style.scroller[durationProp] = '0.0001ms'
      // remove 0.0001ms
      let self = this
      rAF(function () {
        if (self.state.scroller[durationProp] === '0.0001ms') {
          this.setState({
            scroller: Object.assign(this.state.scroller, {
              [durationProp]: '0s'
            })
          })
          // self.state.scroller[durationProp] = '0s'
        }
      });
    }
  }

  _translate = (x, y) => {
    console.log('it translate, check is animating', this.isAnimating)
    /* REPLACE START: _translate */
    this.setState({
      scroller: Object.assign(this.state.scroller, {
        [U.style.transform]: 'translate(' + x + 'px,' + y + 'px)' + this.translateZ
      })
    })
    // this.style.scroller[U.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ
    /* REPLACE END: _translate */

    this.x = x
    this.y = y
  }

  _animate = (destX, destY, duration, easingFn) => {
    let that = this,
      startX = this.x,
      startY = this.y,
      startTime = U.nowTime(),
      destTime = startTime + duration;

    function step() {
      let now = U.nowTime(),
        newX, newY,
        easing;

      if (now >= destTime) {
        that.isAnimating = false;
        that._translate(destX, destY);

        if (!that.resetPosition(that.bounceTime)) {
          if (that.props.onScrollEnd) that.props.onScrollEnd(that.setCallback(that))
        }

        return;
      }

      now = (now - startTime) / duration;
      easing = easingFn(now);
      newX = (destX - startX) * easing + startX;
      newY = (destY - startY) * easing + startY;
      that._translate(newX, newY);
      if (that.isAnimating) {
        rAF(step);
      }

      if (!that.useTransition) {
        if (that.props.onScroll) that.props.onScroll(that.setCallback(that))
      }
    }

    this.isAnimating = true
    step()
  }

  handleEvent = (e) => {
    switch (e.type) {
      case 'touchstart':
      case 'pointerdown':
      case 'MSPointerDown':
      case 'mousedown':
        this._start(e);
        // e.stopImmediatePropagation()
        break;
      case 'touchmove':
      case 'pointermove':
      case 'MSPointerMove':
      case 'mousemove':
        this._move(e);
        break;
      case 'touchend':
      case 'pointerup':
      case 'MSPointerUp':
      case 'mouseup':
      case 'touchcancel':
      case 'pointercancel':
      case 'MSPointerCancel':
      case 'mousecancel':
        this._end(e);
        break;
      case 'orientationchange':
      case 'resize':
        this._resize();
        break;
      case 'transitionend':
      case 'webkitTransitionEnd':
      case 'oTransitionEnd':
      case 'MSTransitionEnd':
        this._transitionEnd(e);
        break;
      case 'wheel':
      case 'DOMMouseScroll':
      case 'mousewheel':
        this._wheel(e);
        break;
      case 'keydown':
        this._key(e);
        break;
      case 'click':
        if (this.enabled && !e._constructed) {
          e.preventDefault();
          e.stopPropagation();
        }
        break;
    }
  }

  render() {
    const { classname, children, needBefore, needAfter } = this.props
    return (<div ref={(wrapper) => this.wrapper = wrapper} className={S('rscroll-wrapper')} style={this.state.wrapper}>
      {needBefore && <div ref="before" className={S('before')}></div>}
      <div ref={(scroller) => this.scroller = scroller} className={S('wrapper', classname)} style={this.state.scroller}>{children}</div>
      {needAfter && <div ref="after" className={S('after')}></div>}
    </div>)
  }
}

export default Scroller

