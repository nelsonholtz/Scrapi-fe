import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { fetchPublicBoards } from "../services/boardSaving";
import "../styles/ProfilePage.css";
import Loading from "../components/Loading";
import PublicBoardGrid from "../components/PublicBoardsGrid";
import "../styles/PublicBoardsGrid.css";

const PublicProfilePage = () => {
    const { username } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProfileData = async () => {
            setLoading(true);
            setError(null);
            try {
                const q = query(
                    collection(db, "users"),
                    where("username", "==", username)
                );
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError("User not found.");
                    setLoading(false);
                    return;
                }

                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                const userId = userDoc.id;

                setUserInfo({
                    username: userData.username,
                    avatarURL: userData.avatarURL || "",
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                });

                const publicBoards = await fetchPublicBoards(userId);
                setBoards(publicBoards);
                console.log("boards received:", boards);
            } catch (err) {
                console.error(err);
                setError("Something went wrong. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadProfileData();
    }, [username]);

    if (loading) return <Loading state="loading" />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="profile-page-container">
            <h1>
                {userInfo.firstName} {userInfo.lastName}
            </h1>
            <h2>@{userInfo.username}</h2>
            {userInfo.avatarURL ? (
                <img
                    src={userInfo.avatarURL}
                    alt={`${userInfo.username}'s avatar`}
                    className="avatar"
                />
            ) : (
                <div className="avatar-placeholder">👤</div>
            )}

            <h2>Public Boards</h2>
            <PublicBoardGrid boards={boards} />
        </div>
    );
};

export default PublicProfilePage;
