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
//  @providesComponent UnitFormatted                                                     //
///////////////////////////////////////////////////////////////////////////////////


import * as React from 'react';
import UnitFormatted from './index';
import {
  Component,
  Props
} from 'react';

interface UnitFormattedTestProps extends Props<UnitFormattedTest>{}
export default class UnitFormattedTest extends Component<UnitFormattedTestProps, any>{
  render(){
    return <div>
      <UnitFormatted unitType='rmb'>34556.34</UnitFormatted>
    </div>;
  }
}
