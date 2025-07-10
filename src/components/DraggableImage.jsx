import { useRef, useEffect } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";

const DraggableImage = ({
  id,
  x,
  y,
  scaleX = 1,
  scaleY = 1,
  rotation = 0,
  onUpdate,
  isSelected,
  onSelect
}) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image] = useImage("https://media.istockphoto.com/id/1253123139/photo/a-frightened-surprised-red-cat-with-big-round-eyes-sits-on-the-couch.jpg?s=612x612&w=0&k=20&c=UiFHA2Sq252VEnPaSptoPlsQ7sMcV3QQ0zchc7TgN0M=");

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();

    node.scaleX(1);
    node.scaleY(1);

    onUpdate(id, {
      x: node.x(),
      y: node.y(),
      scaleX,
      scaleY,
      rotation,
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
        onTap={onSelect}
        onDragEnd={handleTransformEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

export default DraggableImage;
