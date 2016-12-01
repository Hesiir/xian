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
//  @providesComponent LongListScroller                                                     //
///////////////////////////////////////////////////////////////////////////////////


import * as React from 'react';
import LongListScroller from './index';
import {
  Component,
  Props
} from 'react';

const scroller_style = {
  height: '200px'
};
const li_style = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%'
};
interface LongListScrollerTestProps extends Props<LongListScrollerTest>{}
export default class LongListScrollerTest extends Component<LongListScrollerTestProps, any>{
  loader: () => {

  }
  infiniteReader = (start, count) => {
    console.log(`start:${start}  count${count}`);
  }
  render(){
    return <div style={scroller_style}>
      <LongListScroller infiniteLoad={this.loader} infiniteRender={this.infiniteReader}>
        <li style={li_style}>Ctrl + Shift + L以切换模式Alt + F8恢复预设的不透明度值Alt + F9保存当前的不透明度值Alt + F10启用/禁用视力保护功能Alt +（向上键），即可增加不透明度Alt +（向下键），即可降低不透明度Alt + *切换所有打开选项卡的灯+摄像机运动选项+语音识别选项</li>
        <li style={li_style}>Ctrl + Shift + L以切换模式Alt + F8恢复预设的不透明度值Alt + F9保存当前的不透明度值Alt + F10启用/禁用视力保护功能Alt +（向上键），即可增加不透明度Alt +（向下键），即可降低不透明度Alt + *切换所有打开选项卡的灯+摄像机运动选项+语音识别选项</li>
        <li style={li_style}>Ctrl + Shift + L以切换模式Alt + F8恢复预设的不透明度值Alt + F9保存当前的不透明度值Alt + F10启用/禁用视力保护功能Alt +（向上键），即可增加不透明度Alt +（向下键），即可降低不透明度Alt + *切换所有打开选项卡的灯+摄像机运动选项+语音识别选项</li>
        <li style={li_style}>Ctrl + Shift + L以切换模式Alt + F8恢复预设的不透明度值Alt + F9保存当前的不透明度值Alt + F10启用/禁用视力保护功能Alt +（向上键），即可增加不透明度Alt +（向下键），即可降低不透明度Alt + *切换所有打开选项卡的灯+摄像机运动选项+语音识别选项</li>
      </LongListScroller>
    </div>;
  }
}
