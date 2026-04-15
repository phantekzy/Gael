import { Request, Response } from "express";
import { upload } from "./app.js";
import { ResumeService } from "./resume.service.js";

app.post(
  "api/parse",
  upload.single("resume"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const validatedData = await ResumeService.process(
        req.file.path,
        req.file.mimetype,
      );
    } catch (error) {}
  },
);
