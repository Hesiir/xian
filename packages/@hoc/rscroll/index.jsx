import React, { Component } from 'react'
import { string } from 'prop-types'
import classNames from 'classnames/bind'
import Scroller from './core'
import style from './style.css'

const S = classNames.bind(style)
class Rscroll extends Component {
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
    return (<Scroller { ... this.props} className={S('rscroll', this.props.classname)}>{this.props.children}</Scroller>)
  }
}

export default Rscroll

