/*eslint-disable react/no-unused-state*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SideBarUserPanel from './sidebar_user_panel';
import SideBarMenu from './sidebar_menu';

export default class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $('.sidebar-menu').tree();
  }

  userDisplayName() {
    const currentUser = this.props.user;
    let name = 'aibot';

    if (currentUser) {
      //name = currentUser.emails[0].address;
      name = currentUser.username;
    }

    return name;
  }

  render() {
    return (
      <aside className="main-sidebar">
        <section className="sidebar">
          <SideBarUserPanel userName={this.userDisplayName()}/>
          {/*待定后续开发*/}
          {/*<SideBarSearchPanel/>*/}
          <SideBarMenu
            userCount={this.props.users.length}
          />
        </section>
      </aside>
    );
  }
}

SideBar.propTypes = {
  user: PropTypes.object,
  users: PropTypes.array,
};
