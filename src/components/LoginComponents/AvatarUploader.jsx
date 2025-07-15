import { useRef, useState, useEffect } from "react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const AvatarUploader = ({ user, onUploadSuccess }) => {
    const fileRef = useRef();
    const [uploading, setUploading] = useState(false);
    const [dots, setDots] = useState("");

    useEffect(() => {
        if (!uploading) return;

        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + "." : ""));
        }, 500);

        return () => clearInterval(interval);
    }, [uploading]);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);

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
                onUploadSuccess(data.secure_url);
            } else {
                alert("Upload failed.");
            }
        } catch (err) {
            alert("Error uploading avatar.");
        } finally {
            setUploading(false);
            setDots("");
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={() => fileRef.current.click()}
                disabled={uploading}
            >
                {uploading ? `Uploading${dots}` : "Upload New Avatar"}
            </button>
            <input
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
        </div>
    );
};

export default AvatarUploader;
