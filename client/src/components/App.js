import React, { Component } from 'react';
// import Header from './Header';
import HeaderBar from './HeaderBar';
import { NavLink } from 'react-router-dom';
import {
  Container, Icon, Image, Menu, Sidebar, Responsive
} from "semantic-ui-react";

const leftItems = [
  { as: NavLink, content: "Sign Up", to: "/signup" },
  { as: NavLink, content: "Sign In", to: "/signin" }
];
const rightItems = [
  { as: "a", content: "Login", key: "login" },
  { as: "a", content: "Register", key: "register" }
];

class App extends Component {
  state = {
    visible: false
  };

  handlePusher = () => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  handleToggle = () => this.setState({ visible: !this.state.visible });

  render() {
    const { children } = this.props;
    const { visible } = this.state;

    return (
      <div>
        {/* <Header/> */}
        {/* <HeaderBar/> */}
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
                <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
              </Menu.Item>
              <Menu.Item onClick={this.handleToggle}>
                <Icon name="sidebar" />
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item as={NavLink} exact to='/signup' content='Sign Up' />
                <Menu.Item as={NavLink} exact to='/signin' content='Sign In' />
                <Menu.Item as={NavLink} exact to='/signout' content='Sign Out' />
              </Menu.Menu>
            </Menu>
            <Container style={{ marginTop: "5em" }}>{children}</Container>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Menu fixed="top" inverted>
            <Menu.Item>
              <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
            </Menu.Item>
            <Menu.Item as={NavLink} exact to='/signup' content='Sign Up' />
            <Menu.Item as={NavLink} exact to='/signin' content='Sign In' />
            <Menu.Item as={NavLink} exact to='/signout' content='Sign Out' />
            <Menu.Item as={NavLink} exact to='/players' content='Players' />
            <Menu.Menu position="right">
              <Menu.Item as={NavLink} exact to='/signup' content='Sign Up' />
              <Menu.Item as={NavLink} exact to='/signin' content='Sign In' />
              <Menu.Item as={NavLink} exact to='/signout' content='Sign Out' />
              <Menu.Item as={NavLink} exact to='/players' content='Players' />
            </Menu.Menu>
          </Menu>
          <Container style={{ marginTop: "5em" }}>{children}</Container>
        </Responsive>
      </div>
    );
  }
};

export default App;
