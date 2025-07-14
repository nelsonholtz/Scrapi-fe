import CalendarComponent from "../components/CalendarComponent";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import "./ProfilePage.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import AvatarUploader from "../components/LoginComponents/avatarAndCropping";

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
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const docRef = doc(db, "users", user.uid);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
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

  if (loading) return <p>Loading profile...</p>;

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
          }}
        />
      )}

      <AvatarUploader user={user} onUploadSuccess={handleAvatarUploadSuccess} />

      <label>Email</label>
      <input type="email" value={userData.email} disabled />

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
