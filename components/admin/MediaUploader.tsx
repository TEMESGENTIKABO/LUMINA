"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export function MediaUploader({
  onUploadSuccess,
}: {
  onUploadSuccess?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only images allowed.");
      return;
    }
    setUploading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      setSuccess(true);
      router.refresh();
      if (onUploadSuccess) onUploadSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, []);

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      className={`
        relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer
        ${dragOver ? "border-[#c9a227] bg-[#faf6e8]" : ""}
        ${success ? "border-[#4a7c6b] bg-[#eef5f2]" : ""}
        ${error ? "border-[#9b4a4a] bg-[#fbeeee]" : ""}
        ${!dragOver && !success && !error ? "border-[#d4d2cd] bg-[#faf9f7] hover:border-[#a5a39e] hover:bg-[#f5f4f2]" : ""}
        ${uploading ? "opacity-70 pointer-events-none" : ""}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadFile(f);
        }}
        disabled={uploading}
        className="hidden"
      />

      {uploading ? (
        <Loader2 size={24} className="animate-spin text-[#c9a227]" />
      ) : success ? (
        <CheckCircle2 size={24} className="text-[#4a7c6b]" />
      ) : (
        <UploadCloud
          size={24}
          className={dragOver ? "text-[#c9a227]" : "text-[#8b8f99]"}
        />
      )}

      <div>
        <p className="font-ui text-sm font-medium text-[#1a1c23]">
          {uploading
            ? "Uploading..."
            : success
              ? "Upload complete!"
              : dragOver
                ? "Drop file here"
                : "Click to upload"}
        </p>
        <p className="font-ui text-[11px] text-[#8b8f99] mt-0.5">
          JPG, PNG, WebP max 10MB
        </p>
      </div>
      {error && (
        <p className="font-ui text-[11px] text-[#9b4a4a] mt-1 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}
