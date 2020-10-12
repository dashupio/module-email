// require first
const axios = require('axios');
const { Module } = require('@dashup/module');

// import base
const EmailAction = require('./actions/email');

/**
 * export module
 */
class PhoneModule extends Module {

  /**
   * construct discord module
   */
  constructor() {
    // run super
    super();
  }
  
  /**
   * register functions
   *
   * @param {*} fn 
   */
  register(fn) {
    // register sms action
    fn('action', EmailAction);
  }

  /**
   * send
   *
   * @param to 
   * @param from 
   * @param text 
   */
  send(to, from, body) {
    // await res
    console.log(to, from, body);
  }
}

// create new
module.exports = new PhoneModule();
