import React, { Component, useState } from "react";
import axios from 'axios';
import { Link, Route, matchPath, withRouter, useParams, useRouteMatch } from "react-router-dom";
import { Table, Modal, Button } from 'react-bootstrap';
import AutoCompleteField from './components/AutoCompleteInput'
import "./misc-style.scss";

const Person = (props) => {
  return (
    <tr key={props.id}>
      <td>{props.id}</td>
      <td>{props.name}</td>
      <td><a href="#" onClick={props.handleShow}> <i className="fas fa-eye" ></i></a></td>
    </tr>
  );
};


class People extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peopleData: {},
      showDialog: false,
      activePerson: {},
      dialogTitle: "",
      dialogFormData: {
        personID: "",
        firstname: "",
        lastname: "",
        address: "",
        phonenumber: "",
        email: "",
        organisation: {
          id: "",
          name: ""
        },
      },
      addFormStatus: false
    };
  }

  callAPI() {
    axios.get(`http://localhost:9000/users`, {})
      .then(res => {
        var arr = [];
        Object.keys(res).forEach(function (key) {
          arr.push(res[key]);
        });
        this.setState({ peopleData: arr[0] })
      }).catch(function (error) {
        this.setState({ peopleData: [] })
      });
  }

  initActiveUserState() {
    this.setState({
      activePerson: {
        "id": "",
        "firstname": "",
        "lastname": "",
        "address": "",
        "phonenumber": "",
        "email": "",
        "organisation": {
          "id": "0",
          "name": "No Data"
        }
      }
    })
  }

  componentDidMount() {
    this.callAPI();
    this.initActiveUserState();
    let path = window.location.pathname;
  }

  handleShowViewForm = (person) => {
    this.setState({ showDialog: true, activePerson: person, dialogTitle: "View Information", addFormStatus: false })
  }

  handleHide = () => {
    this.callAPI();
    this.setState({ showDialog: false })
  }

  handleUpdate = (person) => {
    // Validation
    let errorMessage = this.validateForm(this.state.activePerson);

    // No error
    if (errorMessage == '') {
      let url = 'http://localhost:9000/users/' + this.state.activePerson.id;
      axios.put(url, this.state.activePerson)
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

  handleDelete = (person) => {
    // No error
    if (person.id != '') {
      let url = 'http://localhost:9000/users/' + this.state.activePerson.id;
      axios.delete(url, this.state.activePerson)
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
    let errorMessage = this.validateForm(this.state.activePerson);

    // No error
    if (errorMessage == '') {
      // console.log('Call delete API');
      axios.post('http://localhost:9000/users', this.state.activePerson)
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

  // log validation error
  validateForm = (person) => {
    let errorMessage = ''
      + (person.firstname == '' ? 'First Name' : '')
      + (person.lastname == '' ? ' Last Name' : '')
      + (person.email == '' ? ' Email' : '');

    errorMessage += errorMessage == '' ? '' : ' is (are) required';
    return errorMessage;
  }

  handleOptionChange = (selectedOption) => {
    let currentState = this.state.activePerson;
    currentState.organisation = {
      "id": selectedOption.value,
      "name": selectedOption.label
    }
    this.setState({ activePerson: currentState, selectedOption });
  }

  handleChange = (e, targetField) => {
    let currentState = this.state.activePerson;
    switch (targetField) {
      case 'firstname':
        currentState.firstname = e.target.value
        break;
      case 'lastname':
        currentState.lastname = e.target.value
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
      default:
      // code block
    }
    this.setState({ activePerson: currentState });
  };


  render() {
    let path = window.location.pathname;
    let { peopleData, showDialog, activePerson, dialogTitle, addFormStatus } = this.state;
    return (
      <div>
        {/* Data table */}
        {peopleData.length > 0 &&
          <div>
            <p>
              {peopleData.length} record(s).
            </p>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full name</th>
                  <th>View more</th>
                </tr>
              </thead>
              <tbody>
                {peopleData.map(person => {
                  let fullname = person.firstname + ' ' + person.lastname;
                  return (
                    <Person key={person.id} id={person.id} name={fullname} handleShow={this.handleShowViewForm.bind(this, person)} />
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

                    <div>ID: <input type="text" placeholder="ID" value={activePerson.id} className="form-control" onChange={(evt) => { }} disabled={true} /></div>
                    <div>First Name: <span className="required-asterisk">*</span><input type="text" required placeholder="First name" value={activePerson.firstname} onChange={(evt) => this.handleChange(evt, "firstname")} className="form-control" /></div>
                    <div>Last Name: <span className="required-asterisk">*</span><input type="text" required placeholder="Last name" value={activePerson.lastname} onChange={(evt) => this.handleChange(evt, "lastname")} className="form-control" /></div>
                    <div>Address: <input type="text" placeholder="Address" value={activePerson.address} onChange={(evt) => this.handleChange(evt, "address")} className="form-control" /></div>
                    <div>Phone Number: <input type="text" placeholder="Phone number" value={activePerson.phonenumber} onChange={(evt) => this.handleChange(evt, "phone")} className="form-control" /></div>
                    <div>Email: <span className="required-asterisk">*</span><input type="email" required placeholder="Enter email" value={activePerson.email} onChange={(evt) => this.handleChange(evt, "email")} className="form-control" /></div>
                    <div>Organisation:
                      <input type="hidden" placeholder="Organsation name" value={activePerson.organisation.name} className="form-control" />
                      <input type="hidden" placeholder="Organsation id" value={activePerson.organisation.id} className="form-control" />
                    </div>
                    <div><AutoCompleteField handleChange={this.handleOptionChange.bind(this)} defaultValue={activePerson.organisation}></AutoCompleteField></div>
                  </div>
                  <div className="modal-footer">
                    {addFormStatus &&
                      <button type="submit" className="btn btn-info" onClick={this.handleAddNew.bind(this)}>Add</button>}

                    {!addFormStatus  &&
                      <>
                        <button type="submit" className="btn btn-primary" onClick={this.handleUpdate.bind(this, activePerson)}>Update</button>
                        <button type="button" className="btn btn-danger" onClick={this.handleDelete.bind(this, activePerson)}>Delete</button>
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

export default People;