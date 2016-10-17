import * as React from 'react';
import { Component } from 'react';

const routes = require('./component_list.json').components;
const Infr = (props) => <div>Home.</div>;

export default class Body extends Component {
  constructor(props){
    super(props);
    this.state = {
      route: window.location.hash.substr(1),
      component: null
    }
  }

  componentDidMount() {
    let components = new Map(), component_list = [];
    window.addEventListener('hashchange', () => {
      this.setState({
        route: window.location.hash.substr(1)
      })
    })
    routes.map((route, index) => {
      components.set(route.component, require(`../lib/${route.type}.${route.component}/test`).default)
    })
    this.setState({
      component: components
    })
  }

  render() {
    let List = [], Child = null;
    if (this.state.component) {
      Child = this.state.route != '' ? this.state.component.get(this.state.route.split('/')[1]) : Infr;
      this.state.component.forEach((value, key) => {
        List.push(<li key={key}><a href={`#/${key}`}>{key}</a></li>)
      })
    }
    List.sort((a, b) => a.key.localeCompare(b.key))
    
    return <div>
      <div className="list">
        <h2>Midfy Components</h2>
        <ul>{List}</ul>
      </div>
      <div className="component">{Child && <Child/>}</div>
    </div>
  }
}
