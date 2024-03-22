// MeetingDataStructure.tsx

export interface DateObject {
  year: number;
  month: number;
  day: number;
}

export type DateArray = DateObject[];

export interface MeetingData {
  meetingType: 'individual' | 'group';
  selectedDates: DateArray;
  additionalDetails: {
    oneOnOne?: {
      participantEmail: string;
    };
    group?: {
      participantCount: number;
    };
  };
}
