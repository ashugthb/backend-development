import { Storage } from "@google-cloud/storage";
import { fileURLToPath } from "url";

const storage = new Storage({
  keyFilename: "keyFile.json",
  projectId: "bhaiji-412210",
});

export default storage;
