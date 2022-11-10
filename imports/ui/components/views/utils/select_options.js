import React from 'react';

const getOptions = async (cname) => {
  return await fetch('/api/options', {
    method: 'POST',
    body: JSON.stringify({cname}),
    cache: 'no-cache',
    headers: {
      'Content-Type':'application/json;charset=UTF-8',
    },
    mode: 'cors',
    redirect: 'follow',
    referrer: 'no-referrer',
  })
    .then(res =>res.json())
    .then((data) => data)
    .catch((err) => []);
};

class SelectOptions extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      cname: props.cname,
    }
  }

  componentDidMount() {
    getOptions(this.state.cname).then(data => this.setState({data}));
  }

  render() {
    const state = this.state;
    const props = this.props;

    return(
      state.data ?
        <select
          className="form-control"
          defaultValue={props.defaultValue}
          value={props.value}
          onChange={(e) => props.onChange(e)}
          placeholder={props.placeholder}
        >
          {
            state.data.map((option) => <option key={option._id} value={option.name}>{option.mean}</option>)
          }
        </select>
        : null
    );
  }
}

export {getOptions, SelectOptions};
