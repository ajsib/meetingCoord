import React, { useState, useEffect } from 'react';
import { DateObject, DateArray } from './utils/TypeStructure';
import styles from '@/styles/components/calendar.module.css'; // Import the CSS module

interface CustomCalendarProps {
    selectedDates: DateArray;
    handleDateChange: (updated: DateArray) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ selectedDates, handleDateChange }) => {
  const [selected, setSelected] = useState<DateArray>(selectedDates);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isTransitioning, setTransitioning] = useState<boolean>(false);

  useEffect(() => {
    setTransitioning(true);
    const timeout = setTimeout(() => {
      setTransitioning(false);
    }, 20); 
    return () => clearTimeout(timeout);
  }, [currentDate]);

  const handleDateSelection = (date: DateObject) => {
    const index = selected.findIndex(d => d.year === date.year && d.month === date.month && d.day === date.day);
    let updatedDates;
    if (index !== -1) {
      updatedDates = [...selected];
      updatedDates.splice(index, 1);
    } else {
      updatedDates = [...selected, date];
    }
    setSelected(updatedDates);
    handleDateChange(updatedDates);
  };

  const handleMonthChange = (increment: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  const handleSelectToday = () => {
    const today = new Date();
    handleDateSelection({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    });
  };

  const handleSelectTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    handleDateSelection({
      year: tomorrow.getFullYear(),
      month: tomorrow.getMonth() + 1,
      day: tomorrow.getDate()
    });
  };

  const handleSelectIn2Days = () => {
    const in2Days = new Date();
    in2Days.setDate(in2Days.getDate() + 2);
    handleDateSelection({
      year: in2Days.getFullYear(),
      month: in2Days.getMonth() + 1,
      day: in2Days.getDate()
    });
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  return (
    <div className={styles.datepicker}>
      {/* Top section */}
      <div className={styles['datepicker-top']}>
        <div className={styles['btn-group']}>
          <button className={styles.tag} onClick={handleSelectToday}>Today</button>
          <button className={styles.tag} onClick={handleSelectTomorrow}>Tomorrow</button>
          <button className={styles.tag} onClick={handleSelectIn2Days}>In 2 days</button>
        </div>
        <div className={styles['month-selector']}>
          <button className={styles.arrow} onClick={() => handleMonthChange(-1)}>⏪</button>
          <span className={styles['month-name']}>{`${currentMonth} ${currentYear}`}</span>
          <button className={styles.arrow} onClick={() => handleMonthChange(1)}>⏩</button>
        </div>
      </div>

      {/* Calendar */}
      <div className={`${styles['datepicker-calendar']} ${isTransitioning ? styles.transitioning : ''}`}>
        {/* Render days */}
        <span className={styles.day}>Su</span>
        <span className={styles.day}>Mo</span>
        <span className={styles.day}>Tu</span>
        <span className={styles.day}>We</span>
        <span className={styles.day}>Th</span>
        <span className={styles.day}>Fr</span>
        <span className={styles.day}>Sa</span>
        
        {/* Render blank cells for days before the first day of the month */}
        {Array.from({ length: firstDayOfMonth }, (_, index) => (
          <span key={`blank-${index}`} className={styles.date}></span>
        ))}

        {/* Render days of the month */}
        {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
          const isCurrentDay = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
          const currentDateObject = new Date(currentYear, currentDate.getMonth(), day);
          const isSelectable = currentDateObject.getTime() >= new Date().getTime() - (24 * 60 * 60 * 1000); // 24 hours in milliseconds
          return (
            <button
              key={day}
              className={`${styles.date} 
                          ${selected.find(d => d.day === day && d.month === currentDate.getMonth() + 1 && d.year === currentYear) ? styles.selected : ''} 
                          ${isCurrentDay ? styles['current-day'] : ''} 
                          ${!isSelectable ? styles['past-date'] : ''}`}
              onClick={() => isSelectable && handleDateSelection({ year: currentYear, month: currentDate.getMonth() + 1, day })}
              disabled={!isSelectable}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomCalendar;
