"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  description?: string;
}

export function ImageUpload({
  value = "",
  onChange,
  folder = "moneywise",
  label = "Upload Image",
  description = "PNG, JPG, WebP up to 5MB",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      onChange(data.secureUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
    setError("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-neutral-main">{label}</label>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Remove
          </button>
        )}
      </div>

      {value ? (
        <div className="relative rounded-lg border border-neutral-border overflow-hidden bg-slate-50 max-h-56 flex items-center justify-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded preview" className="max-h-56 w-auto object-contain" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded hover:bg-brand-dark"
            >
              Replace Image
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neutral-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-slate-50 transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-xs text-neutral-secondary">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span>Uploading to Cloudinary...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-2.5 rounded-full bg-blue-50 text-primary">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-main">
                  Click to select and upload an image
                </p>
                <p className="text-[11px] text-neutral-secondary mt-0.5">{description}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual direct URL fallback input */}
      <div className="flex items-center gap-2 pt-1">
        <ImageIcon className="w-3.5 h-3.5 text-neutral-secondary flex-shrink-0" />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste external Cloudinary / image URL directly..."
          className="w-full text-xs px-2.5 py-1.5 bg-surface border border-neutral-border rounded focus:outline-none focus:ring-1 focus:ring-primary text-neutral-main"
        />
      </div>

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/avif, image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
