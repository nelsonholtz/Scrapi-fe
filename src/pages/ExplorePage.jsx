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
    const [sortBy, setSortBy] = useState("updatedAt");

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
    const sortedBoards = [...publicBoards].sort((a, b) => {
        const dateA =
            sortBy === "updatedAt" ? a.updatedAt?.toDate?.() : new Date(a.date);
        const dateB =
            sortBy === "updatedAt" ? b.updatedAt?.toDate?.() : new Date(b.date);

        return dateB - dateA;
    });

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

            {publicBoards.length === 0 ? (
                <p className="empty-board">No public boards available yet.</p>
            ) : (
                <div className="articles-list">
                    {sortedBoards.map((board) => (
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
