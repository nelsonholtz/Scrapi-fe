import { useState } from "react";
import "../styles/PublicBoardsGrid.css";

const PublicBoardGrid = ({ boards }) => {
    const [sortBy, setSortBy] = useState("updatedAt");

    const sortedBoards = [...boards].sort((a, b) => {
        if (sortBy === "updatedAt") {
            const aDate = a.updatedAt?.toDate?.() || new Date(0);
            const bDate = b.updatedAt?.toDate?.() || new Date(0);
            return bDate - aDate;
        } else {
            return new Date(b.date) - new Date(a.date);
        }
    });

    const formatPrettyDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="public-board-grid">
            <div className="sort-controls">
                <label>Sort by: </label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="updatedAt">Last Updated</option>
                    <option value="date">Saved Date</option>
                </select>
            </div>

            {sortedBoards.length === 0 && <p>No public boards to show 🫣</p>}

            <ul className="board-list">
                {sortedBoards.map((board) => (
                    <li key={board.id} className="board-list-item">
                        <p>
                            <strong>Saved on:</strong>{" "}
                            {formatPrettyDate(board.date)}
                        </p>

                        <p>
                            <strong>Last updated:</strong>{" "}
                            {board.updatedAt?.toDate?.().toLocaleString() ||
                                "Just now"}
                        </p>

                        {board.previewImage ? (
                            <img
                                src={board.previewImage}
                                alt="Board preview"
                                className="board-preview-img"
                            />
                        ) : (
                            <div className="no-preview-placeholder">
                                No preview available
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PublicBoardGrid;
