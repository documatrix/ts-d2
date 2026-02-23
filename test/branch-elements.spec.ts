import { describe, it } from "vitest";
import Proto from "docframe-types";
import { Span } from "Content/Span";
import { Paragraph } from "Content/Paragraph";
import { Table } from "Content/Table";
import { TableRow } from "Content/TableRow";
import { TableCell } from "Content/TableCell";
import { TableContentGroup } from "Content/TableContentGroup";
import { Header } from "Content/Header";
import { Footer } from "Content/Footer";
import { Link } from "Content/Link";
import { Indentation } from "Content/Indentation";
import { Loop } from "Content/Loop";
import { LoopEntry } from "Content/LoopEntry";
import { Section } from "Content/Section";
import { Condition } from "Content/Condition";
import { PageCondition } from "Content/PageCondition";
import { Selection } from "Content/Selection";
import { SelectionEntry } from "Content/SelectionEntry";
import { Directory } from "Content/Directory";
import { WsArea } from "Content/WsArea";
import { CarryOver } from "Content/CarryOver";
import { AdvancedIllustrationArea } from "Content/AdvancedIllustrationArea";
import { AdjustHorizontally } from "Content/AdjustHorizontally";
import { SubTotal } from "Content/SubTotal";
import { Text } from "Content/Text";
import { AbsoluteMeasure, Measure, SideMeasures } from "~/Measure";
import { Color } from "~/Color";
import { Alignment } from "~/Alignment";
import { Border, SideBorders } from "~/Border";
import { ParagraphFormat } from "~/ParagraphFormat";

// ---------------------------------------------------------------------------
// Span
// ---------------------------------------------------------------------------
describe("Span", () => {
  it("should create with content and no formatting", () => {
    const span = new Span("text");
    const df = span.toDocFrame();
    expect(df.span).toBeDefined();
    expect(df.children).toHaveLength(1);
    expect(df.children[0].text?.content).toBe("text");
  });

  it("should serialize bold property as boxed bool", () => {
    const span = new Span("bold", { bold: true });
    const df = span.toDocFrame();
    expect(df.span?.bold?.value).toBe(true);
    expect(df.span?.bold?.isNull).toBe(false);
  });

  it("should serialize italic property", () => {
    const span = new Span("italic", { italic: true });
    expect(span.toDocFrame().span?.italic?.value).toBe(true);
  });

  it("should serialize underline property", () => {
    const span = new Span("underline", { underline: true });
    expect(span.toDocFrame().span?.underline?.value).toBe(true);
  });

  it("should serialize strikethrough property", () => {
    const span = new Span("strike", { strikethrough: true });
    expect(span.toDocFrame().span?.strikethrough?.value).toBe(true);
  });

  it("should serialize subscript property", () => {
    const span = new Span("sub", { subscript: true });
    expect(span.toDocFrame().span?.subscript?.value).toBe(true);
  });

  it("should serialize superscript property", () => {
    const span = new Span("sup", { superscript: true });
    expect(span.toDocFrame().span?.superscript?.value).toBe(true);
  });

  it("should serialize color", () => {
    const span = new Span("red", { color: Color.rgb(255, 0, 0) });
    const df = span.toDocFrame();
    expect(df.span?.color?.r).toBe(255);
  });

  it("should handle false values for boolean props", () => {
    const span = new Span("plain", { bold: false, italic: false });
    const df = span.toDocFrame();
    expect(df.span?.bold?.value).toBe(false);
    expect(df.span?.italic?.value).toBe(false);
  });

  it("should omit undefined boolean props", () => {
    const span = new Span("minimal", {});
    const df = span.toDocFrame();
    expect(df.span?.bold).toBeFalsy();
    expect(df.span?.italic).toBeFalsy();
  });
});

// ---------------------------------------------------------------------------
// Paragraph
// ---------------------------------------------------------------------------
describe("Paragraph", () => {
  it("should accept a paragraph format name as string", () => {
    const p = new Paragraph("hello", "Heading");
    expect(p.props?.paragraphFormatName).toBe("Heading");
  });

  it("should extract name from ParagraphFormat object", () => {
    const pf = new ParagraphFormat({ name: "Body" });
    const p = new Paragraph("content", pf);
    expect(p.props?.paragraphFormatName).toBe("Body");
  });

  it("should serialize paragraph format name to DocFrame", () => {
    const p = new Paragraph("text", "MyFormat");
    const df = p.toDocFrame();
    expect(df.paragraph).toBeDefined();
    expect(df.paragraph?.format?.name?.value).toBe("MyFormat");
    expect(df.children).toHaveLength(1);
  });

  it("should serialize overwrite paragraph format", () => {
    const overwrite = new ParagraphFormat({
      name: "Override",
      bold: true,
    });
    const p = new Paragraph("text", undefined, overwrite);
    const df = p.toDocFrame();
    expect(df.paragraph?.overwrite).toBeDefined();
    expect(df.paragraph?.overwrite?.bold?.value).toBe(true);
  });

  it("should handle no format name or overwrite", () => {
    const p = new Paragraph("plain");
    const df = p.toDocFrame();
    expect(df.paragraph).toBeDefined();
    expect(df.children).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------
describe("Table", () => {
  it("should default xOffset to Measure.zero", () => {
    const table = new Table();
    expect(table.props?.xOffset).toBe(Measure.zero);
  });

  it("should preserve provided xOffset", () => {
    const offset = new AbsoluteMeasure(10, "pt");
    const table = new Table(undefined, { xOffset: offset });
    expect(table.props?.xOffset).toBe(offset);
  });

  it("should serialize width and xOffset to DocFrame", () => {
    const table = new Table(undefined, {
      width: new Measure(100, "%"),
      xOffset: new AbsoluteMeasure(5, "pt"),
    });
    const df = table.toDocFrame();
    expect(df.table).toBeDefined();
    expect(df.table?.settings?.width?.value).toBe(100);
    expect(df.table?.settings?.xOffset?.value).toBe(5);
  });

  it("should serialize leftMeasure as boxed bool (defaults to false)", () => {
    const table = new Table();
    const df = table.toDocFrame();
    expect(df.table?.settings?.leftMeasure?.value).toBe(false);
  });

  it("should serialize repeatHeader when set", () => {
    const table = new Table(undefined, { repeatHeader: 2 });
    const df = table.toDocFrame();
    expect(df.table?.settings?.repeatHeader?.value).toBe(2);
  });

  it("should include children in DocFrame output", () => {
    const row = new TableRow();
    const table = new Table(row);
    const df = table.toDocFrame();
    expect(df.children).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// TableRow
// ---------------------------------------------------------------------------
describe("TableRow", () => {
  it("should serialize with no minHeight", () => {
    const row = new TableRow();
    const df = row.toDocFrame();
    expect(df.tableRow).toBeDefined();
  });

  it("should serialize minHeight", () => {
    const row = new TableRow(undefined, {
      minHeight: new AbsoluteMeasure(30, "pt"),
    });
    const df = row.toDocFrame();
    expect(df.tableRow?.settings?.minHeight?.value).toBe(30);
  });

  it("should include cell children", () => {
    const cell = new TableCell("data");
    const row = new TableRow(cell);
    const df = row.toDocFrame();
    expect(df.children).toHaveLength(1);
    expect(df.children[0].tableCell).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// TableCell
// ---------------------------------------------------------------------------
describe("TableCell", () => {
  it("should serialize with default alignment", () => {
    const cell = new TableCell("data");
    const df = cell.toDocFrame();
    expect(df.tableCell).toBeDefined();
    expect(df.tableCell?.settings?.align?.value).toBe(
      Proto.ProtoHorizontalAlignment.ALIGN_LEFT,
    );
  });

  it("should serialize custom alignment", () => {
    const cell = new TableCell("data", {
      alignment: Alignment.Horizontal.Center,
    });
    const df = cell.toDocFrame();
    expect(df.tableCell?.settings?.align?.value).toBe(
      Proto.ProtoHorizontalAlignment.ALIGN_CENTER,
    );
  });

  it("should serialize vertical alignment", () => {
    const cell = new TableCell("data", {
      verticalAlignment: Alignment.Vertical.Middle,
    });
    const df = cell.toDocFrame();
    expect(df.tableCell?.settings?.valign?.value).toBe(
      Proto.ProtoVerticalAlignment.MIDDLE,
    );
  });

  it("should serialize backgroundColor", () => {
    const cell = new TableCell("data", {
      backgroundColor: Color.rgb(200, 200, 200),
    });
    const df = cell.toDocFrame();
    expect(df.tableCell?.settings?.backgroundColor?.r).toBe(200);
  });

  it("should serialize border", () => {
    const b = new Border(new AbsoluteMeasure(1, "pt"), Color.rgb(0, 0, 0));
    const cell = new TableCell("data", {
      border: new SideBorders({ top: b, bottom: b }),
    });
    const df = cell.toDocFrame();
    expect(df.tableCell?.settings?.border).toBeDefined();
  });

  it("should serialize margin and padding", () => {
    const cell = new TableCell("data", {
      margin: new SideMeasures({
        top: new AbsoluteMeasure(2, "pt"),
      }),
      padding: new SideMeasures({
        left: new AbsoluteMeasure(5, "pt"),
      }),
    });
    const df = cell.toDocFrame();
    expect(df.tableCell?.settings?.margin).toBeDefined();
    expect(df.tableCell?.settings?.padding).toBeDefined();
  });

  it("should serialize width", () => {
    const cell = new TableCell("data", {
      width: new Measure(50, "%"),
    });
    const df = cell.toDocFrame();
    expect(df.tableCell?.settings?.width?.value).toBe(50);
  });

  it("should serialize rotation as boxed double", () => {
    const cell = new TableCell("data", { rotation: 90 });
    const df = cell.toDocFrame();
    expect(df.tableCell?.settings?.rotation?.value).toBe(90);
  });

  it("should serialize defaultParagraphFormat as boxed string", () => {
    const cell = new TableCell("data", {
      defaultParagraphFormat: "CellText",
    });
    const df = cell.toDocFrame();
    expect(df.tableCell?.settings?.defaultParagraphFormat?.value).toBe(
      "CellText",
    );
  });
});

// ---------------------------------------------------------------------------
// TableContentGroup
// ---------------------------------------------------------------------------
describe("TableContentGroup", () => {
  it("should serialize with uuid", () => {
    const group = new TableContentGroup(undefined, { uuid: "grp-1" });
    const df = group.toDocFrame();
    expect(df.tableContentGroup).toBeDefined();
    expect(df.tableContentGroup?.uuid).toBe("grp-1");
  });

  it("should serialize without uuid", () => {
    const group = new TableContentGroup();
    const df = group.toDocFrame();
    expect(df.tableContentGroup).toBeDefined();
  });

  it("should include children", () => {
    const row = new TableRow();
    const group = new TableContentGroup(row);
    const df = group.toDocFrame();
    expect(df.children).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------
describe("Header", () => {
  it("should serialize without mode", () => {
    const header = new Header("header text");
    const df = header.toDocFrame();
    expect(df.header).toBeDefined();
    expect(df.children).toHaveLength(1);
  });

  it.each([
    [
      "append-initial",
      Proto.ProtoHeaderMode.HEADER_MODE_APPEND_INITIAL,
    ],
    ["append", Proto.ProtoHeaderMode.HEADER_MODE_APPEND],
    ["extend", Proto.ProtoHeaderMode.HEADER_MODE_EXTEND],
    ["replace", Proto.ProtoHeaderMode.HEADER_MODE_REPLACE],
  ] as const)("should map mode '%s' correctly", (mode, expected) => {
    const header = new Header("text", { mode });
    expect(header.toDocFrame().header?.mode).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
describe("Footer", () => {
  it("should serialize without mode", () => {
    const footer = new Footer("footer text");
    const df = footer.toDocFrame();
    expect(df.footer).toBeDefined();
    expect(df.children).toHaveLength(1);
  });

  it.each([
    [
      "append-initial",
      Proto.ProtoFooterMode.FOOTER_MODE_APPEND_INITIAL,
    ],
    ["append", Proto.ProtoFooterMode.FOOTER_MODE_APPEND],
    ["extend", Proto.ProtoFooterMode.FOOTER_MODE_EXTEND],
    ["replace", Proto.ProtoFooterMode.FOOTER_MODE_REPLACE],
  ] as const)("should map mode '%s' correctly", (mode, expected) => {
    const footer = new Footer("text", { mode });
    expect(footer.toDocFrame().footer?.mode).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// Link
// ---------------------------------------------------------------------------
describe("Link", () => {
  it("should store url from constructor", () => {
    const link = new Link("click here", "https://example.com");
    expect(link.props?.url).toBe("https://example.com");
  });

  it("should serialize url to DocFrame", () => {
    const link = new Link("text", "https://example.com");
    const df = link.toDocFrame();
    expect(df.link).toBeDefined();
    expect(df.link?.url).toBe("https://example.com");
    expect(df.children).toHaveLength(1);
  });

  it("should handle no url", () => {
    const link = new Link("text");
    const df = link.toDocFrame();
    expect(df.link).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Indentation
// ---------------------------------------------------------------------------
describe("Indentation", () => {
  it("should serialize left indentation as boxed measure", () => {
    const indent = new Indentation("content", {
      left: new AbsoluteMeasure(20, "pt"),
    });
    const df = indent.toDocFrame();
    expect(df.indentation).toBeDefined();
    expect(df.indentation?.left?.value?.value).toBe(20);
  });

  it("should serialize right indentation as boxed measure", () => {
    const indent = new Indentation("content", {
      right: new AbsoluteMeasure(15, "pt"),
    });
    const df = indent.toDocFrame();
    expect(df.indentation?.right?.value?.value).toBe(15);
  });

  it("should serialize uuid", () => {
    const indent = new Indentation("content", { uuid: "indent-1" });
    const df = indent.toDocFrame();
    expect(df.indentation?.uuid).toBe("indent-1");
  });

  it("should handle no properties", () => {
    const indent = new Indentation("content");
    const df = indent.toDocFrame();
    expect(df.indentation).toBeDefined();
    expect(df.children).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------
describe("Loop", () => {
  it("should serialize path and uuid", () => {
    const loop = new Loop("item template", {
      path: "data.items",
      uuid: "loop-1",
    });
    const df = loop.toDocFrame();
    expect(df.loop).toBeDefined();
    expect(df.loop?.path).toBe("data.items");
    expect(df.loop?.uuid).toBe("loop-1");
    expect(df.children).toHaveLength(1);
  });

  it("should handle no properties", () => {
    const loop = new Loop();
    const df = loop.toDocFrame();
    expect(df.loop).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// LoopEntry
// ---------------------------------------------------------------------------
describe("LoopEntry", () => {
  it("should serialize path, index, and uuid", () => {
    const entry = new LoopEntry("entry content", {
      path: "data.items[0]",
      index: 0,
      uuid: "entry-1",
    });
    const df = entry.toDocFrame();
    expect(df.loopEntry).toBeDefined();
    expect(df.loopEntry?.path).toBe("data.items[0]");
    expect(df.loopEntry?.index).toBe(0);
    expect(df.loopEntry?.uuid).toBe("entry-1");
  });

  it("should handle no properties", () => {
    const entry = new LoopEntry();
    const df = entry.toDocFrame();
    expect(df.loopEntry).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------
describe("Section", () => {
  it("should serialize uuid and cDefUuid", () => {
    const section = new Section("section content", {
      uuid: "sec-1",
      cDefUuid: "cdef-1",
    });
    const df = section.toDocFrame();
    expect(df.section).toBeDefined();
    expect(df.section?.uuid).toBe("sec-1");
    expect(df.section?.cDefUuid).toBe("cdef-1");
  });

  it("should handle no properties", () => {
    const section = new Section("content");
    const df = section.toDocFrame();
    expect(df.section).toBeDefined();
    expect(df.children).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Condition
// ---------------------------------------------------------------------------
describe("Condition", () => {
  it("should serialize all properties", () => {
    const cond = new Condition("conditional content", {
      uuid: "cond-1",
      code: "data.show === true",
      result: true,
      regenerate: false,
    });
    const df = cond.toDocFrame();
    expect(df.condition).toBeDefined();
    expect(df.condition?.uuid).toBe("cond-1");
    expect(df.condition?.code).toBe("data.show === true");
    expect(df.condition?.result).toBe(true);
    expect(df.condition?.regenerate).toBe(false);
  });

  it("should handle no properties", () => {
    const cond = new Condition("content");
    const df = cond.toDocFrame();
    expect(df.condition).toBeDefined();
    expect(df.children).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// PageCondition
// ---------------------------------------------------------------------------
describe("PageCondition", () => {
  it("should serialize uuid and code", () => {
    const pc = new PageCondition("page content", {
      uuid: "pcond-1",
      code: "pageNumber > 1",
    });
    const df = pc.toDocFrame();
    expect(df.pageCondition).toBeDefined();
    expect(df.pageCondition?.uuid).toBe("pcond-1");
    expect(df.pageCondition?.code).toBe("pageNumber > 1");
  });

  it("should handle no properties", () => {
    const pc = new PageCondition();
    const df = pc.toDocFrame();
    expect(df.pageCondition).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Selection
// ---------------------------------------------------------------------------
describe("Selection", () => {
  it("should serialize all properties", () => {
    const sel = new Selection(undefined, {
      uuid: "sel-1",
      internalName: "color-choice",
      name: "Color Choice",
      multi: true,
      min: 1,
      max: 3,
    });
    const df = sel.toDocFrame();
    expect(df.selection).toBeDefined();
    expect(df.selection?.uuid).toBe("sel-1");
    expect(df.selection?.internalName).toBe("color-choice");
    expect(df.selection?.name).toBe("Color Choice");
    expect(df.selection?.multi).toBe(true);
    expect(df.selection?.min).toBe(1);
    expect(df.selection?.max).toBe(3);
  });

  it("should handle no properties", () => {
    const sel = new Selection();
    const df = sel.toDocFrame();
    expect(df.selection).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// SelectionEntry
// ---------------------------------------------------------------------------
describe("SelectionEntry", () => {
  it("should serialize all properties", () => {
    const entry = new SelectionEntry("Red option", {
      uuid: "entry-1",
      internalName: "red",
      name: "Red",
      selected: true,
    });
    const df = entry.toDocFrame();
    expect(df.selectionEntry).toBeDefined();
    expect(df.selectionEntry?.uuid).toBe("entry-1");
    expect(df.selectionEntry?.internalName).toBe("red");
    expect(df.selectionEntry?.name).toBe("Red");
    expect(df.selectionEntry?.selected).toBe(true);
  });

  it("should handle unselected entry", () => {
    const entry = new SelectionEntry("Blue option", {
      internalName: "blue",
      selected: false,
    });
    const df = entry.toDocFrame();
    expect(df.selectionEntry?.selected).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Directory
// ---------------------------------------------------------------------------
describe("Directory", () => {
  it("should serialize name and editable", () => {
    const dir = new Directory("content", {
      name: "Chapter 1",
      editable: true,
    });
    const df = dir.toDocFrame();
    expect(df.directory).toBeDefined();
    expect(df.directory?.name).toBe("Chapter 1");
    expect(df.directory?.editable).toBe(true);
  });

  it.each([
    ["none", Proto.ProtoSemanticType.SEMANTIC_TYPE_NONE],
    ["part", Proto.ProtoSemanticType.SEMANTIC_TYPE_PART],
    ["art", Proto.ProtoSemanticType.SEMANTIC_TYPE_ART],
    ["sect", Proto.ProtoSemanticType.SEMANTIC_TYPE_SECT],
    ["div", Proto.ProtoSemanticType.SEMANTIC_TYPE_DIV],
  ] as const)(
    "should map semantic type '%s' correctly",
    (type, expected) => {
      const dir = new Directory("content", { semanticType: type });
      expect(dir.toDocFrame().directory?.semanticType).toBe(expected);
    },
  );

  it("should handle no properties", () => {
    const dir = new Directory("content");
    const df = dir.toDocFrame();
    expect(df.directory).toBeDefined();
    expect(df.children).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// WsArea
// ---------------------------------------------------------------------------
describe("WsArea", () => {
  it("should create with content and produce wsArea node", () => {
    const ws = new WsArea("protected content");
    const df = ws.toDocFrame();
    expect(df.wsArea).toBeDefined();
    expect(df.children).toHaveLength(1);
  });

  it("should create with no content", () => {
    const ws = new WsArea();
    const df = ws.toDocFrame();
    expect(df.wsArea).toBeDefined();
    expect(df.children).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// CarryOver
// ---------------------------------------------------------------------------
describe("CarryOver", () => {
  it("should create with content and produce carryOver node", () => {
    const co = new CarryOver("carry over content");
    const df = co.toDocFrame();
    expect(df.carryOver).toBeDefined();
    expect(df.children).toHaveLength(1);
  });

  it("should create with no content", () => {
    const co = new CarryOver();
    const df = co.toDocFrame();
    expect(df.carryOver).toBeDefined();
    expect(df.children).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// AdvancedIllustrationArea
// ---------------------------------------------------------------------------
describe("AdvancedIllustrationArea", () => {
  it("should serialize all properties", () => {
    const aia = new AdvancedIllustrationArea("illustration", {
      uuid: "aia-1",
      absolute: true,
      width: new AbsoluteMeasure(200, "pt"),
      height: new AbsoluteMeasure(150, "pt"),
      x: new AbsoluteMeasure(50, "pt"),
      y: new AbsoluteMeasure(100, "pt"),
      textFlow: "around",
      rotation: 15,
    });
    const df = aia.toDocFrame();
    expect(df.advancedIllustrationArea).toBeDefined();
    expect(df.advancedIllustrationArea?.uuid).toBe("aia-1");
    expect(df.advancedIllustrationArea?.absolute).toBe(true);
    expect(df.advancedIllustrationArea?.width?.value).toBe(200);
    expect(df.advancedIllustrationArea?.height?.value).toBe(150);
    expect(df.advancedIllustrationArea?.x?.value).toBe(50);
    expect(df.advancedIllustrationArea?.y?.value).toBe(100);
    expect(df.advancedIllustrationArea?.rotation).toBe(15);
  });

  it.each([
    [
      "around",
      Proto.ProtoAdvancedIllustrationAreaTextFlowType.AROUND,
    ],
    [
      "no-flow",
      Proto.ProtoAdvancedIllustrationAreaTextFlowType.NO_FLOW,
    ],
    [
      "foreground",
      Proto.ProtoAdvancedIllustrationAreaTextFlowType.FOREGROUND,
    ],
    [
      "background",
      Proto.ProtoAdvancedIllustrationAreaTextFlowType.BACKGROUND,
    ],
  ] as const)(
    "should map textFlow '%s' correctly",
    (textFlow, expected) => {
      const aia = new AdvancedIllustrationArea("content", { textFlow });
      expect(
        aia.toDocFrame().advancedIllustrationArea?.textFlow,
      ).toBe(expected);
    },
  );

  it("should handle no properties", () => {
    const aia = new AdvancedIllustrationArea();
    const df = aia.toDocFrame();
    expect(df.advancedIllustrationArea).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// AdjustHorizontally
// ---------------------------------------------------------------------------
describe("AdjustHorizontally", () => {
  it("should serialize minFontSize and maxFontSize", () => {
    const ah = new AdjustHorizontally("text", {
      minFontSize: new AbsoluteMeasure(8, "pt"),
      maxFontSize: new AbsoluteMeasure(14, "pt"),
    });
    const df = ah.toDocFrame();
    expect(df.adjustHorizontally).toBeDefined();
    expect(df.adjustHorizontally?.minFontSize?.value).toBe(8);
    expect(df.adjustHorizontally?.maxFontSize?.value).toBe(14);
  });

  it("should handle no properties", () => {
    const ah = new AdjustHorizontally("text");
    const df = ah.toDocFrame();
    expect(df.adjustHorizontally).toBeDefined();
    expect(df.children).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// SubTotal
// ---------------------------------------------------------------------------
describe("SubTotal", () => {
  it("should serialize all properties", () => {
    const st = new SubTotal("subtotal content", {
      applyImmediate: true,
      position: "above-footer",
      height: new AbsoluteMeasure(30, "pt"),
    });
    const df = st.toDocFrame();
    expect(df.subTotal).toBeDefined();
    expect(df.subTotal?.applyImmediate).toBe(true);
    expect(df.subTotal?.position).toBe(
      Proto.ProtoSubTotalPosition.POSITION_ABOVE_FOOTER,
    );
    expect(df.subTotal?.height?.value).toBe(30);
  });

  it("should map 'below-content' position", () => {
    const st = new SubTotal(undefined, { position: "below-content" });
    expect(st.toDocFrame().subTotal?.position).toBe(
      Proto.ProtoSubTotalPosition.POSITION_BELOW_CONTENT,
    );
  });

  it("should handle no properties", () => {
    const st = new SubTotal();
    const df = st.toDocFrame();
    expect(df.subTotal).toBeDefined();
  });
});
