import React from 'react';

class ListAllKnowledge extends React.Component{
  constructor() {
    super();

    this.state = {
      // eslint-disable-next-line react/no-unused-state
      isChecked: false,
    }
  }

  addSameKnowledge() {
    const similar = this.props.knowledge.similar;
    similar.push(this.props.questionName);
    Meteor.call('knowledges.updatesimilar',this.props.knowledge._id,similar,function (err) {
      if (err){
        throw err;
        $('#list-know-fail').modal('show');
      } else {
        $('#list-know-success').modal('show');
      }
    });
  }

  render() {
    return(
      <tr>
        <td>{this.props.knowledge.standard}</td>
        <td>
          <a>
            <i onClick={this.addSameKnowledge.bind(this)} className="fa fa-edit">
            </i>
          </a>
        </td>
      </tr>
    );
  }
}

export default ListAllKnowledge;
