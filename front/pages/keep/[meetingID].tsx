import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { submitAvailability } from '../../components/meeting/api/submitAvailability';
import { UserAvailabilityEvent, MeetingDetails } from '../../components/meeting/MeetingTypes';
import processAvailabilities from '../../components/meeting/utils/processAvailabilities';
import fetchMeetingDetails from '../../components/meeting/api/fetchMeetingDetails';
import { handleSlotSelect, goToNext, goToPrev } from '../../components/meeting/utils/calendarActions';
import { handleInputChange, handleSubmit, handleCancel } from '../../components/meeting/utils/formHandlers';
import LoadingAndError from '../../components/meeting/utils/LoadingAndError';


const MeetingDetailPage: React.FC = () => {
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<{ name: string; email: string }>({ name: '', email: '' });
  const [userAvailability, setUserAvailability] = useState<UserAvailabilityEvent[]>([]);
  const [allAvailabilities, setAllAvailabilities] = useState<UserAvailabilityEvent[]>([]);
  const [tempEvent, setTempEvent] = useState(null);
  const calendarRef = useRef<FullCalendar>(null);
  const router = useRouter();
  const { meetingID } = router.query;
  // cell selection states
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  // menu states
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedEvent, setSelectedEvent] = useState(null);
  // handlers
  const slotSelectHandler = handleSlotSelect(
    isEditMode, 
    selectionStart, setSelectionStart, 
    selectionEnd, setSelectionEnd, 
    userAvailability, setUserAvailability,
    setTempEvent
  );
  const formSubmitHandler = handleSubmit(
    meetingID, userDetails,
    userAvailability, allAvailabilities, 
    setIsEditMode, setUserAvailability, 
    setAllAvailabilities, submitAvailability
  );
  const inputChangeHandler = handleInputChange(userDetails, setUserDetails);
  const cancelHandler = handleCancel(setIsEditMode, setUserAvailability);
  const nextHandler = goToNext(calendarRef);
  const prevHandler = goToPrev(calendarRef);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchMeetingDetails(meetingID);
        if (data) {
          setMeetingDetails(data);
          const processed = processAvailabilities(data.availabilities);
          setAllAvailabilities(processed);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (meetingID) {
      loadData();
    }
  }, [meetingID]);

  // Render logic
  if (loading || error) {
    return <LoadingAndError loading={loading} error={error} />;
  }

  // Determine the valid date range for the calendar
  const validRange = meetingDetails?.proposedTimes.length ? {
    start: meetingDetails.proposedTimes[0].start,
    end: meetingDetails.proposedTimes[meetingDetails.proposedTimes.length - 1].end
  } : null;

  const handleEventMouseEnter = (mouseEnterInfo: { jsEvent: { clientX: any; clientY: any; }; event: React.SetStateAction<null>; }) => {
    setShowMenu(true);
    setMenuPosition({ x: mouseEnterInfo.jsEvent.clientX, y: mouseEnterInfo.jsEvent.clientY });
    setSelectedEvent(mouseEnterInfo.event);
  };

  const handleEventMouseLeave = () => {
    setShowMenu(false);
    setSelectedEvent(null);
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
          <form onSubmit={formSubmitHandler} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                name="name"
                value={userDetails.name}
                onChange={inputChangeHandler}
                placeholder="Your Name"
                style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '1rem' }}
              />
              <input
                type="email"
                name="email"
                value={userDetails.email}
                onChange={inputChangeHandler}
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
            <button
              type="button" // This should be 'button' to prevent form submission
              onClick={cancelHandler}
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                marginLeft: '10px', // Add some margin between buttons
                backgroundColor: '#999', // Different color to distinguish from submit button
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Cancel
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
            onClick={prevHandler}
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
            onClick={nextHandler}
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
            slotMaxTime="23:30:00"
            height="auto"
            weekends={true}
            selectable={isEditMode} 
            select={slotSelectHandler}
            events={isEditMode ? [...userAvailability, ...(tempEvent ? [tempEvent] : [])] : allAvailabilities}            
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
