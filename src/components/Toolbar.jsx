const Toolbar = ({ onAddText, onAddImage }) => {
    return (
        <div style={{ top: 10, left: 10, zIndex: 100 }}>
            <button onClick={onAddText}>Add Text</button>
            <button onClick={onAddImage}>Add chunky cat</button>
        </div>
    );
};

export default Toolbar;
