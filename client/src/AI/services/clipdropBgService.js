// client/src/AI/services/clipdropBgService.js

/**
 * Remove background using Clipdrop.
 * Endpoint expects multipart/form-data with `image_file`.
 * Returns an object URL to a PNG with transparent background.
 *
 * ENV (client/.env):
 *   VITE_CLIPDROP_API_KEY=your_real_key_here
 */
export const removeBackground = async (file) => {
  const apiKey = import.meta.env.VITE_CLIPDROP_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing VITE_CLIPDROP_API_KEY. Add it in client/.env and restart the dev server."
    );
  }
  if (!file) throw new Error("Please upload an image.");

  const formData = new FormData();
  formData.append("image_file", file);
  // You can optionally tweak behavior with extra fields if Clipdrop adds them later.
  // e.g., formData.append("output_format", "png"); // default is png anyway

  const res = await fetch("https://clipdrop-api.co/remove-background/v1", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      // Do NOT set Content-Type for FormData; the browser will set it
    },
    body: formData,
  });

  if (!res.ok) {
    let detail = "";
    try { detail = await res.text(); } catch {}
    const friendly =
      res.status === 401
        ? "Unauthorized (401) — invalid or missing API key."
        : res.status === 429
        ? "Rate limited (429). Try again soon."
        : res.status === 400
        ? "Bad request (400). Check the file format/size."
        : `HTTP ${res.status}`;
    throw new Error(`${friendly}${detail ? ` — ${detail}` : ""}`);
  }

  const blob = await res.blob(); // PNG with alpha
  return URL.createObjectURL(blob);
};
