import React from 'react';
import { Meteor } from 'meteor/meteor';

class ListCrontab extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      isChecked: false,
    }
  }

  componentDidMount() {
    if(this.props.clearCheck) {
      this.setState({isChecked: false});
      this.props.changeClear();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.clearCheck) {
      this.setState({isChecked: false});
      this.props.changeClear();
    }
  }

  // 点击每条记录的checxbox，首先更改当前isChecked的值，然后传递当前记录的值给父组件
  toggleCheck() {
    // console.log(this.state.isChecked);

    this.setState({
      isChecked: !this.state.isChecked,
    });

    if(this.props.dealList){
      const checkedCrontabs =
        {
          isChecked: !this.state.isChecked,
          crontabId: this.props.crontab._id,
          cronName: this.props.crontab.cronName,
        };

      this.props.dealList(checkedCrontabs);
    }
  }

  handleStart() {
    if(this.props.crontab) {
      if(this.props.crontab.status !== 'Running') {
        Meteor.call('crontab.start', this.props.crontab)
      }else {
        $('#cronStart').modal('show');
      }
    }
  }

  handleStop() {
    if(this.props.crontab) {
      if(this.props.crontab.status === 'Running') {
        Meteor.call('crontab.stop', this.props.crontab)
      }else {
        $('#cronStop').modal('show');
      }
    }
  }

  render() {
    const style = {cursor: 'pointer'};
    const {crontab} = this.props;

    return(
      <tr>
        <td className="check-box-position">
          <input
            type="checkbox"
            checked={this.state.isChecked}
            onChange={this.toggleCheck.bind(this)}
          />
        </td>
        <td>{crontab.cronName}</td>
        <td>{crontab.status}</td>
        <td>{crontab.className}</td>
        <td>{crontab.description}</td>
        <td>{crontab.plan}</td>
        <td>
          <span onClick={this.handleStart.bind(this)} style={style}>
            <i className="fa fa-play" id="crontabplay" />
          </span>
          <b> | </b>
          <span onClick={this.handleStop.bind(this)} style={style}>
            <i className="fa fa-stop" id="crontabstop" />
          </span>
        </td>
      </tr>
    );
  }
}

export default ListCrontab;
