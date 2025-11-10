

import React, { useCallback, useEffect, useRef, useState } from "react";
import { removeBackground } from "../services/clipdropBgService";

import NavbarCustomer from "../../components/NavbarCustomer";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_MB = 20;

const BackgroundRemovalForm = () => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dropRef = useRef(null);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [filePreview, resultUrl]);

  const validateFile = (f) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      throw new Error("Unsupported format. Use PNG, JPG, or WEBP.");
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      throw new Error(`File too large. Max ${MAX_MB}MB.`);
    }
  };

  const handleFiles = (files) => {
    const f = files?.[0];
    if (!f) return;
    try {
      validateFile(f);
      if (filePreview) URL.revokeObjectURL(filePreview);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
      setFile(f);
      setFilePreview(URL.createObjectURL(f));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dt = e.dataTransfer;
      if (dt?.files?.length) handleFiles(dt.files);
      dropRef.current?.classList.remove("ring-2", "ring-indigo-400");
    },
    [dropRef]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    dropRef.current?.classList.add("ring-2", "ring-indigo-400");
  }, []);

  const onDragLeave = useCallback(() => {
    dropRef.current?.classList.remove("ring-2", "ring-indigo-400");
  }, []);

  const onInputChange = (e) => handleFiles(e.target.files);

  const handleProcess = async () => {
    if (!file) return setError("Please upload an image first.");
    setLoading(true);
    setError("");
    try {
      const url = await removeBackground(file);
      setResultUrl(url);
    } catch (err) {
      setError(err?.message || "Background removal failed.");
    } finally {
      setLoading(false);
    }
  };

  const sampleGuide = [
    "Use even lighting to reduce harsh shadows for cleaner cutouts.",
    "Prefer high-res images; subjects with strong edge contrast work best.",
    "Avoid motion blur. A fast shutter for product shoots helps.",
    "For people, keep hair separated from similar-colored backgrounds.",
    "Shoot on plain backgrounds (white/gray) for best separation.",
  ];

  return (

    <><NavbarCustomer/>

    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">
            Studio Background Removal
          </h1>
          <p className="text-gray-600 mt-2 text-sm max-w-2xl mx-auto">
            Upload a product shot, portrait, or any studio image and instantly
            get a <span className="font-medium">transparent PNG</span>—perfect
            for catalogs, composites, and social graphics.
          </p>
        </div>

        {/* Upload area */}
        <div
          ref={dropRef}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="flex-1 text-center md:text-left">
              <p className="text-gray-800 font-semibold">
                Drag & drop an image, or browse to upload
              </p>
              <p className="text-gray-500 text-sm">
                Accepted: PNG, JPG, WEBP • Max {MAX_MB}MB
              </p>
              <div className="mt-3">
                <label className="inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium cursor-pointer hover:bg-indigo-700 transition">
                  Choose File
                  <input
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    className="sr-only"
                    onChange={onInputChange}
                  />
                </label>
              </div>
            </div>

            {/* Small preview */}
            {filePreview ? (
              <div className="flex-shrink-0 w-40 h-40 bg-white rounded-lg overflow-hidden ring-1 ring-gray-200 shadow">
                <img
                  src={filePreview}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-40 h-40 bg-white rounded-lg grid place-items-center text-gray-400 ring-1 ring-gray-200">
                No image
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-5 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
          <h3 className="font-semibold text-gray-700 mb-2">
            📸 Studio tips for cleaner cutouts
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            {sampleGuide.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              setFile(null);
              if (filePreview) URL.revokeObjectURL(filePreview);
              if (resultUrl) URL.revokeObjectURL(resultUrl);
              setFilePreview(null);
              setResultUrl(null);
              setError("");
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleProcess}
            disabled={loading || !file}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading ? "Processing..." : "Remove Background"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mt-4 font-medium">{error}</p>
        )}

        {/* Before/After */}
        {resultUrl && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Preview
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-gray-200 p-3 bg-white">
                <p className="text-sm text-gray-600 mb-2">Original</p>
                <div className="w-full bg-gray-50 rounded-lg overflow-hidden grid place-items-center">
                  <img
                    src={filePreview}
                    alt="Original"
                    className="max-h-[520px] object-contain"
                  />
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 p-3 bg-white relative">
                <p className="text-sm text-gray-600 mb-2">Background Removed</p>
                <div className="w-full bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIElEQVQYV2NkYGD4z0ABYBw1w6hQGDAaGA0jGg0DAwMAABf+BDk3Z8JgAAAAAElFTkSuQmCC')] rounded-lg overflow-hidden grid place-items-center">
                  {/* checkerboard background via tiny Base64 image */}
                  <img
                    src={resultUrl}
                    alt="Result"
                    className="max-h-[520px] object-contain"
                  />
                </div>

                <a
                  href={resultUrl}
                  download="background_removed.png"
                  className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
                >
                  Download PNG
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-10">
          © 2025 StudioAI — Background Removal • Powered by ClipDrop
        </p>
      </div>
    </div>
    </>
  );
};

export default BackgroundRemovalForm;
