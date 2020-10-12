
// import connect interface
import { Struct } from '@dashup/module';

/**
 * build address helper
 */
export default class EmailAction extends Struct {
  /**
   * construct email connector
   *
   * @param args 
   */
  constructor(...args) {
    // run super
    super(...args);
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
    return 'fa fa-email';
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
  async run({ req, dashup }, action, data) {
    // @todo run txt
  }
}