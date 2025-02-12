import React, { useState } from "react";
import { Controller, Control } from "react-hook-form";

interface CustomFileUploadProps {
  control: Control<any>;
  name: string;
}

const CustomFileUpload: React.FC<CustomFileUploadProps> = ({ control, name }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: (files: File[]) => void) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    onChange([...selectedFiles, ...files]);
  };

  // Remove an image
  const removeFile = (index: number, onChange: (files: File[]) => void) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onChange(updatedFiles);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <div className="file-upload-container">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => handleFileChange(event, onChange)}
            className="form-control"
          />

          {/* Preview Selected Images */}
          <div className="preview-container mt-2 d-flex flex-wrap">
            {selectedFiles.map((file, index) => (
              <div key={index} className="preview-item position-relative m-2">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="rounded border"
                  width="100"
                  height="100"
                />
                <button
                  type="button"
                  className="btn btn-danger btn-sm position-absolute top-0 end-0"
                  onClick={() => removeFile(index, onChange)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
};

export default CustomFileUpload;
