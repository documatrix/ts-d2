import * as fs from "fs";
import Deuterium from "ts-d2";

let bold = new Deuterium.Content.ParagraphFormat({
  name: "bold",
  font: Deuterium.Font.StandardFonts.Helvetica,
  fontSize: new Deuterium.Measure.AbsoluteMeasure(10, "pt"),
  lineFeed: new Deuterium.Measure.AbsoluteMeasure(12, "pt"),
  bold: true,
});

const doc = new Deuterium.Content.Document(
  [
    "Hello ",
    new Deuterium.Content.Formatted("<bd>World!<lt>", "<b>World!</b>"),
    new Deuterium.Content.Paragraph("I'm in a bold paragraph", bold.name),
  ],
  {
    paragraphFormats: {
      Normal: new Deuterium.Content.ParagraphFormat({
        name: "Normal",
        font: Deuterium.Font.StandardFonts.Helvetica,
        fontSize: new Deuterium.Measure.AbsoluteMeasure(10, "pt"),
        lineFeed: new Deuterium.Measure.AbsoluteMeasure(12, "pt"),
        default: true,
      }),
      boldy: boldy,
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

doc.convertTo(Deuterium.OutputFormat.PDF).then(async (buffer) => {
  // save blob to file
  fs.writeFileSync("output.pdf", new Uint8Array(await buffer.arrayBuffer()));
  console.log("PDF saved");
});

doc.convertTo(Deuterium.OutputFormat.HTML).then(async (buffer) => {
  // save blob to file
  fs.writeFileSync("output.html", new Uint8Array(await buffer.arrayBuffer()));
  console.log("HTML saved");
});

doc.convertTo(Deuterium.OutputFormat.TEXT).then(async (buffer) => {
  // save blob to file
  fs.writeFileSync("output.txt", new Uint8Array(await buffer.arrayBuffer()));
  console.log("Text saved");
});
