export const handleInputChange = (userDetails, setUserDetails) => (event) => {
  setUserDetails({
    ...userDetails,
    [event.target.name]: event.target.value
  });
};

export const handleSubmit = (meetingID, userDetails, userAvailability, allAvailability, setIsEditMode, setUserAvailability, setAllAvailability, submitAvailability) => async (event) => {
  // when submitting we want all availability to be += userAvailability
  event.preventDefault();
  if (!meetingID || typeof meetingID !== 'string') return;

  try {
    const result = await submitAvailability(meetingID, userDetails, userAvailability);
    console.log('Availability submitted:', result);
    setIsEditMode(false);
    setUserAvailability([]);
    setAllAvailability([...allAvailability, ...userAvailability]);
  } catch (error) {
    console.error('Error submitting availability:', error);
  }
};

export const handleCancel = (setIsEditMode, setUserAvailability) => () => {
  setIsEditMode(false);
  // Reset user availability to empty array
  setUserAvailability([]);
}
