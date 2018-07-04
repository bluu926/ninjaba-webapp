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

  changeWaiveeRank(waiveeId, movement) {
    this.props.changeWaiveeRank({ waiveeId, movement });
  }

  renderMessage() {
    if(this.props.waiveeListSuccess) {
        return (
          <Message positive>
            <Message.Header>Success!</Message.Header>
            <p>{this.props.waiveeListSuccess}</p>
          </Message>
        );
    }
  }

  renderAlert() {
    if(this.props.waiveeListErrored) {
      return (
        <Message negative>
          <Message.Header>Error!</Message.Header>
          <p>{this.props.waiveeListErrored}</p>
        </Message>
      );
    }
  }

  render() {
    let waivees = this.props.waiveePlayersList;

    let dropList = waivees.map((waivee, index) => {
      return (
        <List.Item key={waivee._id}>
          <List.Content>
            <Message>
              <Button icon onClick={() => this.cancelWaivee(waivee._id)}>
                <Icon name='minus' size='large' verticalAlign='middle' />
              </Button>
              <Button icon onClick={() => this.changeWaiveeRank(waivee._id, 'down')}>
                <Icon name='arrow down' size='large' verticalAlign='middle' />
              </Button>
              <Button icon onClick={() => this.changeWaiveeRank(waivee._id, 'up')}>
                <Icon name='arrow up' size='large' verticalAlign='middle' />
              </Button>
              <strong>Bidding ${waivee.bid}</strong> to add <strong>{waivee.addPlayerName}</strong> to drop <strong>{waivee.dropPlayerName}</strong>.
            </Message>
          </List.Content>
        </List.Item>
      );
    });

    return (
      <div>
        <div style={styles}>
          <Message info>
            <Message.Header>Thank you for signing in!</Message.Header>
            <p>Trading will be availble soon.</p>
          </Message>
        </div>
        <Divider />
        {this.renderAlert()}
        {this.renderMessage()}
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
        cancelWaivee: ({ email, waiveeId }) => dispatch(waiveeActions.cancelWaivee({ email, waiveeId })),
        changeWaiveeRank: ({ waiveeId, movement }) => dispatch(waiveeActions.changeWaiveeRank({ waiveeId, movement })),
    };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
  // requireAuth
)(Dashboard);
