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
//  @providesComponent LongListScroller                                          //
///////////////////////////////////////////////////////////////////////////////////

import * as React from 'react';
import {
  Component,
  Props,
  PropTypes
} from 'react';
import * as ReactDOM from 'react-dom';
import { infiniteOptionsType } from './types';

const iscroll = require('iscroll/build/iscroll-infinite');
const inner_style = {
  paddingLeft: 0,
  marginTop: 0,
  marginBottom: 0
};
interface LongListScrollerStatus {
  list?: Object,
  count?: Number,
  loading?: Boolean,
}
interface LongListScrollerProps extends Props<LongListScroller>{
  options?: infiniteOptionsType,
  infiniteLoad: Function,
  infiniteRender: Function,
  loadCount?: Number,
  initLoadPage?: Number,
}

export default class LongListScroller extends Component<LongListScrollerProps,LongListScrollerStatus>{
  constructor(props){
    super(props);
    this.state = {
      list: [],
      count: this.props.loadCount || 13,
      loading: false
    }
  }
  componentDidMount(){
    this.loadData(this.props.initLoadPage || 1, this.state.count)
  }
  loadData = (page, count) => {
    this.setState({
      loading:true
    })
  }
  renderItem = (item, index) => <li key={index}>{item}</li>
  render(){
    return (<div/>)
  }
}
