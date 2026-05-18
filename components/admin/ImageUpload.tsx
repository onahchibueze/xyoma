'use client';

import { useState, useCallback } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import Image from 'next/image';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const newUrls: string[] = [...value];
    const files = Array.from(e.target.files);

    try {
      for (const file of files) {
        // Convert to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.readAsDataURL(file);
        });

        const base64Image = await base64Promise;

        // Upload to API
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image, folder: 'products' }),
        });

        const data = await response.json();

        if (response.ok && data.url) {
          newUrls.push(data.url);
        } else {
          console.error('Upload failed for file:', file.name, data.error);
          alert(`Failed to upload ${file.name}: ${data.error}`);
        }
      }
      
      onChange(newUrls);
    } catch (error) {
      console.error('Image upload error:', error);
      alert('An error occurred during image upload.');
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange]);

  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      {/* Upload Box */}
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-colors",
          disabled || isUploading ? "opacity-50 cursor-not-allowed border-white/10" : "border-white/20 hover:border-white/50 cursor-pointer"
        )}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*"
          disabled={disabled || isUploading}
          onChange={handleUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center text-white/50">
            <Loader2 className="w-8 h-8 mb-2 animate-spin text-white" />
            <span className="text-sm font-medium uppercase tracking-widest">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-white/50">
            <UploadCloud className="w-8 h-8 mb-2 text-white/70" />
            <span className="text-sm font-medium uppercase tracking-widest text-white/70">Click or drag images</span>
            <span className="text-xs mt-1">High resolution PNG, JPG up to 10MB</span>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg border border-white/10 overflow-hidden bg-white/5 group">
              <Image 
                src={url} 
                alt={`Product image ${index + 1}`} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110"              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={disabled || isUploading}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                >
                  <X size={16} />
                </button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 rounded text-[10px] font-bold uppercase tracking-widest">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
