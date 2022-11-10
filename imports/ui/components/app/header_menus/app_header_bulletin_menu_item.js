import React from 'react';
import PropTypes from 'prop-types';

class AppHeaderBulletinMenuItem extends React.Component {
  handleClick(item) {
    if(this.props.bulletinInfo) {
      this.props.bulletinInfo(item)
    }
  }

  render() {
    const item = this.props.item;
    return(
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
      <li data-toggle="modal" data-target="#appHeaderBulletin" onClick={this.handleClick.bind(this, item)}>
        <a href="#">
          <i className={this.props.classNames} /> {item.title}
          <p>({item.updateDate.toLocaleString()})</p>
        </a>
      </li>
    );
  }
}

AppHeaderBulletinMenuItem.propTypes = {
  classNames: PropTypes.string,
  item: PropTypes.object,
};

export default AppHeaderBulletinMenuItem;
