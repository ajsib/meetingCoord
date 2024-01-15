export const handleSlotSelect = (
  isEditMode, 
  selectionStart, setSelectionStart, 
  selectionEnd, setSelectionEnd, 
  userAvailability, setUserAvailability,
  setTempEvent
) => (selectInfo) => {
  if (!isEditMode) return;

  const selectedDate = selectInfo.startStr;

  // Set start or end of the selection range
  if (!selectionStart) {
    // Set the start of the selection range and create a temporary event
    setSelectionStart(selectedDate);
    setTempEvent({
    title: 'Select End Time',
    start: selectedDate,
    end: "\n",
    color: '#FFB399', // A distinct color
    allDay: false,
    });
    } else if (!selectionEnd) {
    setSelectionEnd(selectedDate);

    // Create a continuous range
    const newEvent = {
      title: 'Your Availability',
      start: selectionStart,
      end: selectedDate,
      color: '#FF6633'
    };
    setUserAvailability([...userAvailability, newEvent]);

    // Reset for the next selection
    setTempEvent(null);
    setSelectionStart(null);
    setSelectionEnd(null);
  }
};

  
export const goToNext = (calendarRef) => () => {
  if (calendarRef.current) {
    calendarRef.current.getApi().next();
  }
};

export const goToPrev = (calendarRef) => () => {
  if (calendarRef.current) {
    calendarRef.current.getApi().prev();
  }
};
  