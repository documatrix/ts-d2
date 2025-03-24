# ts-d2

This is the TypeScript version of the [Deuterium](https://www.d2lib.io) library.

Deuterium is a "document as code" library, which allows you to create format-independent documents, which then are converted into a specific format using the three components DocFrame, docPIPE and docTYPE.

The following output formats are supported:
* HTML
* PDF (including PDF/UA support)
* Plaintext
* Images (BMP, PNG and more)
* PostScript

This is a small example creating a document with the content "Hello World" as PDF:

```typescript
import * as fs from "fs";
import Deuterium from "ts-d2";

new Deuterium.Content.Document("Hello World")
  .convertTo(Deuterium.OutputFormat.PDF)
  .then(async (buffer) => {
    // save blob to file
    fs.writeFileSync("output.pdf", Buffer.from(await buffer.arrayBuffer()));
  });
```

# Basics

Documents are divided into DocumentElements, which are the smallest part of a document (like text, vertical space, etc.).

DocumentElements also may be branch elements and therefore have child-elements (like tables, paragraphs, etc.).

DocumentElements may be grouped together to a document, which then may be converted to the desired output format.

All the supported DocumentElements are placed in the package `Deuterium.Content`.

## Leaf elements

The following leaf elements are currently supported:
* Barcode
* ColumnDefinition (only useful for page-based formats)
* Directory
* Footer
* Formatted (may be used to directly insert docTYPE code and/or HTML code)
* Header
* Linebreak
* Pagebreak
* PageDefinition (only useful for page-based formats)
* Paragraph
* SpaceVertically
* Span
* Table
* TableCell
* TableRow
* Text

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

## Branch elements

Branch elements have two functionalities:
* Group elements together (like Directory)
* Apply formatting/properties to their child elements.

The following branch elements are supported:
* Directory
* Document
* Footer
* Header
* Paragraph
* Span
* Table
* TableCell
* TableRow

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
