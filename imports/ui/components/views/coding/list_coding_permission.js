import React from 'react';

class ListCodingPermission extends React.Component{
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
      const {isChecked, codingInfo} =
        {
          isChecked: !this.state.isChecked,
          codingInfo: this.props.coding,
        };

      this.props.dealList({isChecked, codingInfo});
    }
  }

  handleEdit(){
    if (this.props.cname) {
      this.props.cname(this.props.coding.name)
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
        <td>{this.props.coding.name}</td>
        <td>{this.props.coding.desc}</td>
        <td>
          <a>
            <i
              data-toggle="modal"
              data-target="#optionEdit"
              onClick={this.handleEdit.bind(this)}
              className="fa fa-edit"
            />
          </a>
        </td>
      </tr>
    );
  }
}

export default ListCodingPermission;
