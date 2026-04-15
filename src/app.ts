import express from "express";
import fs from "fs";

const app = express();

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
