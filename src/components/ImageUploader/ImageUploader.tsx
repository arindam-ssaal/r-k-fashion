import { ImageUp, X } from "lucide-react";
import React from "react";

import { Input } from "../ui/input";
import useImageUploaderState from "./store/useImageUploader";

function ImageUploader() {
  const image = useImageUploaderState(state=>state.image);
  const isLoading = useImageUploaderState(state=>state.isLoading);
  const setImage = useImageUploaderState(state=>state.setImage);
  const setLoading = useImageUploaderState(state=>state.setLoading);

  const handleFileChange = (file: Blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Img = reader.result as string;
      setImage(base64Img); // Update Zustand store
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setLoading(true);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    } else {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      handleFileChange(file);
    } else {
      setLoading(false);
    }
  };

  const handleClearImage = () => {
    setImage(null); // Clear image from Zustand store and localStorage
  };

  return (
    <div
      className="image-uploader bg-[#F9F9F9] rounded-sm border border-dashed border-[#CACACA] h-[200px] w-full grid place-content-center relative"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e)}
    >
      {isLoading ? (
        <div className="loader text-center">
          <p>Uploading...</p>
        </div>
      ) : image ? (
        <div className="image-preview text-center relative">
          <img
            src={image}
            alt="Preview"
            className="h-[60px] w-[60px] object-cover mx-auto rounded"
          />
          <button
            onClick={handleClearImage}
            className="absolute top-[-15px] right-[4px] rounded-full bg-red-100 text-red-500 z-50"
          >
            <X size={25} className="p-1" />
          </button>
          <p className="text-gray-400 text-sm mt-2">Image uploaded</p>
        </div>
      ) : (
        <div className="img-icon text-center">
          <ImageUp className="bg-red-50 block mx-auto rounded-lg h-[50px] p-3 w-[50px] text-red-400" />
          <div className="text-gray-400 text-sm mt-3">
            <h5>Click to upload or drag and drop</h5>
            <h6 className="text-[12px]">SVG, PNG, JPG</h6>
          </div>
        </div>
      )}
      <Input
        id="picture"
        type="file"
        accept="image/*"
        onChange={(e) => handleInputChange(e)}
        className="absolute h-full w-full opacity-0 cursor-pointer"
      />
    </div>
  );
}

export default ImageUploader;
