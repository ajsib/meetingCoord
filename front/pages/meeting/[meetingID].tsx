import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface MeetingDetails {
  coordinator: {
    name: string;
    email: string;
  };
  meetingName: string;
  description: string;
  proposedTimes: Array<{ start: string; end: string; }>;
}

interface UserAvailabilityEvent {
  title: string;
  start: string | Date;
  end: string | Date;
  color: string;
}


const MeetingDetailPage: React.FC = () => {
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<{ name: string; email: string }>({ name: '', email: '' });
  const [userAvailability, setUserAvailability] = useState<UserAvailabilityEvent[]>([]);
  const [tempStart, setTempStart] = useState<string | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const router = useRouter();
  const { meetingID } = router.query;

  // Handler for selecting time slots on the calendar
  const handleSlotSelect = (selectInfo: { startStr: any; endStr: any; view: { calendar: any; }; }) => {
    if (!isEditMode) return; // Allow selection only in edit mode

    const newEvent = {
      title: 'Your Availability',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      color: '#666' // Customize the color for user-selected events
    };

    setUserAvailability([...userAvailability, newEvent]);
    // Optionally, you can close the selection after adding it
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // Clear date selection
  };

  useEffect(() => {
    if (meetingID && typeof meetingID === 'string') {
      fetch(`https://set-a-meet-0e5fe70129fc.herokuapp.com/api/meetings/${meetingID}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setMeetingDetails(data);
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [meetingID]);

  const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
    setUserDetails({
      ...userDetails,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    // Implement the logic to handle submission (e.g., send data to server)
    setIsEditMode(false); // Exit edit mode after submission
    // we want to submit the user availability to the backend here!
    console.log('User Availability Submitted:', userDetails);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Determine the valid date range for the calendar
  const validRange = meetingDetails?.proposedTimes.length ? {
    start: meetingDetails.proposedTimes[0].start,
    end: meetingDetails.proposedTimes[meetingDetails.proposedTimes.length - 1].end
  } : null;

  const goToNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
    }
  };

  const goToPrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
    }
  };

  return (
    <>
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '10px' }}>{meetingDetails?.meetingName}</h1>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>{meetingDetails?.description}</p>
        </div>
  
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '10px' }}>Coordinator Details</h2>
          <p style={{ color: '#666' }}>Name: {meetingDetails?.coordinator.name}</p>
          <p style={{ color: '#666' }}>Email: {meetingDetails?.coordinator.email}</p>
        </div>
        
        <div style={{ marginBottom: '40px' }}>
          <button
            onClick={() => setIsEditMode(true)}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              color: 'white',
              backgroundColor: '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'block',
              margin: '10px 0',
            }}
          >
            Add Availability
          </button>
        </div>

        {isEditMode && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                name="name"
                value={userDetails.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '1rem' }}
              />
              <input
                type="email"
                name="email"
                value={userDetails.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '1rem' }}
              />
            </div>
            <p>Add your availability on the calendar and then submit.</p>
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
              }}
            >
              Submit Availability
            </button>
          </form>
        )}
  
        {/* Customized FullCalendar Component */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button
            style={{
              padding: '5px 10px',
              fontSize: '1rem',
              color: 'white',
              backgroundColor: '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '10px',
            }}
            onClick={goToPrev}
          >
            Previous Week
          </button>
          <button
            style={{
              padding: '5px 10px',
              fontSize: '1rem',
              color: 'white',
              backgroundColor: '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '10px',
            }}
            onClick={goToNext}
          >
            Next Week
          </button>
        </div>
        {meetingDetails?.proposedTimes && validRange && (
          <>
            <h2 style={{ fontSize: '2rem', color: '#333', textAlign: 'center', marginBottom: '10px' }}>
            {new Date(validRange.start).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
            </h2>
            <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={false} 
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            height="auto"
            weekends={true}
            selectable={isEditMode} // Enable selection in edit mode
            select={handleSlotSelect} // Add the handler for slot selection
            events={userAvailability} // Render only user-selected availability events
            validRange={validRange}
            expandRows={true}
            visibleRange={validRange}
            dayHeaderFormat={{
              weekday: 'short',
              day: 'numeric',   
            }}
            slotLabelFormat={{ hour: '2-digit', minute: '2-digit' }}
          />
          </>
        )}
      </div>
    </>
  );
};

export default MeetingDetailPage;