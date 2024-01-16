interface Participant {
    name: string;
    email: string;
  }
  
  interface Availability {
    _id: string;
    meeting: string;
    participant: Participant;
    availableTimes: Array<{
      start: string;
      end: string;
      _id: string;
    }>;
    createdAt: string;
  }
  
  interface UserAvailabilityEvent {
    title: string;
    start: Date | string;
    end: Date | string;
    color: string;
  }
  
  interface MeetingDetails {
    _id: string;
    link: string;
    coordinator: Participant;
    meetingName: string;
    description: string;
    proposedTimes: Array<{
      start: string;
      end: string;
      _id: string;
    }>;
    availabilities: Array<Availability>;
    createdAt: string;
  }

export type { Participant, Availability, UserAvailabilityEvent, MeetingDetails };