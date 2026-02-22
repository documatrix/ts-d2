import "dotenv/config";
import * as fs from "fs";
import Deuterium from "ts-d2";

const np = new Deuterium.Content.Pagebreak();

const doc = new Deuterium.Content.Document([
  "Hello World!",
  np,
  "This is a simple text document.",
  new Deuterium.Content.Span("I'm bold", { bold: true }),
]);

// Use default connection (reads from .env)
const conn = new Deuterium.Connection();

conn.convertTo(Deuterium.Output.OutputFormat.PDF, doc).then(async (buffer) => {
  // save blob to file
  fs.writeFileSync("simple-text/output.pdf", new Uint8Array(await buffer.arrayBuffer()));
  console.log("PDF saved to simple-text/output.pdf");
});

conn.convertTo(Deuterium.Output.OutputFormat.HTML, doc).then(async (buffer) => {
  // save blob to file
  fs.writeFileSync("simple-text/output.html", new Uint8Array(await buffer.arrayBuffer()));
  console.log("HTML saved to simple-text/output.html");
});
