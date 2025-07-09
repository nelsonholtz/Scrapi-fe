import { Stage, Layer, Image, Transformer } from "react-konva";
import useImage from "use-image";
import { useRef, useEffect } from "react";

const DraggableImage = ({ position, setPosition, history, historyStep }) => {
  const [image] = useImage(
    "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg"
  );

  const imageRef = useRef();
  const transformerRef = useRef();

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
    history.current.push(pos);
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
    history.current.push(pos);
    historyStep.current += 1;
    setPosition(pos);
  };

  return (
    <>
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
        onTransformEnd={handleTransformEnd}
      />
      <Transformer ref={transformerRef} />
    </>
  );
};

export default DraggableImage;
