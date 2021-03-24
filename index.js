// require first
const fs         = require('fs-extra');
const mjml2html  = require('mustache.mjml');
const { Module } = require('@dashup/module');

// import base
const EmailAction = require('./actions/email');

/**
 * export module
 */
class EmailModule extends Module {

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
  async send(connect, to, subject, body, data) {
    // Make sure addresses is array
    if (!Array.isArray(to)) to = [to];

    // rendered
    const { template, errors } = mjml2html((await fs.readFile('./emails/action.mjml', 'utf8')).replace('[[TEMPLATE]]', body));

    // template with data
    const email = template(data);
        
    // submit form
    return await this.connection.action({
      type   : 'connect',
      struct : connect.type,
    }, 'send', connect, {
      to,
      subject, 
      body : email,
    });
  }
}

// create new
module.exports = new EmailModule();
