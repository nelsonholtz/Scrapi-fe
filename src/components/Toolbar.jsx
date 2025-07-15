import "../styles/toolbar-update.css";
import { FaUndo } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { BsTextareaT } from "react-icons/bs";
import { RiEmojiStickerLine } from "react-icons/ri";
import { CgExport } from "react-icons/cg";
import { FiSave } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FaPaintBrush, FaEraser } from "react-icons/fa";

import ImageUploader from "./ImageUploader";

const Toolbar = ({
  onAddText,
  onAddImage,
  onUndo,
  onRedo,
  onDelete,
  onDeleteBoard,
  selectedId,
  onUploadError,
  onOpenStickerLibrary,
  onUploadingComplete,
  onUploadingStart,
  onUploadingEnd,
  onSave,
  onExport,
  isDrawingMode,
  setIsDrawingMode,
  tool,
  setTool,
}) => {
  return (
    <div className="toolbar-container">
      <ul className="toolbar-list">
        <li>
          <button className="toolbar-button" onClick={onAddText}>
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
          <button className="toolbar-button" onClick={onOpenStickerLibrary}>
            <RiEmojiStickerLine />
          </button>
        </li>
        <li>
          <button className="toolbar-button" onClick={onSave}>
            <FiSave />
          </button>
        </li>
        <li>
          <button className="toolbar-button" onClick={onExport}>
            <CgExport />
          </button>
        </li>
        <li>
          <button className="toolbar-button" onClick={onDeleteBoard}>
            <RiDeleteBin2Line />
          </button>
        </li>
        <div
          className="drawing-toolbar-container"
          style={{
            marginLeft: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            className={`toolbar-button ${isDrawingMode ? "active" : ""}`}
            onClick={() => setIsDrawingMode(!isDrawingMode)}
            title={isDrawingMode ? "Disable Drawing" : "Enable Drawing"}
            aria-pressed={isDrawingMode}
          >
            <FaPaintBrush />
          </button>

          {isDrawingMode && (
            <select
              className="toolbar-select"
              value={tool}
              onChange={(e) => setTool(e.target.value)}
              aria-label="Select drawing tool"
              style={{ padding: "5px", borderRadius: "4px" }}
            >
              <option value="brush">Brush</option>
              <option value="eraser">Eraser</option>
            </select>
          )}
        </div>
      </ul>

      <div className="side-toolbar-container">
        <button className="toolbar-button" onClick={onUndo}>
          <FaUndo />
        </button>
        <button className="toolbar-button" onClick={onRedo}>
          <FaRedo />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
