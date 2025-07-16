import React, { useEffect, useState } from "react";
import "../styles/signIn.css";
import scrapiLogoSVG from "../assets/ScrapiHomeLogo.svg";
import speechSticker from "../assets/Stickers/TornPaper/TornPaper6.png";
import flowerSticker from "../assets/Stickers/FlowerStickers/Flowers4.png";

const Welcome = () => {
    const [showIdle, setShowIdle] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowIdle(true);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="welcome-container">
            <div className="welcome">
                <h1>Welcome to</h1>
                <img src={scrapiLogoSVG} className="scrapi-logo stop-motion" />
                <p>Your digital scrapbook awaits...</p>

                <img
                    src={speechSticker}
                    alt=""
                    className={`sticker slide-in ${showIdle ? "idle" : ""}`}
                />
                <img
                    src={speechSticker}
                    alt=""
                    className={`sticker-flipped slide-in ${showIdle ? "idle" : ""}`}
                />
            </div>
        </div>
    );
};

export default Welcome;
