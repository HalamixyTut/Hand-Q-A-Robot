import React from 'react';

class ListQuestion extends React.Component{
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
      const {isChecked, questionInfo} =
        {
          isChecked: !this.state.isChecked,
          questionInfo: this.props.question,
        };

      this.props.dealList({isChecked, questionInfo});
    }
  }

  render() {
    return(
      <tr>
        <td className="check-box-position">
          <input
            type="checkbox"
            checked={this.state.isChecked}
            onChange={this.toggleCheck.bind(this)}
          />
        </td>
        <td>{this.props.question.name}</td>
        <td>
          <a href="/dashboard/addknowledge">
            <i className="fa fa-mail-forward" />
          </a>
        </td>
        <td>
          <a>
            <i
              onClick={()=>this.props.changeName(this.props.question.name)}
              data-toggle="modal"
              data-target="#addSameKnowledge"
              className="fa fa-edit"
            />
          </a>
        </td>
      </tr>
    );
  }
}

export default ListQuestion;
