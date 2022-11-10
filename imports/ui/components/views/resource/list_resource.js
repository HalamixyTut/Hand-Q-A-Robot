import React from 'react';
import {Common} from '../utils/common';

class ListResource extends React.Component{
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
    this.setState({
      isChecked: !this.state.isChecked,
    });

    if(this.props.dealList){
      const {isChecked, resourceInfo} =
        {
          isChecked: !this.state.isChecked,
          resourceInfo: this.props.resource,
        };

      this.props.dealList({isChecked, resourceInfo});
    }
  }

  render() {
    const {resource, options} = this.props;

    return(
      <tr className="tr-title-space">
        <td className="check-box-position">
          <input
            type="checkbox"
            checked={this.state.isChecked}
            onChange={this.toggleCheck.bind(this)}
          />
        </td>
        <td>{resource.name}</td>
        <td>{Common.getCodeMeaningByValue(options, resource.type)}</td>
        <td>{resource.desc}</td>
      </tr>
    );
  }
}

export default ListResource;
