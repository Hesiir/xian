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
import { PropTypes } from 'react';

const Button:React.StatelessComponent<any> = ({ children, onClick }) => <div
  onClick={onClick}
  style={{
    width: '80px',
    height: '40px',
    backgroundColor: 'red'
  }}
>{children}</div>;

Button.propTypes = {
  onClick: PropTypes.func
};
Button.defaultProps = {};

export default Button
