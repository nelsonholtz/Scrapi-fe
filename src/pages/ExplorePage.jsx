import { useEffect, useState } from "react";
import { getPublicBoards } from "../services/boardSaving";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import PostCard from "../components/PostCard";
import "../styles/exploreBoard.css";
import "../styles/loading.css";
import Loading from "../components/Loading";

const ExplorePage = () => {
    const [publicBoards, setPublicBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadBoards() {
            try {
                const boards = await getPublicBoards();
                const boardsWithUser = await Promise.all(
                    boards.map(async (board) => {
                        const userSnap = await getDoc(
                            doc(db, "users", board.userId)
                        );
                        return {
                            ...board,
                            userData: userSnap.exists()
                                ? userSnap.data()
                                : null,
                        };
                    })
                );
                setPublicBoards(boardsWithUser);
            } catch (err) {
                setError("Failed to load boards.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadBoards();
    }, []);

    if (loading) {
        return <Loading state={"loading"} />;
    }
    if (error)
        return (
            <div className="error-container">
                <button className="close-btn" onClick={() => setError(null)}>
                    ×
                </button>
                <div className="error-whale">🐳</div>
                <p className="error-text">{error}</p>
            </div>
        );

    return (
        <div className="explore-container">
            <h1 className="explore-title">Explore Boards</h1>
            {publicBoards.length === 0 ? (
                <p className="empty-board">No public boards available yet.</p>
            ) : (
                <div className="articles-list">
                    {publicBoards.map((board) => (
                        <div key={board.id} className="article-card">
                            <PostCard board={board} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExplorePage;
