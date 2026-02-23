# ts-d2

This is the TypeScript version of the [Deuterium](https://www.d2lib.io) library.

Deuterium is a "document as code" library, which allows you to create format-independent documents, which then are converted into a specific format using the three components DocFrame, docPIPE and docTYPE.

The following output formats are supported:
* HTML
* PDF (including PDF/UA support)
* Plaintext
* Images (BMP, PNG and more)
* PostScript

## Configuration

Before using the library, you need to configure your docPIPE API connection. Create a `.env` file in your project root:

```bash
cp .env.example .env
```

Then edit the `.env` file and set your docPIPE API credentials:

```bash
# The URL of your docPIPE API server
DOCPIPE_URL=http://localhost:8080

# Your docPIPE API authentication token
DOCPIPE_TOKEN=your-token-here
```

**Note:** The `.env` file is already included in `.gitignore` to prevent accidentally committing sensitive credentials.

## Usage

This is a small example creating a document with the content "Hello World" as PDF:

```typescript
import * as fs from "fs";
import Deuterium from "ts-d2";

new Deuterium.Content.Document("Hello World")
  .convertTo(Deuterium.Output.OutputFormat.PDF)
  .then(async (buffer) => {
    // save blob to file
    fs.writeFileSync("output.pdf", Buffer.from(await buffer.arrayBuffer()));
  });
```

### Job Parameters

Both `convertTo` and `convertToPDF` accept an optional `jobParams` argument — a free-form object that is merged into the request metadata sent to the docPIPE server:

```typescript
new Deuterium.Content.Document("Hello World")
  .convertTo(Deuterium.Output.OutputFormat.PDF, undefined, { locale: "en-US" })
  .then(async (buffer) => {
    fs.writeFileSync("output.pdf", Buffer.from(await buffer.arrayBuffer()));
  });
```

These job parameters are available in docPIPE as job variables.

### Custom Connection

By default, the library uses the connection credentials from your `.env` file. If you need to use different credentials for a specific conversion, you can create a custom `Connection` instance:

```typescript
import Deuterium from "ts-d2";

// Create a custom connection with different credentials
const customConnection = new Deuterium.Connection(
  "https://api.example.com",
  "custom-token-here"
);

// Use the custom connection for conversion
const doc = new Deuterium.Content.Document("Hello World");
customConnection.convertTo(Deuterium.Output.OutputFormat.PDF, doc)
  .then(async (buffer) => {
    fs.writeFileSync("output.pdf", Buffer.from(await buffer.arrayBuffer()));
  });
```

# Basics

Documents are divided into DocumentElements, which are the smallest part of a document (like text, vertical space, etc.).

DocumentElements also may be branch elements and therefore have child-elements (like tables, paragraphs, etc.).

DocumentElements may be grouped together to a document, which then may be converted to the desired output format.

All the supported DocumentElements are placed in the package `Deuterium.Content`.

## Leaf elements

Leaf elements have no children. The following leaf elements are supported:

* **Barcode** -- renders a barcode (QR, Code128, etc.) with configurable position, size and rotation
* **Linebreak** -- inserts a line break
* **Image** -- embeds an image with support for scaling, cropping, flipping, rotation and absolute positioning
* **Pagebreak** -- inserts a page break
* **Rule** -- draws a horizontal or vertical line with configurable style (solid, dashed, dotted, double, etc.), color and thickness
* **SpaceVertically** -- inserts vertical whitespace of a given height
* **Tag** -- inserts a named tag with optional parameters
* **Text** -- renders a plain text string
* **Variable** -- inserts a dynamic variable (data path, page number, date, etc.)

Any leaf element may be added to multiple branch elements (there is no connection from a leaf element to its parent element).

### Text

To create a text element you may use the following code:

```typescript
new Deuterium.Content.Text("Hello World!")
```

The text may then be added to any branch element.

When creating branch elements, you may also pass strings directly in order to create a text element.

```typescript
new Deuterium.Content.Span("Hello World!", {
  bold: true
});
```

### Image

```typescript
new Deuterium.Content.Image({
  /* Currently only images located on the docPIPE server are supported. */
  src: "logo.png",
  alt: "Company Logo",
  width: new Deuterium.Measure.AbsoluteMeasure(200, "pt"),
  height: new Deuterium.Measure.AbsoluteMeasure(100, "pt"),
  scaleType: "absolute",
});
```

### Variable

Variables can display dynamic data or special values like page numbers:

```typescript
// Data variable
new Deuterium.Content.Variable({ path: "customer.name" });

// Page number
new Deuterium.Content.Variable({ specialType: "cur-page" });

// Total page count
new Deuterium.Content.Variable({ specialType: "page-count" });
```

### Rule

```typescript
new Deuterium.Content.Rule({
  width: new Deuterium.Measure.AbsoluteMeasure(400, "pt"),
  thickness: new Deuterium.Measure.AbsoluteMeasure(1, "pt"),
  color: Deuterium.Color.Colors.black,
  style: "solid",
});
```

### Barcode

```typescript
import Proto from "docframe-types";

new Deuterium.Content.Barcode({
  type: Proto.ProtoBarcodeType.QRCODE,
  data: "https://example.com",
  x: new Deuterium.Measure.AbsoluteMeasure(0, "pt"),
  y: new Deuterium.Measure.AbsoluteMeasure(0, "pt"),
  width: new Deuterium.Measure.AbsoluteMeasure(100, "pt"),
  height: new Deuterium.Measure.AbsoluteMeasure(100, "pt"),
  referencePoint: "top-left",
  rotation: 0,
  positionAbsolute: false,
});
```

## Branch elements

Branch elements have two functionalities:
* Group elements together (like Directory)
* Apply formatting/properties to their child elements.

The following branch elements are supported:

* **AdjustHorizontally** -- adjusts font size within min/max bounds to fit content horizontally
* **AdvancedIllustrationArea** -- a positioned area for illustrations with text flow control
* **CarryOver** -- defines content carried over when a table breaks across pages
* **Condition** -- conditionally includes content based on a code expression
* **Directory** -- groups elements with optional name, editability and semantic type
* **Document** -- the root element; holds page/column definitions, paragraph formats and all content
* **Footer** -- defines page footer content with configurable mode (append, extend, replace)
* **Header** -- defines page header content with configurable mode (append, extend, replace)
* **Indentation** -- applies left/right indentation to its children
* **Link** -- wraps content in a hyperlink
* **Loop** -- iterates over a data path, rendering children for each entry
* **LoopEntry** -- represents a single entry inside a Loop
* **PageCondition** -- conditionally includes content evaluated per page
* **Paragraph** -- groups inline content under a named paragraph format with optional overrides
* **Section** -- defines a document section, optionally with its own column definition
* **Selection** -- groups selectable entries (single or multi-select)
* **SelectionEntry** -- a single option inside a Selection
* **Span** -- applies inline formatting (bold, italic, underline, strikethrough, color, sub/superscript)
* **SubTotal** -- defines a sub-total area for tables (e.g. running totals)
* **Table** -- a table element with configurable width, offset and repeating headers
* **TableCell** -- a table cell with alignment, background color, borders, padding, margin and rotation
* **TableContentGroup** -- groups table rows (e.g. header group, body group, footer group)
* **TableRow** -- a table row with optional minimum height
* **WsArea** -- wraps content to control widow/orphan and page-split behavior

### Content parameter

When creating branch document elements, the first parameter is the so called "content" parameter, which is used to define the child elements of the new branch document element.

The content parameter may be one of the following:

* string -> Creates a Text Document Element for the given string
* DocumentElement -> Just uses the passed DocumentElement
* (DocumentElement | string)[] -> Uses all the passed DocumentElements (and converts passed strings to Text objects)

Especially the first variant of the content parameter can result in small code:

```typescript
new Deuterium.Content.Footer("...");
```

### Span

```typescript
new Deuterium.Content.Span("Important!", {
  bold: true,
  italic: true,
  color: Deuterium.Color.Color.rgb(255, 0, 0),
  underline: true,
});
```

### Link

```typescript
new Deuterium.Content.Link("Click here", "https://example.com");
```

### Table

```typescript
new Deuterium.Content.Table(
  new Deuterium.Content.TableRow([
    new Deuterium.Content.TableCell("Column 1", {
      border: new Deuterium.Border.SideBorders({
        bottom: new Deuterium.Border.Border(
          new Deuterium.Measure.AbsoluteMeasure(1, "pt"),
          Deuterium.Color.Colors.black,
        ),
      }),
    }),
    new Deuterium.Content.TableCell("Column 2"),
  ]),
  { repeatHeader: 1 },
);
```

### Header and Footer

```typescript
new Deuterium.Content.Header("Page header content", { mode: "replace" });
new Deuterium.Content.Footer("Page footer content", { mode: "append" });
```

### Condition

```typescript
new Deuterium.Content.Condition(
  "This is only shown when the condition is true",
  { code: "data.showSection === true", result: true },
);
```

### Loop

```typescript
new Deuterium.Content.Loop(
  new Deuterium.Content.Variable({ path: "item.name" }),
  { path: "items" },
);
```

### Indentation

```typescript
new Deuterium.Content.Indentation(
  "This text is indented",
  { left: new Deuterium.Measure.AbsoluteMeasure(30, "pt") },
);
```

## Support classes

In addition to the document elements, the library provides several support classes:

* **Deuterium.Alignment** -- predefined horizontal (Left, Center, Right, Justify, FullJustify) and vertical (Top, Middle, Bottom) alignment values
* **Deuterium.Border** -- `Border` (weight + color) and `SideBorders` (top/right/bottom/left)
* **Deuterium.Color** -- `Color.rgb()`, `Color.cmyk()`, `Color.fromHex()` factory methods and preset `Colors` (black, white)
* **Deuterium.Font** -- `Font` class and `StandardFonts` (Helvetica)
* **Deuterium.Measure** -- `AbsoluteMeasure` (pt, cm, mm, in, px), `Measure` (also supports %), `SideMeasures` and `Sides`
* **Deuterium.ParagraphFormat** -- defines named paragraph formats with font, size, line feed, spacing, alignment, bold/italic and indentation

## Page layout

For page-based output formats (PDF, PostScript), you can configure page size and column layout:

```typescript
const doc = new Deuterium.Content.Document("Content", {
  pageDefinition: new Deuterium.Content.PageDefinition(
    new Deuterium.Measure.AbsoluteMeasure(595, "pt"),
    new Deuterium.Measure.AbsoluteMeasure(842, "pt"),
  ),
  columnDefinition: new Deuterium.Content.ColumnDefinition({
    position: Deuterium.Content.ColumnPosition.Center,
    interColumnSpace: new Deuterium.Measure.AbsoluteMeasure(0, "pt"),
    positionOffset: new Deuterium.Measure.AbsoluteMeasure(70, "pt"),
    width: new Deuterium.Measure.AbsoluteMeasure(490, "pt"),
  }),
});
```

Predefined page sizes are available via `PageDefinitions` (A3, A4, A5) and column presets via `ColumnDefinitions`.

# Contributing

Contributions to this project are very welcome. If you want to contribute, please create a pull request with your changes and a description of what you have done.

## Building the project

To build the project, you need to have Node.js and npm installed. Then you can run the following command in the project directory:

```bash
npm ci
npm run build
```

## Testing the project

To run the tests, you can use the following command:

```bash
npm run test
```
