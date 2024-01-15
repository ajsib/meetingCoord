import React from 'react';
import Header from '../../components/Header';

const HomePage = () => {
  const handleCreateMeetingClick = () => {
    window.location.href = '/create';
  };

  return (
    <>
      <div style={{ padding: '20px' }}>

        {/* Welcome Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '10px' }}>Welcome to MeetingCoord</h1>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Effortlessly coordinate meetings with anyone, anywhere.</p>
        </div>

        {/* Features Overview */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '10px' }}>Features</h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <div style={{ width: '45%', marginBottom: '20px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', color: '#333' }}>Create Meeting</h3>
              <p style={{ color: '#666' }}>Quickly set up a new meeting and invite participants with a simple link.</p>
            </div>
            <div style={{ width: '45%', marginBottom: '20px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', color: '#333' }}>View Meeting</h3>
              <p style={{ color: '#666' }}>Browse and manage your scheduled meetings with ease.</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '10px' }}>How It Works</h2>
          <ol style={{ color: '#666' }}>
            <li>Create a meeting and generate a unique link.</li>
            <li>Share the link with your attendees.</li>
            <li>Attendees propose and vote on convenient times.</li>
            <li>Finalize the meeting time that suits everyone.</li>
          </ol>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button
            onClick={handleCreateMeetingClick}
            style={{ padding: '10px 20px', fontSize: '1rem', color: 'white', backgroundColor: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Create a Meeting
          </button>
        </div>

        {/* Testimonials (Placeholder Content)
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '10px' }}>What Our Users Say</h2>
          <p style={{ color: '#666' }}>&quot;MeetingCoord has simplified our scheduling process significantly. Highly recommend!&quot; - Alex</p>
          <p style={{ color: '#666' }}>&quot;The best tool for coordinating meeting times across different time zones.&quot; - Sam</p>
        </div> */}

        {/* Footer */}
        <footer style={{ padding: '20px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>Created with ❤️ by <a href="https://aidan.ajsibley.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#333' }}>Aidan Sibley</a> </p>
        </footer>

      </div>
    </>
  );
};

export default HomePage;
