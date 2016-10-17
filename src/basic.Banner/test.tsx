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
//  @providesComponent Banner                                                     //
///////////////////////////////////////////////////////////////////////////////////


import * as React from 'react';
import Banner from './index';
import {
  Component,
  Props
} from 'react';

interface BannerTestProps extends Props<BannerTest>{}
export default class BannerTest extends Component<BannerTestProps, any>{
  render(){
    return <div>
      <Banner></Banner>
    </div>;
  }
}
