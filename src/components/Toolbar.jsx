import "../styles/toolbar-update.css";
import { FaUndo } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { BsTextareaT } from "react-icons/bs";
import { RiEmojiStickerLine } from "react-icons/ri";

import ImageUploader from "./ImageUploader";

const Toolbar = ({
  onAddText,
  onAddImage,
  onUndo,
  onRedo,
  onDelete,
  selectedId,
  onUploadError,
  onOpenStickerLibrary,
  onUploadingComplete,
  onUploadingStart,
  onUploadingEnd,
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
