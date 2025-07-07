import { Stage, Layer, Image, Transformer } from "react-konva";
import useImage from "use-image";
import { useRef, useEffect, useState } from "react";

const DraggableImage = () => {
  const [image] = useImage(
    "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg"
  );

  const imageRef = useRef();
  const transformerRef = useRef();

  const [state, setState] = useState({
    x: 10,
    y: 10,
  });

  useEffect(() => {
    if (image && imageRef.current && transformerRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [image]);

  const handleDragEnd = (e) => {
    setState({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return (
    <>
      <Image
        x={state.x}
        y={state.y}
        width={100}
        height={100}
        image={image}
        draggable
        onDragEnd={handleDragEnd}
        ref={imageRef}
        onTransformStart={() => {}}
        onTransform={() => {}}
        onTransformEnd={() => {}}
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
