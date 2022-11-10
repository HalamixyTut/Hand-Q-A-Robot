/* eslint-disable import/no-unresolved */
import React, { Component } from 'react';

class ShowRolePermission extends Component {
  constructor(props) {
    super(props);
    this.permission = React.createRef();

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
  toggleChecked() {
    this.setState({
      isChecked: !this.state.isChecked,
    });

    if(this.props.dealRoleList) {
      const {isChecked, roleInfo} =
        { isChecked: !this.state.isChecked,
          roleInfo:this.props.role,
        };
      this.props.dealRoleList({isChecked, roleInfo});
    }
  }

  // 为角色分配权限时，传递改角色的信息
  handleClick() {
    if(this.props.editPermission) {
      this.props.editPermission(this.props.role)
    }
  }

  render() {
    return (
      <tr className="tr-title-space">
        <td className="check-box-position">
          <input
            type="checkbox"
            checked={this.state.isChecked}
            onChange={this.toggleChecked.bind(this)} />
        </td>
        <td>{this.props.role.name}</td>
        <td>{this.props.role.desc}</td>
        <td>
          <a>
            <i
              data-toggle="modal"
              data-target="#roleShowPermission"
              onClick={this.handleClick.bind(this)}
              className="fa fa-edit"
            />
          </a>
        </td>
      </tr>
    );
  }
}

export default ShowRolePermission;
