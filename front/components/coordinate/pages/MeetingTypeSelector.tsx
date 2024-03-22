import React, { useState } from 'react';
import { useMeeting } from '@/components/coordinate/utils/MeetingContext';
import styles from '@/styles/components/MeetingTypeSelector.module.css';
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

const MeetingTypeSelector: React.FC<Props> = ({ advanceStep }) => {
  const { updateMeetingData } = useMeeting();
  const [selectedType, setSelectedType] = useState<'individual' | 'group' | null>(null)

  const handleSelectType = (type: 'individual' | 'group') => {
    setSelectedType(type);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 25);
  };

  const confirmSelection = () => {
    if (selectedType) {
      updateMeetingData({ meetingType: selectedType});
      advanceStep();
    }
  };

  return (
    <div className={styles.selectorContainer}>
      <h1 style={titleStyle}>Coordinate a Meeting</h1>
      <p className={styles.withText}>with:</p>
      <div className={styles.typeOptions}>
        <div className={`${styles.option} ${selectedType === 'individual' ? styles.selected : ''}`}
             onClick={() => handleSelectType('individual')}>
          <div className={styles.icon}>👤</div>
          <p className={styles.label}>an individual</p>
        </div>
        <div className={styles.orText}>or</div>
        <div className={`${styles.option} ${selectedType === 'group' ? styles.selected : ''}`}
             onClick={() => handleSelectType('group')}>
          <div className={styles.icon}>👥</div>
          <p className={styles.label}>a group</p>
        </div>
      </div>
      {selectedType && (
        <FadeInWrapper>
        <button className="button" onClick={confirmSelection} style={{marginBottom: '4rem'}}>
          Confirm and Continue
        </button>
        </FadeInWrapper>
      )}
    </div>
  );
};

export default MeetingTypeSelector;
