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
//  @providesComponent EllipsisText                                                     //
///////////////////////////////////////////////////////////////////////////////////


import * as React from 'react';
import EllipsisText from './index';
import {
  Component,
  Props
} from 'react';
import * as Truncate from 'react-truncate';
import * as Dotdotdot from 'react-dotdotdot';

interface EllipsisTextTestProps extends Props<EllipsisTextTest>{}
export default class EllipsisTextTest extends Component<EllipsisTextTestProps, any>{
  render(){
    return <div>
      <EllipsisText column={2} initials={true}>我也不知道发生了神This source code is licensed under the BSD-style license found in the</EllipsisText>
      <br/>
    </div>;
  }
}
