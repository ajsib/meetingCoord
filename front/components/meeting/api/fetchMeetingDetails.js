const fetchMeetingDetails = async (meetingID) => {
    if (!meetingID || typeof meetingID !== 'string') return null;
    try {
      const response = await fetch(`https://set-a-meet-0e5fe70129fc.herokuapp.com/api/meetings/${meetingID}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  };
  
  export default fetchMeetingDetails;
  