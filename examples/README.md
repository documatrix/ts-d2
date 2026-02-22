# Examples

This folder contains several examples of how to use the ts-d2 library. Each example is a standalone project that demonstrates different features of the library.

## Prerequisites

- Node.js >= 18.17.0
- A running docPIPE server
- docPIPE API authentication token

## Setup

### 1. Build the main package first

Before running the examples, you need to build the ts-d2 package:

```bash
# From the project root
cd ..
pnpm build
```

### 2. Install example dependencies

```bash
cd examples
npm install
```

**Note:** The examples currently use a local file reference (`"ts-d2": "file:.."`) to the parent package because the published npm version has build issues. Once a corrected version is published, update `package.json` to use the npm version (e.g., `"ts-d2": "^0.0.21"`).

### 3. Configure docPIPE connection

```bash
cp .env.example .env
```

Edit the `.env` file and add your docPIPE API credentials:
```bash
DOCPIPE_URL=http://localhost:8080
DOCPIPE_TOKEN=your-actual-token-here
```

## Running Examples

Each example can be run independently using npm scripts:

### Simple Text Example
Demonstrates basic text document creation with bold spans and formatted content.
```bash
npm run simple-text
```
Generates: `simple-text/output.pdf` and `simple-text/output.html`

### Paragraph Example
Shows paragraph formatting, custom fonts, and style definitions.
```bash
npm run paragraph
```
Generates: `paragraph/output.pdf`, `paragraph/output.html`, and `paragraph/output.txt`

### Table Example
Demonstrates table creation with borders and custom styling.
```bash
npm run table
```
Generates: `table/output.pdf` and `table/output.html`

## Examples Overview

### simple-text/
Basic document with:
- Simple text content
- Page breaks
- Bold text spans
- Formatted mathematical notation

### paragraph/
Advanced formatting with:
- Custom paragraph formats
- Font and size definitions
- Line feed configuration
- Page and column definitions
- Class-based document structure

### table/
Table features including:
- Table rows and cells
- Border customization
- Cell styling
- Integration with other content

## Notes

- These examples currently use a local file reference to the parent ts-d2 package
- When a corrected version is published to npm, update to use: `"ts-d2": "^0.0.21"` (or later)
- Output files (PDF, HTML, TXT) are included in the repository for reference
- Make sure your docPIPE server is running before executing examples
- Connection credentials are loaded from the `.env` file (not hardcoded)

## Troubleshooting

**Connection errors:** Verify your docPIPE server is running and the credentials in `.env` are correct.

**Module not found:** Run `npm install` in the examples directory.

**Permission errors:** Ensure you have write permissions in the example directories for output files.

**Build errors:** Make sure you've built the parent package first with `pnpm build` from the project root.
