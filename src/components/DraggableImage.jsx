import { useRef, useEffect } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";

const DraggableImage = ({ id, x, y, scaleX, scaleY, rotation, onUpdate, isSelected, onSelect }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image] = useImage(
    "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=300&q=80"
  );

  useEffect(() => {
    // Attach transformer when selected
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, image]);

  const handleDragTransformEnd = (e) => {
    const node = shapeRef.current;
    onUpdate(id, {
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
    });
  };

  return (
    <>
      <Image
        ref={shapeRef}
        image={image}
        x={x}
        y={y}
        scaleX={scaleX}
        scaleY={scaleY}
        rotation={rotation}
        draggable
        onClick={onSelect}
        onTransformEnd={handleDragTransformEnd}
        onDragEnd={handleDragTransformEnd}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

export default DraggableImage;
