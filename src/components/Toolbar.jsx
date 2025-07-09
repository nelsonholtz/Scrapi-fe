import "./toolBar.css";
import ImageUploader from "./ImageUploader";

const Toolbar = ({
    onAddText,
    onAddImage,
    onUndo,
    onRedo,
    onOpenStickerLibrary,
    onUploadingComplete,
}) => {
    return (
        <div style={{ top: 10, left: 10, zIndex: 100 }}>
            <button onClick={onAddText}>Add Text</button>
            <button onClick={onAddImage}>Add chunky cat</button>
            <button onClick={onUndo}>Undo</button>
            <button onClick={onRedo}>Redo</button>
            <ImageUploader onUploadingComplete={onUploadingComplete} />
            <button onClick={onOpenStickerLibrary}>Add Sticker</button>
        </div>
    );
};

export default Toolbar;
