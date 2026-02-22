import "dotenv/config";
import * as fs from "fs";
import Deuterium from "ts-d2";

let bold = new Deuterium.ParagraphFormat({
  name: "bold",
  font: Deuterium.Font.StandardFonts.Helvetica,
  fontSize: new Deuterium.Measure.AbsoluteMeasure(10, "pt"),
  lineFeed: new Deuterium.Measure.AbsoluteMeasure(12, "pt"),
  bold: true,
  indentionWidth: new Deuterium.Measure.AbsoluteMeasure(15, "pt"),
});

let doc = new Deuterium.Content.Document(
  [
    "Hello ",
    new Deuterium.Content.Paragraph("I'm in a bold paragraph", bold.props.name),
  ],
  {
    paragraphFormats: {
      Normal: new Deuterium.ParagraphFormat({
        name: "Normal",
        font: Deuterium.Font.StandardFonts.Helvetica,
        fontSize: new Deuterium.Measure.AbsoluteMeasure(10, "pt"),
        lineFeed: new Deuterium.Measure.AbsoluteMeasure(12, "pt"),
        default: true,
        indentionWidth: new Deuterium.Measure.AbsoluteMeasure(15, "pt"),
      }),
      bold: bold,
    },
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
  },
);

// Use default connection (reads from .env)
const conn = new Deuterium.Connection();

conn
  .convertTo(Deuterium.Output.OutputFormat.PDF, doc, {})
  .then(async (buffer) => {
    // save blob to file
    fs.writeFileSync("paragraph/output.pdf", new Uint8Array(await buffer.arrayBuffer()));
    console.log("PDF saved to paragraph/output.pdf");
  });

conn.convertTo(Deuterium.Output.OutputFormat.HTML, doc).then(async (buffer) => {
  // save blob to file
  fs.writeFileSync("paragraph/output.html", new Uint8Array(await buffer.arrayBuffer()));
  console.log("HTML saved to paragraph/output.html");
});

conn.convertTo(Deuterium.Output.OutputFormat.TEXT, doc).then(async (buffer) => {
  // save blob to file
  fs.writeFileSync("paragraph/output.txt", new Uint8Array(await buffer.arrayBuffer()));
  console.log("Text saved to paragraph/output.txt");
});
