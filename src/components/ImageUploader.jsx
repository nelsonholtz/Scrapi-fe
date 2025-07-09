import { useRef } from "react";
import { useUser } from "../contexts/UserContext";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const ImageUploader = ({ onUploadingComplete }) => {
    const { user } = useUser();
    const fileRef = useRef();

    const handleClick = () => {
        fileRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!user) {
            console.log("please login");
            return;
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
                const imageURL = data.secure_url;
                onUploadingComplete(imageURL);
            } else {
                console.error("Upload error:", data);
            }
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    return (
        <>
            <button onClick={handleClick}>Upload Image</button>
            <input
                type="file"
                accept="image/*"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </>
    );
};
export default ImageUploader;
