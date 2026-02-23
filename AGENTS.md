# AGENTS.md

## Project Overview

**ts-d2** (Deuterium) is a TypeScript builder library for professional document creation. It constructs DocFrame protobuf node trees (`docframe-types`) and sends them to a docPIPE server for rendering into PDF, PostScript, and other output formats.

## Architecture

```
DocumentElement (abstract base — leaf elements)
  └─ BranchDocumentElement<P> (abstract — has children)
       └─ Concrete branch elements (Paragraph, Span, Table, etc.)
  └─ Concrete leaf elements (Text, Image, Barcode, Variable, etc.)
```

- **`DocumentElement`** — Abstract base class. All elements implement `toDocFrame(): Proto.Node`.
- **`BranchDocumentElement<P>`** — Extends `DocumentElement`. Manages child elements and auto-converts `Content` (string | DocumentElement | array) into `DocumentElement[]`, wrapping strings in `Text` nodes.
- **`Document`** — Top-level element with defaults: A4 page, single column, default header/footer with 40pt vertical spacing, "Text" paragraph format.

### Source Layout

```
src/
  index.ts                  # Public API exports
  Alignment/                # Horizontal/Vertical alignment types
  Border/                   # Border and SideBorders types
  Color/                    # RGB, CMYK, hex color support
  Connection/               # docPIPE server connection (axios-based)
  Font/                     # Font configuration
  Measure/                  # AbsoluteMeasure, SideMeasures (pt, mm, cm, in)
  OutputFormat/             # PDF, PostScript, AFP output formats
  ParagraphFormat/          # Text formatting (font, size, alignment, spacing)
  Content/                  # All document elements (~34 types)
    Document/               # Top-level document builder
    DocumentElement/        # Abstract base class
    BranchDocumentElement/  # Abstract branch base class
    Text/, Paragraph/, Span/, Table/, Image/, Barcode/, ...
```

### Key Dependencies

- **`docframe-types`** — Protobuf type definitions. Uses `null` (not `undefined`) for unset fields.
- **`axios`** — HTTP client for docPIPE server communication.
- **`uuid`** — UUID generation for element identification.

## Development

### Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build with tsup |
| `npm run dev` | Build in watch mode |
| `npm test` | Run tests with vitest |
| `npm run format` | Format with dprint |
| `npm run lint` | Lint with eslint |

### Path Aliases

Configured in `tsconfig.json` and `vitest.config.ts`:

- `~/*` → `./src/*`
- `content/*` / `Content/*` → `./src/Content/*`

**Important:** LSP may report false "Cannot find module" errors for these aliases. They resolve correctly at runtime via vitest's alias configuration.

### Testing

- **Framework:** Vitest v4 with `globals: true` — `describe`, `it`, `expect` are available without imports.
- **Test location:** `test/*.spec.ts`
- **Run:** `npx vitest run`

### Protobuf Conventions

- `docframe-types` uses `null` instead of `undefined` for unset protobuf fields. Use `toBeFalsy()` rather than `toBeUndefined()` when asserting absent fields.
- Protobuf enum values can be `0` (the default), which means the field may be omitted during serialization. Always verify actual enum names against the `docframe-types` package — they may not match what you'd expect (e.g., `ProtoBarcodeType.QR` not `QR_CODE`).

### Formatting

- **Formatter:** dprint (not Prettier directly, though dprint wraps Prettier for some file types)
- **Indent:** 2 spaces
- **Trailing commas:** all
- **Quotes:** single quotes (Prettier config)
- Run `npm run format` before committing.

### Node Version

Minimum Node.js 18.17.0 (see `.nvmrc`).

## Code Style

- ESM module system (`"type": "module"` in package.json)
- Strict TypeScript (`strict: true`, `noImplicitReturns`, `noUnusedLocals`, `noUnusedParameters`)
- Each content element lives in its own directory under `src/Content/` with an `index.ts` file
- Properties are defined via TypeScript interfaces (e.g., `ImageProperties`, `BarcodeProperties`)
- Elements expose a `toDocFrame(): Proto.Node` method that creates protobuf nodes via `Proto.Node.create()`
