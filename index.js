// require first
const fs         = require('fs-extra');
const transport  = require('nodemailer-mailgun-transport');
const mjml2html  = require('mustache.mjml');
const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
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

    // connect discord
    this.building.then(() => {
      // Build mailer
      this.mailer = nodemailer.createTransport(transport({
        auth : {
          domain  : this.config.domain,
          api_key : this.config.apiKey,
        }
      }));
    });
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
  async send(to, subject, body, data) {
    // Make sure addresses is array
    if (!Array.isArray(to)) to = [to];

    // rendered
    const { template, errors } = mjml2html((await fs.readFile('./emails/action.mjml', 'utf8')).replace('[[TEMPLATE]]', body));

    // template with data
    const email = template(data);

    // Options
    const options = {
      to,
      from : this.config.from,
      html : email,
      text : htmlToText.fromString(email, {
        wordwrap : 130,
      }),
      subject : subject,
    };

    // info
    let info = null;

    // Run try/catch
    try {
      // Send mail with defined transport object
      info = await new Promise((resolve, reject) => {
        // Send mail
        this.mailer.sendMail(options, (err, data) => {
          // Check error
          if (err) return reject(err);

          // Resolve
          return resolve(data);
        });
      });
    } catch (e) {
      // log error
      console.log(e);
    }

    // Return email
    return info;
  }
}

// create new
module.exports = new PhoneModule();
