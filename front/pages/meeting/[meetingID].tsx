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
import Tooltip from '../../components/meeting/ToolTip';

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
  const [tooltipEvent, setTooltipEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
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

  const isMobileDevice = () => {
    return window.innerWidth <= 768; // or any other logic for mobile device detection
  };

  // Determine the valid date range for the calendar
  const validRange = meetingDetails?.proposedTimes.length ? {
    start: meetingDetails.proposedTimes[0].start,
    end: meetingDetails.proposedTimes[meetingDetails.proposedTimes.length - 1].end
  } : null;

  const handleEventMouseEnter = (mouseEnterInfo: any) => {
    const eventElement = mouseEnterInfo.el;
    const tooltipWidth = 200;
    const tooltipHeight = 100; 

    const rect = eventElement.getBoundingClientRect();
    let posX = rect.left + window.scrollX;
    let posY = rect.top + window.scrollY - tooltipHeight; // Position above the event
    // position middle of the event
    // let posY = rect.top + window.scrollY - tooltipHeight/2 + rect.height/2;

    // Adjust for right edge
    if (posX + tooltipWidth > window.innerWidth) {
      posX -= (posX + tooltipWidth - window.innerWidth);
    }

    // Adjust for left edge
    if (posX < 0) {
      posX = rect.right + window.scrollX; // Position to the right of the event
    }

    // Adjust for top edge
    if (posY < 0) {
      posY = rect.bottom + window.scrollY; // Position below the event
    }

    setTooltipEvent(mouseEnterInfo.event);
    setTooltipPosition({ x: posX, y: posY });
  };

  const handleEventChange = (changeInfo: any) => {
    setUserAvailability(currentAvailabilities => {
      return currentAvailabilities.map(event => {
        const eventStart = event.start instanceof Date ? event.start : new Date(event.start);
        const eventEnd = event.end instanceof Date ? event.end : new Date(event.end);
        const oldEventStart = changeInfo.oldEvent.start instanceof Date ? changeInfo.oldEvent.start : new Date(changeInfo.oldEvent.start);
        const oldEventEnd = changeInfo.oldEvent.end instanceof Date ? changeInfo.oldEvent.end : new Date(changeInfo.oldEvent.end);
  
        if (eventStart.getTime() === oldEventStart.getTime() &&
            eventEnd.getTime() === oldEventEnd.getTime()) {
          return {
            ...event,
            start: changeInfo.event.start,
            end: changeInfo.event.end
          };
        }
        return event;
      });
    });
  };
  
  

  const handleEventMouseLeave = () => {
      setTooltipEvent(null);
  };

  const handleMobileAvailabilitySubmit = (event: any) => {
    event.preventDefault();
    const { date, startTime, endTime } = event.target.elements;
    
    const newAvailability = {
      title: 'Available',
      start: new Date(`${date.value}T${startTime.value}`),
      end: new Date(`${date.value}T${endTime.value}`),
      color: 'green',
    };
  
    setUserAvailability([...userAvailability, newAvailability]);
  };

  const generateTimeSlots = (minTime: string, maxTime: string) => {
    const times = [];
    let currentTime = new Date(`1970-01-01T${minTime}`);
    const endTime = new Date(`1970-01-01T${maxTime}`);
  
    while (currentTime <= endTime) {
      times.push(currentTime.toISOString().substring(11, 16)); // Extracts HH:MM format
      currentTime = new Date(currentTime.getTime() + 30 * 60000); // Add 30 minutes
    }
  
    return times;
  };
  
  // Get valid dates and times
  let validDates = { min: '', max: '' };

if (validRange) {
  validDates = {
    min: new Date(validRange.start).toISOString().substring(0, 10),
    max: new Date(new Date(validRange.end).getTime() - 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
  };
}
  const timeSlots = generateTimeSlots("03:00", "18:30");


  return (
    <>
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '10px' }}>{meetingDetails?.meetingName}</h1>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>{meetingDetails?.description}</p>
        </div>
  
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '40px' }}>
          <div style={{ flex: 1, marginRight: '20px' }}>
            <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '10px', textAlign: 'left' }}>Coordinator Details</h2>
            <p style={{ color: '#666', textAlign: 'left' }}>Name: {meetingDetails?.coordinator.name}</p>
            <p style={{ color: '#666', textAlign: 'left' }}>Email: {meetingDetails?.coordinator.email}</p>
          </div>
          <div style={{ flex: 1, marginLeft: '20px' }}>
            <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '10px', textAlign: 'right' }}>Participants</h2>
            {meetingDetails?.availabilities.map((availability, index) => (
              <div key={availability._id} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <div style={{ marginRight: '20px', color: '#666', textAlign: 'right', flex: 1 }}>
                  {availability.participant.name}
                </div>
                <div style={{ textAlign: 'right', color:'#666', flex: 1 }}>
                  {availability.participant.email}
                </div>
              </div>
            ))}
          </div>
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
          <>
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
              {!isMobileDevice && <p>Add your availability on the calendar and then submit.</p>}
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
                Submit
              </button>
              <button
                type="button" // This should be 'button' to prevent form submission
                onClick={cancelHandler}
                style={{
                  padding: '10px 20px',
                  fontSize: '1rem',
                  marginLeft: '10px', // Add some margin between buttons
                  backgroundColor: '#7a8387', // Different color to distinguish from submit button
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </form>
            
            {isMobileDevice() && (
              <form onSubmit={handleMobileAvailabilitySubmit} style={{ marginBottom: '20px', maxWidth: '400px', margin: 'auto' }}>
                <h3 style={{ textAlign: 'center', color: '#333' }}>Add Availability</h3>
                  <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                    Add the times you are available to put them in the calendar.
                  </p>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontSize: '1rem' }}>Date:</label>
                    <input
                      type="date"
                      name="date"
                      required
                      min={validDates.min}
                      max={validDates.max}
                      style={{ width: '100%', padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontSize: '1rem' }}>Start Time:</label>
                    <select name="startTime" required style={{ width: '100%', padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontSize: '1rem' }}>End Time:</label>
                    <select name="endTime" required style={{ width: '100%', padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#333', color: 'white', fontSize: '1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    add to calendar
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
                    Once you are satisfied, you can press the submit button above!
                  </p>
                </form>
            )}
          </>

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
            {(
              <Tooltip event={tooltipEvent} position={tooltipPosition} isEdit={isEditMode} userAvail={userAvailability} setUserAvailability={setUserAvailability} />
            )}           
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
            editable={isEditMode}
            visibleRange={validRange}
            eventChange={handleEventChange}
            dayHeaderFormat={{
              weekday: 'short',
              day: 'numeric',   
            }}
            slotLabelFormat={{ hour: '2-digit', minute: '2-digit' }}
            eventMouseEnter={handleEventMouseEnter}
            eventMouseLeave={handleEventMouseLeave}
            eventOverlap={!isEditMode}
          />
          </>
        )}
      </div>
      <footer style={{ padding: '20px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>Check out my Portfolio: <a href="https://aidan.ajsibley.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#333' }}>Aidan</a> </p>
      </footer>
    </>
  );
};

export default MeetingDetailPage;
