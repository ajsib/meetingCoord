import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Participant {
  name: string;
  email: string;
}

interface Availability {
  _id: string;
  meeting: string;
  participant: Participant;
  availableTimes: Array<{
    start: string;
    end: string;
    _id: string;
  }>;
  createdAt: string;
}

interface UserAvailabilityEvent {
  title: string;
  start: Date | string;
  end: Date | string;
  color: string;
}

interface MeetingDetails {
  _id: string;
  link: string;
  coordinator: Participant;
  meetingName: string;
  description: string;
  proposedTimes: Array<{
    start: string;
    end: string;
    _id: string;
  }>;
  availabilities: Array<Availability>;
  createdAt: string;
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

  const processAvailabilities = (availabilities: any[]) => {
    return availabilities.map((availability: { availableTimes: any[]; participant: { name: any; }; }, index: any) => {
      return availability.availableTimes.map((timeSlot: { start: string | number | Date; end: string | number | Date; }) => ({
        title: availability.participant.name,
        start: new Date(timeSlot.start).toISOString(),
        end: new Date(timeSlot.end).toISOString(),
        color: generateColor(index), // Function to generate a unique color
      }));
    }).flat();
  };
  
  const generateColor = (index: number) => {
    // Simple function to generate a unique color for each team member
    const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
    return colors[index % colors.length];
  }

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
          const processedAvailabilities = processAvailabilities(data.availabilities);
          setUserAvailability(processedAvailabilities); 
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!meetingID || typeof meetingID !== 'string') return;
  
    // Prepare availability data
    const availabilityData = {
      participant: {
        name: userDetails.name,
        email: userDetails.email
      },
      availableTimes: userAvailability.map(avail => ({
        start: new Date(avail.start).toISOString(),
        end: new Date(avail.end).toISOString()
      }))
    };
  
    try {
      const response = await fetch(`https://set-a-meet-0e5fe70129fc.herokuapp.com/api/availabilities/${meetingID}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(availabilityData),
      });
  
      if (!response.ok) {
        throw new Error(`Error submitting availability: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Availability submitted:', result);
  
      // Reset states and exit edit mode after successful submission
      setIsEditMode(false);
      setUserAvailability([]);
  
    } catch (error) {
      console.error('Error submitting availability:', error);
    }
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

        <div>
          {meetingDetails?.availabilities.map((availability, index) => (
            <div key={availability._id}>
              {availability.participant.name}
            </div>
          ))}
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