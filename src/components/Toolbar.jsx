import "../styles/toolbar-update.css";
import { FaUndo } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { BsTextareaT } from "react-icons/bs";

import ImageUploader from "./ImageUploader";

const Toolbar = ({
    onAddText,
    onAddImage,
    onUndo,
    onRedo, onDelete, selectedId,
    onUploadingComplete,
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
                    <ImageUploader onUploadingComplete={onUploadingComplete} />
                </li>
                <li>
                <button 
                onClick={onDelete} 
                disabled={!selectedId}
                style={{ backgroundColor: selectedId ? "#f00" : "#ccc", color: "#fff" }}
            >
                Delete Selected
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
