const Tooltip = ({ event, position }) => {
    if (!event) return null;
  
    return (
      <div style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 100,
        backgroundColor: '#333', // Solid background color
        color: '#fff', // Text color
        padding: '10px 15px', // Space around the content
        borderRadius: '8px', // Rounded corners
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // Subtle shadow
        border: '1px solid #4a4f5c', // Border for definition
        transition: 'all 0.7s ease', // Smooth transition effect
        maxWidth: '200px', // Maximum width
        wordWrap: 'break-word', // Ensures text doesn't overflow
        fontSize: '0.9rem', // Font size
        textAlign: 'center', // Center align text
        lineHeight: '1.4', // Line height for better readability
      }}>
        <strong>{event.title}</strong>
        <div>{event.start.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - {event.end.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
      </div>
    );
  };
  
  export default Tooltip;
  