export let rAF = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) { window.setTimeout(callback, 1000 / 60) }

export default class Utils {
    venderOf = null
    elementStyle = null

    hasTransform = null
    hasPerspective = null
    hasTouch = null
    hasPointer = null
    hasTransition = null

    style = {}
    eventType = {}
    ease = {}

    constructor() {
        this.elementStyle = document.createElement('div').style
        this.style['transform'] = this._prefixedAndEnsuredStyle('transform')

        this.hasTransform = !!this.style['transform']
        this.hasPerspective = !!this._prefixedAndEnsuredStyle('perspective')
        this.hasTouch = window.hasOwnProperty('ontouchstart')
        this.hasPointer = !!(window.PointerEvent || window.MSPointerEvent) // IE10 is prefixed
        this.hasTransition = !!this._prefixedAndEnsuredStyle('transition')

        this.style['transitionTimingFunction'] = this._prefixedAndEnsuredStyle('transitionTimingFunction')
        this.style['transitionDuration'] = this._prefixedAndEnsuredStyle('transitionDuration')
        this.style['transitionDelay'] = this._prefixedAndEnsuredStyle('transitionDelay')
        this.style['transformOrigin'] = this._prefixedAndEnsuredStyle('transformOrigin')
        this.style['touchAction'] = this._prefixedAndEnsuredStyle('touchAction')

        this.eventType['touchstart'] = 1
        this.eventType['touchmove'] = 1
        this.eventType['touchend'] = 1
        this.eventType['mousedown'] = 2
        this.eventType['mousemove'] = 2
        this.eventType['mouseup'] = 2
        this.eventType['pointerdown'] = 3
        this.eventType['pointermove'] = 3
        this.eventType['pointerup'] = 3
        this.eventType['MSPointerDown'] = 4
        this.eventType['MSPointerMove'] = 4
        this.eventType['MSPointerUp'] = 4

        this.ease['quadratic'] = {
            style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fn: function quadratic(k) {
                return k * (2 - k)
            }
        }
        this.ease['circular'] = {
            style: 'cubic-bezier(0.1, 0.57, 0.1, 1)', // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
            fn: function circular(k) {
                return Math.sqrt(1 - (--k * k))
            }
        }
        this.ease['back'] = {
            style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fn: function back(k) {
                let b = 4
                return (k = k - 1) * k * ((b + 1) * k + b) + 1
            }
        }
        this.ease['bounce'] = {
            style: '',
            fn: function bounce(k) {
                if ((k /= 1) < (1 / 2.75)) {
                    return 7.5625 * k * k
                } else if (k < (2 / 2.75)) {
                    return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75
                } else if (k < (2.5 / 2.75)) {
                    return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375
                } else {
                    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375
                }
            }
        }
        this.ease['elastic'] = {
            style: '',
            fn: function elastic(k) {
                let f = 0.22,
                    e = 0.4

                if (k === 0) { return 0 }
                if (k == 1) { return 1 }

                return (e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1)
            }
        }
    }

    _prefixedAndEnsuredStyle = (style) => {
        const vendors = ['', 'webkit', 'Moz', 'ms', 'O']
        for (let i = 0; i < vendors.length; i++) {
            let prefixedStyle = i === 0 ? style : vendors[i] + style.charAt(0).toUpperCase() + style.substr(1)
            if (this.elementStyle.hasOwnProperty(prefixedStyle)) return prefixedStyle
        }
    }

    __prefixPointerEvent = (pointerEvent) => {
        return window.MSPointerEvent ?
            'MSPointer' + pointerEvent.charAt(7).toUpperCase() + pointerEvent.substr(8) :
            pointerEvent
    }

    /*
	This should find all Android browsers lower than build 535.19 (both stock browser and webview)
        - galaxy S2 is ok
        - 2.3.6 : `AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1`
        - 4.0.4 : `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
    - galaxy S3 is badAndroid (stock brower, webview)
        `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
    - galaxy S4 is badAndroid (stock brower, webview)
        `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
    - galaxy S5 is OK
        `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
    - galaxy S6 is OK
        `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
    */
    __isBadAndroid = () => {
        let appVersion = window.navigator.appVersion
            // Android browser is not a chrome browser.
        if (/Android/.test(appVersion) && !(/Chrome\/\d/.test(appVersion))) {
            let safariVersion = appVersion.match(/Safari\/(\d+.\d)/)
            if (safariVersion && typeof safariVersion === "object" && safariVersion.length >= 2) {
                return parseFloat(safariVersion[1]) < 535.19
            } else {
                return true
            }
        } else {
            return false
        }
    }

    nowTime = () => Date.now() || function nowTime() { return new Date().getTime() }

    extend = (target, obj) => {
        for (let i in obj) {
            target[i] = obj[i];
        }
    }

    addEvent = (el, type, fn, capture) => {
        el.addEventListener(type, fn, !!capture)
    }

    removeEvent = (el, type, fn, capture) => {
        el.removeEventListener(type, fn, !!capture)
    }

    momentum = (current, start, time, lowerMargin, wrapperSize, deceleration) => {
        let distance = current - start,
            speed = Math.abs(distance) / time,
            destination,
            duration

        deceleration = deceleration === undefined ? 0.0006 : deceleration

        destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1)
        duration = speed / deceleration

        if (destination < lowerMargin) {
            destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin
            distance = Math.abs(destination - current)
            duration = distance / speed
        } else if (destination > 0) {
            destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0
            distance = Math.abs(current) + destination
            duration = distance / speed
        }

        return {
            destination: Math.round(destination),
            duration: duration
        }
    }

    getRect = (el) => {
        if (el instanceof SVGElement) {
            let rect = el.getBoundingClientRect()
            return {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            }
        } else {
            return {
                top: el.offsetTop,
                left: el.offsetLeft,
                width: el.offsetWidth,
                height: el.offsetHeight
            }
        }
    }

    getTouchAction = (eventPassthrough, addPinch) => {
        let touchAction = 'none'
        if (eventPassthrough === 'vertical') {
            touchAction = 'pan-y'
        } else if (eventPassthrough === 'horizontal') {
            touchAction = 'pan-x'
        }
        if (addPinch && touchAction != 'none') {
            // add pinch-zoom support if the browser supports it, but if not (eg. Chrome <55) do nothing
            touchAction += ' pinch-zoom'
        }
        return touchAction
    }

    click = (e) => {
        let target = e.target,
            ev

        if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
            // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent
            // initMouseEvent is deprecated.
            ev = document.createEvent(window.MouseEvent ? 'MouseEvents' : 'Event');
            ev.initEvent('click', true, true);
            ev.view = e.view || window;
            ev.detail = 1;
            ev.screenX = target.screenX || 0;
            ev.screenY = target.screenY || 0;
            ev.clientX = target.clientX || 0;
            ev.clientY = target.clientY || 0;
            ev.ctrlKey = !!e.ctrlKey;
            ev.altKey = !!e.altKey;
            ev.shiftKey = !!e.shiftKey;
            ev.metaKey = !!e.metaKey;
            ev.button = 0;
            ev.relatedTarget = null;
            ev._constructed = true;
            target.dispatchEvent(ev);
        }
    }

    tap = (e, eventName) => {
        let ev = document.createEvent('Event')
        ev.initEvent(eventName, true, true)
        ev.pageX = e.pageX
        ev.pageY = e.pageY
        e.target.dispatchEvent(ev)
    }

    preventDefaultException = (el, exceptions) => {
        for (let i in exceptions) {
            if (exceptions[i].test(el[i])) {
                return true
            }
        }
        return false
    }

    hasClass = (el, c) => {
        let re = new RegExp("(^|\\s)" + c + "(\\s|$)")
        return re.test(el.className)
    };

    addClass = (el, c) => {
        if (this.hasClass(el, c)) { return }

        let newclass = el.className.split(' ')
        newclass.push(c)
        el.className = newclass.join(' ')
    };

    removeClass = (el, c) => {
        if (!this.hasClass(el, c)) { return }

        let re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g')
        el.className = el.className.replace(re, ' ')
    };

    offset = (el) => {
        let left = -el.offsetLeft,
            top = -el.offsetTop

        // jshint -W084
        while (el = el.offsetParent) {
            left -= el.offsetLeft
            top -= el.offsetTop
        }
        // jshint +W084

        return {
            left: left,
            top: top
        }
    }
}