import CalendarComponent from "../components/CalendarComponent";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth, db } from "../services/firebase";
import "../styles/ProfilePage.css";
import "../styles/loading.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import AvatarUploaderOld from "../components/LoginComponents/avatarAndCropping";
import AvatarUploader from "../components/LoginComponents/AvatarUploader";
import LogOut from "../components/LoginComponents/LogOut";

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

  const handleAvatarUploadSuccess = (url) => {
    setUserData((prev) => ({ ...prev, avatarURL: url }));
    if (user) {
      const docRef = doc(db, "users", user.uid);
      updateDoc(docRef, { avatarURL: url }).catch((error) => {
        console.error("Failed to update avatar URL in Firestore:", error);
      });
    }
  };

  const handleUpdate = () => {
    if (!user) return;
    setUpdating(true);
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
          <img src={userData.avatarURL} alt="Avatar" className="avatar" />
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

              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
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
              <div className="avatar-section">
                <h4> Avatar</h4>
                {userData.avatarURL && (
                  <img
                    src={userData.avatarURL}
                    alt="Avatar"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      marginBottom: 10,
                      objectFit: "cover",
                    }}
                  />
                )}

                <AvatarUploader
                  user={user}
                  onUploadSuccess={handleAvatarUploadSuccess}
                />
              </div>
              <label>Email</label>
              <input type="email" value={userData.email} disabled />

              <button onClick={handleUpdate} disabled={updating}>
                {updating ? "Saving..." : "Save Changes"}
              </button>

              <LogOut />
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
