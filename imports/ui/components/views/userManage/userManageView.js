import React from 'react';
import ShowUser from './showUser';
import AddUserPop from './addUserPop';

class UserManageView extends React.Component {

  constructor(props){
    super(props);
    this.state={
      queryKey:'',
      paginationSkip:0,
      paginationLimit:10,
    }
  }

  getQueryKey(username) {
    this.setState(
      {
        queryKey:username,
        paginationSkip:0,
      },
    )
  }

  getDataRange(paginationLimit, pagenationSkip){
    this.setState({
      paginationSkip:pagenationSkip,
      paginationLimit:paginationLimit,
    });
  }

  render() {
    return(
      <div className="statistic-content">
        <section className="content">
          <div className="row">
            <AddUserPop />
            <ShowUser
              queryKey={this.state.queryKey||'none'}
              stateUp={this.getQueryKey.bind(this)}
              limit={this.state.paginationLimit}
              skip={this.state.paginationSkip}
              getDataRange={this.getDataRange.bind(this)}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default UserManageView;
