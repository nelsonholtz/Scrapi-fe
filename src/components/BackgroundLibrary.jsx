// src/components/BackgroundLibrary.js

import { backgroundCategories } from "../utils/BackgroundCategories";
import "../styles/BackgroundLibrary.css";

export default function BackgroundLibrary({
  isOpen,
  onClose,
  onSelectBackground,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Select a Background</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {Object.entries(backgroundCategories).map(
          ([categoryName, backgrounds]) => (
            <div key={categoryName}>
              <h3>{categoryName}</h3>
              <div className="background-grid">
                {Object.entries(backgrounds).map(([name, src]) => (
                  <img
                    key={name}
                    src={src}
                    alt={name}
                    className="background-thumbnail"
                    onClick={() => {
                      onSelectBackground(src);
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
