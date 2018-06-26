import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';

const styles = {
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

class Home extends Component {
  render() {
    return (
      <div style={styles}>
        <Message warning>
          <Message.Header>Welcome to Ninja Basketball!</Message.Header>
          <p>Please Sign up or Sign in.</p>
        </Message>
      </div>
    );
  }
};

export default Home;
