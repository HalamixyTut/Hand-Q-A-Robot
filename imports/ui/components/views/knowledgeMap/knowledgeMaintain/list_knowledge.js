import React from 'react';

class ListKnowledge extends React.Component{
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

    if(this.props.dealKnowledgeList){
      const {isChecked, knowledgeInfo} =
        {
          isChecked: !this.state.isChecked,
          knowledgeInfo: this.props.question,
        };

      this.props.dealKnowledgeList({isChecked, knowledgeInfo});
    }
  }

  handle() {
    if (this.props.dealKnowledgeList1) {
      const knowledgeInfo = this.props.question;
      this.props.dealKnowledgeList1(knowledgeInfo);
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
        <td><a className="listknowledge" onClick={this.handle.bind(this)}>{this.props.question.standard}</a></td>
        <td>{this.props.question.similar.length +1}</td>
        {/*待定后续开发*/}
        {/*<td>{1}</td>
        <td>{this.props.question.source}</td>*/}
      </tr>
    );
  }
}

export default ListKnowledge;
