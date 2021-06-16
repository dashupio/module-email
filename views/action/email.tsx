
import React from 'react';
import Select from 'react-select';
import { Alert } from 'react-bootstrap';

// create email
const ActionEmail = (props = {}) => {
  // set action
  const setAction = (key, value = null, prev = false) => {
    // props
    return props.setAction(props.action, key, value, prev);
  };

  // get email
  const getEmail = () => {
    // return emails
    return [...(props.page.get('connects') || [])].filter((e) => e.email).map((connect) => {
      return {
        label    : connect.email,
        value    : connect.uuid,
        selected : props.action.from === connect.uuid,
      }
    });
  };

  // return jsx
  return (
    <>
      { getEmail().length ? (
        <div className="mb-3">
          <label className="form-label">
            Email Sender
          </label>
          <Select options={ getEmail() } defaultValue={ getEmail().filter((f) => f.selected) } onChange={ (val) => setAction('from', val?.value) } />
        </div>
      ) : (
        <Alert variant="info" onClick={ (e) => props.onConfig(e) }>
          <i className="fa fa-exclamation-triangle me-2" />
          Please select an <b>email</b> for this action.
        </Alert>
      ) }
      
      <div className="mb-3">
        <label className="form-label">
          Email Recipient(s)
        </label>
        <input className="form-control" value={ props.action.to || '' } type="text" onChange={ (e) => setAction('to', e.target.value) } />
        <small>Seperate with <code>,</code></small>
      </div>
      <div className="mb-3">
        <label className="form-label">
          Email Subject
        </label>
        <input className="form-control" value={ props.action.subject || '' } type="text" onChange={ (e) => setAction('subject', e.target.value) } />
      </div>
      <div className="mb-3">
        <label className="form-label">
          Email Body
        </label>
        EDITOR
      </div>
    </>
  );
};

// export default
export default ActionEmail;