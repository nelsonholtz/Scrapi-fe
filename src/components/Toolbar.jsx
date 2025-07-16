import "../styles/toolbar-update.css";
import { FaUndo } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { BsTextareaT } from "react-icons/bs";
import { RiEmojiStickerLine } from "react-icons/ri";
import { CgExport } from "react-icons/cg";
import { FiSave } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";

import ImageUploader from "./ImageUploader";

const Toolbar = ({
    onAddText,
      onUndo,
    onRedo,
    onDelete,
    onDeleteBoard,
    selectedId,
    onUploadError,
      onUploadingComplete,
    onUploadingStart,
    onUploadingEnd,
    onSave,
    onExport,
  onOpenStickerLibrary,
  canUndo,
  canRedo,
  onBackgroundColorChange, // 👉 Added prop to trigger bg color change
}) => {
    // 👉 Helper to convert HEX (#RRGGBB) to { r, g, b }
  const hexToRgb = (hex) => {
    const sanitized = hex.replace("#", "");
    const bigint = parseInt(sanitized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  const handleColorChange = (e) => {
    const hex = e.target.value;
    const rgb = hexToRgb(hex); // 👉 Convert hex to RGB object
    onBackgroundColorChange(rgb); // 👉 Update background color state in parent
  };

  return (
        <div className="toolbar-container">
            <ul className="toolbar-list">
                <li>
                    <button
                        title="Add text"
                        className="toolbar-button"
                        onClick={onAddText}
                    >
                        <BsTextareaT />
                    </button>
                </li>
                <li>
                    <ImageUploader
                        onUploadingComplete={onUploadingComplete}
                        onUploadError={onUploadError}
                        onUploadingStart={onUploadingStart}
                        onUploadingEnd={onUploadingEnd}
                    />
                </li>
                <li>
                    <button
                        title="Add stickers"
                        className="toolbar-button"
                        onClick={onOpenStickerLibrary}
                    >
                        <RiEmojiStickerLine />
                    </button>
                </li>
                <li>
                    <button
                        title="Save your board"
                        className="toolbar-button"
                        onClick={onSave}
                    >
                        <FiSave />
                    </button>
                </li>
                <li>
                    <button
                        title="Save your board as a PNG file"
                        className="toolbar-button"
                        onClick={onExport}
                    >
                        <CgExport />
                    </button>
                </li>
                <li>
                    <button
                        title="Clear board"
                        className="toolbar-button"
                        onClick={onDeleteBoard}
                    >
                        <RiDeleteBin2Line />
                    </button>
                </li>
              <li>
          {/* 👉 New background color picker button */}
          <input
            type="color"
            onChange={handleColorChange} // 👉 Updates RGB color state in parent
            title="Pick background color"
            className="toolbar-button"
            style={{
              width: "40px",
              height: "40px",
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          />
        </li>
      </ul>

            <div className="side-toolbar-container">
                <button
                    title="Undo"
                   
          className="toolbar-button"
                   
          onClick={onUndo}
                
          disabled={!canUndo}
        >
                    <FaUndo />
                </button>
                <button
                    title="Redo"
                   
          className="toolbar-button"
                   
          onClick={onRedo}
                
          disabled={!canRedo}
        >
                    <FaRedo />
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
