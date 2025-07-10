import "../styles/createBoard-styling.css";
const DatePicker = ({ date, onDateChange }) => {
    return (
        <div className="date-picker">
            <label htmlFor="boardDate">Select Date:</label>
            <input
                type="date"
                id="boardDate"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
            />
        </div>
    );
};

export default DatePicker;
