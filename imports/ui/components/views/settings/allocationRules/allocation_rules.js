import React from 'react';
import ShowParty from './show_party';
import AddParty from './add_party';
import UpdateParty from './update_party';

class AllocationRules extends React.Component {
  constructor() {
    super();
    this.state = {
      party: [],
    }
  }

  setUpdate(party) {
    this.setState({party})
  }

  render() {
    return(
      <React.Fragment>
        <AddParty />
        <UpdateParty partyInfo={this.state.party[0]} />
        <ShowParty
          setUpdate={this.setUpdate.bind(this)}
        />
      </React.Fragment>
    );
  }
}

export default AllocationRules;
