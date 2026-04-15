import { upload } from "./app.js";

app.post("api/parse", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
  } catch (error) {}
});
