import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserBoards, deleteBoard } from "../services/boardSaving";
import { RiDeleteBin2Line } from "react-icons/ri";

import "../styles/ProfilePage.css";
import "../styles/errorMessage.css";

const AllUserBoards = ({ user }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingBoardId, setDeletingBoardId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchBoards = async () => {
      setLoading(true);
      setError(null);
      try {
        const userBoards = await fetchUserBoards(user.uid);
        setBoards(userBoards);
      } catch (error) {
        console.error("Failed to fetch user boards:", error);
        setError("Failed to load your boards. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [user]);

  const handleDeleteClick = (boardDate, boardId) => {
    setDeletingBoardId({ id: boardId, date: boardDate });
  };

  const handleConfirmDelete = async () => {
    if (!deletingBoardId) return;

    setError(null);

    try {
      await deleteBoard(user.uid, deletingBoardId.date);
      setBoards((prevBoards) =>
        prevBoards.filter((board) => board.id !== deletingBoardId.id)
      );
    } catch (error) {
      console.error("Failed to delete board:", error);
      setError("Failed to delete board. Please try again.");
    } finally {
      setDeletingBoardId(null);
    }
  };

  if (loading) return <p>Your boards are loading...</p>;

  if (deletingBoardId) {
    return (
      <div className="error-container">
        <button className="close-btn" onClick={() => setDeletingBoardId(null)}>
          ×
        </button>
        <div className="error-whale">🗑️</div>
        <p className="error-text">
          Are you sure you want to delete the board from {deletingBoardId.date}?
          This cannot be undone.
        </p>
        <div className="confirm-buttons">
          <button className="confirm-btn" onClick={handleConfirmDelete}>
            Yes, delete
          </button>
          <button
            className="confirm-btn"
            onClick={() => setDeletingBoardId(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Your Scrapbooks</h2>
      {error && <div className="error-message">{error}</div>}
      {boards.length === 0 ? (
        <p>You haven't created any boards yet!</p>
      ) : (
        <div className="boards-grid">
          {boards.map((board) => (
            <div key={board.id} className="board-tile board-tile-container">
              <div
                onClick={() => navigate(`/board/${board.date}`)}
                className="board-content"
              >
                {board.previewImage && board.previewImage.trim() !== "" ? (
                  <img src={board.previewImage} alt="Board preview" />
                ) : (
                  <div className="no-preview-placeholder">
                    No preview available
                  </div>
                )}
                <div className="board-info">
                  <p>{board.date}</p>
                  {board.public && <span>🌍 Public</span>}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(board.date, board.id);
                }}
                className="delete-board-btn"
                title="Delete board"
              >
                <RiDeleteBin2Line />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllUserBoards;
