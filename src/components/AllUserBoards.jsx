import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { fetchUserBoards } from "../services/boardSaving";

import "../styles/ProfilePage.css";

const AllUserBoards = ({ user }) => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchBoards = async () => {
            setLoading(true);
            try {
                const userBoards = await fetchUserBoards(user.uid);
                setBoards(userBoards);
            } catch (error) {
                console.error("Failed to fetch user boards:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBoards();
    }, [user]);

    if (loading) return <p>Your boards are loading...</p>;

    return (
        <div>
            <h2>Your Scrapbooks</h2>
            {boards.length === 0 ? (
                <p>You haven't created any boards yet!</p>
            ) : (
                <div className="boards-grid">
                    {boards.map((board) => (
                        <div
                            key={board.id}
                            className="board-tile"
                            onClick={() => navigate(`/board/${board.date}`)}
                        >
                            <img src={board.previewImage} alt="Board preview" />
                            <div className="board-info">
                                <p>{board.date}</p>
                                {board.public && <span>🌍 Public</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllUserBoards;
