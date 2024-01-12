import React, { useState } from 'react';
import Header from '../../components/Header';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";

const CoordinateMeetingPage = () => {
  const [meetingDetails, setMeetingDetails] = useState({
    meetingName: '',
    description: '',
    coordinatorName: '',
    coordinatorEmail: '',
    proposedDates: {
      from: null,
      to: null
    },
    meetingLink: ''
  });

  const fieldsFilled = () => {
    const { meetingName, description, coordinatorName, coordinatorEmail } = meetingDetails;
    return meetingName && description && coordinatorName && coordinatorEmail;
  }

  const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
    setMeetingDetails({
      ...meetingDetails,
      [event.target.name]: event.target.value
    });
  };

  const handleDateChange = (proposedDates: any) => {
    setMeetingDetails({ ...meetingDetails, proposedDates });
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    // window.location.href = '/meeting/';
  };

  // Check if the selected dates are either todays date or in the future
  const today = new Date();
  const isDateValid = (date: { year: number; month: number; day: number } | null) => {
    return date ? new Date(date.year, date.month - 1, date.day + 1) >= today : false;
  };

  const isDateRangeValid = () => {
    const { from, to } = meetingDetails.proposedDates;
    return isDateValid(from) && isDateValid(to);
  };

  return (
    <>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#333', textAlign: 'center', marginBottom: '20px' }}>Coordinate a Meeting</h1>
        
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', width: '100%', margin: '0 auto' }}>
          <input
            type="text"
            name="meetingName"
            value={meetingDetails.meetingName}
            onChange={handleInputChange}
            placeholder="Meeting Name"
            style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '1rem' }}
          />
          <textarea
            name="description"
            value={meetingDetails.description}
            onChange={handleInputChange}
            placeholder="Meeting Description"
            style={{ width: '100%', padding: '10px', height: '100px', marginBottom: '10px', fontSize: '1rem' }}
          />
          <input 
            type="text"
            name="coordinatorName"
            value={meetingDetails.coordinatorName}
            onChange={handleInputChange}
            placeholder="Your Name"
            style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '1rem' }}
          />
          <input 
            type="email"
            name="coordinatorEmail"
            value={meetingDetails.coordinatorEmail}
            onChange={handleInputChange}
            placeholder="Your Email"
            style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '1rem' }}
          />
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
            <Calendar
              value={meetingDetails.proposedDates}
              onChange={handleDateChange}
              colorPrimary="#666"
              colorPrimaryLight="rgba(51, 51, 51, 0.4)"
              shouldHighlightWeekends
            />
          </div>

          {!isDateRangeValid() ? (
            <p style={{ color: 'red', textAlign: 'center' }}>Please select a valid meeting range</p>
          ) :
            !fieldsFilled() ? (
                <p style={{ color: 'red', textAlign: 'center' }}>Please fill in all fields</p>
            ) :
          (
            <button 
              type="submit"
              style={{ padding: '10px 20px', fontSize: '1rem', color: 'white', backgroundColor: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'block', margin: '10px auto' }}
            >
              Find a time to meet
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default CoordinateMeetingPage;
