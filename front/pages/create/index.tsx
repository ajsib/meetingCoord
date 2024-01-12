import React, { useState } from 'react';
import Header from '../../components/Header';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import Link from 'next/link';

interface DateObject {
  year: number;
  month: number;
  day: number;
}

interface MeetingDetails {
  meetingName: string;
  description: string;
  coordinatorName: string;
  coordinatorEmail: string;
  proposedDates: {
    from: DateObject | null;
    to: DateObject | null;
  };
  meetingLink: string;
}

const CoordinateMeetingPage = () => {
  const [isError, setError] = useState(0);
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails>({
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

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fieldsFilled() || !isDateRangeValid()) return;

    const { meetingName, description, coordinatorName, coordinatorEmail, proposedDates } = meetingDetails;

    // Check if proposedDates.from and proposedDates.to are not null
    if (!proposedDates.from || !proposedDates.to) {
        console.error('Invalid date range');
        return; // or handle this case appropriately
    }

    // Prepare the data for the backend
    const meetingData = {
        meetingName,
        description,
        coordinator: {
            name: coordinatorName,
            email: coordinatorEmail,
        },
        proposedTimes: [
            {
                start: new Date(proposedDates.from.year, proposedDates.from.month - 1, proposedDates.from.day),
                end: new Date(proposedDates.to.year, proposedDates.to.month - 1, proposedDates.to.day),
            },
        ],
    };

    try {
      // Send a POST request to your backend
      const response = await fetch('https://set-a-meet-0e5fe70129fc.herokuapp.com/api/meetings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create meeting');
      }

      const result = await response.json();

      if (result.link) {
        console.log('Meeting created, link:', result.link);
        //  Want to redirect to the meeting page? Use the following line instead:
        window.location.href = `/meeting/${result.link}`;
      } else {
        throw new Error('Meeting link not received');
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      setError(1);
    }
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

          {!fieldsFilled() ? (
            <p style={{ color: 'red', textAlign: 'center' }}>Please fill in all fields</p>
          ) : !isDateRangeValid() ? (
            <p style={{ color: 'red', textAlign: 'center' }}>Please select a valid meeting range</p>
          ) : meetingDetails.meetingLink ? (
            <p style={{ color: 'green', textAlign: 'center' }}>Meeting created: {meetingDetails.meetingLink}</p>
          ) : !isError ? (
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                color: 'white',
                backgroundColor: '#333',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'block',
                margin: '10px auto',
              }}
            >
              Find a time to meet
            </button>
          ) : (
            <p style={{ color: 'red', textAlign: 'center' }}>Error creating meeting, please contact Aidan</p>
          )}
        </form>
      </div>
    </>
  );
};

export default CoordinateMeetingPage;
