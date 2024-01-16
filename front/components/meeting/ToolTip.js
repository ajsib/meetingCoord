const Tooltip = ({ event, position, isEdit, userAvail, setUserAvailability }) => {
  if (!event) return null;
    return (
      <div style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 100,
          backgroundColor: '#333',
          color: '#fff',
          padding: '10px 15px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          border: '1px solid #4a4f5c',
          maxWidth: '200px',
          wordWrap: 'break-word',
          fontSize: '0.9rem',
          textAlign: 'center',
          lineHeight: '1.4'
      }}>
          <strong>{event.title}</strong>
          <div>{event.start.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - {event.end.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
      </div>
  );
};

export default Tooltip;
