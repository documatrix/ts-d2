import * as fs from "fs";
import Deuterium from "../../src/";
import { Pagebreak } from "../../src/Content/Pagebreak";
import { Document } from "../../src/Content/Document";

const np = new Pagebreak();

const doc = new Document(["Hello Zürich!", np, "Next page"]);

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
