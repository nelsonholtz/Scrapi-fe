import { Layer, Stage, Image } from "react-konva";
import DraggableImage from "../components/DraggableImage";

const CreateBoard = () => {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <DraggableImage />
      </Layer>
    </Stage>
  );
};

export default CreateBoard;
