import React, { useState, useEffect, ReactNode } from 'react';
import styles from '@/styles/base/_FadeInWrapper.module.css'

interface FadeInProps {
  children: ReactNode;
}

const FadeInWrapper: React.FC<FadeInProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set isVisible to true after component mounts
    setIsVisible(true);
  }, []);

  return (
    <div className={`${styles.fadeInContainer} ${isVisible ? styles.show : ''}`}>
      {children}
    </div>
  );
};

export default FadeInWrapper;
