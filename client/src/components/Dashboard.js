import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';
import requireAuth from './requireAuth';

const styles = {
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

class Dashboard extends Component {
  render() {
    return (
      <div style={styles}>
        <Message info>
          <Message.Header>Thank you for signing up!</Message.Header>
          <p>Player Transaction section will be available soon.</p>
        </Message>
      </div>
    );
  }
}

export default requireAuth(Dashboard);
