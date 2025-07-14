import { useEffect, useState } from "react";
import { getPublicBoards } from "../services/boardSaving";
import PostCard from "../components/PostCard";
import "../styles/exploreBoard.css";
import "../styles/loading.css";

const ExplorePage = () => {
  const [publicBoards, setPublicBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPublicBoards()
      .then((boards) => {
        setPublicBoards(boards);
        console.log(boards);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="whale">🐋</div>
        <div>loading page</div>
        <div className="dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    );
  }
  if (error)
    return (
      <div className="error-container">
        <button className="close-btn" onClick={() => setError(null)}>
          ×
        </button>
        <div className="error-whale">🐳</div>
        <p className="error-text">Our moodboards aren't flowing right now</p>
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
