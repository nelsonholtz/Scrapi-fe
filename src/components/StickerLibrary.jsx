import { stickerCategories } from "../utils/stickerCategories";

import "../styles/StickerLibrary.css";

export default function StickerLibrary({ isOpen, onClose, onSelectSticker }) {
    if (!isOpen) return null;
    console.log("Loaded stickers:", stickerCategories);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Sticker!</h2>
                    <button className="close-button" onClick={onClose}>
                        x
                    </button>
                </div>
                {Object.entries(stickerCategories).map(
                    ([category, stickers]) => (
                        <div key={category}>
                            <h3>{category}</h3>
                            <div className="sticker-grid">
                                {Object.entries(stickers).map(([name, src]) => (
                                    <img
                                        key={name}
                                        src={src}
                                        alt={name}
                                        onClick={() => {
                                            onSelectSticker(src);
                                            onClose();
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
