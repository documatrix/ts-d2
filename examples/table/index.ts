import * as fs from "fs";
import Deuterium from "../../src/";

const BorderWidths = {
  THIN: new Deuterium.Measure.AbsoluteMeasure(0.6, "pt"),
  THICK: new Deuterium.Measure.AbsoluteMeasure(2.5, "pt")
}

const data = {
  firstName : "John",
  lastName : "Doe",
}

new Deuterium.Content.Formatted(`<#firstName=${data.firstName}> <#lastName=${data.lastName}>`)

const borders = new Deuterium.Border.SideBorders({
  top: new Deuterium.Border.Border(BorderWidths.THICK, Deuterium.Color.Colors.black),
  right: new Deuterium.Border.Border(new Deuterium.Measure.AbsoluteMeasure(0.6, "pt"), Deuterium.Color.Colors.black),
  bottom: new Deuterium.Border.Border(new Deuterium.Measure.AbsoluteMeasure(0.6, "pt"), Deuterium.Color.Colors.black),
  left: new Deuterium.Border.Border(new Deuterium.Measure.AbsoluteMeasure(0.6, "pt"), Deuterium.Color.Colors.black),
});

const doc = new Deuterium.Content.Document([
  "On the next page is a wonderful page",
  new Deuterium.Content.Pagebreak(),
  new Deuterium.Content.Table(
    new Deuterium.Content.TableRow([
      new Deuterium.Content.TableCell("Hello", {
        border: borders,
      }),
      new Deuterium.Content.TableCell("World"),
    ]),
  )
]);


doc
  .convertTo(Deuterium.OutputFormat.PDF)
  .then(async (buffer) => {
    // save blob to file
    fs.writeFileSync("output.pdf", new Uint8Array(await buffer.arrayBuffer()));
    console.log("PDF saved");
  });


doc
  .convertTo(Deuterium.OutputFormat.HTML)
  .then(async (buffer) => {
    // save blob to file
    fs.writeFileSync("output.html", new Uint8Array(await buffer.arrayBuffer()));
    console.log("HTML saved");
  });
