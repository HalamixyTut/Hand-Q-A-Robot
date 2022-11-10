import React from 'react';
import {Common} from '../../utils/common';

class ListParty extends React.Component{
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
      const { thirdParty } = this.props;
      const {isChecked, partyId, code, name, algorithm, roleName} =
        {
          isChecked: !this.state.isChecked,
          partyId: thirdParty._id,
          code: thirdParty.code,
          name: thirdParty.name,
          algorithm: thirdParty.algorithm,
          roleName: thirdParty.roleName,
        };

      this.props.dealList({isChecked, partyId, code, name, algorithm, roleName});
    }
  }

  render() {
    const {thirdParty, options} = this.props;

    return(
      <tr className="tr-title-space">
        <td className="check-box-position">
          <input
            type="checkbox"
            checked={this.state.isChecked}
            onChange={this.toggleCheck.bind(this, thirdParty)}
          />
        </td>
        <td>{thirdParty.code}</td>
        <td>{thirdParty.name}</td>
        <td>{Common.getCodeMeaningByValue(options, thirdParty.algorithm)}</td>
        <td>{thirdParty.roleName}</td>
      </tr>
    );
  }
}

export default ListParty;
