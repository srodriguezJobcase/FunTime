import React, { Component } from 'react';
import {Row, Col} from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import Calendar from './calendar.jsx';
import Recommend from './recommend.jsx';
import Search from './search.jsx';
import Navigation from './navigation.jsx';
import Login from './login.jsx';
import PreferencesForm from './preferencesForm.jsx';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      events: [],
      user: {},
      first: true
    }
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);

  }

  logIn(data, user) {
    let events = data.events
    console.log('events:', events)
    console.log('user:', user);
    axios.post(`/user/verify`, { ...user }).then((result) => {
      console.log("RETRUN value from user email get:", result)
      if(result.data.first) {
        user.first = true;
        this.setState(()=>{
          first:true
        })
      } else {
        // user.first = false;
        console.log(user.first)
        user.first = true;
      }
      this.setState({signedIn: true, events, user})
    })
  }

  logOut() {
    this.setState({signedIn: false})
  }


  render() {
    {return this.state.signedIn
      ? (this.state.first 
        ? <PreferencesForm /> 
          : <Container>
              <header>
                <Row style={{marginTop: "50px", height: "100%"}}>
                  <Col sm={8}><Search /></Col>
                  <Col sm={4}><Navigation logOut={this.logOut} /></Col>
                </Row>
              </header>
              <Row>
                <Col sm={8}><Calendar events = {this.state.events} /></Col>
                <Col sm={4}><Recommend /></Col>
              </Row>
            </Container>
        ) 
      : <Login logIn = { this.logIn } logOut = { this.logOut } />
    }
  }
}

export default App;
