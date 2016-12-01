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
//  @providesComponent Switch                                                     //
///////////////////////////////////////////////////////////////////////////////////


import * as React from 'react';
import Switch from './index';
import {
  Component,
  Props
} from 'react';

interface SwitchTestProps extends Props<SwitchTest>{}
export default class SwitchTest extends Component<SwitchTestProps, any>{
  render(){
    return <div>
      <Switch></Switch>
    </div>;
  }
}
