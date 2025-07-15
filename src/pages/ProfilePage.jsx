import CalendarComponent from "../components/CalendarComponent";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth, db } from "../services/firebase";
import "../styles/ProfilePage.css";
import "../styles/loading.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import AllUserBoards from "../components/AllUserBoards";
const ProfilePage = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        avatarURL: "",
        email: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }

        const docRef = doc(db, "users", user.uid);
        setLoading(true);
        setError(null);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user, navigate]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        if (!user) return;
        setUpdating(true);

        const docRef = doc(db, "users", user.uid);
        updateDoc(docRef, userData)
            .then(() => {
                alert("Profile updated successfully!");
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
                alert("Failed to update profile.");
            })
            .finally(() => {
                setUpdating(false);
            });
    };

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
                <p className="error-text">{error}</p>
            </div>
        );

    return (
        <>
            <div className="profile-page-container">
                <h1>Your Profile</h1>
                <div className="profile-header">
                    <img
                        src={userData.avatarURL}
                        alt="Avatar"
                        className="avatar"
                    />
                    <strong>
                        <h2>
                            {userData.firstName} {userData.lastName}
                        </h2>
                    </strong>
                    <h3>@{userData.username}</h3>
                    <button onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>

                    {isEditing && (
                        <div className="edit-form">
                            <label>First Name</label>
                            <input
                                name="firstName"
                                type="text"
                                value={userData.firstName}
                                onChange={handleChange}
                            />

                            <label>Last Name</label>
                            <input
                                name="lastName"
                                type="text"
                                value={userData.lastName}
                                onChange={handleChange}
                            />

                            <label>Username</label>
                            <input
                                name="username"
                                type="text"
                                value={userData.username}
                                onChange={handleChange}
                            />

                            <label>Avatar URL</label>
                            <input
                                name="avatarURL"
                                type="url"
                                value={userData.avatarURL}
                                onChange={handleChange}
                            />

                            <label>Email</label>
                            <input
                                type="email"
                                value={userData.email}
                                disabled
                            />

                            <button onClick={handleUpdate} disabled={updating}>
                                {updating ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    )}
                </div>

                <div className="calendar-section">
                    <h2>Your Calendar</h2>
                    <div className="calendar-layout">
                        <CalendarComponent user={user} />
                    </div>
                </div>
            </div>
            <div>
                <AllUserBoards user={user} />
            </div>
        </>
    );
};

export default ProfilePage;
