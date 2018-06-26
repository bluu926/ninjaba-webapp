import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react'

class HeaderBar extends Component {
  render() {
    return (
      <Menu stackable>
        <Menu.Item as={NavLink} exact to='/' content='Home' />
        <Menu.Item as={NavLink} exact to='/dashboard' content='Dashboard' />
        {/* <Menu.Item as={NavLink} exact to='/players' content='Players' /> */}
        <Menu.Item as={NavLink} exact to='/signout' content='Sign Out' />
        <Menu.Item as={NavLink} exact to='/signup' content='Sign Up' />
        <Menu.Item as={NavLink} exact to='/signin' content='Sign In' />
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps)(HeaderBar);
