import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { firebaseAuth, db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import AvatarUploader from "./AvatarUploader";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [avatarURL, setAvatarURL] = useState("");

    const [emailError, setEmailError] = useState("");

    const navigate = useNavigate();

    const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (!emailRegex.test(value)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError("");
        }
    };

    const handleAvatarUploadSuccess = (url) => {
        setAvatarURL(url);
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        if (emailError) return;
        console.log({
            firstName,
            lastName,
            username,
            avatarURL,
            email,
            password,
        });

        createUserWithEmailAndPassword(firebaseAuth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                const userData = {
                    firstName,
                    lastName,
                    username,
                    avatarURL,
                    email,
                    createdAt: new Date().toISOString(),
                };
                setDoc(doc(db, "users", user.uid), userData)
                    .then(() => {
                        navigate("/profile");
                    })
                    .catch((error) => {
                        console.error(
                            "Error saving user data to Firestore:",
                            error
                        );
                    });
            })
            .catch((err) => {
                const errorCode = err.code;
                const errorMessage = err.message;
                console.log(errorCode, errorMessage);

                if (errorCode === "auth/invalid-email") {
                    setEmailError("Invalid email address.");
                } else {
                    setEmailError("");
                }
            });
    };

    const getInputClass = (error, value) => {
        if (error) return "error";
        if (value && !error) return "success";
        return "";
    };

    return (
        <>
            <form onSubmit={handleSignUp} className="auth">
                <h1 className="script-text">Create an account</h1>
                <label htmlFor="firstName">First Name</label>
                <input
                    id="firstName"
                    type="text"
                    required
                    minLength={2}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />

                <label htmlFor="lastName">Last Name</label>
                <input
                    id="lastName"
                    type="text"
                    required
                    minLength={2}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />

                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    required
                    minLength={3}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label htmlFor="avatar">Avatar (Optional)</label>
                <div className="avatar-upload-section">
                    {avatarURL && avatarURL.trim() !== "" && (
                        <img
                            src={avatarURL}
                            alt="Avatar preview"
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                marginBottom: 10,
                                objectFit: "cover",
                                display: "block",
                                margin: "0 auto 10px auto",
                            }}
                        />
                    )}
                    <AvatarUploader
                        user={{ uid: "temp-signup-user" }}
                        onUploadSuccess={handleAvatarUploadSuccess}
                    />
                </div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={getInputClass(emailError, email)}
                />
                {emailError && <p style={{ color: "red" }}>{emailError}</p>}

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
        </>
    );
};

export default SignUp;
