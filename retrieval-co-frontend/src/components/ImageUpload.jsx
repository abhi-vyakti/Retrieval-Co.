import React, { useRef, useState, useEffect, useCallback } from "react";
import {
    Camera,
    Image as ImageIcon,
    Loader2,
    X,
    Check,
    Aperture,
    Crop,
    RotateCcw,
} from "lucide-react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config/api";

export default function ImageUpload({
    onUploadSuccess,
    currentImage,
    onRemove,
    label = "Attach Photo",
    iconOnly = false,
}) {
    const { token } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    // Crop state
    const [rawImageSrc, setRawImageSrc] = useState(null); // Data URL of the selected/captured image
    const [rawFile, setRawFile] = useState(null); // Original file before crop
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState(undefined);
    const [completedCrop, setCompletedCrop] = useState(null);
    const cropImgRef = useRef(null);

    // Cleanup camera when unmounting
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        setError("");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });
            streamRef.current = stream;
            setIsCameraOpen(true);

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current
                        .play()
                        .catch((e) => console.error("Video play error:", e));
                }
            }, 100);
        } catch (err) {
            console.error("Camera access error:", err);
            setError(
                "Could not access camera. Please check browser permissions.",
            );
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            stopCamera();

            // Instead of uploading directly, open the crop view
            const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        setRawFile(
                            new File([blob], "camera-capture.jpg", {
                                type: "image/jpeg",
                            }),
                        );
                    }
                },
                "image/jpeg",
                0.9,
            );
            setRawImageSrc(dataUrl);
            setIsCropping(true);
            setCrop(undefined);
            setCompletedCrop(null);
        }
    };

    const uploadFile = async (file) => {
        setError("");
        setIsUploading(true);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(`${API_BASE}/api/upload`, {
                method: "POST",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Upload failed");
            }

            if (onUploadSuccess) {
                const imageDataUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () =>
                        reject(
                            new Error("Could not prepare image for analysis."),
                        );
                    reader.readAsDataURL(file);
                });
                onUploadSuccess(data.imageUrl, imageDataUrl);
            }
        } catch (err) {
            console.error("Upload Error:", err);
            setError(err.message);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError("Image must be less than 10MB.");
            return;
        }

        // Instead of uploading directly, open the crop view
        setRawFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setRawImageSrc(reader.result);
            setIsCropping(true);
            setCrop(undefined);
            setCompletedCrop(null);
        };
        reader.readAsDataURL(file);
    };

    // Generate cropped image blob from the crop selection
    const getCroppedBlob = useCallback(() => {
        return new Promise((resolve) => {
            const image = cropImgRef.current;
            if (!image || !completedCrop) {
                // No crop selected — upload original
                resolve(rawFile);
                return;
            }

            const canvas = document.createElement("canvas");
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            canvas.width = completedCrop.width * scaleX;
            canvas.height = completedCrop.height * scaleY;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(
                image,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                canvas.width,
                canvas.height,
            );

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(
                            new File([blob], rawFile?.name || "cropped.jpg", {
                                type: "image/jpeg",
                            }),
                        );
                    } else {
                        resolve(rawFile);
                    }
                },
                "image/jpeg",
                0.9,
            );
        });
    }, [completedCrop, rawFile]);

    const handleCropConfirm = async () => {
        const croppedFile = await getCroppedBlob();
        setIsCropping(false);
        setRawImageSrc(null);
        setCrop(undefined);
        setCompletedCrop(null);
        if (croppedFile) {
            await uploadFile(croppedFile);
        }
    };

    const handleCropCancel = () => {
        setIsCropping(false);
        setRawImageSrc(null);
        setRawFile(null);
        setCrop(undefined);
        setCompletedCrop(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSkipCrop = async () => {
        setIsCropping(false);
        setRawImageSrc(null);
        setCrop(undefined);
        setCompletedCrop(null);
        if (rawFile) {
            await uploadFile(rawFile);
        }
    };

    return (
        <div className="w-full">
            {currentImage ? (
                <div className="relative inline-block mt-2">
                    <img
                        src={currentImage}
                        alt="Uploaded"
                        className="h-32 w-auto object-cover rounded-xl border border-grey-200 shadow-sm"
                    />
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
                    >
                        <X size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white flex items-center gap-1">
                        <Check size={12} className="text-emerald-400" />{" "}
                        Attached
                    </div>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className={iconOnly ? "p-2 aspect-square" : "flex-1"}
                        title={label}
                    >
                        {isUploading ? (
                            <Loader2
                                size={16}
                                className={iconOnly ? "" : "mr-2"}
                            />
                        ) : (
                            <ImageIcon
                                size={16}
                                className={iconOnly ? "" : "mr-2"}
                            />
                        )}
                        {!iconOnly && (isUploading ? "Uploading..." : label)}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={startCamera}
                        disabled={isUploading}
                        className={iconOnly ? "p-2 aspect-square" : "flex-1"}
                        title="Take Photo"
                    >
                        <Camera
                            size={16}
                            className={
                                iconOnly ? "text-blue" : "mr-2 text-blue"
                            }
                        />
                        {!iconOnly && "Take Photo"}
                    </Button>
                </div>
            )}

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            {/* Fullscreen Camera Overlay */}
            {isCameraOpen && (
                <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
                    <div className="absolute top-4 right-4 z-[110]">
                        <button
                            onClick={stopCamera}
                            className="bg-neutral-800 text-white rounded-full p-2 hover:bg-neutral-700 transition"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="relative w-full h-full max-w-2xl mx-auto flex flex-col justify-center items-center">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-[80vh] object-cover bg-neutral-900 border border-neutral-800"
                        />

                        <div className="absolute bottom-8 left-0 w-full flex justify-center">
                            <button
                                onClick={capturePhoto}
                                className="w-16 h-16 bg-white rounded-full border-4 border-neutral-400 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                            >
                                <div className="w-12 h-12 bg-white rounded-full border border-neutral-300" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen Crop Overlay */}
            {isCropping && rawImageSrc && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                    {/* Header */}
                    <div className="w-full max-w-2xl flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-white">
                            <Crop size={18} className="text-primary-400" />
                            <h3 className="text-lg font-display font-bold">
                                Crop Image
                            </h3>
                        </div>
                        <button
                            onClick={handleCropCancel}
                            className="bg-neutral-800 text-white rounded-full p-2 hover:bg-neutral-700 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <p className="text-neutral-400 text-sm mb-4 max-w-2xl text-center">
                        Drag to select the area you want to keep. Focus on the
                        item and crop away the background.
                    </p>

                    {/* Crop Area */}
                    <div className="flex-1 max-w-2xl w-full overflow-auto flex items-center justify-center bg-neutral-900 rounded-xl border border-neutral-800">
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                            className="max-h-[60vh]"
                        >
                            <img
                                ref={cropImgRef}
                                src={rawImageSrc}
                                alt="Crop preview"
                                className="max-h-[60vh] max-w-full object-contain"
                            />
                        </ReactCrop>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6 w-full max-w-2xl">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCropCancel}
                            className="flex-1 py-3"
                        >
                            <X size={16} className="mr-2" /> Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleSkipCrop}
                            className="flex-1 py-3"
                            disabled={isUploading}
                        >
                            <RotateCcw size={16} className="mr-2" /> Skip Crop
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleCropConfirm}
                            className="flex-1 py-3"
                            disabled={isUploading}
                        >
                            <Check size={16} className="mr-2" />{" "}
                            {completedCrop
                                ? "Crop & Upload"
                                : "Upload Original"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
