/* eslint-disable import/no-unresolved */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import KefuChat from './kefu_chat';
import RightSider from '../chatRoom/rightSider';

class KefuRoom extends React.Component{
  constructor() {
    super();

    this.state = {
      thirdId: '',
    }
  }

  componentWillMount() {
    if(this.props.match.params.token) {
      const self = this;
      const token = this.props.match.params.token;

      Meteor.call('get.thirdId', token, function (err, thirdId) {
        if(!err && thirdId) {
          self.setState({thirdId})

          setTimeout(() => {
            self.clearClientData(thirdId);
          }, 1000*60*30)
        }
      })
    }
  }

  componentWillUnmount() {
    const { thirdId } = this.state;
    this.clearClientData(thirdId);
  }

  clearClientData = (thirdId) => {
    Meteor.call('change.active.status', thirdId, (err, result) => {
      if(!err) {
        Meteor.disconnect();
      }
    });
  };

  render() {
    return (
      <div>
        <div className="main-header home-header">
          <nav className="navbar navbar-default navbar-fixed-top">
            <div className="container">
              <div className="navbar-header">
                <button
                  type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                  data-target="#navbar-collapse"
                >
                  <i className="fa fa-bars" />
                </button>
                <a href="/" className="navbar-brand">
                  <img alt="hand" src="/img/aibot_logo.png" />
                </a>
              </div>
            </div>
          </nav>
        </div>

        <div className="statistic-content" style={{margin: '4% auto'}}>
          <section className="content">
            <div className="row chat-box col-md-10 col-md-offset-1">
              <KefuChat thirdId={this.state.thirdId} />
              <RightSider />
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default KefuRoom;
