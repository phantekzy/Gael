# Xael Resume Parser

### TECHNICAL DEBT: SPATIAL RECONSTRUCTION LIMITATIONS

The current iteration of the Xael engine utilizes `pdf-parse` for text extraction. Users should be aware of a critical limitation regarding "riced" or multi-column PDF layouts.

#### The Problem
PDFs do not store text as a semantic flow; they store characters at specific (X, Y) coordinates. Standard Node.js stream-readers extract this data by following the internal object stream, which often results in "Layout Interleaving."

When a resume features a sidebar (e.g., Skills) alongside a main body (e.g., Experience), the parser flattens the two columns into a single line. This merges sidebar labels directly into the middle of experience descriptions, breaking the heuristic segmentation logic.

#### Visualizing the Failure
Instead of reading:
- Block A (Summary)
- Block B (Skills)

The parser reads:
- Line 1 (Start of A + Start of B)
- Line 2 (Middle of A + Middle of B)

#### Potential Solutions
To resolve this, the extraction layer must be migrated to a coordinate-aware engine (Spatial Indexing). This involves:
1. Extracting every text fragment with its bounding box (X1, Y1, X2, Y2).
2. Grouping fragments into vertical "buckets" based on X-axis alignment.
3. Sorting these buckets to reconstruct the intended reading order before passing the string to the Parser.

Contributions or suggestions regarding low-overhead spatial reconstruction in Node.js are welcome.


## Table of Contents

* [Introduction](#introduction)
* [The Layout Interleaving Problem](#the-layout-interleaving-problem)
* [Project Structure](#project-structure)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Installation](#installation)
* [API Reference](#api-reference)

## Introduction

Xael is Node.js API designed to extract, segment, and structure data from PDF and DOCX resumes into validated JSON. It uses a heuristic-based approach to identify professional sections and maps technical skills against a dynamic dictionary.

## The Layout Interleaving Problem

The primary challenge currently facing the engine is the "Stream-Reading" limitation of standard PDF libraries.

When a resume uses a multi-column layout (e.g., a sidebar for skills and a main body for experience), the parser reads text left-to-right across the entire page. This causes "interleaving," where sidebar labels are injected directly into the middle of experience descriptions or summaries. Without a coordinate-aware layout engine, the parser remains "blind" to the visual separation of data, leading to fragmented JSON output.

## Project Structure

```bash
Xael/
├── src/
│   ├── core/
│   │   ├── extractor.ts      # Handles PDF/Docx to String
│   │   ├── parser.ts         # Heuristics & Regex logic
│   │   └── sanitizer.ts      # Clean up messy text
│   ├── types/
│   │   └── resume.ts         # Zod schemas & TS interfaces
│   ├── utils/
│   │   └── pattern-match.ts  # Regex constants
│   ├── index.ts              # Entry point (Express/Fastify)
│   └── app.ts                # App configuration
├── uploads/                  # Temporary storage for files
├── .env                      # Configuration
├── package.json
└── tsconfig.json
```

## features

* Agnostic Parsing: No hardcoded locations or user-specific data; uses pattern recognition for global compatibility.

* Skill Mapping: Automated detection of languages, frameworks, and infrastructure tools.

* Section Slicing: Greedy algorithms designed to capture full blocks of text between headers.

* Social Discovery: Dynamic identification of GitHub, LinkedIn, and Portfolio links even when detached from icons.

* Multi-format Support: Native handling for both PDF and DOCX file buffers.

## Tech Stack

* Runtime: Node.js

* Language: TypeScript

* Processing: pdf-parse, mammoth

* Validation: Zod

## Installation

```bash
git clone [https://github.com/phantekzy/Xael.git](https://github.com/phantekzy/Xael.git)
cd Xael
npm install
npm run dev
```

## API Reference

```bash
Parse Resume
POST /api/parse

Form Data:
resume: File (PDF/DOCX)

Example Response:
{
"name": {
"firstName": "Ferchouch",
"lastName": "keshkoush",
"title": "Moody cat"
},
"contact": {
"email": "ferchouch@gmail.com",
"links": {
"github": "https://github.com/ferchouch"
}
},
"experience": [...],
"skills": {...}
}
```
