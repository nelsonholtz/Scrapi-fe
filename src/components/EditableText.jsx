import { useState, useRef } from "react";
import { Text } from "react-konva";
import { Html } from "react-konva-utils";

const EditableText = ({
  id,
  x,
  y,
  text,
  onChange,
  onUpdate,
  stageRef,
}) => {
  const [isEditing, setIsEditing] = useState(false); // Same var names
  const [value, setValue] = useState(text); //Initialize input with current text
  const inputRef = useRef();

  const handleDblClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus(); // Focus after render
    }, 0);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== text) {
      onChange(id, value); //Update elements with final value
      onUpdate(id, { text: value }); //Push final value to history
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current.blur(); //Save on Enter key
    }
  };

  return (
    <>
      {isEditing ? (
        <Html>
          <input
            ref={inputRef}
            style={{
              position: "absolute",
              top: y + stageRef.current.container().offsetTop,
              left: x + stageRef.current.container().offsetLeft,
              fontSize: 20,
              border: "1px solid black",
              padding: "2px",
              zIndex: 1000,
            }}
            value={value} // Controlled input
            onChange={(e) => setValue(e.target.value)} // Live input update
            onBlur={handleBlur} // Save on blur
            onKeyDown={handleKeyDown}
          />
        </Html>
      ) : (
        <Text
          x={x}
          y={y}
          text={text} //Shows correct text from props
          fontSize={20}
          draggable
          onDblClick={handleDblClick}
          onDragEnd={(e) => {
            onUpdate(id, {
              x: e.target.x(),
              y: e.target.y(),
            }); // Update text position
          }}
        />
      )}
    </>
  );
};

export default EditableText;