import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const LandingPage = () => {
  const [meetingID, setMeetingID] = useState('');
  const [isDesktop, setIsDesktop] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMeetingID(event.target.value);
  };

  const handleView = () => {
    window.location.href = '/meeting/';
  };

  const handleCreateMeeting = () => {
    console.log('Creating a new meeting');
    window.location.href = '/create/';
  };

  useEffect(() => {
    // Update isDesktop based on the window's width when the component mounts
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    // Set initial value
    handleResize();

    // Add event listener for future window resize
    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    color: 'white',
    backgroundColor: '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const inputStyle = {
    padding: '10px',
    marginRight: isDesktop ? '10px' : '0',
    marginBottom: isDesktop ? '0' : '10px',
    fontSize: '1rem',
    width: isDesktop ? 'auto' : '100%',
  };

  return (
    <>
      <div style={{ padding: '20px', textAlign: 'center' }}>

        {/* Join Meeting Section */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '10px' }}>View a Meeting</h2>
          <div style={{ display: isDesktop ? 'flex' : 'block', alignItems: 'center', justifyContent: 'center' }}>
            <input 
              type="text" 
              value={meetingID}
              onChange={handleInputChange} 
              placeholder="Enter Meeting ID" 
              style={inputStyle} 
            />
            <button 
              onClick={handleView} 
              style={buttonStyle}
            >
              View Meeting
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ marginBottom: '40px' }}>
          <span style={{ color: '#666', fontSize: '1.5rem' }}>OR</span>
        </div>

        {/* Create Meeting Section */}
        <div>
          <button 
            onClick={handleCreateMeeting} 
            style={buttonStyle}
          >
            Coordinate a Meeting
          </button>
        </div>

        {/* Footer */}
        <footer style={{ padding: '20px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>Aidan Sibley 2024 - MeetingCoord</p>
        </footer>

      </div>
    </>
  );
};

export default LandingPage;