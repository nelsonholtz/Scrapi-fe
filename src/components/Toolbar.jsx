import "./toolBar.css";

const Toolbar = ({ onAddText, onAddImage, onUndo, onRedo, onDelete, selectedId }) => {
    return (
        <div style={{ position: "absolute", top: 200, left: 10, zIndex: 100, display: "flex", flexDirection: "column", gap: "8px" }}>
            <button onClick={onAddText}>Add Text</button>
            <button onClick={onAddImage}>Add chunky cat</button>
            <button onClick={onUndo}>Undo</button>
            <button onClick={onRedo}>Redo</button>
            <button 
                onClick={onDelete} 
                disabled={!selectedId}
                style={{ backgroundColor: selectedId ? "#f00" : "#ccc", color: "#fff" }}
            >
                Delete Selected
            </button>
        </div>
    );
};

export default Toolbar;
