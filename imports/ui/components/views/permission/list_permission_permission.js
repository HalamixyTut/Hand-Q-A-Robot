import React from 'react';

class ListPermissionPermission extends React.Component{
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

  handleClick() {
    if(this.props.editResource) {
      this.props.editResource(this.props.permission)
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
        <td>
          <a>
            <i
              data-toggle="modal"
              data-target="#PermissionShowResource"
              onClick={this.handleClick.bind(this)}
              className="fa fa-edit"
            />
          </a>
        </td>
      </tr>
    );
  }
}

export default ListPermissionPermission;
