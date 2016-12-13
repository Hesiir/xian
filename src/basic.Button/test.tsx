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
//  @providesComponent Button                                                     //
///////////////////////////////////////////////////////////////////////////////////


import * as React from 'react';
import Button from './index';
import {
  Component,
  Props
} from 'react';
import { action } from '@kadira/storybook';
import { text, boolean, number } from '@kadira/storybook-addon-knobs';

interface ButtonNormalProps extends Props<ButtonNormal>{
  onClick?: Function
}
export class ButtonNormal extends Component<ButtonNormalProps, any>{
  render(){
    return <div>
      <Button onClick={action('click', console.log('dd'))}>{text('Button Text', 'this is a button')}</Button>
    </div>;
  }
}

interface ButtonSelfProps extends Props<ButtonNormal>{
  onClick?: Function
}
export class ButtonSelf extends Component<ButtonSelfProps, any>{
  render(){
    return <div onClick={() => this.props.onClick()}>
      this is a action button
    </div>;
  }
}
