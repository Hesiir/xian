import React, { Component } from 'react'
import { string } from 'prop-types'
import classNames from 'classnames/bind'
import style from './style.css'

const S = classNames.bind(style)
class Swiper extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  static PropTypes = {
    classname: string
  }

  componentDidMount(){}

  componentWillReciveProps(nextProps){}

  render(){
    const { classname, children } = this.props
    return (<div className={S('swiper', classname)}>{children}</div>)
  }
}

export default Swiper

