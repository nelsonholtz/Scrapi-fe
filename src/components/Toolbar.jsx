const Toolbar = ({ onAddText, onUndo, onRedo }) => {
  return (
    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 100 }}>
      <button onClick={onAddText}>Add Text</button>
      <button onClick={onUndo}>Undo</button>
      <button onClick={onRedo}>Redo</button>
    </div>
  );
};

export default Toolbar;
