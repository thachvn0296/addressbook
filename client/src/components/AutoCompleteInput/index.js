
import React from 'react';
import axios from 'axios';
import Select from 'react-select';

export default class AutoCompleteInput extends React.Component {
  state = {
    options: []
  }

  handleChange = (selectedOption) => {
    // Update avlue back to parent componetn
    this.setState({ selectedOption });
  }

  componentDidMount() {
    // get data from api
    axios.get(`http://localhost:9000/organisations`, {})
      .then(res => {
        // All organise data
        let data = res.data;

        // Only keep active organisation on the dropdown
        let filteredData = [];
        let entry = {};
        while( (entry = data.shift()) !== undefined ) {
          console.log(entry);
          if (entry.active) filteredData.push(entry)
        }

        // reformat the data
        let mapData = filteredData.map(option => { return { value: option.id, label: option.name } });

        // save the data to dropdown state
        this.setState({ options: mapData ? mapData : [] });
      }).catch( (error) => {
        this.setState({ options: [] })
      });
  }

  render() {
    const { options } = this.state;
    let defaultValue = {
      label: this.props.defaultValue.name,
      value: this.props.defaultValue.id
    }
    return (
      <div className="">
        <Select options={options} onChange={this.props.handleChange} defaultValue={defaultValue} />
      </div>
    )
  }
}
