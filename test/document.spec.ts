import { describe, it } from "vitest";
import { PageDefinitions } from "Content/PageDefinition";
import { ColumnDefinitions } from "Content/ColumnDefinition";
import { Document } from "Content/Document";
import { Header } from "Content/Header";
import { Footer } from "Content/Footer";
import { Text } from "Content/Text";
import { ParagraphFormat } from "~/ParagraphFormat";
import { StandardFonts } from "~/Font";
import { AbsoluteMeasure } from "~/Measure";

describe("Document", () => {
  describe("constructor defaults", () => {
    it("should use A4 format if no format is specified", () => {
      const doc = new Document();
      expect(doc.props?.pageDefinition).toBe(PageDefinitions.A4);
    });

    it("should use A4 Single column definition by default", () => {
      const doc = new Document();
      expect(doc.props?.columnDefinition).toBe(ColumnDefinitions.A4.Single);
    });

    it("should create a default header with SpaceVertically", () => {
      const doc = new Document();
      expect(doc.props?.defaultHeader).toBeInstanceOf(Header);
    });

    it("should create a default footer with SpaceVertically", () => {
      const doc = new Document();
      expect(doc.props?.defaultFooter).toBeInstanceOf(Footer);
    });

    it("should register a default 'Text' paragraph format", () => {
      const doc = new Document();
      const textFormat = doc.getParagraphFormat("Text");
      expect(textFormat).toBeDefined();
      expect(textFormat?.props.name).toBe("Text");
      expect(textFormat?.props.default).toBe(true);
    });
  });

  describe("constructor with custom props", () => {
    it("should use provided page definition", () => {
      const doc = new Document(undefined, {
        pageDefinition: PageDefinitions.A3,
        columnDefinition: ColumnDefinitions.A4.Single,
      });
      expect(doc.props?.pageDefinition).toBe(PageDefinitions.A3);
    });

    it("should use provided column definition", () => {
      const doc = new Document(undefined, {
        pageDefinition: PageDefinitions.A4,
        columnDefinition: ColumnDefinitions.A4.Double,
      });
      expect(doc.props?.columnDefinition).toBe(ColumnDefinitions.A4.Double);
    });

    it("should use provided paragraph formats", () => {
      const customFormat = new ParagraphFormat({
        name: "Custom",
        font: StandardFonts.Helvetica,
        fontSize: new AbsoluteMeasure(16, "pt"),
      });
      const doc = new Document(undefined, {
        pageDefinition: PageDefinitions.A4,
        columnDefinition: ColumnDefinitions.A4.Single,
        paragraphFormats: { Custom: customFormat },
      });
      expect(doc.getParagraphFormat("Custom")).toBe(customFormat);
    });
  });

  describe("paragraph format management", () => {
    it("registerParagraphFormat should add a new format", () => {
      const doc = new Document();
      const heading = new ParagraphFormat({
        name: "Heading",
        fontSize: new AbsoluteMeasure(24, "pt"),
        bold: true,
      });
      doc.registerParagraphFormat("Heading", heading);
      expect(doc.getParagraphFormat("Heading")).toBe(heading);
    });

    it("registerParagraphFormat should overwrite existing format", () => {
      const doc = new Document();
      const newText = new ParagraphFormat({
        name: "Text",
        fontSize: new AbsoluteMeasure(10, "pt"),
      });
      doc.registerParagraphFormat("Text", newText);
      expect(doc.getParagraphFormat("Text")).toBe(newText);
    });

    it("getParagraphFormat should return undefined for unknown names", () => {
      const doc = new Document();
      expect(doc.getParagraphFormat("NonExistent")).toBeUndefined();
    });
  });

  describe("content management", () => {
    it("should accept string content in constructor", () => {
      const doc = new Document("Hello World");
      const df = doc.toDocFrame();
      // Children should be in the output (among settings nodes)
      const textNodes = df.children.filter((n) => n.text);
      expect(textNodes.length).toBeGreaterThan(0);
    });

    it("should accept DocumentElement content", () => {
      const text = new Text("test");
      const doc = new Document(text);
      const df = doc.toDocFrame();
      const textNodes = df.children.filter((n) => n.text);
      expect(textNodes.length).toBeGreaterThan(0);
    });

    it("should accept array content", () => {
      const doc = new Document(["line1", "line2"]);
      const df = doc.toDocFrame();
      const textNodes = df.children.filter((n) => n.text);
      expect(textNodes.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("toDocFrame", () => {
    it("should include page definition in output", () => {
      const doc = new Document();
      const df = doc.toDocFrame();
      const pDefNodes = df.children.filter((n) => n.pDef);
      expect(pDefNodes.length).toBeGreaterThan(0);
    });

    it("should include applyPDef in output", () => {
      const doc = new Document();
      const df = doc.toDocFrame();
      const applyNodes = df.children.filter((n) => n.applyPDef);
      expect(applyNodes.length).toBeGreaterThan(0);
      expect(applyNodes[0].applyPDef?.pDefUuid).toBe(
        doc.props?.pageDefinition.uuid,
      );
    });

    it("should include column definition in output", () => {
      const doc = new Document();
      const df = doc.toDocFrame();
      const cDefNodes = df.children.filter((n) => n.cDef);
      expect(cDefNodes.length).toBeGreaterThan(0);
    });

    it("should include paragraph formats in output", () => {
      const doc = new Document();
      const df = doc.toDocFrame();
      const pfNodes = df.children.filter((n) => n.paragraphFormat);
      expect(pfNodes.length).toBeGreaterThan(0);
    });

    it("should include default header in output", () => {
      const doc = new Document();
      const df = doc.toDocFrame();
      const headerNodes = df.children.filter((n) => n.header);
      expect(headerNodes.length).toBeGreaterThan(0);
    });

    it("should include default footer in output", () => {
      const doc = new Document();
      const df = doc.toDocFrame();
      const footerNodes = df.children.filter((n) => n.footer);
      expect(footerNodes.length).toBeGreaterThan(0);
    });

    it("should return a root Proto.Node", () => {
      const doc = new Document("test");
      const df = doc.toDocFrame();
      expect(df).toBeDefined();
      expect(df.children).toBeDefined();
      expect(df.children.length).toBeGreaterThan(0);
    });
  });
});
