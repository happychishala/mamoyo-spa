"use client";

import { useRef, useState } from "react";
import { Upload, X, FileText } from "lucide-react";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Downscale a large photo/screenshot to a sensible max edge and re-encode as JPEG. */
async function compressImage(file: File, maxEdge = 1400, quality = 0.72): Promise<string> {
  const dataUrl = await fileToDataUrl(file);
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = dataUrl;
  });
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

export default function PopUploadField({
  name = "pop",
  label = "Proof of payment",
}: {
  name?: string;
  label?: string;
}) {
  const [dataUrl, setDataUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [isPdf, setIsPdf] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (file?: File) => {
    setError("");
    if (!file) return;
    try {
      if (file.type === "application/pdf") {
        if (file.size > 3_000_000) {
          setError("PDF is too large (max 3MB).");
          return;
        }
        setDataUrl(await fileToDataUrl(file));
        setIsPdf(true);
      } else if (file.type.startsWith("image/")) {
        setDataUrl(await compressImage(file));
        setIsPdf(false);
      } else {
        setError("Upload an image or a PDF.");
        return;
      }
      setFileName(file.name);
    } catch {
      setError("Couldn't read that file — try another.");
    }
  };

  const clear = () => {
    setDataUrl("");
    setFileName("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-mist-800">
        {label} <span className="font-normal text-mist-500">(optional — photo or screenshot)</span>
      </label>
      <input type="hidden" name={name} value={dataUrl} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      {!dataUrl ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-mist-300 bg-mist-50 px-4 py-3 text-sm font-medium text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-white"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          Attach POP
        </button>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-mist-200 bg-white p-2.5">
          {isPdf ? (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-mist-100 text-mist-600">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt="Proof of payment preview" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
          )}
          <span className="flex-1 truncate text-xs text-mist-700">{fileName || "Attached"}</span>
          <button
            type="button"
            onClick={clear}
            aria-label="Remove attachment"
            className="rounded-full p-1.5 text-mist-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
