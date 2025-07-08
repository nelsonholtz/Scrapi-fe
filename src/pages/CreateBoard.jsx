import { Stage, Layer } from "react-konva";
import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import Toolbar from "../components/Toolbar";
import EditableText from "../components/EditableText";
import DraggableImage from "../components/DraggableImage";

const CreateBoard = () => {
  const [elements, setElements] = useState([]);
  const stageRef = useRef();

  const handleAddText = () => {
    const newText = {
      id: uuidv4(),
      type: "text",
      text: "New Text",
      x: 200,
      y: 200,
    };
    setElements((prev) => [...prev, newText]);
  };
  const handleTextChange = (id, newText) => {
    setElements((prev) =>
      prev.map((element) =>
        element.id === id ? { ...element, text: newText } : element
      )
    );
  };
  return (
    <>
      <Toolbar onAddText={handleAddText} />
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
      >
        <Layer>
          {elements.map((element) =>
            element.type === "text" ? (
              <EditableText
                key={element.id}
                id={element.id}
                text={element.text}
                x={element.x}
                y={element.y}
                onChange={handleTextChange}
                stageRef={stageRef}
              />
            ) : null
          )}
          <DraggableImage />
        </Layer>
      </Stage>
    </>
  );
};

export default CreateBoard;
