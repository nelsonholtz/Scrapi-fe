import Calendar from "react-calendar";
import { useState, useEffect } from "react";

import { getUserBoardDates } from "../services/boardSaving";
import "react-calendar/dist/Calendar.css";
import "../styles/calendar.css";

const CalendarComponent = ({ user }) => {
  const [savedDates, setSavedDates] = useState([]);
  const [value, setValue] = useState(new Date());

  const formatDate = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!user) {
      setSavedDates([]);
      return;
    }
    getUserBoardDates(user.uid)
      .then((dates) => setSavedDates(dates))
      .catch((err) => {
        console.error("Cannot get dates", err);
      });
  }, [user]);
  return (
    <div className="calendar-container">
      <Calendar
        onChange={setValue}
        value={value}
        tileContent={({ date, view }) => {
          if (view === "month") {
            const dateStr = formatDate(date);
            if (savedDates.includes(dateStr)) {
              return <span className="calendar-note-indicator">📝</span>;
            }
          }
          return null;
        }}
      />
    </div>
  );
};

export default CalendarComponent;
