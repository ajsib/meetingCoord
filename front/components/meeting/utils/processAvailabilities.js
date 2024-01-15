// ./utils/processAvailabilities.js
import generateColor from './generateColor';

const processAvailabilities = (availabilities) => {
  return availabilities.map((availability, index) => {
    return availability.availableTimes.map((timeSlot) => ({
      title: availability.participant.name,
      start: new Date(timeSlot.start).toISOString(),
      end: new Date(timeSlot.end).toISOString(),
      color: generateColor(index),
    }));
  }).flat();
};

export default processAvailabilities;
