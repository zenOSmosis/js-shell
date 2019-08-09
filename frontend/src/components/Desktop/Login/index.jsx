import './style.css';

import React, { Component } from 'react';

import DesktopLinkedState, { EVT_LINKED_STATE_UPDATE } from 'state/DesktopLinkedState';

import config from 'config';
import { ANIMATE_SHAKE, ANIMATE_FADE_OUT } from 'utils/animate';
import animate from 'utils/animate';
const fail_effect = ANIMATE_SHAKE;
const ok_effect = ANIMATE_FADE_OUT;

class Login extends Component {
  state={
    username :'',
    password: ''
  }
 
  constructor(props = {}) {
    super();

    this._desktopLinkedState = new DesktopLinkedState();
  }

  async handleSubmit(evt) {
    console.log(this.state, `${config.HOST_REST_URI}/auth/login`)
    evt.preventDefault();
    const res = await fetch(`${config.HOST_REST_URI}/auth/login`, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(this.state)
    });
    const ret = await res.json();
    console.log(ret)
    if(ret.ok) {
      this._desktopLinkedState.setIsLogged(true);
      this.animate(this._form, ok_effect);
    } else {
      this._desktopLinkedState.setIsLogged(false);
      this.animate(this._pwd, fail_effect);
    }
  }

  handleChange = (key) => (evt) => {
    let data = {};
    data[key] = evt.target.value;
    this.setState(data);
  }

  async animate(element, effect) {
    try {
      await animate(element, effect);
    } catch (exc) {
      throw exc;
    }
  }
  
  render() {
    return (
      <div ref={ref => this._form = ref} >
        <div class="login-form" >
          <img src={`${config.HOST_ICON_URI_PREFIX}user/user.jpg`} alt="user logo" class="avatar" />
          <h2>JS Shell</h2>
          <form onSubmit={this.handleSubmit.bind(this)}>
              <p>Username</p>
              <input type="text" onChange={this.handleChange('username')} name="username" placeholder="Enter Username" />
              <p>Password</p>
              <input type="password" ref={ref => this._pwd = ref} onChange={this.handleChange('password')} name="password" placeholder="Enter Password" />
              <input type="submit" name="" value="Sign In" />
          </form>
        </div>
      </div>
    );
  }
}

export default Login