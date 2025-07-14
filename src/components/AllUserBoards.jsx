import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from "../services/firebase";

import "../pages/ProfilePage.css";

const AllUserBoards = ({ user }) => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchBoards = async () => {
            try {
                const q = query(
                    collection(db, "boards"),
                    where("userId", "==", user.uid)
                );
                const querySnapshot = await getDocs(q);
                const userBoards = [];

                querySnapshot.forEach((doc) => {
                    userBoards.push({ id: doc.id, ...doc.data() });
                });

                userBoards.sort((a, b) => new Date(b.date) - new Date(a.date));
                setBoards(userBoards);
            } catch (error) {
                console.error("Error fetching user boards:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBoards();
    }, [user.uid]);

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
