import { useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { RiImageAddFill } from "react-icons/ri";
import "../styles/toolbar-update.css";
import "../styles/loading.css";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const ImageUploader = ({
    onUploadingComplete,
    onUploadError,
    onUploadingStart,
    onUploadingEnd,
}) => {
    const { user } = useUser();
    const fileRef = useRef();

    const isValidImage = (filename) => {
        const lowerName = filename.toLowerCase();
        return (
            lowerName.endsWith(".jpeg") ||
            lowerName.endsWith(".png") ||
            lowerName.endsWith(".jpg")
        );
    };

    const handleClick = () => {
        fileRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!isValidImage(file.name)) {
            onUploadError?.("Only JPG,JPEG PNG files allowed 🐧");
            return;
        }

        if (!user) {
            onUploadError?.("Please login to upload images");
            return;
        }

        if (onUploadingStart) {
            onUploadingStart();
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();

            if (res.ok) {
                onUploadingComplete(data.secure_url);
            } else {
                onUploadError?.(data.error?.message || "Image upload failed");
                console.error("Upload error:", data);
            }
        } catch (err) {
            onUploadError?.(err.message || "Upload failed");
            console.error("Upload failed", err);
        } finally {
            if (onUploadingEnd) {
                onUploadingEnd();
            }
        }
    };

    return (
        <>
            <button
                title={"Add image"}
                onClick={handleClick}
                className="toolbar-button"
            >
                <RiImageAddFill />
            </button>
            <input
                type="file"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </>
    );
};
export default ImageUploader;
