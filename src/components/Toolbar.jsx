const Toolbar = ({ onAddText }) => {
  return (
    <div style={{ top: 10, left: 10, zIndex: 100 }}>
      <button onClick={() => onAddText("text")}>Add Text</button>
    </div>
  );
};

export default Toolbar;
