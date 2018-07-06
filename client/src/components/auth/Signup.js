import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux'
import { connect } from 'react-redux';
import { Button, Icon, Form, Label } from 'semantic-ui-react';
import * as actions from '../../actions';

const required = value => (value || typeof value === 'number' ? undefined : 'Required');

const styles = {
  textAlign: 'center'
};

const renderField = ({
    input, label, type, meta: { touched, error, warning }
  }) => (
      <Form.Field>
        <div style={{display: "inline-block", textAlign: "left", width:"370px"}}>
          <Label>
            {label}<Icon style={{"padding-left":"5px"}} name="asterisk" />
          </Label>
          <Form.Input {...input} placeholder={label} type={type} error={false} />
          {touched && ((error && <span>
            <Label style={{"margin-top": "0em"}}color='red' pointing>
              {error}
            </Label>
            </span>) || (warning && <span>{warning}</span>))}
        </div>
      </Form.Field>
);

class Signup extends Component {
  onSubmit = formProps => {
    this.props.signup(formProps, () => {
      this.props.history.push('/Dashboard');
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
            label="Name"
            name="name"
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
          <Button color='teal'><Icon name="basketball ball" />Sign Up!</Button>
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
