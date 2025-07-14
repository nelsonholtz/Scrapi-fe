import { useEffect, useState } from "react";
import { getPublicBoards } from "../services/boardSaving";
import PostCard from "../components/PostCard";

const ExplorePage = () => {
    const [publicBoards, setPublicBoards] = useState([]);

    useEffect(() => {
        getPublicBoards().then((boards) => {
            setPublicBoards(boards);
            console.log(boards);
        });
    }, []);

    return (
        <div>
            <h2>Explore Boards</h2>
            {publicBoards.length === 0 ? (
                <p>No public boards available yet.</p>
            ) : (
                <div>
                    {publicBoards.map((board) => (
                        <PostCard key={board.id} board={board} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExplorePage;
