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
import * as ReactIScrolli from 'react-iscroll';

const iScroll = require('iscroll/build/iscroll-lite');
const Scroller:React.StatelessComponent<{}> = (props:{children}) => <ReactIScrolli iScroll={iScroll}
  options={{}}
><ul>{props.children}</ul></ReactIScrolli>;

Scroller.propTypes = {};
Scroller.defaultProps = {};

export default Scroller
