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

  cancelWaivee(waiveeId) {
    this.props.cancelWaivee({ email: this.props.userEmailAddress, waiveeId });
  }

  render() {
    let waivees = this.props.waiveePlayersList;

    let dropList = waivees.map((waivee, index) => {
      return (
        <List.Item key={waivee._id}>
          <List.Content>
            <List.Header>
              <Button icon onClick={() => this.cancelWaivee(waivee._id)}>
                <Icon name='minus' size='large' verticalAlign='middle' />
              </Button>
              <Button icon>
                <Icon name='arrow down' size='large' verticalAlign='middle' />
              </Button>
              <Button icon>
                <Icon name='arrow up' size='large' verticalAlign='middle' />
              </Button>
              Bidding <i>${waivee.bid}</i> to add <i>{waivee.addPlayerName}</i> to drop <i>{waivee.dropPlayerName}</i>.
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
            <p>Trading will be availble soon.</p>
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
        userEmailAddress: state.auth.userEmailAddress,
        waiveeListSuccess: state.waivee.waiveeListSuccess,
        waiveeListErrored: state.waivee.waiveeListErrored,
        waiveePlayersList: state.waivee.waiveePlayersList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getOwnerWaivees: ({ email }) => dispatch(waiveeActions.getOwnerWaivees({ email })),
        cancelWaivee: ({ email, waiveeId }) => dispatch(waiveeActions.cancelWaivee({ email, waiveeId }))
    };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
  // requireAuth
)(Dashboard);
