// DateSelection.tsx
import React, { useState } from 'react';
import CustomCalendar from '@/components/coordinate/CustomCalendar';
import { DateArray } from '@/components/coordinate/utils/TypeStructure';
import FadeInWrapper from '@/components/wrappers/FadeIn';


interface Props {
  advanceStep: () => void;
}

const titleStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '2rem',
};

const DateSelection: React.FC<Props> = ({ advanceStep }) => {
  const [selectedDates, setSelectedDates] = useState<DateArray>([]);

  const handleDateChange = (updatedDates: DateArray) => {
    var prevLen = selectedDates.length;
    setSelectedDates(updatedDates);
    console.log(updatedDates);
    if (updatedDates.length == 1 && prevLen == 0) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }

  };

  const handleContinue = () => {
    // Handle the action when the user clicks Continue
    advanceStep();
  };

  return (
    <>
      <h1 style={titleStyle}>Select Days</h1>
      <div style={{ width: '90%', maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
        <CustomCalendar selectedDates={selectedDates} handleDateChange={handleDateChange} />
        {selectedDates.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
          <FadeInWrapper>
            <button className="button" onClick={handleContinue} style={{ margin: '2rem' }}>Continue</button>
          </FadeInWrapper>
          </div>
        )}
      </div>
    </>
  );
};

export default DateSelection;
