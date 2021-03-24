
// import connect interface
import handlebars from 'handlebars';
import { Struct, Query } from '@dashup/module';

/**
 * build address helper
 */
export default class EmailAction extends Struct {

  /**
   * construct
   */
  constructor(...args) {
    // return
    super(...args);

    // run listen
    this.runAction = this.runAction.bind(this);
  }

  /**
   * returns connect type
   */
  get type() {
    // return connect type label
    return 'email';
  }

  /**
   * returns connect type
   */
  get title() {
    // return connect type label
    return 'Email';
  }

  /**
   * returns connect icon
   */
  get icon() {
    // return connect icon label
    return 'fa fa-envelope';
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      config : 'action/email/config',
    };
  }

  /**
   * returns object of views
   */
  get actions() {
    // return object of views
    return {
      run : this.runAction,
    };
  }

  /**
   * returns category list for connect
   */
  get categories() {
    // return array of categories
    return ['email'];
  }

  /**
   * returns connect descripton for list
   */
  get description() {
    // return description string
    return 'Email Action';
  }

  /**
   * action method
   *
   * @param param0 
   * @param action 
   * @param data 
   */
  async runAction(opts, action, data) {
    // send
    if (!action.to) return {
      data,
    };

    // template
    const toTemplate = handlebars.compile(action.to);

    // replace with data
    const to = toTemplate(data || {});

    // template
    const subjectTemplate = handlebars.compile(action.subject);

    // subject
    const subject = subjectTemplate(data || {});

    // get to
    const actualTo = to.split(',').map((item) => item && item.trim().length ? item.trim() : null).filter((f) => f);

    // check to
    if (!actualTo.length) return { 
      data,
    };

    // get page
    const page = await new Query({
      struct : 'email',
    }, 'page').findById(opts.page);

    // check page
    if (!page) return {
      data,
    };

    // get connect
    const connect = (page.get('connects') || []).find((c) => c.uuid === action.from);

    // check page
    if (!connect) return {
      data,
    };

    // send
    this.dashup.send(connect, actualTo, subject, action.body, data);

    // return data
    return {
      data,
    };
  }
}