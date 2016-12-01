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
import { PropTypes } from 'react';

const unit = {
  usd: '$',
  rmb: '￥',
  eur: '€',
  gbp: '£'
};
const UnitFormatted:React.StatelessComponent<{}> = (props) => <section>
  {props.position === 0 && <span>{unit[props.unitType]}</span>}
  {props.children}
  {props.position === 1 && <span>{unit[props.unitType]}</span>}
</section>;

UnitFormatted.propTypes = {
  unitType: PropTypes.string,
  position: PropTypes.number
};
UnitFormatted.defaultProps = {
  unitType: null,
  position: 0
};

export default UnitFormatted
