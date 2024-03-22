// MeetingContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MeetingData } from './TypeStructure'

interface MeetingContextType {
  meetingData: MeetingData | {};
  updateMeetingData: (newData: Partial<MeetingData>) => void;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const useMeeting = (): MeetingContextType => {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};

interface MeetingProviderProps {
  children: ReactNode;
}

export const MeetingProvider: React.FC<MeetingProviderProps> = ({ children }) => {
  const [meetingData, setMeetingData] = useState<MeetingData | {}>({});

  const updateMeetingData = (newData: Partial<MeetingData>) => {
    setMeetingData((prev: MeetingData | {}) => ({ ...prev, ...newData }));
  };

  return (
    <MeetingContext.Provider value={{ meetingData, updateMeetingData }}>
      {children}
    </MeetingContext.Provider>
  );
};
