/* eslint-disable import/no-unresolved */
import {Meteor} from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, {Component} from 'react';
import {Ldap} from '../../../../api/ldap/ldap';
import LdapSetting from './ldap_setting';

class LdapManager extends Component {
  constructor() {
    super();

    this.state = {ldap: {}}
  }

  componentDidMount() {
    this.$timer = setInterval(() => {
      if(this.props.ldap) {
        clearInterval(this.$timer);
        let ldap = this.props.ldap;
        this.setState({ldap})
      }
    }, 100)

    setTimeout(() => {
      clearInterval(this.$timer);
    }, 3000)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.ldap !== this.state.ldap
  }

  componentWillUnmount() {
    clearInterval(this.$timer);
  }

  render() {
    return (
      <div>
        <LdapSetting ldap={this.state.ldap} />
      </div>
    )
  }
}

export default withTracker(() => {
  Meteor.subscribe('ldaps');

  return {
    ldap: Ldap.findOne(),
  }
})(LdapManager)
