import "../styles/toolbar-update.css";
import { FaUndo, FaRedo } from "react-icons/fa";
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
  onOpenStickerLibrary, // 👉 receives `true` to open sticker library
  canUndo,
  canRedo,
  onBackgroundColorChange,
  onBackgroundImageChange,
}) => {
  const hexToRgb = (hex) => {
    const sanitized = hex.replace("#", "");
    const bigint = parseInt(sanitized, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const handleColorChange = (e) => {
    const hex = e.target.value;
    onBackgroundImageChange(null); // 👉 clear background image
    onBackgroundColorChange(hexToRgb(hex)); // 👉 convert to RGB object
  };

  const presetBackgrounds = [
    { name: "Waterfall", url: "https://images.unsplash.com/photo-1549893072-3ca07293a0e3" },
    { name: "Jungle", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
    { name: "Outer Space", url: "https://images.unsplash.com/photo-1470472304068-4398a9daabf8" },
    { name: "Sky", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
    { name: "Beach", url: "" },
  ];

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
            onClick={() => onOpenStickerLibrary(true)} // 👉 calls parent handler with `true`
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
            title="Export as PNG"
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
          <input
            type="color"
            onChange={handleColorChange} // 👉 handles solid color bg
            title="Pick background color"
            className="toolbar-button"
            style={{ width: 40, height: 40, padding: 0, border: "none" }}
          />
        </li>
        <li>
          <select
            className="toolbar-button"
            onChange={(e) => {
              const url = e.target.value;
              if (url) {
                onBackgroundImageChange(url); // 👉 sets image bg
              }
            }}
          >
            <option value="">-- Set Background Image --</option>
            {presetBackgrounds.map(({ name, url }) => (
              <option key={url} value={url}>
                {name}
              </option>
            ))}
          </select>
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
