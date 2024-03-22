import React from 'react';
import { useRouter } from 'next/router';

const LandingPage = () => {
  const router = useRouter();

  const handleCoordinate = () => {
    router.push('/create');
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '6rem'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '2.5rem', // Adjust size as needed
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '4rem', 
  };

  const inputStyle: React.CSSProperties = {
    fontSize: '1rem',
    color: 'var(--secondary-color)',
    fontWeight: '600',
    border: '1px solid #666',
    backgroundColor: 'var(--primary-color)',
    borderRadius: '5px',
    padding: '0.7rem',
    marginRight: '1rem',
  };

  const orStyle: React.CSSProperties = {
    fontSize: '1rem',
    color: 'var(--secondary-color)',
    fontWeight: '600',
    padding: '1rem',
    marginBottom: '1.5rem'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Ready to Make Meetings Easier?</h1>
      {/* <div style={{marginBottom: '1.5rem'}}>
        <input style={inputStyle} placeholder="Meeting Name" />
        <button style={buttonStyle}>Search by Name</button>
      </div>
      <p style={orStyle}>OR</p> */}
      <button className="button" onClick={handleCoordinate}>Coordinate a Meeting</button>
    </div>
  );
};

export default LandingPage;
