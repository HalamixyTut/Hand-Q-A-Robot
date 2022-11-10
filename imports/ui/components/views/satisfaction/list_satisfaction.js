import React from 'react';

class ListSatisfaction extends React.Component{
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
      const {isChecked, satisfactionInfo} =
        {
          isChecked: !this.state.isChecked,
          satisfactionInfo: this.props.satisfaction,
        };

      this.props.dealList({isChecked, satisfactionInfo});
    }
  }

  render() {
    return(
      <tr>
        <td>
          <input
            type="checkbox"
            checked={this.state.isChecked}
            onChange={this.toggleCheck.bind(this)}
          />
        </td>
        <td>{this.props.satisfaction.ques}</td>
        <td>{this.props.satisfaction.answer}</td>
        <td>{this.props.satisfaction.satisfaction == -1 ? '不满意' : this.props.satisfaction.satisfaction == 0 ? '未评价' : '满意'}</td>
      </tr>
    );
  }
}

export default ListSatisfaction;
