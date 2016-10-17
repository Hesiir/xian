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
import ReactIScroll from 'react-iscroll';
import * as cn from 'classnames';

const inner_style = {
  paddingLeft: 0,
  marginTop: 0,
  marginBottom: 0
};
const iScroll = require('iscroll');
const Scroller:React.StatelessComponent<{}> = (props) => <ReactIScroll iScroll={iScroll}
  options={props.iscrollOptions} 
  className={cn('Scroller', props.chassName)}>
    <ul style={inner_style}>
      <li>{props.children}</li>
    </ul>
</ReactIScroll>;

Scroller.propTypes = {
  iscrollOptions: React.PropTypes.shape({
    mouseWheel: React.PropTypes.bool,
    momentum: React.PropTypes.bool,
    keyBindings: React.PropTypes.bool,
    invertWheelDirection: React.PropTypes.bool,
    preventDefault: React.PropTypes.bool,
    startX: React.PropTypes.number,
    startY: React.PropTypes.number,
    tap: React.PropTypes.bool || React.PropTypes.string,

    scrollbars: React.PropTypes.bool || React.PropTypes.string,       // 'custom'-- CSS<.iScrollHorizontalScrollbar/.iScrollVerticalScrollbar/.iScrollIndicator/.iScrollBothScrollbars>
    fadeScrollbars: React.PropTypes.bool,
    interactiveScrollbars: React.PropTypes.bool,
    resizeScrollbars: React.PropTypes.bool,
    shrinkScrollbars: React.PropTypes.bool || React.PropTypes.string,

    // indicators: React.PropTypes.arrayOf(React.PropTypes.shape({
    //   el: React.PropTypes.node,
    //   ignoreBoundaries: React.PropTypes.bool,
    //   listenX: React.PropTypes.bool,
    //   listenY: React.PropTypes.bool,
    //   speedRatioX: React.PropTypes.number,
    //   speedRatioY: React.PropTypes.number,
    //   fade: React.PropTypes.bool,
    //   interactive: React.PropTypes.bool,
    //   resize: React.PropTypes.bool,
    //   shrink: React.PropTypes.bool,
    // }))
  }),
  className: React.PropTypes.string
};
Scroller.defaultProps = {
  iscrollOptions: {
    mouseWheel: false,
    scrollbars: false,
    momentum: true,
    invertWheelDirection: false,
    preventDefault: true,
    startX: 0,
    startY: 0,
    tap: false,
    fadeScrollbars: false,
    interactiveScrollbars: true,
    resizeScrollbars: true,
    shrinkScrollbars: false,

    // indicators: [{
    //   ignoreBoundaries: false,
    //   listenX: true,
    //   listenY: true,
    //   speedRatioX: 0,
    //   speedRatioY: 0,
    //   fade: false,
    //   interactive: true,
    //   resize: true,
    //   shrink: false
    // }]
  },
  className: null
};

export default Scroller
