import React from 'react';
import {Common} from '../utils/common'

class ListBulletin extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      ...props.bulletin,
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
      const {isChecked, bulletinId, bulletinTitle, bulletinContent, bulletinType} =
        {
          isChecked: !this.state.isChecked,
          bulletinId: this.props.bulletin._id,
          bulletinTitle: this.props.bulletin.title,
          bulletinContent: this.props.bulletin.content,
          bulletinType: this.props.bulletin.type,
        };

      this.props.dealList({isChecked, bulletinId, bulletinTitle, bulletinContent, bulletinType});
    }
  }

  render() {
    const state = this.state;
    return(
      <tr className="tr-title-space">
        <td className="check-box-position">
          <input
            type="checkbox"
            checked={state.isChecked}
            onChange={this.toggleCheck.bind(this)}
          />
        </td>
        <td>{state.title}</td>
        <td>{state.content}</td>
        <td>{Common.getCodeMeaningByValue(this.props.options, state.type)}</td>
        <td>{state.updateDate.toLocaleString()}</td>
      </tr>
    );
  }
}

export default ListBulletin;
