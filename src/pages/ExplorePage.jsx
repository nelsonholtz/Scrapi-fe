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
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Explore Boards</h2>
            {publicBoards.length === 0 ? (
                <p>No public boards available yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {publicBoards.map((board) => (
                        <PostCard key={board.id} board={board} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExplorePage;
