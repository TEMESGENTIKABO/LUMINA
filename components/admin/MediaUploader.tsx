"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, AlertCircle, Check, Loader2 } from "lucide-react";

export function MediaUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are accepted.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Upload failed");
      setSuccess(false);
    } else {
      setSuccess(true);
      router.refresh();
      setTimeout(() => {
        setSuccess(false);
        setFileName("");
      }, 2000);
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, []);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-sm p-6 text-center cursor-pointer
        transition-all duration-150
        ${
          dragOver
            ? "border-[#c9a227] bg-[#faf6e8]"
            : success
              ? "border-[#4a7c6b] bg-[#eef5f2]"
              : error
                ? "border-[#9b4a4a] bg-[#faf5f5]"
                : "border-[#d4d2cd] bg-[#faf9f7] hover:border-[#a5a39e] hover:bg-[#f5f4f2]"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-2">
        {uploading ? (
          <Loader2 size={20} className="text-[#8b8f99] animate-spin" />
        ) : success ? (
          <Check size={20} className="text-[#4a7c6b]" />
        ) : (
          <Upload
            size={20}
            className={dragOver ? "text-[#c9a227]" : "text-[#b8b5b0]"}
          />
        )}

        <p className="font-ui text-sm text-[#6b6f7a]">
          {uploading
            ? `Uploading ${fileName}...`
            : success
              ? `${fileName} uploaded`
              : dragOver
                ? "Drop image here"
                : "Click or drag image to upload"}
        </p>
        <p className="font-ui text-[11px] text-[#a5a39e]">
          Supports JPG, PNG, WebP up to 10MB
        </p>
      </div>

      {error && (
        <div className="flex items-center justify-center gap-1.5 mt-3 font-ui text-xs text-[#9b4a4a]">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
