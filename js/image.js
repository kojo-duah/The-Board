/**
 * Initializes the image upload feature for the dashboard.
 * 
 * Allows the user to upload an image file and displays it
 * inside the image widget tile.
 * 
 * Supported formats: any valid browser image type (PNG, JPG, GIF, WebP, etc.)
 */
export function setupImageUpload() {
  const input = document.getElementById("image-upload");
  const image = document.getElementById("custom-image");
  const placeholder = document.getElementById("image-placeholder");

  // Safety check: ensure all required elements exist
  if (!input || !image || !placeholder) return;

  /**
   * Handles file selection event
   * Loads selected image and updates UI
   */
  input.addEventListener("change", () => {
    const file = input.files[0];

    // Validate file type
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    // Create temporary URL for preview
    const imageUrl = URL.createObjectURL(file);

    // Update image preview
    image.src = imageUrl;
    image.style.display = "block";

    // Hide placeholder text
    placeholder.style.display = "none";
  });
}