import CalendarComponent from "../components/CalendarComponent";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth, db } from "../services/firebase";
import "../styles/ProfilePage.css";
import "../styles/loading.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";

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
        <p className="error-text">Our moodboards aren't flowing right now</p>
      </div>
    );

  return (
    <div className="profile">
      <h1 className="script-text">Edit Your Profile</h1>

      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        value={userData.firstName}
        onChange={handleChange}
        required
      />

      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        value={userData.lastName}
        onChange={handleChange}
        required
      />

      <label htmlFor="username">Username</label>
      <input
        id="username"
        name="username"
        type="text"
        value={userData.username}
        onChange={handleChange}
        required
      />

      <label htmlFor="avatarURL">Avatar URL</label>
      <input
        id="avatarURL"
        name="avatarURL"
        type="url"
        value={userData.avatarURL}
        onChange={handleChange}
      />
      {userData.avatarURL && (
        <img
          src={userData.avatarURL}
          alt="Avatar Preview"
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            marginTop: 10,
          }}
        />
      )}

      <label>Email</label>
      <input
        type="email"
        value={userData.email}
        name="email"
        onChange={handleChange}
      />

      <button onClick={handleUpdate} disabled={updating}>
        {updating ? "Saving..." : "Save Changes"}
      </button>

      <div style={{ marginTop: "30px" }}>
        <h2>Your Calendar</h2>
        <CalendarComponent user={user} />
      </div>
    </div>
  );
};

export default ProfilePage;
