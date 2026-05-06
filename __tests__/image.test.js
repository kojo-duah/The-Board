import { jest } from "@jest/globals";
import { setupImageUpload } from "../js/image.js";

describe("setupImageUpload", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input type="file" id="image-upload">
      <img id="custom-image" alt="Uploaded preview">
      <span id="image-placeholder">Add Image</span>
    `;

    global.URL.createObjectURL = jest.fn(() => "blob:test-image-url");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("does nothing if required elements are missing", () => {
    document.body.innerHTML = "";

    expect(() => setupImageUpload()).not.toThrow();
  });

  test("shows image preview when a valid image is uploaded", () => {
    setupImageUpload();

    const input = document.getElementById("image-upload");
    const image = document.getElementById("custom-image");
    const placeholder = document.getElementById("image-placeholder");

    const file = new File(["fake image content"], "test.png", {
      type: "image/png"
    });

    Object.defineProperty(input, "files", {
      value: [file],
      writable: false
    });

    input.dispatchEvent(new Event("change"));

    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(image.src).toContain("blob:test-image-url");
    expect(image.style.display).toBe("block");
    expect(placeholder.style.display).toBe("none");
  });

  test("ignores non-image files", () => {
    setupImageUpload();

    const input = document.getElementById("image-upload");
    const image = document.getElementById("custom-image");
    const placeholder = document.getElementById("image-placeholder");

    const file = new File(["hello"], "notes.txt", {
      type: "text/plain"
    });

    Object.defineProperty(input, "files", {
      value: [file],
      writable: false
    });

    input.dispatchEvent(new Event("change"));

    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(image.style.display).not.toBe("block");
    expect(placeholder.style.display).not.toBe("none");
  });

  test("does nothing if no file is selected", () => {
    setupImageUpload();

    const input = document.getElementById("image-upload");

    Object.defineProperty(input, "files", {
      value: [],
      writable: false
    });

    input.dispatchEvent(new Event("change"));

    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
});