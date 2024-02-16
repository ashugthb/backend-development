import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import { uploadImage, deleteImage, listImages } from "../helpers/imgHelpers.js";

const router = express.Router();

const multerMid = multer({
  storage: multer.memoryStorage(),
}).single("file");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(multerMid);

// POST endpoint for uploading an image
router.post("/", async (req, res, next) => {
  try {
    const myFile = req.file;
    if (!myFile) {
      return res.status(400).json({
        error: "No file provided",
        message: "Please provide a file for upload",
      });
    }
    const imageUrl = await uploadImage(myFile);
    res.status(200).json({
      message: "Upload was successful",
      data: imageUrl,
    });
  } catch (error) {
    console.error("Error in / route:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to upload image, something went wrong",
    });
  }
});

// DELETE endpoint for deleting an image
router.delete("/:imageName", async (req, res) => {
  try {
    const imageName = req.params.imageName;
    await deleteImage(imageName);
    res.status(200).json({
      message: `Image ${imageName} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to delete image, something went wrong",
    });
  }
});

// GET endpoint for listing all images
router.get("/", async (req, res) => {
  try {
    const images = await listImages();
    res.status(200).json(images);
  } catch (error) {
    console.error("Error listing images:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to list images, something went wrong",
    });
  }
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.log("Multer error:", err.message);
    res.status(400).json({
      error: "File upload error",
      message: err.message,
    });
  } else {
    console.error("Internal server error:", err);
    res.status(500).json({
      error: err,
      message: "Internal server error!",
    });
  }
});

export default router;
