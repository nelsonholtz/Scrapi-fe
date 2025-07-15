import Calendar from "react-calendar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { fetchUserBoards, getUserBoard } from "../services/boardSaving";
import "react-calendar/dist/Calendar.css";
import "../styles/calendar.css";
//import "../styles/calendar-with-panel.css";
import { useParams } from "react-router-dom";

const CalendarComponent = ({ user }) => {
    const { datePath } = useParams();
    const [savedDates, setSavedDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [value, setValue] = useState(new Date());

    const navigate = useNavigate();

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
        const loadBoards = async () => {
            try {
                const boards = await fetchUserBoards(user.uid);

                const dates = boards.map((board) => board.date);
                setSavedDates(dates);
            } catch (err) {
                console.error("Cannot fetch boards for calendar", err);
            }
        };
        loadBoards();
    }, [user]);

    const handleDateClick = async (date) => {
        const dateStr = formatDate(date);
        setValue(date);
        setSelectedDate(dateStr);

        if (savedDates.includes(dateStr)) {
            try {
                const board = await getUserBoard(user.uid, dateStr);
                setSelectedBoard(board);
            } catch (err) {
                console.error("Failed to fetch board for selected date", err);
                setSelectedBoard(null);
            }
        } else {
            setSelectedBoard(null);
        }
    };

    return (
        <div className="calendar-preview-wrapper">
            <div className="calendar-container">
                <Calendar
                    onChange={setValue}
                    onClickDay={handleDateClick}
                    value={value}
                    tileContent={({ date, view }) => {
                        if (view === "month") {
                            const dateStr = formatDate(date);
                            if (savedDates.includes(dateStr)) {
                                return (
                                    <span className="calendar-note-indicator">
                                        📝
                                    </span>
                                );
                            }
                        }
                        return null;
                    }}
                />
            </div>

            <div
                className={`calendar-preview-panel ${
                    selectedBoard ? "slide-in" : "slide-out"
                }`}
            >
                {selectedBoard ? (
                    <>
                        <h3>{selectedDate}</h3>
                        {selectedBoard.previewImage ? (
                            <img
                                src={selectedBoard.previewImage}
                                alt="Board Preview"
                                className="calendar-preview-img"
                            />
                        ) : (
                            <p>No preview available</p>
                        )}
                        <p>
                            Visibility:{" "}
                            {selectedBoard.public ? (
                                <span>🌍 Public</span>
                            ) : (
                                <span>🔒 Private</span>
                            )}
                        </p>
                        <button
                            className="calendar-view-button"
                            onClick={() => navigate(`/board/${selectedDate}`)}
                        >
                            View Scrapbook
                        </button>
                    </>
                ) : (
                    <p className="empty-preview">Select a date with a board</p>
                )}
            </div>
        </div>
    );
};

export default CalendarComponent;
