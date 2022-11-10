import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import { FormattedMessage } from 'react-intl';
import KefuWindow from './kefu_window';
import KefuInput from './kefu_input';
import {Immsg} from '../../../../api/chat/im_msg';

class KefuChat extends React.Component {
  sendMessage(msg) {
    const imId = this.props.immsgs._id;
    const userId = this.props.thirdId;

    const imMsg = {
      sourceId: userId,
      sourceName: userId,
      msg: msg,
      isRead: false,
      data: new Date(),
    };

    Meteor.call('immsgs.insert',imId, imMsg)
  }

  render() {
    return (
      <div className="col-md-5 chat-window">
        <div className="box box-primary direct-chat direct-chat-primary">
          <div className="box-header with-border">
            <h3 className="box-title">
              <FormattedMessage
                id="StaffService"
                defaultMessage="人工客服"
              />
            </h3>
          </div>
          <KefuWindow
            immsgs={this.props.immsgs}
            thirdId={this.props.thirdId}
          />
          <KefuInput
            sendMessage={this.sendMessage.bind(this)}
            immsgs={this.props.immsgs}
          />
        </div>
      </div>
    );
  }
}

export default withTracker(({thirdId}) => {
  Meteor.subscribe('immsgs', thirdId);

  if(thirdId) {
    return {
      immsgs: Immsg.findOne({_id: new RegExp(thirdId)}),
    }
  }else {
    return {
      immsgs: Immsg.findOne({_id: ''}),
    }
  }
})(KefuChat);
