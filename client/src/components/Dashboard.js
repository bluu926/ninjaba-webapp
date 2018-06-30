import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux';
import { Button, Divider, Icon, List, Message } from 'semantic-ui-react';
import requireAuth from './requireAuth';
import * as waiveeActions from '../actions/waivees';

const styles = {
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

class Dashboard extends Component {
  componentDidMount() {
    this.props.getOwnerWaivees({ email: this.props.userEmailAddress });
  }

  render() {
    let waivees = this.props.waiveePlayersList;

    let dropList = waivees.map((waivee, index) => {
      return (
        <List.Item key={waivee._id}>
          <List.Content>
            <List.Header>
              <Button icon>
                <Icon name='minus' size='large' verticalAlign='middle' />
              </Button>
              <Button icon>
                <Icon name='arrow down' size='large' verticalAlign='middle' />
              </Button>
              <Button icon>
                <Icon name='arrow up' size='large' verticalAlign='middle' />
              </Button>
              {waivee.addPlayerName}
            </List.Header>
          </List.Content>
        </List.Item>
      );
    });

    return (
      <div>
        <div style={styles}>
          <Message info>
            <Message.Header>Thank you for signing up!</Message.Header>
            <p>Player Transaction section will be available soon.</p>
          </Message>
        </div>
        <Divider />
        <div>
          <List selection>
            {dropList}
          </List>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        authenticated: state.auth.authenticated,
        waiveeListSuccess: state.waivee.waiveeListSuccess,
        waiveeListErrored: state.waivee.waiveeListErrored,
        waiveePlayersList: state.waivee.waiveePlayersList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getOwnerWaivees: ({ email }) => dispatch(waiveeActions.getOwnerWaivees({ email }))
    };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
  // requireAuth
)(Dashboard);
