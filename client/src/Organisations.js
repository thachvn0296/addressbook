import React, { Component, useState } from "react";
import axios from 'axios';
import { Link, Route, matchPath, withRouter, useParams, useRouteMatch } from "react-router-dom";
import { Table, Modal, Button } from 'react-bootstrap';
import AutoCompleteField from './components/AutoCompleteInput'
import "./misc-style.scss";

const Organisation = (props) => {
  return (
    <tr key={props.id}>
      <td>{props.id}</td>
      <td>{props.name}</td>
      <td>{props.active ? "Yes" : "No"}</td>
      <td><a href="#" onClick={props.handleShow}> <i className="fas fa-eye" ></i></a></td>
    </tr>
  );
};


class Organisations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organisationData: {},
      showDialog: false,
      activeOrganisation: {},
      dialogTitle: "",
      dialogFormData: {
        id: "",
        name: "",
        address: "",
        phonenumber: "",
        email: "",
        active: true
      },
      addFormStatus: false
    };
  }

  callAPI() {
    axios.get(`http://localhost:9000/organisations`, {})
      .then(res => {
        var arr = [];
        Object.keys(res).forEach(function (key) {
          arr.push(res[key]);
        });
        // remove first element (default Org - no org)
        arr[0].shift();
        this.setState({ organisationData: arr[0] })
      }).catch(function (error) {
        this.setState({ organisationData: [] })
      });
  }

  initActiveUserState() {
    this.setState({
      activeOrganisation: {
        id: "",
        name: "",
        address: "",
        phonenumber: "",
        email: "",
        active: true
      }
    })
  }

  componentDidMount() {
    this.callAPI();
    this.initActiveUserState();
    let path = window.location.pathname;
  }

  handleShowViewForm = (organisation) => {
    this.setState({ showDialog: true, activeOrganisation: organisation, dialogTitle: "View Information", addFormStatus: false })
  }

  handleHide = () => {
    this.callAPI();
    this.setState({ showDialog: false })
  }

  validateForm = (organisation) => {
    let errorMessage = ''
      + (organisation.name == '' ? 'First Name' : '')
      + (organisation.email == '' ? ' Email' : '');

    errorMessage += errorMessage == '' ? '' : ' is (are) required';
    return errorMessage;
  }


  handleUpdate = (organisation) => {
    // No error
    let errorMessage = this.validateForm(this.state.activeOrganisation);

    if (errorMessage == '') {
      let url = 'http://localhost:9000/organisations/' + this.state.activeOrganisation.id;
      axios.put(url, this.state.activeOrganisation)
        .then(res => {
          alert('succ')
          this.handleHide();
        }).catch(function (error) {
          alert(error)
        });

    } else {
      // alert(errorMessage);
    }
  }

  handleDisable = (organisation) => {

    if (organisation.id != '') {
      let url = 'http://localhost:9000/organisations/' + this.state.activeOrganisation.id;
      axios.delete(url, this.state.activeOrganisation)
        .then(res => {
          alert('succ')
          this.handleHide();
        }).catch(function (error) {
          alert(error)
        });
    } else {
      // alert(errorMessage);
    }
  }

  handleAddNew = () => {
    // Validation
    let errorMessage = this.validateForm(this.state.activeOrganisation);

    if (errorMessage == '') {
      // Call delete API
      axios.post('http://localhost:9000/organisations', this.state.activeOrganisation)
        .then(res => {
          alert('succ')
          this.handleHide();
        }).catch(function (error) {
          alert(error)
        });

    } else {
      // alert(errorMessage);
    }

  }

  handleShowAddForm = () => {
    this.initActiveUserState();
    this.setState({ showDialog: true, dialogTitle: "Add Form", addFormStatus: true })
  }

  handleOptionChange = (selectedOption) => {
    let currentState = this.state.activeOrganisation;
    currentState.organisation = {
      "id": selectedOption.value,
      "name": selectedOption.label
    }
    this.setState({ activeOrganisation: currentState, selectedOption });
  }

  handleChange = (e, targetField) => {
    let currentState = this.state.activeOrganisation;
    switch (targetField) {
      case 'name':
        currentState.name = e.target.value
        break;
      case 'address':
        currentState.address = e.target.value
        break;
      case 'phone':
        currentState.phonenumber = e.target.value
        break;
      case 'email':
        currentState.email = e.target.value
        break;
      case 'active':
        console.log('Change active')
        currentState.active = !currentState.active
        break;
      default:
      // code block
    }

    this.setState({ activeOrganisation: currentState });
  };


  render() {
    let path = window.location.pathname;
    let { organisationData, showDialog, activeOrganisation, dialogTitle, addFormStatus } = this.state;
    return (
      <div>
        {/* Data table */}
        {organisationData.length > 0 &&
          <div>
            <p>
              {organisationData.length} record(s).
            </p>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Organisation name</th>
                  <th>Is Active</th>
                  <th>View more</th>
                </tr>
              </thead>
              <tbody>
                {organisationData.map(organisation => {
                  return (
                    <Organisation key={organisation.id} id={organisation.id} name={organisation.name} active={organisation.active} handleShow={this.handleShowViewForm.bind(this, organisation)} />
                  )
                })}
              </tbody>
            </Table>
            <button className="btn btn-primary" onClick={this.handleShowAddForm.bind(this)}>Add</button>
          </div>
        }

        {/* Dialog */}

        {showDialog
          ?
          <div className={`fade modal-backdrop ${showDialog ? "show" : ""}`}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="modal-title h4">{dialogTitle}</div>
                </div>
                <form>
                  <div className="modal-body">
                    <div>ID: <input type="text" placeholder="ID" value={activeOrganisation.id} className="form-control" onChange={(evt) => { }} disabled={true} /></div>
                    <div>Organisation Name: <span className="required-asterisk">*</span> <input type="text" required placeholder="Last name" value={activeOrganisation.name} onChange={(evt) => this.handleChange(evt, "name")} className="form-control" /></div>
                    <div>Address: <input type="text" placeholder="Address" value={activeOrganisation.address} onChange={(evt) => this.handleChange(evt, "address")} className="form-control" /></div>
                    <div>Phone Number: <input type="text" placeholder="Phone number" value={activeOrganisation.phonenumber} onChange={(evt) => this.handleChange(evt, "phone")} className="form-control" /></div>
                    <div>Email: <span className="required-asterisk">*</span><input type="email" required placeholder="Enter email" value={activeOrganisation.email} onChange={(evt) => this.handleChange(evt, "email")} className="form-control" /></div>
                    <div>Is activate? <input type="checkbox" placeholder="Enter email" checked={activeOrganisation.active} onChange={(evt) => this.handleChange(evt, "active")} className="t" /> </div>
                  </div>
                  <div className="modal-footer">
                    {addFormStatus &&
                      <button type="submit" className="btn btn-info" onClick={this.handleAddNew.bind(this)}>Add</button>}
                    {!addFormStatus && <>
                      <button type="submit" className="btn btn-primary" onClick={this.handleUpdate.bind(this, activeOrganisation)}>Update</button>
                      <button type="button" className="btn btn-danger" onClick={this.handleDisable.bind(this, activeOrganisation)}>Disable</button>
                    </>}
                    <button type="button" className="btn btn-secondary" onClick={this.handleHide.bind(this)}>Close</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          : <div></div>
        }
      </div>
    );
  }

};

export default Organisations;