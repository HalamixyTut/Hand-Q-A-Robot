import React from 'react';

class ResourceOption extends React.Component{
  constructor() {
    super();
  }

  render() {
    return(
      <option value={this.props.option.name}>{this.props.option.mean}</option>
    );
  }
}
export default ResourceOption;
