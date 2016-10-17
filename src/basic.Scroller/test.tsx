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
import Scroller from './index';
import {
  Component,
  Props
} from 'react';

const scroller_style = {
  height: '200px'
};

interface ScrollerTestProps extends Props<ScrollerTest>{}
export default class ScrollerTest extends Component<ScrollerTestProps, any>{
  render(){
    return <div style={scroller_style}>
      <Scroller>Turn Off the Lights是一个轻量而实用的插件，它为更舒适的观看体验而设计。它可以用于所有已知的视频网站，如YouTube、Vimeo、Dailymotion、Hulu、Metacafe、优酷等。不仅如此，该扩展程序还与Google Chrome、Apple Safari、Mozilla Firefox、Opera、Microsoft Edge、傲游以及Yandex这些浏览器兼容。 
此浏览器插件的几个比较有特色的功能：
+轻击黑色部分即可开灯+支持众多视频网站，例如：YouTube、HTML5视频等及更多... 
+自定义你的YouTube体验： 自动高清：自动将视频调整至高清画质。用户可以选择分辨率高配> 8K > 5K> 4K > 1080p > 720p > 480p > 360p > 240p > 144p >默认自动宽屏：自动在最宽模式播放视频...及更多... 
+彩蛋：
快捷键：T ->喜欢真正的电影院感觉吗？
+点击视频播放按钮时，使画面按设定自动变暗
+可选择不同的渐亮渐暗效果
+自定义颜色
+ Flash探测选项
+可选择是否显示暗度水平栏
+在夜间开启视力保护的选项，可以使用白名单/黑名单过滤+开启气氛照明选项，视频播放器周围会显示一层辉光
+可选择是否显示画面上的暗层
+快捷键选项：
Ctrl + Shift + L以切换模式
Alt + F8恢复预设的不透明度值
Alt + F9保存当前的不透明度值
Alt + F10启用/禁用视力保护功能
Alt +（向上键），即可增加不透明度
Alt +（向下键），即可降低不透明度
Alt + *切换所有打开选项卡的灯
+摄像机运动选项+语音识别选项
+切换YouTube黑白主题的夜间模式开关可以选择摆放的位置，同时带有白名单/黑名单过滤功能时间戳：在指定的时间内激活夜间模式熄灯：降低页面亮度，或者激活夜间模式关闭YouTube和HTML5视频的自动播放选项</Scroller>
    </div>;
  }
}
