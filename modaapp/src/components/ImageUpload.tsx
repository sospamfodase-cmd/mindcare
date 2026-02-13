import React, { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
  label?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, label = "Upload Image", className = "" }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageSelected(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelected]);

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPreview(null);
    onImageSelected('');
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block w-full cursor-pointer group">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
        />
        
        {preview ? (
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-gray-100 group-hover:border-gray-200 transition-colors bg-gray-50">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              onClick={clearImage}
              className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="aspect-square w-full rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-3 text-gray-400 group-hover:text-black group-hover:border-black transition-all bg-gray-50 hover:bg-gray-100">
            <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                <Upload size={24} />
            </div>
            <span className="font-medium text-sm">{label}</span>
          </div>
        )}
      </label>
    </div>
  );
};
