"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Loader2, UploadCloud, X } from "lucide-react";

const MAX_BYTES = 10 * 1024 * 1024;
const CONCURRENCY = 3;

type Job = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
};

const fmt = (b: number) =>
  b > 1048576
    ? `${(b / 1048576).toFixed(1)} MB`
    : `${Math.max(1, Math.round(b / 1024))} KB`;

function send(file: File, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (e) =>
      e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      if (xhr.status < 300) return resolve();
      let msg = "Upload failed";
      try {
        msg = JSON.parse(xhr.responseText).error ?? msg;
      } catch {}
      reject(new Error(msg));
    };
    xhr.onerror = () => reject(new Error("Network error"));
    const fd = new FormData();
    fd.append("file", file);
    xhr.send(fd);
  });
}

export function MediaUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [over, setOver] = useState(false);

  const upload = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      const patch = (id: string, p: Partial<Job>) =>
        setJobs((all) => all.map((j) => (j.id === id ? { ...j, ...p } : j)));

      const entries = files.map((file) => {
        const error = !file.type.startsWith("image/")
          ? "Only image files are accepted."
          : file.size > MAX_BYTES
            ? "Larger than 10 MB."
            : "";
        const job: Job = {
          id: Math.random().toString(36).slice(2),
          name: file.name,
          size: file.size,
          progress: 0,
          status: error ? "error" : "queued",
          error: error || undefined,
        };
        return { file, job };
      });
      setJobs((all) => [...entries.map((e) => e.job), ...all]);

      const queue = entries.filter((e) => e.job.status === "queued");
      let ok = 0;
      const worker = async () => {
        for (let e = queue.shift(); e; e = queue.shift()) {
          patch(e.job.id, { status: "uploading" });
          try {
            await send(e.file, (p) => patch(e.job.id, { progress: p }));
            patch(e.job.id, { status: "done", progress: 100 });
            ok++;
          } catch (err) {
            patch(e.job.id, { status: "error", error: (err as Error).message });
          }
        }
      };
      await Promise.all(Array.from({ length: CONCURRENCY }, worker));
      if (ok) router.refresh();
      setTimeout(
        () => setJobs((all) => all.filter((j) => j.status !== "done")),
        3000,
      );
    },
    [router],
  );

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? []).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (files.length) upload(files);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [upload]);

  return (
    <div className="flex flex-col gap-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
        }
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          upload(Array.from(e.dataTransfer.files));
        }}
        className={`grid cursor-pointer place-items-center gap-1.5 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#c79a45]/40 ${
          over
            ? "border-[#c79a45] bg-[#c79a45]/10"
            : "border-[#d8d1bf] bg-[#faf8f3] hover:border-[#c79a45] hover:bg-[#c79a45]/10"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            upload(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#e6e1d6] bg-white text-[#8a6414]">
          <UploadCloud size={22} />
        </span>
        <b className="text-sm">
          {over ? "Drop to upload" : "Drag images here, or click to browse"}
        </b>
        <span className="text-xs text-[#6b665c]">
          You can also paste from the clipboard · JPG, PNG, WebP up to 10 MB
          each
        </span>
      </div>

      {jobs.map((j) => (
        <div
          key={j.id}
          className="flex items-center gap-3 rounded-xl border border-[#e6e1d6] bg-white px-3 py-2.5"
        >
          <span className="grid w-5 flex-none place-items-center">
            {j.status === "done" ? (
              <Check size={18} className="text-[#1f9d6b]" />
            ) : j.status === "error" ? (
              <AlertCircle size={18} className="text-[#b3201f]" />
            ) : (
              <Loader2 size={18} className="animate-spin text-[#6b665c]" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between gap-3 text-[13px] font-semibold">
              <span className="truncate">{j.name}</span>
              <span className="font-medium text-[#6b665c]">{fmt(j.size)}</span>
            </div>
            {j.status === "error" ? (
              <p className="mt-0.5 text-xs text-[#b3201f]">{j.error}</p>
            ) : (
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f0ece1]">
                <div
                  className="h-full rounded-full bg-[#c79a45] transition-[width] duration-200"
                  style={{ width: `${j.progress}%` }}
                />
              </div>
            )}
          </div>
          {j.status === "error" && (
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setJobs((all) => all.filter((x) => x.id !== j.id))}
              className="grid h-7 w-7 place-items-center rounded-lg bg-[#f1ede2] transition hover:bg-[#e8e2d2]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
