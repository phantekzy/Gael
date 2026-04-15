import { Request, Response } from "express";
import app, { upload } from "./app.js";
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
      return res.json(validatedData);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res
          .status(422)
          .json({ error: "Schema Validation Error", details: error.errors });
      }
      return res
        .status(500)
        .json({ error: error.message || "Internal Server Error" });
    }
  },
);
