import React, { Component } from 'react';
import {CLIENT_ID, CLIENT_SECRET, API_KEY} from '../config.js';
import './login.css';
import axios from 'axios'

// const CLIENT_ID = '<YOUR_CLIENT_ID>';
// const API_KEY = '<YOUR_API_KEY>';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar";


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      signInToggle: false,
      signOutToggle: false
    }
    this.handleAuthClick = this.handleAuthClick.bind(this);
    this.handleClientLoad = this.handleClientLoad.bind(this);
    this.handleSignoutClick = this.handleSignoutClick.bind(this);
    this.initClient = this.initClient.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    this.listUpcomingEvents = this.listUpcomingEvents.bind(this);
    this.appendPre = this.appendPre.bind(this);
  }

  componentDidMount() {
    this.handleClientLoad();
  }
  
  listUpcomingEvents(appendPre, logIn) {
    console.log('getting events');
    window.gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 30,
      'orderBy': 'startTime'
    }).then(function(response) {
      const events = response.result.items;
      console.log('events', events);
      // appendPre('Upcoming events:');
      const profile = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();

      const user = {
        id: profile.getId(),
        firstName: profile.getGivenName(),
        lastName: profile.getFamilyName(),
        imageUrl: profile.getImageUrl(),
        email: profile.getEmail()
      }
      console.log('user in login:', user)
      logIn({ events }, user)

    });
  }
  
  updateSigninStatus(isSignedIn) {
    console.log('updating signin status')
    if (isSignedIn) {
      this.setState({
        signInToggle: false,
        signOutToggle: true
      })
      this.listUpcomingEvents(this.appendPre, this.props.logIn);
    } else {
      this.setState({
        signInToggle: true,
        signOutToggle: false
      })
    }
  }

  initClient(updateSigninStatus, appendPre) {
    console.log('initializing client')
    console.log(window.gapi.client);
    
    new Promise((res, rej) => {
      let interval = setInterval(() => {
        if(window.gapi.client) {
          res(interval)
        }
      }, 100);
    }).then((interval) => {
      interval = null;
      window.gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      }).then(function () {
        // Listen for sign-in state changes.
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
  
        // Handle the initial sign-in state.
        updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
      });
    }) 
  }


  handleAuthClick(event) {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  handleSignoutClick(event) {
    window.gapi.auth2.getAuthInstance().signOut();
  }

  appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }

  handleClientLoad() {
    console.log('client loaded')
    window.gapi.load('client:auth2', this.initClient(this.updateSigninStatus, this.appendPre));
  }

  render() { 
    return ( 
      <div className = 'login'>
        <img src='/logo.jpg'/>
        {/* <div className="g-signin2" onClick= {this.handleAuthClick}></div> */}
        {this.state.signInToggle ? (<button className='login-signInButton' onClick= {this.handleAuthClick}>Sign in with Google</button>) : null} 
        {/* {this.state.signOutToggle ? <button id="signout_button" onClick= {this.handleSignoutClick}>Sign Out</button> : null}  */}
        <pre id="content" style={{'whiteSpace': 'pre-wrap'}}></pre>
      </div>
     );
  }
}
 
export default Login;