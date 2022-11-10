import React from 'react';

class ListPermission extends React.Component{
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
      const {isChecked, permissionInfo} =
        {
          isChecked: !this.state.isChecked,
          permissionInfo: this.props.permission,
        };

      this.props.dealList({isChecked, permissionInfo});
    }
  }

  render() {
    return(
      <tr className="tr-title-space">
        <td className="check-box-position">
          <input
            type="checkbox"
            checked={this.state.isChecked}
            onChange={this.toggleCheck.bind(this)}
          />
        </td>
        <td>{this.props.permission.name}</td>
        <td>{this.props.permission.desc}</td>
      </tr>
    );
  }
}

export default ListPermission;
