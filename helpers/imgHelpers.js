import { format } from "util";
import gc from "../config/imageURL.js";

const bucket = gc.bucket("bhaiji-public-images");

// Function to upload image file in the bucket
export const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    console.log("Uploading file:", originalname);

    const blob = bucket.file(originalname.replace(/ /g, "_"));

    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream
      .on("finish", () => {
        console.log("Image upload successful:", originalname);
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        resolve(publicUrl);
      })
      .on("error", (error) => {
        console.error("Error during image upload:", error);
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });
};

// Function to list objects in the bucket
export const listImages = () => {
  return new Promise((resolve, reject) => {
    bucket.getFiles((err, files) => {
      if (err) {
        console.error("Error listing images:", err);
        reject(err);
      } else {
        const imageUrls = files.map((file) => {
          return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
        });
        resolve(imageUrls);
      }
    });
  });
};

// Function to delete an object from the bucket
export const deleteImage = (imageName) => {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(imageName);
    blob.delete((err, data) => {
      if (err) {
        console.error("Error deleting image:", err);
        reject(err);
      } else {
        console.log("Image deleted successfully:", imageName);
        resolve();
      }
    });
  });
};
