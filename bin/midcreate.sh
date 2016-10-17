#!/bin/bash

################################################
# Author: Orlo Wang                            #
# Email: ow.cc@outlook.com                     #
# Version: 0.1.0                               #
################################################

componet=
componet_name=
syntax_type=
type_name=

while getopts "c:t:hfb" arg
do
  case $arg in
    c) componet_name=$OPTARG;;
    f) syntax_type="function";;
    b) syntax_type="business";;
    t) type_name=$OPTARG;;
    h) echo -e "\nUsage: midcreate -c [conponent name] [--option]\n\nOptions:\n\n  -t,  componet type, valid fields is 'base', 'business'\n  -f,  stateless component\n  -b,  status component\n";
      exit 1;;
  esac
done

if [[ $componet_name == -* ]]; 
then
  echo -e "[Error:] componet name required. Type '-h' to see help"
  exit 1
fi

if [ ! $componet_name ]; 
then
  echo -e "[Error:] componet name required. Type '-h' to see help"
  exit 1
fi

upper_component_name=$(tr '[:lower:]' '[:upper:]' <<< ${componet_name:0:1})${componet_name:1}

doc_block="///////////////////////////////////////////////////////////////////////////////////
//  Copyright 2016-present, Jnfinity, Inc.                                       //
//  All rights reserved.                                                         //
//                                                                               //
//  This source code is licensed under the BSD-style license found in the        //
//  LICENSE file in the root directory of this source tree. An additional grant  //
//  of patent rights can be found in the PATENTS file in the same directory.     //
//                                                                               //
//  @Author Orlo Wang                                                            //
//  @Email  ow.cc@outlook.com                                                    //
//  @providesComponent ${upper_component_name}                                                     //
///////////////////////////////////////////////////////////////////////////////////\n"

function_component_tpl="${doc_block}
import * as React from 'react';

const ${upper_component_name}:React.StatelessComponent<{}> = (props) => <div></div>;

${upper_component_name}.propTypes = {};
${upper_component_name}.defaultProps = {};

export default ${upper_component_name}"

base_component_tpl="${doc_block}
import * as React from 'react';
import {
  Component,
  Props
} from 'react';

interface ${upper_component_name}Props extends Props<$upper_component_name>{}

export default class $upper_component_name extends Component<${upper_component_name}Props,any>{
  componentDidMount(){}
  render(){
    return (<div {...this.props}></div>)
  }
}"

business_component_tpl="${doc_block}
import * as React from 'react';
import {
  Component,
  Props
} from 'react';

interface ${upper_component_name}Status {}
interface ${upper_component_name}Props extends Props<$upper_component_name>{}

export default class $upper_component_name extends Component<${upper_component_name}Props,${upper_component_name}Status>{
  constructor(props){
    super(props);
    this.state = {}
  }
  componentDidMount(){}
  render(){
    return (<div {...this.props}></div>)
  }
}"

case $syntax_type in
  "function") componet=$function_component_tpl;;
  "business") componet=$business_component_tpl;;
  * )         componet=$base_component_tpl;;
esac

styl_tpl="${doc_block}\n.$upper_component_name{}"
test_tpl="${doc_block}\n
import * as React from 'react';
import ${upper_component_name} from './index';
import {
  Component,
  Props
} from 'react';

interface ${upper_component_name}TestProps extends Props<${upper_component_name}Test>{}
export default class ${upper_component_name}Test extends Component<${upper_component_name}TestProps, any>{
  render(){
    return <div>
      <${upper_component_name}></${upper_component_name}>
    </div>;
  }
}"
type_name_prefix=

if [ ! $type_name ];
then
  type_name_prefix="basic"
else
  type_name_prefix=$type_name
fi

if [ ! -d "./src/${type_name_prefix}.${upper_component_name}" ]
then
  mkdir ./src/${type_name_prefix}.${upper_component_name}
  echo -e "$componet" > ./src/${type_name_prefix}.${upper_component_name}/index.tsx
  echo -e "$test_tpl" > ./src/${type_name_prefix}.${upper_component_name}/test.tsx
  # echo -e "$styl_tpl" > ./src/${type_name_prefix}.${upper_component_name}/style.styl

  node ./helper/add_component.js $type_name_prefix $upper_component_name
else
  echo "[Fail:] componet '${type_name_prefix}.${upper_component_name}' already exists!"
  exit 1
fi
