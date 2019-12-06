import React, { Component } from 'react';
import moment, { calendarFormat } from 'moment';
import {
  Calendar,
  momentLocalizer,
} from 'react-big-calendar';
require('react-big-calendar/lib/css/react-big-calendar.css');
import './calendar.css'
import PreferencesForm from './preferencesForm.jsx';
import { Modal, Button } from 'react-bootstrap';

// import {Row, Col} from 'react-bootstrap';

const localizer = momentLocalizer(moment);

class MyCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {events:[], showModal: false  };
    this.onHide = this.onHide.bind(this);
  }

  componentDidMount () {
    const events = []
    this.props.events.map((event) => events.push({
      start: new Date(event.start.dateTime),
      end: new Date(event.end.dateTime),
      title: event.summary,
    }))
    console.log('prop', this.props)
    if(this.props.user.first) {
      this.setState({events, showModal: true})
    } else {
      this.setState({events});
    }
  }

  onHide() {
    console.log("triggered")
    this.setState({showModal: false});
  }


  render() {
    return (

      <div>
        <Calendar
          localizer={localizer}
          events={this.state.events}
          defaultView='week'
          views = {['week']}
          />
        <Modal
          show={this.state.showModal}
          backdrop = 'static'
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          size = 'sm'

        >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Select your preferences
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PreferencesForm hide = {this.onHide}/>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button onClick={this.onHide}>Close</Button> */}
        </Modal.Footer>
      </Modal>
      </div>
     );
  }
}

export default MyCalendar;
