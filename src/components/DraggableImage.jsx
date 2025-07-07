import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";

const DraggableImage = () => {
  const [image] = useImage(
    "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg"
  );

  return (
    <Image x={50} y={50} width={100} height={100} image={image} draggable />
  );
};

export default DraggableImage;
