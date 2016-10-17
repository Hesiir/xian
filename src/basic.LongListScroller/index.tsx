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
import ReactIScroll from 'react-iscroll';
import { infiniteOptionsType } from './types';

const iscroll = require('iscroll/build/iscroll-infinite');
const inner_style = {
  paddingLeft: 0,
  marginTop: 0,
  marginBottom: 0
};
interface LongListScrollerStatus {}
interface LongListScrollerProps extends Props<LongListScroller>{
  options?: infiniteOptionsType,
  infiniteLoad: Function,
  infiniteRender: Function
}

export default class LongListScroller extends Component<LongListScrollerProps,LongListScrollerStatus>{
  constructor(props){
    super(props);
    this.state = {}
  }
  componentDidMount(){
    
  }
  render(){
    return (<ReactIScroll iScroll={iscroll} 
    options={{
      mouseWheel: true,
      infiniteElements: '#iStroll li',
      cacheSize: 1000,
      dataset: (start, count) => {
        console.log(this)
      },
      dataFiller: (el, data) => {
        console.log(`el:${el}`)
      }
    }}
    >
      <ul id="iStroll" style={inner_style}>
        <li>{this.props.children}</li>
      </ul>
    </ReactIScroll>)
  }
}
