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
}) => {
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
            </ul>

            <div className="side-toolbar-container">
                <button
                    title="Undo"
                    className="toolbar-button"
                    onClick={onUndo}
                >
                    <FaUndo />
                </button>
                <button
                    title="Redo"
                    className="toolbar-button"
                    onClick={onRedo}
                >
                    <FaRedo />
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
