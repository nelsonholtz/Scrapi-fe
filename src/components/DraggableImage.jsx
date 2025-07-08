import { Stage, Layer, Image, Transformer, Rect, Text } from "react-konva";
import useImage from "use-image";
import { useRef, useEffect, useState } from "react";

const DraggableImage = () => {
  const [position, setPosition] = useState({
    x: 20,
    y: 20,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
  });
  // We use refs to keep history to avoid unnecessary re-renders
  const history = useRef([{ x: 20, y: 20, scaleX: 1, scaleY: 1, rotation: 0 }]);
  const historyStep = useRef(0);

  const [image] = useImage(
    "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg"
  );

  const imageRef = useRef();
  const transformerRef = useRef();

  const handleUndo = () => {
    if (historyStep.current === 0) {
      return;
    }
    historyStep.current -= 1;
    const previous = history.current[historyStep.current];
    setPosition(previous);
  };

  const handleRedo = () => {
    if (historyStep.current === history.current.length - 1) {
      return;
    }
    historyStep.current += 1;
    const next = history.current[historyStep.current];
    setPosition(next);
  };

  useEffect(() => {
    if (image && imageRef.current && transformerRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [image]);

  const handleDragEnd = (e) => {
    history.current = history.current.slice(0, historyStep.current + 1);
    const pos = {
      x: e.target.x(),
      y: e.target.y(),
      scaleX: e.target.scaleX(),
      scaleY: e.target.scaleY(),
      rotation: e.target.rotation(),
    };
    // Push the new state
    history.current = history.current.concat([pos]);
    historyStep.current += 1;
    setPosition(pos);
  };

  const handleTransformEnd = (e) => {
    history.current = history.current.slice(0, historyStep.current + 1);
    const pos = {
      x: e.target.x(),
      y: e.target.y(),
      scaleX: e.target.scaleX(),
      scaleY: e.target.scaleY(),
      rotation: e.target.rotation(),
    };
    // Push the new state
    history.current = history.current.concat([pos]);
    historyStep.current += 1;
    setPosition(pos);
  };

  return (
    <>
      <Text text="undo" onClick={handleUndo} />
      <Text text="redo" x={40} onClick={handleRedo} />
      <Image
        x={position.x}
        y={position.y}
        scaleX={position.scaleX}
        scaleY={position.scaleY}
        rotation={position.rotation}
        width={100}
        height={100}
        image={image}
        draggable
        onDragEnd={handleDragEnd}
        ref={imageRef}
        onTransformStart={() => {}}
        onTransform={() => {}}
        onTransformEnd={handleTransformEnd}
      />
      <Transformer
        ref={transformerRef}
        onTransformStart={() => {}}
        onTransform={() => {}}
        onTransformEnd={() => {}}
      />
    </>
  );
};

export default DraggableImage;
