// client/src/AI/services/clipdropService.js

/**
 * Calls Clipdrop Text-to-Image with multipart/form-data.
 * Returns a temporary object URL for the generated image blob.
 *
 * ENV (client/.env):
 *   VITE_CLIPDROP_API_KEY=your_real_key_here
 */
export const generateImage = async (promptText) => {
  const apiKey = import.meta.env.VITE_CLIPDROP_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing VITE_CLIPDROP_API_KEY. Add it to client/.env and restart the dev server."
    );
  }
  if (!promptText || !promptText.trim()) {
    throw new Error("Please enter a prompt.");
  }

  // Clipdrop expects multipart/form-data with a "prompt" field
  const formData = new FormData();
  formData.append("prompt", promptText.trim());

  try {
    const res = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        // DO NOT set Content-Type; browser sets correct boundaries for FormData
      },
      body: formData,
    });

    if (!res.ok) {
      let detail = "";
      try {
        // Clipdrop may return text error body
        detail = await res.text();
      } catch (_) {}

      const friendly =
        res.status === 401
          ? "Unauthorized (401). Your API key is missing/invalid."
          : res.status === 429
          ? "Rate limited (429). Too many requests."
          : res.status === 400
          ? "Bad request (400). Check your prompt."
          : `HTTP ${res.status}`;

      throw new Error(`${friendly}${detail ? ` — ${detail}` : ""}`);
    }

    const blob = await res.blob(); // Image bytes returned by Clipdrop
    return URL.createObjectURL(blob); // Caller should revokeObjectURL when done
  } catch (err) {
    console.error("Clipdrop Text-to-Image error:", err);
    throw err;
  }
};
