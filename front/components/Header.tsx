import React, { useState, useEffect, useRef } from 'react';
import { CSSProperties } from 'react';
import styled from 'styled-components';

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(5);
  const [menuVerticalPosition, setMenuVerticalPosition] = useState(4);

  // Ref to the side panel element
  const sidePanelRef = useRef<HTMLDivElement>(null);
  
  // Toggle the menu open state and calculate menu position
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Effect hook to listen for window resize events
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call the handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effect hook to listen for clicks outside the side panel
  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      if (sidePanelRef.current && !sidePanelRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    // Add event listener for clicks outside the side panel
    document.addEventListener('mousedown', handleClickOutside);

    // Remove event listener on cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Styled component for links
  const StyledLink = styled.a`
    text-decoration: none;
    color: #666666;
    font-size: 1rem;
    position: relative;
    display: inline-block;
    overflow: hidden;
  `;

  const headerStyle: CSSProperties = {
    backgroundColor: '#f5f5f5',
    padding: isMobile ? '10px' : '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const logoStyle: CSSProperties = {
    fontSize: isMobile ? '1.2rem' : '1.5rem',
    fontWeight: 'bold',
    color: '#333',
  };

  const linkStyle: CSSProperties = {
    textDecoration: 'none',
    color: '#666',
    fontSize: '1rem',
    position: 'relative', // Needed for absolute positioning of ::after pseudo-element
    display: 'inline-block', // Ensures the pseudo-element aligns correctly
    overflow: 'hidden', // Keeps the pseudo-element within the link's boundaries
  };

  const navStyle: CSSProperties = {
    listStyle: 'none',
    display: isMobile ? 'none' : 'flex',
    gap: '20px'
  };

  const menuButtonStyle: CSSProperties = {
    display: isMobile ? 'block' : 'none',
    fontSize: '1.5rem',
    color: '#333',
    position: 'fixed',
    right: `${menuPosition}px`, // Update the horizontal position
    top: `${menuVerticalPosition}px`, // Update the vertical position
    transform: menuOpen ? 'rotate(90deg)' : 'none', // Rotate to form 'X'
    transition: 'right 0.3s ease, top 0.3s ease, transform 0.3s ease',
    zIndex: 0 // Ensure it's above other elements
  };

  const sidePanelStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    right: menuOpen ? 0 : '-100%',
    width: '250px', // Ensure this matches the sidePanelWidth in toggleMenu
    height: '100%',
    backgroundColor: '#fff',
    boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.3)',
    transition: 'right 0.3s ease',
    zIndex: 100 // Ensure it's above other elements
  };

  const sidePanelContentStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '10px'
  };

  const sidePanelLinkStyle: CSSProperties = {
    ...linkStyle, // Inherits existing link styles
    margin: '10px 0',
    padding: '10px 20px',
    backgroundColor: '#e7e7e7',
    borderRadius: '5px',
    width: 'calc(100% - 40px)', // Full width minus padding
    textAlign: 'center',
    transition: 'background-color 0.3s ease',
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle}>MeetingCoord</div>
      <nav>
        <ul style={navStyle}>
          <li><StyledLink href="/">Meetings</StyledLink></li>
          <li><StyledLink href="/home/">Home</StyledLink></li>
        </ul>
        <div style={menuButtonStyle} onClick={toggleMenu}>&#9776;</div>
      </nav>
      <div ref={sidePanelRef} style={sidePanelStyle}>
        <div style={sidePanelContentStyle}>
          <a href="/home/" style={sidePanelLinkStyle}>Home</a>
          <a href="/" style={sidePanelLinkStyle}>Meetings</a>
          <a href="/create" style={sidePanelLinkStyle}>Organize</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
