export const submitAvailability = async (meetingID, userDetails, userAvailability) => {
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
      return result;
    } catch (error) {
      throw error;
    }
  };
  