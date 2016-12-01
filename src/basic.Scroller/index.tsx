///////////////////////////////////////////////////////////////////////////////////
//  Copyright 2016-present, Jnfinity, Inc.                                       //
//  All rights reserved.                                                         //
//                                                                               //
//  This source code is licensed under the BSD-style license found in the        //
//  LICENSE file in the root directory of this source tree. An additional grant  //
//  of patent rights can be found in the PATENTS file in the same directory.     //
//                                                                               //
//  @Author Orlo Wang                                                            //
//  @Email  ow.cc@outlook.com                                                    //
//  @providesComponent Scroller                                                     //
///////////////////////////////////////////////////////////////////////////////////

import * as React from 'react';
import {
  Component,
  Props,
  PropTypes
} from 'react';
import * as cn from 'classnames';
import me from './func';

const wrapper_style = {
  position: 'relative',
  height: '100%',
  width: '100%',
  overflow: 'hidden'
};

const scroller_style = {
  position: 'relative',
  height: '100%',
};

const inner_style = {
  paddingLeft: 0,
  marginTop: 0,
  marginBottom: 0
};

interface ScrollerStatus {
  scrollerStyle?: Object,
  x?: number,
  y?: number,
  directionX?: number,
  directionY?: number,
  events?: Object,
  wrapperWidth?: number,
  wrapperHeight?: number,
  scrollerWidth?: number,
  scrollerHeight?: number,
  maxScrollX?: number,
  maxScrollY?: number,
  hasHorizontalScroll?: boolean,
  hasVerticalScroll?: boolean,
  endTime?: number,
  wrapperOffset?: Object,
  enabled?: boolean,
  indicators?: Object[],
  isInTransition?: boolean|number,
  isAnimating?: boolean,
  translateZ?: string,

  // scroll status
  initiated?: boolean,
  moved?: boolean,

  distX?: number,
  distY?: number,
  startX?: number,
  startY?: number,
  absStartX?: number,
  absStartY?: number,
  pointX?: number,
  pointY?: number,
	scrollX?: boolean|number,
	scrollY?: boolean|number,
  directionLocked?: number|string|Function,
  startTime?: number,
	freeScroll?: boolean,
	directionLockThreshold?: boolean|number,
	bounceEasing?: string,
	eventPassthrough?: boolean|string,
	preventDefault?: boolean
}

interface ScrollerProps extends Props<Scroller>{
  disablePointer?: boolean,
  disableTouch?: boolean,
  disableMouse?: boolean,
  startX?: number,
  startY?: number,
  scrollX?: boolean,
  scrollY?: boolean,
  directionLockThreshold?: number,
  momentum?: boolean,

  bounce?: boolean,
  bounceTime?: number,
  bounceEasing?: string,

  preventDefault?: boolean,
  preventDefaultException?: Object,
  eventPassthrough?: boolean | string,

  freeScroll?: boolean,
  HWCompositing?: boolean,
  useTransition?: boolean,
  useTransform?: boolean,
  bindToWrapper?: boolean,

  mouseWheel?: boolean,
  keyBindings?: boolean,
  invertWheelDirection?: boolean,
  tap?: boolean | string,

  resizePolling?: number,
  click?: boolean,
  indicators?: Object,
  snap?: boolean,

  scrollbars?: boolean | string,       // 'custom'-- CSS<.iScrollHorizontalScrollbar/.iScrollVerticalScrollbar/.iScrollIndicator/.iScrollBothScrollbars>
  fadeScrollbars?: boolean,
  interactiveScrollbars?: boolean,
  resizeScrollbars?: boolean,
  shrinkScrollbars?: boolean | string,
  className?: string
}

export default class Scroller extends Component<ScrollerProps, ScrollerStatus>{
  constructor(props){
    super(props);
    this.state = {
      scrollerStyle: {
				position: 'relative',
				listStyleType: 'none',
				margin: 0,
				padding: 0,
			},
      x: 0,
      y: 0,
      directionX: 0,
      directionY: 0,
      events: {},
      indicators: [],
      translateZ: this.props.HWCompositing && me.hasPerspective ? ' translateZ(0)' : '',
			scrollX: this.props.eventPassthrough == 'horizontal' ? false : this.props.scrollX,
			scrollY: this.props.eventPassthrough == 'vertical' ? false : this.props.scrollY,
			bounceEasing: me.ease[this.props.bounceEasing] || me.ease.circular,
			eventPassthrough: this.props.eventPassthrough === true ? 'vertical' : this.props.eventPassthrough,
			preventDefault: !this.props.eventPassthrough && this.props.preventDefault
    };

    // this.useTransition = me.hasTransition && this.props.useTransition;
    // this.useTransform = me.hasTransform && this.props.useTransform;

    // this.eventPassthrough = this.props.eventPassthrough === true ? 'vertical' : this.props.eventPassthrough;
    // this.preventDefault = !this.props.eventPassthrough && this.props.preventDefault;

    // If you want eventPassthrough I have to lock one of the axes
    // this.scrollY = this.props.eventPassthrough == 'vertical' ? false : this.props.scrollY;
    // this.scrollX = this.props.eventPassthrough == 'horizontal' ? false : this.props.scrollX;

    // With eventPassthrough we also need lockDirection mechanism
    // this.freeScroll = this.props.freeScroll && !this.props.eventPassthrough;
    // this.directionLockThreshold = this.props.eventPassthrough ? 0 : this.props.directionLockThreshold;

    // this.bounceEasing = typeof this.props.bounceEasing == 'string' ? me.ease[this.props.bounceEasing] || me.ease.circular : this.props.bounceEasing;

    // this.resizePolling = this.props.resizePolling;
    // this.tap = this.props.tap === true ? 'tap' : this.props.tap;
    // if (!this.props.useTransition && !this.props.useTransform) {
    //   if(!(/relative|absolute/i).test(this.state.scrollerStyle.position)) {
    //     this.state.scrollerStyle.position = "relative";
    //   }
    // }
  }

  public static defaultProps: ScrollerProps = {
    disablePointer : !me.hasPointer,
    disableTouch : me.hasPointer || !me.hasTouch,
    disableMouse : me.hasPointer || me.hasTouch,
    startX: 0,
    startY: 0,
    scrollY: true,
    directionLockThreshold: 5,
    momentum: true,

    bounce: true,
    bounceTime: 600,
    bounceEasing: '',

    preventDefault: true,
    preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

    resizePolling: 60,

    HWCompositing: true,
    useTransition: true,
    useTransform: true,
    bindToWrapper: typeof window.onmousedown === "undefined",
    className: null
  }

  componentDidMount(){
    this.__init();
    this.refresh();
    this.scrollTo(this.props.startX, this.props.startY);
    this.enable();
  }

  refs : {
    [key: string]: (Element);
    wrapper: (HTMLDivElement);
    scroller: (HTMLDivElement);
  }

  __init = () => {
    this.__initEvents();
    if ( this.props.scrollbars || this.props.indicators ) {
			this.__initIndicators();
		}

		if ( this.props.mouseWheel ) {
			this.__initWheel();
		}

		if ( this.props.snap ) {
			this.__initSnap();
		}

		if ( this.props.keyBindings ) {
			this.__initKeys();
		}
  }

  __initIndicators = () => {
    let interactive = this.props.interactiveScrollbars,
			customStyle = typeof this.props.scrollbars != 'string',
			indicators = [],
			indicator;

		let that = this;

		this.indicators = [];

		if ( this.props.scrollbars ) {
			// Vertical scrollbar
			if ( this.props.scrollY ) {
				indicator = {
					el: createDefaultScrollbar('v', interactive, this.props.scrollbars),
					interactive: interactive,
					defaultScrollbars: true,
					customStyle: customStyle,
					resize: this.props.resizeScrollbars,
					shrink: this.props.shrinkScrollbars,
					fade: this.props.fadeScrollbars,
					listenX: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
			}

			// Horizontal scrollbar
			if ( this.props.scrollX ) {
				indicator = {
					el: createDefaultScrollbar('h', interactive, this.props.scrollbars),
					interactive: interactive,
					defaultScrollbars: true,
					customStyle: customStyle,
					resize: this.props.resizeScrollbars,
					shrink: this.props.shrinkScrollbars,
					fade: this.props.fadeScrollbars,
					listenY: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
			}
		}

		if ( this.props.indicators ) {
			// TODO: check concat compatibility
			indicators = indicators.concat(this.props.indicators);
		}

		for ( let i = indicators.length; i--; ) {
			this.indicators.push( new Indicator(this, indicators[i]) );
		}

		// TODO: check if we can use array.map (wide compatibility and performance issues)
		function _indicatorsMap (fn) {
			if (that.indicators) {
				for ( let i = that.indicators.length; i--; ) {
					fn.call(that.indicators[i]);
				}
			}
		}

		if ( this.props.fadeScrollbars ) {
			this.on('scrollEnd', function () {
				_indicatorsMap(function () {
					this.fade();
				});
			});

			this.on('scrollCancel', function () {
				_indicatorsMap(function () {
					this.fade();
				});
			});

			this.on('scrollStart', function () {
				_indicatorsMap(function () {
					this.fade(1);
				});
			});

			this.on('beforeScrollStart', function () {
				_indicatorsMap(function () {
					this.fade(1, true);
				});
			});
		}


		this.on('refresh', function () {
			_indicatorsMap(function () {
				this.refresh();
			});
		});

		this.on('destroy', function () {
			_indicatorsMap(function () {
				this.destroy();
			});

			delete this.indicators;
		});
  }
  __initWheel = () => {}
  __initSnap = () => {}
  __initKeys = () => {}

  __initEvents = (remove?:boolean) => {
    let eventType = remove ? me.removeEvent : me.addEvent,
			target = this.props.bindToWrapper ? this.refs.wrapper : window;

		eventType(window, 'orientationchange', this);
		eventType(window, 'resize', this);

		if ( this.props.click ) {
			eventType(this.refs.wrapper, 'click', this, true);
		}

		if ( !this.props.disableMouse ) {
			eventType(this.refs.wrapper, 'mousedown', this);
			eventType(target, 'mousemove', this);
			eventType(target, 'mousecancel', this);
			eventType(target, 'mouseup', this);
		}

		if ( me.hasPointer && !this.props.disablePointer ) {
			eventType(this.refs.wrapper, me.prefixPointerEvent('pointerdown'), this);
			eventType(target, me.prefixPointerEvent('pointermove'), this);
			eventType(target, me.prefixPointerEvent('pointercancel'), this);
			eventType(target, me.prefixPointerEvent('pointerup'), this);
		}

		if ( me.hasTouch && !this.props.disableTouch ) {
			eventType(this.refs.wrapper, 'touchstart', this);
			eventType(target, 'touchmove', this);
			eventType(target, 'touchcancel', this);
			eventType(target, 'touchend', this);
		}

		eventType(this.refs.scroller, 'transitionend', this);
		eventType(this.refs.scroller, 'webkitTransitionEnd', this);
		eventType(this.refs.scroller, 'oTransitionEnd', this);
		eventType(this.refs.scroller, 'MSTransitionEnd', this);
  }

  __destroy = () => {
		this.__initEvents(true);
		clearTimeout(this.resizeTimeout);
 		this.resizeTimeout = null;
		this.__execEvent('destroy');
	}

  handleEvent = (e) => {
    switch ( e.type ) {
			case 'touchstart':
			case 'pointerdown':
			case 'MSPointerDown':
			case 'mousedown':
				this.__start(e);
				break;
			case 'touchmove':
			case 'pointermove':
			case 'MSPointerMove':
			case 'mousemove':
				this.__move(e);
				break;
			case 'touchend':
			case 'pointerup':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'pointercancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				this.__end(e);
				break;
			case 'orientationchange':
			case 'resize':
				this.__resize();
				break;
			case 'transitionend':
			case 'webkitTransitionEnd':
			case 'oTransitionEnd':
			case 'MSTransitionEnd':
				this.__transitionEnd(e);
				break;
			case 'wheel':
			case 'DOMMouseScroll':
			case 'mousewheel':
				this.__wheel(e);
				break;
			case 'keydown':
				this.__key(e);
				break;
			case 'click':
				if ( this.state.enabled && !e._constructed ) {
					e.preventDefault();
					e.stopPropagation();
				}
				break;
		}
  }

  __start = (e) => {
		// React to left mouse button only
		if ( me.eventType[e.type] != 1 ) {
		  // for button property
		  // http://unixpapa.com/js/mouse.html
		  let button;
	    if (!e.which) {
	      /* IE case */
	      button = (e.button < 2) ? 0 :
	               ((e.button == 4) ? 1 : 2);
	    } else {
	      /* All others */
	      button = e.button;
	    }
			if ( button !== 0 ) {
				return;
			}
		}

		if ( !this.state.enabled || (this.state.initiated && me.eventType[e.type] !== this.state.initiated) ) {
			return;
		}

		if ( this.props.preventDefault && !me.isBadAndroid && !me.preventDefaultException(e.target, this.props.preventDefaultException) ) {
			e.preventDefault();
		}

		let point = e.touches ? e.touches[0] : e, pos;

		// this.state.initiated	= me.eventType[e.type];
		// this.moved		= false;
		// this.distX		= 0;
		// this.distY		= 0;
		// this.directionX = 0;
		// this.directionY = 0;
		// this.directionLocked = 0;

		// this.startTime = me.getTime();
    
		if ( this.props.useTransition && this.state.isInTransition ) {
			this.__transitionTime();
      this.setState({
        isInTransition: false
      });
			// this.state.isInTransition = false;
			pos = this.getComputedPosition();
			this.__translate(Math.round(pos.x), Math.round(pos.y));
			this.__execEvent('scrollEnd');
		} else if ( !this.props.useTransition && this.state.isAnimating ) {
			// this.state.isAnimating = false;
      this.setState({
        isAnimating: false
      });
			this.__execEvent('scrollEnd');
		}

		// this.startX    = this.state.x;
		// this.startY    = this.state.y;
		// this.absStartX = this.state.x;
		// this.absStartY = this.state.y;
		// this.pointX    = point.pageX;
		// this.pointY    = point.pageY;

    this.setState(Object.assign(this.state, {
      initiated: me.eventType[e.type],
      moved: false,
      distX: 0,
      distY: 0,
      startX: this.state.x,
      startY: this.state.y,
      directionX: 0,
      directionY: 0,
      absStartX: this.state.x,
      absStartY: this.state.y,
      pointX: point.pageX,
      pointY: point.pageY,
      directionLocked: 0,
      startTime: me.getTime()
    }))

		this.__execEvent('beforeScrollStart');
	}

	__move = (e) => {
		if ( !this.state.enabled || me.eventType[e.type] !== this.state.initiated ) {
			return;
		}

		if ( this.props.preventDefault ) {	// increases performance on Android? TODO: check!
			e.preventDefault();
		}

		let point		= e.touches ? e.touches[0] : e,
			deltaX		= point.pageX - this.state.pointX,
			deltaY		= point.pageY - this.state.pointY,
      plusX, plusY,
			timestamp	= me.getTime(),
			newX, newY,
			absDistX, absDistY;

		// this.pointX		= point.pageX;
		// this.pointY		= point.pageY;
		
    plusX += deltaX;
    plusY += deltaY;

		// this.distX		+= deltaX;
		// this.distY		+= deltaY;
		absDistX		= Math.abs(plusX);
		absDistY		= Math.abs(plusY);

		// We need to move at least 10 pixels for the scrolling to initiate
		if ( timestamp - this.state.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
			return;
		}

		// If you are scrolling in one direction lock the other
		// if ( !this.state.directionLocked && !this.props.freeScroll ) {
		// 	if ( absDistX > absDistY + this.props.directionLockThreshold ) {
		// 		this.state.directionLocked = 'h';		// lock horizontally
		// 	} else if ( absDistY >= absDistX + this.props.directionLockThreshold ) {
		// 		this.state.directionLocked = 'v';		// lock vertically
		// 	} else {
		// 		this.state.directionLocked = 'n';		// no lock
		// 	}
		// }

		

    this.setState(Object.assign(this.state, {
      pointX: point.pageX,
      pointY: point.pageY,
      distX: plusX,
      distY: plusY,
      directionLocked: (():string => {
        if ( !this.state.directionLocked && !this.props.freeScroll ) {
          if ( absDistX > absDistY + this.props.directionLockThreshold ) {
            return 'h';		// lock horizontally
          } else if ( absDistY >= absDistX + this.props.directionLockThreshold ) {
            return 'v';		// lock vertically
          } else {
            return 'n';		// no lock
          }
        }
      })()
    }), () => {
      if ( this.state.directionLocked == 'h' ) {
        if ( this.props.eventPassthrough == 'vertical' ) {
          e.preventDefault();
        } else if ( this.props.eventPassthrough == 'horizontal' ) {
          this.state.initiated = false;
          return;
        }

        deltaY = 0;
      } else if ( this.state.directionLocked == 'v' ) {
        if ( this.props.eventPassthrough == 'horizontal' ) {
          e.preventDefault();
        } else if ( this.props.eventPassthrough == 'vertical' ) {
          this.state.initiated = false;
          return;
        }

        deltaX = 0;
      }

      deltaX = this.state.hasHorizontalScroll ? deltaX : 0;
      deltaY = this.state.hasVerticalScroll ? deltaY : 0;

      newX = this.state.x + deltaX;
      newY = this.state.y + deltaY;

      // Slow down if outside of the boundaries
      if ( newX > 0 || newX < this.state.maxScrollX ) {
        newX = this.props.bounce ? this.state.x + deltaX / 3 : newX > 0 ? 0 : this.state.maxScrollX;
      }
      if ( newY > 0 || newY < this.state.maxScrollY ) {
        newY = this.props.bounce ? this.state.y + deltaY / 3 : newY > 0 ? 0 : this.state.maxScrollY;
      }

      this.setState(Object.assign(this.state, {
        directionX: deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0,
        directionY: deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0
      }), () => {
        !this.state.moved && this.__execEvent('scrollStart');
        this.setState({
          moved: true
        }, () => this.__translate(newX, newY))
      })
    })

		// this.state.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		// this.state.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		// if ( !this.state.moved ) {
		// 	this.__execEvent('scrollStart');
		// }

		// this.state.moved = true;

		// this.__translate(newX, newY);

/* REPLACE START: _move */

		if ( timestamp - this.state.startTime > 300 ) {
			this.setState(Object.assign(this.state, {
				startTime: timestamp,
				startX: this.state.x,
				startY: this.state.y
			}))
		}

    /* REPLACE END: _move */
	}

	__end = (e) => {
		if ( !this.state.enabled || me.eventType[e.type] !== this.state.initiated ) {
			return;
		}

		if ( this.props.preventDefault && !me.preventDefaultException(e.target, this.props.preventDefaultException) ) {
			e.preventDefault();
		}

		let point = e.changedTouches ? e.changedTouches[0] : e,
			momentumX,
			momentumY,
			duration = me.getTime() - this.state.startTime,
			newX = Math.round(this.state.x),
			newY = Math.round(this.state.y),
			distanceX = Math.abs(newX - this.state.startX),
			distanceY = Math.abs(newY - this.state.startY),
			time = 0,
			easing = '';

		// this.isInTransition = 0;
		// this.state.initiated = 0;
		// this.endTime = me.getTime();

		this.setState(Object.assign(this.state, {
			isInTransition: 0,
			initiated: 0,
			endTime: me.getTime()
		}), () => {
			// reset if we are outside of the boundaries
			if ( this.__resetPosition(this.props.bounceTime) ) {
				return;
			}

			this.scrollTo(newX, newY);	// ensures that the last position is rounded

			// we scrolled less than 10 pixels
			if ( !this.state.moved ) {
				if ( this.props.tap ) {
					me.tap(e, this.props.tap);
				}

				if ( this.props.click ) {
					me.click(e);
				}

				this.__execEvent('scrollCancel');
				return;
			}

			if ( this.state.events.flick && duration < 200 && distanceX < 100 && distanceY < 100 ) {
				this.__execEvent('flick');
				return;
			}

			// start momentum animation if needed
			if ( this.props.momentum && duration < 300 ) {
				momentumX = this.state.hasHorizontalScroll ? me.momentum(this.state.x, this.state.startX, duration, this.state.maxScrollX, this.props.bounce ? this.state.wrapperWidth : 0, this.props.deceleration) : { destination: newX, duration: 0 };
				momentumY = this.state.hasVerticalScroll ? me.momentum(this.state.y, this.state.startY, duration, this.state.maxScrollY, this.props.bounce ? this.state.wrapperHeight : 0, this.props.deceleration) : { destination: newY, duration: 0 };
				newX = momentumX.destination;
				newY = momentumY.destination;
				time = Math.max(momentumX.duration, momentumY.duration);
				this.setState(Object.assign(this.state, {
					isInTransition: 1
				}))
				// this.isInTransition = 1;
			}
			// console.log(momentumY)
			// INSERT POINT: _end

			if ( newX != this.state.x || newY != this.state.y ) {
				// change easing function when scroller goes out of the boundaries
				if ( newX > 0 || newX < this.state.maxScrollX || newY > 0 || newY < this.state.maxScrollY ) {
					easing = me.ease.quadratic;
				}

				this.scrollTo(newX, newY, time, easing);
				return;
			}

			this.__execEvent('scrollEnd');
		})
	}

	__resize = () => {
		let that = this;

		clearTimeout(this.resizeTimeout);

		this.resizeTimeout = setTimeout(function () {
			that.refresh();
		}, this.props.resizePolling);
	}

	__resetPosition = (time?:number) => {
		let x = this.state.x,
			y = this.state.y;

		time = time || 0;

		if ( !this.state.hasHorizontalScroll || this.state.x > 0 ) {
			x = 0;
		} else if ( this.state.x < this.state.maxScrollX ) {
			x = this.state.maxScrollX;
		}

		if ( !this.state.hasVerticalScroll || this.state.y > 0 ) {
			y = 0;
		} else if ( this.state.y < this.state.maxScrollY ) {
			y = this.state.maxScrollY;
		}

		if ( x == this.state.x && y == this.state.y ) {
			return false;
		}
		
		this.scrollTo(x, y, time, this.props.bounceEasing);
		return true;
	}

	disable = () => {
    this.setState({
      enabled: false
    });
	}

	enable = () => {
		this.setState({
      enabled: true
    });
	}

	refresh = () => {
		me.getRect(this.refs.wrapper);		// Force reflow
		let rect = me.getRect(this.refs.scroller);
    const wW = this.refs.wrapper.clientWidth,
          wH = this.refs.wrapper.clientHeight,
          sW = rect.width,
          sH = rect.height,
          hasHS = this.props.scrollX && (wW - sW) < 0,
          hasVS = this.props.scrollY && (wH - sH) < 0;

    this.setState({
      wrapperWidth: wW,
      wrapperHeight: wH,
      scrollerWidth: !hasHS ? wW : sW,
      scrollerHeight: !hasVS ? wH : sH,
      maxScrollX: !hasHS ? 0 : wW - sW,
      maxScrollY: !hasVS ? 0 : wH - sH,
      hasHorizontalScroll: hasHS,
      hasVerticalScroll: hasVS,
      directionX: 0,
      directionY: 0,
      endTime: 0,
      wrapperOffset: me.offset(this.refs.wrapper)
    })

		this.__execEvent('refresh');

		this.__resetPosition();

// INSERT POINT: _refresh

	}

	on = (type, fn) => {
		if ( !this.state.events[type] ) {
			this.state.events[type] = [];
		}

		this.state.events[type].push(fn);
	}

	off = (type, fn) => {
		if ( !this.state.events[type] ) {
			return;
		}

		let index = this.state.events[type].indexOf(fn);

		if ( index > -1 ) {
			this.state.events[type].splice(index, 1);
		}
	}

	__execEvent = (type) => {
		if ( !this.state.events[type] ) {
			return;
		}

		let i = 0,
			l = this.state.events[type].length;

		if ( !l ) {
			return;
		}

		for ( ; i < l; i++ ) {
			this.state.events[type][i].apply(this, [].slice.call(arguments, 1));
		}
	}

	scrollBy = (x, y, time, easing) => {
		x = this.state.x + x;
		y = this.state.y + y;
		time = time || 0;

		this.scrollTo(x, y, time, easing);
	}

	scrollTo = (x:number, y:number, time?:number, easing?:any) => {
		easing = easing || me.ease.circular;

    this.setState({
      isInTransition: this.props.useTransition && time > 0
    });
		let transitionType = this.props.useTransition && easing.style;
		if ( !time || transitionType ) {
				if(transitionType) {
					this.__transitionTimingFunction(easing.style);
					this.__transitionTime(time);
				}
			this.__translate(x, y);
		} else {
			this.__animate(x, y, time, easing.fn);
		}
	}

  __animate = (destX, destY, duration, easingFn) => {
		let that = this,
			startX = this.state.x,
			startY = this.state.y,
			startTime = me.getTime(),
			destTime = startTime + duration;

		function step () {
			let now = me.getTime(),
				newX, newY,
				easing;

			if ( now >= destTime ) {
				that.state.isAnimating = false;
				that.__translate(destX, destY);

				if ( !that.__resetPosition(that.props.bounceTime) ) {
					that.__execEvent('scrollEnd');
				}

				return;
			}

			now = ( now - startTime ) / duration;
			easing = easingFn(now);
			newX = ( destX - startX ) * easing + startX;
			newY = ( destY - startY ) * easing + startY;
			that.__translate(newX, newY);

			if ( that.state.isAnimating ) {
				me.rAF(step);
			}
		}

		this.state.isAnimating = true;
		step();
	}

	scrollToElement = (el, time, offsetX, offsetY, easing) => {
		el = el.nodeType ? el : this.refs.scroller.querySelector(el);

		if ( !el ) {
			return;
		}

		let pos = me.offset(el);

		pos.left -= this.wrapperOffset.left;
		pos.top  -= this.wrapperOffset.top;

		// if offsetX/Y are true we center the element to the screen
		let elRect = me.getRect(el);
		let wrapperRect = me.getRect(this.wrapper);
		if ( offsetX === true ) {
			offsetX = Math.round(elRect.width / 2 - wrapperRect.width / 2);
		}
		if ( offsetY === true ) {
			offsetY = Math.round(elRect.height / 2 - wrapperRect.height / 2);
		}

		pos.left -= offsetX || 0;
		pos.top  -= offsetY || 0;

		pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
		pos.top  = pos.top  > 0 ? 0 : pos.top  < this.maxScrollY ? this.maxScrollY : pos.top;

		time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.state.x-pos.left), Math.abs(this.state.y-pos.top)) : time;

		this.scrollTo(pos.left, pos.top, time, easing);
	}

	__transitionTime = (time?:number) => {
		if (!this.props.useTransition) {
			return;
		}
		time = time || 0;
		let durationProp = me.style.transitionDuration;
		if(!durationProp) {
			return;
		}
console.log(me.style);

    this.setState({
      scrollerStyle: Object.assign(this.state.scrollerStyle, {[durationProp]: time + 'ms'})
    });

		// if ( !time && me.isBadAndroid ) {
		// 	this.state.scrollerStyle[durationProp] = '0.0001ms';
		// 	// remove 0.0001ms
		// 	let self = this;
		// 	rAF(function() {
		// 		if(self.scrollerStyle[durationProp] === '0.0001ms') {
		// 			self.scrollerStyle[durationProp] = '0s';
		// 		}
		// 	});
		// }

// INSERT POINT: __transitionTime

	}

	__transitionTimingFunction = (easing) => {
    this.setState({
      scrollerStyle: Object.assign(this.state.scrollerStyle, {
        [me.style.transitionTimingFunction]: easing
      })
    })
		// this.state.scrollerStyle[me.style.transitionTimingFunction] = easing;

    // INSERT POINT: __transitionTimingFunction
	}

	__translate = (x, y) => {
		// if ( this.props.useTransform ) {

    // /* REPLACE START: __translate */
    //   this.setState({
    //     scrollerStyle: {
    //       [me.style.transform]: 'translate(' + x + 'px,' + y + 'px)' + this.translateZ
    //     }
    //   });

    // /* REPLACE END: __translate */

		// } else {
    //   this.setState({
    //     scrollerStyle: Object.assign(this.state.scrollerStyle, {
    //       left: `${Math.round(x)}px`,
    //       top: `${Math.round(y)}px`
    //     })
    //   })
		// }
		// console.log("Y is:"+y);
		
    this.setState({
      scrollerStyle: Object.assign(this.state.scrollerStyle, this.props.useTransform && {
        [me.style.transform]: 'translate(' + x + 'px,' + y + 'px)' + this.state.translateZ
      }, !this.props.useTransform && {
        left: `${Math.round(x)}px`,
        top: `${Math.round(y)}px`,
      }),
      x: x,
      y: y
    })

    // INSERT POINT: __translate
	}

	getComputedPosition = () => {
		let matrix = window.getComputedStyle(this.refs.scroller, null),
			x, y;

		if ( this.props.useTransform ) {
			matrix = matrix[me.style.transform].split(')')[0].split(', ');
			x = +(matrix[12] || matrix[4]);
			y = +(matrix[13] || matrix[5]);
		} else {
			x = +matrix.left.replace(/[^-\d.]/g, '');
			y = +matrix.top.replace(/[^-\d.]/g, '');
		}

		return { x: x, y: y };
	}

	__transitionEnd = (e) => {
		if ( e.target != this.refs.scroller || !this.isInTransition ) {
			return;
		}

		this.__transitionTime;
		if ( !this.__resetPosition(this.props.bounceTime) ) {
			this.isInTransition = false;
			this.__execEvent('scrollEnd');
		}
	}

  renderChild = () => {
    return <li>{this.props.children}</li>
  }

  onScroll = () => this.on('scroll', console.log('hi'))

  render(){
    return (<div ref="wrapper" style={wrapper_style} 
      onScroll={this.onScroll}>
      <ul ref="scroller" style={this.state.scrollerStyle}>{this.renderChild()}</ul>
    </div>)
  }
};
