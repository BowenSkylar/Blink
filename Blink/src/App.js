import React, { Component } from 'react';
import Header from './components/Header/Header';
import Search from './components/Search/Search';
import DisplayListItems from './components/DisplayListItems/DisplayListItems';
import UserInfo from './components/UserInfo/UserInfo';
import BucketDisplay from './components/BucketDisplay/BucketDisplay';
import './App.css';

import AjaxAdapter from './HelperUtils/AjaxAdapter'

class App extends Component {
  constructor() {
    super()
    this.state = {
      searchTerms: '',
      googleSearch:[],
      dobInput: {
        userAge: 'none',
        userGender: 'none',
        userDOB: 'none',
        age: 'none'
      },
      userProfile: {
        id: 'none',
        email: 'none',
        name: 'none',
        bday: 'none',
        age: 'none',
        profile_img: 'none'
      }
    }
  }

  consoleLogCheck(e){
    console.log('whoa')
  }

  handleToggleClose(e){
    this.refs.bucket.toggle()
  }

  handleToggleDrawer() {
    this.refs.bucket.toggle()
  }

  updateFormAge(e) {
    this.setState({
      dobInput: {
        userAge: e.target.value,
        userGender: this.state.dobInput.userGender,
        userDOB: this.state.dobInput.userDOB
      }
    });
  }
   updateFormGender(e) {
    this.setState({
      dobInput: {
        userAge: this.state.dobInput.userAge,
        userGender: e.target.value,
        userDOB: this.state.dobInput.userDOB
      }
    });
  }
  updateFormDOB(e) {
    this.setState({
      dobInput: {
        userAge: this.state.dobInput.userAge,
        userGender: this.state.dobInput.userGender,
        userDOB: e.target.value
      }
    });
  }

  searchGooglePlaces() {
    AjaxAdapter.googleSearch(this.state.searchTerms)
    .then((data) => {
      this.setState({
        googleSearch: data.results
      })
    })
  }
  handleSearchSubmit() {
    this.searchGooglePlaces()
  }
  handleSearchInput(e) {
    this.setState({
      searchTerms: e.target.value
    })
  }
  handleDOBSubmit() {
    AjaxAdapter.saveDOB(this.state.dobInput)
    .then(this.updateUserData())
  }
  handleAddClick(details) {
    AjaxAdapter.addToBucket(details, this.state.userProfile.id)
  }
  updateUserData() {
    AjaxAdapter.getUserData().then((data) => {
      this.setState({
        userProfile: {
          id: data.userProfile.id,
          email: data.userProfile.email,
          name: data.userProfile.name,
          bday: data.userProfile.bday,
          age: data.userProfile.age,
          profile_img: data.userProfile.profile_img
        }
      })
    })
  }
  componentDidMount() {
    this.updateUserData();
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Header />
        </div>

        <BucketDisplay ref='bucket'
          handleToggleDrawer={event => this.handleToggleDrawer(event)}
          consoleLogCheck={event => this.consoleLogCheck(event)}/>

        <UserInfo
          dob={this.state.userProfile.bday}
          updateFormAge={event => this.updateFormAge(event)}
          updateFormGender={event => this.updateFormGender(event)}
          updateFormDOB={event => this.updateFormDOB(event)}
          handleDOBSubmit={() => this.handleDOBSubmit()}
          />

        <Search
          handleSearchSubmit={() => this.handleSearchSubmit()}
          handleSearchInput={(event) => this.handleSearchInput(event)}
        />
        <DisplayListItems
          handleAddClick={(gEvent) => this.handleAddClick(gEvent)}
          userId={this.state.userProfile.id}
          googleSearch={this.state.googleSearch}
          />
      </div>
    );
  }
}

export default App;
