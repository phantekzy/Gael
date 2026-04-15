# Xael Resume Parser
This project is still under work so calma and wait 
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
