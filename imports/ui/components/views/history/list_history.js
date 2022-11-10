import React from 'react';

class ListHistory extends React.Component{
  constructor() {
    super();

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
    this.setState({
      isChecked: !this.state.isChecked,
    });

    if(this.props.dealList){
      const {isChecked, historyInfo} =
        {
          isChecked: !this.state.isChecked,
          historyInfo: this.props.history,
        };

      this.props.dealList({isChecked, historyInfo});
    }
  }

  render() {
    let signintime1 = '';
    let signouttime1 = '登录中';
    if (this.props.history.signInTime){
      const signintimetest = this.props.history.signInTime.toString().split(' ');
      const signintime = signintimetest.slice(0,5).toString().replace(/,/g,' ');
      signintime1 = signintime;
    }
    if (this.props.history.signOutTime){
      const signouttimetest = this.props.history.signOutTime.toString().split(' ');
      const signouttime = signouttimetest.slice(0,5).toString().replace(/,/g,' ');
      signouttime1 = signouttime;
    }

    return(
      <tr className="tr-title-space">
        <td className="check-box-position">
          <input
            type="checkbox"
            checked={this.state.isChecked}
            onChange={this.toggleCheck.bind(this)}
          />
        </td>
        <td>{this.props.history.ip}</td>
        <td>{this.props.history.username}</td>
        <td>{this.props.history.os}</td>
        <td>{this.props.history.browser}</td>
        <td>{signintime1}</td>
        <td>{signouttime1}</td>
      </tr>
    );
  }
}

export default ListHistory;
