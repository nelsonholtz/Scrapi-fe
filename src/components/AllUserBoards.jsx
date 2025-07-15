import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { fetchUserBoards, deleteBoard } from "../services/boardSaving";
import { RiDeleteBin2Line } from "react-icons/ri";

import "../styles/ProfilePage.css";

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

    const handleDeleteBoard = async (boardDate, boardId) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete the board from ${boardDate}? This action cannot be undone.`
        );
        
        if (!confirmDelete) return;

        setDeletingBoardId(boardId);
        setError(null);
        
        try {
            await deleteBoard(user.uid, boardDate);
            setBoards(prevBoards => prevBoards.filter(board => board.id !== boardId));
        } catch (error) {
            console.error("Failed to delete board:", error);
            setError("Failed to delete board. Please try again.");
        } finally {
            setDeletingBoardId(null);
        }
    };

    if (loading) return <p>Your boards are loading...</p>;

    return (
        <div>
            <h2>Your Scrapbooks</h2>
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            {boards.length === 0 ? (
                <p>You haven't created any boards yet!</p>
            ) : (
                <div className="boards-grid">
                    {boards.map((board) => (
                        <div
                            key={board.id}
                            className="board-tile board-tile-container"
                        >
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
                                    handleDeleteBoard(board.date, board.id);
                                }}
                                disabled={deletingBoardId === board.id}
                                className="delete-board-btn"
                                title={deletingBoardId === board.id ? "Deleting..." : "Delete board"}
                            >
                                {deletingBoardId === board.id ? (
                                    <span className="delete-loading">...</span>
                                ) : (
                                    <RiDeleteBin2Line />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllUserBoards;
