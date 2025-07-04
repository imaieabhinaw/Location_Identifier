import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CloudUpload, RotateCw, Crop, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onImageUpload: (file: File) => void;
  onIdentify: () => void;
  isLoading?: boolean;
}

export function UploadZone({
  onImageUpload,
  onIdentify,
  isLoading,
}: UploadZoneProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glassmorphism dark:glassmorphism-dark rounded-2xl p-8 upload-zone"
      >
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive
              ? "border-saffron bg-saffron/10"
              : "border-saffron/60 hover:border-saffron"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

          <div className="mb-6">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="floating-icon"
            >
              <CloudUpload className="w-16 h-16 text-saffron mx-auto" />
            </motion.div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Upload Monument Image
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Drag and drop your image here, or click to browse
          </p>
          <Button className="bg-gradient-to-r from-saffron to-gold text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            Choose File
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Supports: JPEG, PNG, WebP up to 10MB
          </p>
        </div>
      </motion.div>

      {/* Image Preview */}
      {previewImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glassmorphism dark:glassmorphism-dark rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
              Image Preview
            </h4>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <Crop className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearImage}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />

          <Button
            onClick={onIdentify}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-deep-blue to-royal-purple text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Identifying...
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4 mr-2" />
                Identify Monument
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
