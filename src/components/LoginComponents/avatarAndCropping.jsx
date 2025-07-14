import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { v4 as uuidv4 } from "uuid";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
  });

const getCroppedImg = async (imageSrc, pixelCrop, fileName) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Canvas is empty"));
      const file = new File([blob], fileName, { type: "image/jpeg" });
      resolve(file);
    }, "image/jpeg");
  });
};

const AvatarUploader = ({ user, onUploadSuccess }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels || !user) return;

    try {
      const croppedImageFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        `${user.uid}-${uuidv4()}.jpg`
      );

      const formData = new FormData();
      formData.append("file", croppedImageFile);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Cloudinary upload error:", data);
        alert("Upload failed.");
        return;
      }

      const imageURL = data.secure_url;

      await updateDoc(doc(db, "users", user.uid), {
        avatarURL: imageURL,
      });

      onUploadSuccess(imageURL);
      setImageSrc(null);
      alert("Avatar updated successfully!");
    } catch (error) {
      console.error("Avatar upload failed:", error);
      alert("Avatar upload failed.");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {imageSrc && (
        <div
          style={{
            position: "relative",
            width: 300,
            height: 300,
            marginTop: 10,
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ marginTop: 10, width: "100%" }}
          />
          <button onClick={handleUpload} style={{ marginTop: 10 }}>
            Upload Avatar
          </button>
        </div>
      )}
    </div>
  );
};

export default AvatarUploader;
