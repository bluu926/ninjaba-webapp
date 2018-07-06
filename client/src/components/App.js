import _ from "lodash";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import {
  Container, Icon, Image, Menu, Sidebar, Responsive
} from "semantic-ui-react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  handlePusher = () => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  handleToggle = () => this.setState({ visible: !this.state.visible });

  render() {
    let leftItems = [
      { as: NavLink, key: '1', exact: true, content: "Home", to: "/" },
      { as: NavLink, key: '2', exact: true, content: "Dashboard", to: "/dashboard" },
      { as: NavLink, key: '3', exact: true, content: "Players", to: "/players" },
      { as: NavLink, key: '4', exact: true, content: "Transactions", to: "/transactions" }
    ];

    let rightItems = [
      { as: NavLink, key: '1', exact: true, content: "Register", to: "/signup" },
      { as: NavLink, key: '2', exact: true, content: "Sign In", to: "/signin" },
      { as: NavLink, key: '3', exact: true, content: "Sign out", to: "/signout" }
    ];

    if(this.props.authenticated) {
      rightItems = [
        { as: NavLink, key: '3', exact: true, content: "Sign out", to: "/signout" }
      ];
    }

    const { children } = this.props;
    const { visible } = this.state;

    return (
      <div>
        {/* <Header/> */}
        <Responsive {...Responsive.onlyMobile}>
          <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="overlay"
            icon="labeled"
            inverted
            items={leftItems}
            vertical
            visible={visible}
          />
          <Sidebar.Pusher
            dimmed={visible}
            onClick={this.handlePusher}
            style={{ minHeight: "100vh" }}
          >
            <Menu fixed="top" inverted>
              <Menu.Item>
                <Image size="mini" src="http://urbanballr.com/wp-content/uploads/2014/10/basketball-icon-blue.png" />
              </Menu.Item>
              <Menu.Item onClick={this.handleToggle}>
                <Icon name="sidebar" />
              </Menu.Item>
              <Menu.Menu position="right">
                {_.map(rightItems, item => <Menu.Item {...item} />)}
              </Menu.Menu>
            </Menu>
            <Container style={{ marginTop: "5em" }}>{children}</Container>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Menu fixed="top" inverted>
            <Menu.Item>
              <Image size="mini" src="http://urbanballr.com/wp-content/uploads/2014/10/basketball-icon-blue.png" />
            </Menu.Item>
            {_.map(leftItems, item => <Menu.Item {...item} />)}
            <Menu.Menu position="right">
              {_.map(rightItems, item => <Menu.Item {...item} />)}
            </Menu.Menu>
          </Menu>
          <Container style={{ marginTop: "5em" }}>{children}</Container>
        </Responsive>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}

export default withRouter(connect(mapStateToProps)(App));
