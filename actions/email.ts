
// import connect interface
import Bottleneck from 'bottleneck';
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
    this.bulkAction = this.bulkAction.bind(this);
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
      config : 'action/email',
    };
  }

  /**
   * returns object of views
   */
  get actions() {
    // return object of views
    return {
      run  : this.runAction,
      bulk : this.bulkAction,
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
    this.dashup.send(opts, connect, {
      to   : actualTo,
      item : data.item && data.item._id,
      user : data.user || opts.user,
      body : action.body,
      data,
      subject,
    });

    // return data
    return {
      data,
    };
  }

  

  /**
   * bulk action
   *
   * @param opts 
   * @param connect 
   * @param param2 
   */
  async bulkAction(opts, connect, { user, body, subject, query }) {
    // load form
    const [page, form] = await new Query(opts, 'page').findByIds([opts.page, opts.form]);

    // check page
    if (!page) return;

    // get fields
    const emailField = (form.get('data.fields') || []).find((f) => f.uuid === page.get('data.field.email'));

    // get query
    const getQuery = () => {
       // check id
      let actualQuery = new Query({
        type   : 'connect',
        page   : opts.page,
        model  : page.get('data.model'),
        struct : 'gmail',
      }, 'model');

      // loop
      query.forEach(([fn, val]) => {
        // query
        actualQuery = actualQuery[fn](...val);
      });

      // return actual query
      return actualQuery;
    };

    // count
    const count = await getQuery().count();

    // template
    const subjectTemplate = handlebars.compile(subject);

    // create limiter
    const limiter = new Bottleneck({
      minTime       : 250,
      maxConcurrent : 25,
    });

    // create schedule
    const items = await getQuery().find();

    // for each
    items.forEach((item) => {
      // schedule
      limiter.schedule(() => {
        // send
        return this.dashup.send({
          ...opts,
        }, connect, {
          body,
          to      : [item.get(emailField.name || emailField.uuid)],
          data    : item.sanitise(),
          user    : user || opts.user,
          item    : item.get('_id'),
          subject : subjectTemplate(item.sanitise()),
        });
      });
    });

    // count
    return {
      count,
    };
  }
}