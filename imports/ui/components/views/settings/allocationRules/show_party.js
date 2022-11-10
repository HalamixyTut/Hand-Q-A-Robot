import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import { FormattedMessage } from 'react-intl';
import { ThirdParty } from '../../../../../api/settings/thirdParty/third_party';
import ListParty from './list_party';
import {getOptions} from '../../utils/select_options';
import {DialogUpdate} from '../../utils/modal_dialog';
import {handleDelete as Delete} from "../../utils/common";

class ShowParty extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      party: [],
      isChecked: false,
      options: [], //存储快码
      clearCheck: false,
    }
  }

  componentDidMount() {
    getOptions('customerServiceAlgorithm').then(data => this.setState({options: data}));
  }

  dealList(thirdParty) {
    let flag = 0;

    for(let eachItem of this.state.party) {
      if(eachItem.partyId === thirdParty.partyId) {
        this.state.party.splice(this.state.party.indexOf(eachItem),1);
        this.setState({
          party: this.state.party,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.party.push(thirdParty);

      this.setState({
        party: this.state.party,
      });
    }
  }

  handleUpdate() {
    const { party } = this.state;
    if(party.length > 1 ){
      console.log(11);
      $('#modal-default').modal('show');
    }else if(party.length === 1 ){
      console.log(22);
      if(this.props.setUpdate){
        this.props.setUpdate(party)
      }
      $('#partyUpdate').modal('show');
    }
  }

  handleDelete() {
    Delete('third.party.delete', this.state.party, this, 'party');
  }

  toggleCheck(thirdParty) {
    const { isChecked, party } = this.state;
    let copyParty = party.concat();

    if (!isChecked) {
      for (const eachItem of party) {
        if(eachItem._id === thirdParty._id) {
          copyParty.splice(copyParty.indexOf(eachItem),1);
        }
      }
    } else {
      copyParty.push(thirdParty);
    }

    this.setState({party: copyParty, isChecked: !isChecked});
  }

  changeClear = () => this.setState({clearCheck: false});

  render() {
    return(
      <div className="box">
        <div className="box-header">
          <div className="role-button">
            <form id="room-form">
              <button
                type="button" data-toggle="modal" data-target="#addPartyModal"
                className="btn btn-info pull-left"
              >
                <i className="fa fa-plus-square" />
                <FormattedMessage
                  id="new"
                  defaultMessage="新建"
                />
              </button>
              <button
                id="buttonUpdate"
                type="button"
                className="btn btn-info pull-left btn-edit"
                onClick={this.handleUpdate.bind(this)}
              >
                <i className="fa fa-edit" />
                <FormattedMessage
                  id="update"
                  defaultMessage="更新"
                />
              </button>
              <button type="button" className="btn btn-info pull-left btn-trash" onClick={this.handleDelete.bind(this)}><i className="fa fa-trash-o" />
                <FormattedMessage
                  id="delete"
                  defaultMessage="删除"
                />
              </button>
            </form>
          </div>
        </div>
        <div className="box-body">
          <table id="example2" className="table table-bordered table-hover">
            <thead>
            <tr className="tr-title-space">
              <th></th>
              <th>
                编码
              </th>
              <th>
                <FormattedMessage
                  id="name"
                  defaultMessage="名称"
                />
              </th>
              <th>
                算法
              </th>
              <th>
                关联角色
              </th>
            </tr>
            </thead>
            <tbody>
            {
              this.props.thirdParty.map((thirdParty, index) => {
                return(
                  // eslint-disable-next-line react/jsx-key
                  <ListParty
                    key={thirdParty._id}
                    thirdParty={thirdParty}
                    dealList={this.dealList.bind(this)}
                    options={this.state.options}
                    clearCheck={this.state.clearCheck}
                    changeClear={this.changeClear}
                  />
                );
              })
            }
            </tbody>
          </table>
        </div>

        <DialogUpdate />
      </div>
    )
  }
}

export default withTracker(() => {
  Meteor.subscribe('third.party');

  return{
    thirdParty: ThirdParty.find().fetch(),
  }
})(ShowParty);
