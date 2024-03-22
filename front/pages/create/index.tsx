import React, { useState } from 'react';
import MeetingTypeSelector from '@/components/coordinate/pages/MeetingTypeSelector'
import { MeetingProvider } from '@/components/coordinate/utils/MeetingContext'
import FadeInWrapper from '@/components/wrappers/FadeIn';


import DateSelection from '@/components/coordinate/pages/DateSelection'
// import AdditionalDetailsOneOnOne from '@/components/coordinate/pages/AdditionalDetailsOneOnOne'
// import AdditionalDetailsGroup from '@/components/coordinate/pages/AdditionalDetailsGroup'
// import ReviewAndSubmit from '@/components/coordinate/pages/ReviewAndSubmit'

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '2rem',
};

const CoordinateMeetingPage = () => {
  const [step, setStep] = useState(1);
  const advanceStep = () => setStep(step + 1);

  return (

    <div style={containerStyle}>
      <MeetingProvider>
        {step === 1 && <FadeInWrapper><MeetingTypeSelector advanceStep={advanceStep} /></FadeInWrapper>}
        {step === 2 && <FadeInWrapper><DateSelection advanceStep={advanceStep} /></FadeInWrapper>}
        {/*{step === 3 && meetingType === 'One-on-One' && <AdditionalDetailsOneOnOne advanceStep={advanceStep} />}
        {step === 3 && meetingType === 'Group' && <AdditionalDetailsGroup advanceStep={advanceStep} />}
        {step === 4 && <ReviewAndSubmit />} */}
      </MeetingProvider>
    </div>
  );
};

export default CoordinateMeetingPage;
