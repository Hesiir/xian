import React, { Component } from 'react'
import { string, func, bool, number, object, shape } from 'prop-types'
import classNames from 'classnames/bind'
import Scroller from './core'
import style from './swiper.css'

const S = classNames.bind(style)
class Swiper extends Component {
  constructor(props) {
    super(props)
    this.more
  }

  static propTypes = {
    loadMore: func | bool,
    loadMoreView: func,
    loadMoreText: string,
    doneLoadText: string
  }

  componentDidMount(){
    this.more = this.refs.scroller.refs.after
  }

  defaultLoadMoreFunc = (leng) => {
    let l = -leng, rx = 0, x = 12;
    if (10 < l) {
      rx = (l - 10) / 5
    }
    if (l > 40) {
      x = 8
    } else {
      x = 12 - l / 10
    }
    if (l > 50) {
      rx = 8
    }
    return `<div style="height: 100%;">
        <svg style="height: 100%; margin-left: -50%;" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="12" rx="${rx}" ry="12" style="fill:rgb(200,100,50)"/>
          <text x="0" y="${-x}" transform="rotate(90)" style="fill: #fff; font-size: 40%">${leng > -50 ? this.props.loadMoreText || 'loading' : this.props.doneLoadText || 'done'}</text>
        </svg>
      </div>`
  }

  onScrollHandlder = (pos) => {
    let fuc = this.props.loadMoreView || this.defaultLoadMoreFunc
    this.more.style.right = 
    this.more.innerHTML = pos.x - pos.maxScrollX < 0 && fuc(pos.x - pos.maxScrollX)
  }

  onScrollStopHandler = (pos) => {
   this.props.loadMore && pos.maxScrollX - pos.x > 50 && this.props.loadMore()
  }

  render() {
    const { classname, children, loadMore } = this.props
    return (<Scroller ref='scroller' className={S(classname)}
      onScroll={loadMore && this.onScrollHandlder}
      onScrollStop={loadMore && this.onScrollStopHandler}
      probeType={loadMore ? 3 : 1}
      eventPassthrough={!!loadMore}
      preventDefault={!loadMore}
      useTransition={!loadMore}
      scrollX={true}
      scrollY={false}
      needAfter={!!loadMore}
      { ... this.props }
    >
      <div className={S('inner')}>{children}</div>
    </Scroller>)
  }
}

export default Swiper
