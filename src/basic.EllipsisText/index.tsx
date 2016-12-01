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
import { PropTypes } from 'react';

const EllipsisText:React.StatelessComponent<{}> = (props) => <div style={{
  overflow: 'hidden',
  height: `${props.column * props.height}rem`,
  lineHeight: `${props.height}rem`
}} className={props.className}>
  <textarea name="" id="" cols="30" rows="10" defaultValue={props.children}></textarea>
</div>;

EllipsisText.propTypes = {
  column: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  initials: PropTypes.bool.isRequired,
  className: PropTypes.string
};
EllipsisText.defaultProps = {
  column: 1,
  height: 1.33333,
  initials: false
};

export default EllipsisText;
