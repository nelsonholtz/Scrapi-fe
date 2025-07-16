import React from "react";
import { Link } from "react-router-dom";
import "../styles/PostCard.css";

const PostCard = ({ board }) => {
    const { userId, userData, date, updatedAt, previewImage } = board;

    const formatPrettyDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const suffix =
            day % 10 === 1 && day !== 11
                ? "st"
                : day % 10 === 2 && day !== 12
                  ? "nd"
                  : day % 10 === 3 && day !== 13
                    ? "rd"
                    : "th";

        const options = { month: "long", year: "numeric" };
        const formatted = date.toLocaleDateString("en-GB", options);

        return `${day}${suffix} ${formatted}`;
    };
    const formattedDate = formatPrettyDate(date);
    const formattedUpdatedAt = updatedAt?.toDate?.().toLocaleString?.() || "";

    return (
        <li className="post-card">
            <div className="post-card-content">
                <div className="post-card-header">
                    {userData?.avatarURL ? (
                        <img
                            src={userData.avatarURL}
                            alt={`${userData.username} avatar`}
                            className="post-card-avatar"
                        />
                    ) : (
                        <div className="post-card-avatar-placeholder">?</div>
                    )}

                    <div className="post-card-user-info">
                        <strong>
                            {userData
                                ? `${userData.firstName} ${userData.lastName}`
                                : userId}
                        </strong>
                        <br />
                        <span className="post-card-username">
                            <Link
                                to={`/profiles/${userData?.username || userId}`}
                                className="post-card-user-link"
                            >
                                @{userData?.username || userId}
                            </Link>
                        </span>
                    </div>
                </div>

                <div className="post-card-date">
                    <strong>{formattedDate}</strong>
                </div>

                {previewImage ? (
                    <img
                        src={previewImage}
                        alt={`Board by ${userData?.username || userId}`}
                        className="post-card-preview"
                    />
                ) : (
                    <p>No preview available</p>
                )}

                <div className="post-card-updated">
                    Last updated: {formattedUpdatedAt || "Just now"}
                </div>
            </div>
        </li>
    );
};

export default PostCard;
