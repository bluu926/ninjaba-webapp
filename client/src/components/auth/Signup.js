import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux'
import { connect } from 'react-redux';
import { Button, Message, Icon, Form, Input } from 'semantic-ui-react';
import * as actions from '../../actions';

const required = value => (value || typeof value === 'number' ? undefined : 'Required');

const styles = {
  textAlign: 'center'
};

const renderField = ({
    input, label, type, meta: { touched, error, warning }
  }) => (
      <Form.Field>
        <Form.Input style={{width:"370px"}} {...input} label={label} placeholder={label} type={type} error={false} />
        <Message success header="Test" />
        {touched && ((error && <span><Message error header={error} /></span>) ||
                      (warning && <span>{warning}</span>))}
      </Form.Field>
);

class Signup extends Component {
  onSubmit = formProps => {
    this.props.signup(formProps, () => {
      this.props.history.push('/feature');
    });
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div style={styles}>
        <Form onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            label="Email Address"
            name="email"
            type="text"
            component={renderField}
            autoComplete="none"
            validate={required}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            component={renderField}
            autoComplete="none"
            validate={required}
          />
          <div>
            {this.props.errorMessage}
          </div>
          <Button><Icon name="save" />Sign Up!</Button>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.errorMessage };
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: 'signup' })
)(Signup)
