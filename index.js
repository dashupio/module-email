// require first
const fs        = require('fs-extra');
const mjml2html = require('mustache.mjml');
const { Module, Model, Query } = require('@dashup/module');

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
  async send(opts, connect, { to, user, item, subject, body, data }) {
    // Make sure addresses is array
    if (!Array.isArray(to)) to = [to];

    // rendered
    const { template, errors } = mjml2html((await fs.readFile('./emails/action.mjml', 'utf8')).replace('[[TEMPLATE]]', body));

    // template with data
    const email = template(data);

    // create event
    if (opts && opts.page && item) {
      // page/form
      const page = await new Query(opts, 'page').findById(opts.page);
      const form = page && page.get('data.event.form') && await new Query(opts, 'page').findById(page.get('data.event.form'));

      // check type
      if (page && form && page.get('data.event')) {
        // get fields
        const fields = {};
        ['type', 'item', 'body', 'user', 'title'].forEach((field) => {
          // set field
          fields[field] = (form.get('data.fields') || []).find((f) => f.uuid === page.get(`data.event.${field}`));
        });

        // create email event
        const event = new Model({
          
        }, 'model');

        // fields
        if (fields.type) event.set(fields.type.name || fields.type.uuid, 'email:outbound');
        if (fields.item) event.set(fields.item.name || fields.item.uuid, item);
        if (fields.body) event.set(fields.body.name || fields.body.uuid, `<b>Subject:</b> ${subject}<br />${body}`);
        if (fields.user) event.set(fields.user.name || fields.user.uuid, user);
        if (fields.title) event.set(fields.title.name || fields.title.uuid, `Sent email from ${connect.email} to ${to}`);

        // save event
        event.save({
          form  : page.get('data.event.form'),
          page  : page.get('data.event.model'),
          model : page.get('data.event.model'),
        });
      }
    }
        
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
