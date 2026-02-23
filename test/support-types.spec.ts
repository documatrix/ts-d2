import { describe, it } from "vitest";
import Proto from "docframe-types";
import { Color, Colors } from "~/Color";
import { Measure, AbsoluteMeasure, SideMeasures } from "~/Measure";
import {
  HorizontalAlignment,
  VerticalAlignment,
  Alignment,
} from "~/Alignment";
import { Border, SideBorders } from "~/Border";
import { Font, StandardFonts } from "~/Font";
import { ParagraphFormat } from "~/ParagraphFormat";
import { PageDefinition, PageDefinitions } from "Content/PageDefinition";
import {
  ColumnDefinition,
  ColumnDefinitions,
  ColumnPosition,
} from "Content/ColumnDefinition";
import { referencePointToDocFrame } from "Content/ReferencePoint";

// ---------------------------------------------------------------------------
// Color
// ---------------------------------------------------------------------------
describe("Color", () => {
  describe("rgb", () => {
    it("should create an RGB color", () => {
      const color = Color.rgb(100, 150, 200);
      const df = color.toDocFrame();
      expect(df.type).toBe(Proto.ProtoColorType.RGB);
      expect(df.r).toBe(100);
      expect(df.g).toBe(150);
      expect(df.b).toBe(200);
    });

    it("should accept boundary values 0 and 255", () => {
      const black = Color.rgb(0, 0, 0);
      const white = Color.rgb(255, 255, 255);
      expect(black.toDocFrame().r).toBe(0);
      expect(white.toDocFrame().r).toBe(255);
    });

    it("should throw for invalid red value", () => {
      expect(() => Color.rgb(-1, 0, 0)).toThrow("Invalid red value");
      expect(() => Color.rgb(256, 0, 0)).toThrow("Invalid red value");
    });

    it("should throw for invalid green value", () => {
      expect(() => Color.rgb(0, -1, 0)).toThrow("Invalid green value");
      expect(() => Color.rgb(0, 256, 0)).toThrow("Invalid green value");
    });

    it("should throw for invalid blue value", () => {
      expect(() => Color.rgb(0, 0, -1)).toThrow("Invalid blue value");
      expect(() => Color.rgb(0, 0, 256)).toThrow("Invalid blue value");
    });
  });

  describe("cmyk", () => {
    it("should create a CMYK color", () => {
      const color = Color.cmyk(10, 20, 30, 40);
      const df = color.toDocFrame();
      expect(df.type).toBe(Proto.ProtoColorType.CMYK);
      expect(df.c).toBe(10);
      expect(df.m).toBe(20);
      expect(df.y).toBe(30);
      expect(df.k).toBe(40);
    });

    it("should accept boundary values 0 and 100", () => {
      const min = Color.cmyk(0, 0, 0, 0);
      const max = Color.cmyk(100, 100, 100, 100);
      expect(min.toDocFrame().c).toBe(0);
      expect(max.toDocFrame().c).toBe(100);
    });

    it("should throw for invalid cyan value", () => {
      expect(() => Color.cmyk(-1, 0, 0, 0)).toThrow("Invalid cyan value");
      expect(() => Color.cmyk(101, 0, 0, 0)).toThrow("Invalid cyan value");
    });

    it("should throw for invalid magenta value", () => {
      expect(() => Color.cmyk(0, -1, 0, 0)).toThrow("Invalid magenta value");
      expect(() => Color.cmyk(0, 101, 0, 0)).toThrow("Invalid magenta value");
    });

    it("should throw for invalid yellow value", () => {
      expect(() => Color.cmyk(0, 0, -1, 0)).toThrow("Invalid yellow value");
      expect(() => Color.cmyk(0, 0, 101, 0)).toThrow("Invalid yellow value");
    });

    it("should throw for invalid black value", () => {
      expect(() => Color.cmyk(0, 0, 0, -1)).toThrow("Invalid black value");
      expect(() => Color.cmyk(0, 0, 0, 101)).toThrow("Invalid black value");
    });
  });

  describe("fromHex", () => {
    it("should create a color from hex string with #", () => {
      const color = Color.fromHex("#ff8040");
      const df = color.toDocFrame();
      expect(df.type).toBe(Proto.ProtoColorType.RGB);
      expect(df.r).toBe(255);
      expect(df.g).toBe(128);
      expect(df.b).toBe(64);
    });

    it("should create a color from hex string without #", () => {
      const color = Color.fromHex("00ff00");
      const df = color.toDocFrame();
      expect(df.r).toBe(0);
      expect(df.g).toBe(255);
      expect(df.b).toBe(0);
    });

    it("should throw for invalid hex length", () => {
      expect(() => Color.fromHex("#fff")).toThrow("Invalid hex color");
      expect(() => Color.fromHex("abcdefg")).toThrow("Invalid hex color");
    });
  });

  describe("preset colors", () => {
    it("should have white as RGB(255,255,255)", () => {
      const df = Colors.white.toDocFrame();
      expect(df.type).toBe(Proto.ProtoColorType.RGB);
      expect(df.r).toBe(255);
      expect(df.g).toBe(255);
      expect(df.b).toBe(255);
    });

    it("should have black as CMYK(0,0,0,100)", () => {
      const df = Colors.black.toDocFrame();
      expect(df.type).toBe(Proto.ProtoColorType.CMYK);
      expect(df.k).toBe(100);
    });
  });
});

// ---------------------------------------------------------------------------
// Measure
// ---------------------------------------------------------------------------
describe("Measure", () => {
  it("should store value and unit", () => {
    const m = new Measure(10, "cm");
    expect(m.value).toBe(10);
    expect(m.unit).toBe("cm");
  });

  it.each([
    ["pt", Proto.ProtoMeasureType.PT],
    ["cm", Proto.ProtoMeasureType.CM],
    ["mm", Proto.ProtoMeasureType.MM],
    ["in", Proto.ProtoMeasureType.IN],
    ["px", Proto.ProtoMeasureType.PX],
    ["%", Proto.ProtoMeasureType.PERCENT],
  ] as const)("should convert unit '%s' to DocFrame", (unit, expected) => {
    const m = new Measure(42, unit);
    const df = m.toDocFrame();
    expect(df.value).toBe(42);
    expect(df.mtype).toBe(expected);
  });

  it("should provide Measure.zero as 0 pt", () => {
    expect(Measure.zero.value).toBe(0);
    expect(Measure.zero.unit).toBe("pt");
  });
});

describe("AbsoluteMeasure", () => {
  it("should be a Measure with absolute unit", () => {
    const m = new AbsoluteMeasure(12, "pt");
    expect(m).toBeInstanceOf(Measure);
    expect(m.value).toBe(12);
    expect(m.unit).toBe("pt");
  });

  it("should convert to DocFrame correctly", () => {
    const m = new AbsoluteMeasure(25.4, "mm");
    const df = m.toDocFrame();
    expect(df.value).toBe(25.4);
    expect(df.mtype).toBe(Proto.ProtoMeasureType.MM);
  });
});

describe("SideMeasures", () => {
  it("should convert all four sides to DocFrame", () => {
    const sm = new SideMeasures({
      top: new AbsoluteMeasure(1, "pt"),
      right: new AbsoluteMeasure(2, "pt"),
      bottom: new AbsoluteMeasure(3, "pt"),
      left: new AbsoluteMeasure(4, "pt"),
    });
    const df = sm.toDocFrame();
    expect(df.top?.value).toBe(1);
    expect(df.right?.value).toBe(2);
    expect(df.bottom?.value).toBe(3);
    expect(df.left?.value).toBe(4);
  });

  it("should handle partial sides", () => {
    const sm = new SideMeasures({
      top: new AbsoluteMeasure(5, "pt"),
    });
    const df = sm.toDocFrame();
    expect(df.top?.value).toBe(5);
    expect(df.right).toBeFalsy();
    expect(df.bottom).toBeFalsy();
    expect(df.left).toBeFalsy();
  });
});

// ---------------------------------------------------------------------------
// Alignment
// ---------------------------------------------------------------------------
describe("Alignment", () => {
  describe("HorizontalAlignment", () => {
    it("should wrap a proto value and convert back", () => {
      const align = new HorizontalAlignment(
        Proto.ProtoHorizontalAlignment.ALIGN_CENTER,
      );
      expect(align.toDocFrame()).toBe(
        Proto.ProtoHorizontalAlignment.ALIGN_CENTER,
      );
    });
  });

  describe("VerticalAlignment", () => {
    it("should wrap a proto value and convert back", () => {
      const align = new VerticalAlignment(Proto.ProtoVerticalAlignment.MIDDLE);
      expect(align.toDocFrame()).toBe(Proto.ProtoVerticalAlignment.MIDDLE);
    });
  });

  describe("predefined alignments", () => {
    it("should provide horizontal presets", () => {
      expect(Alignment.Horizontal.Left.toDocFrame()).toBe(
        Proto.ProtoHorizontalAlignment.ALIGN_LEFT,
      );
      expect(Alignment.Horizontal.Center.toDocFrame()).toBe(
        Proto.ProtoHorizontalAlignment.ALIGN_CENTER,
      );
      expect(Alignment.Horizontal.Right.toDocFrame()).toBe(
        Proto.ProtoHorizontalAlignment.ALIGN_RIGHT,
      );
      expect(Alignment.Horizontal.Justify.toDocFrame()).toBe(
        Proto.ProtoHorizontalAlignment.ALIGN_JUSTIFY,
      );
      expect(Alignment.Horizontal.FullJustify.toDocFrame()).toBe(
        Proto.ProtoHorizontalAlignment.ALIGN_FULL_JUSTIFY,
      );
    });

    it("should provide vertical presets", () => {
      expect(Alignment.Vertical.Top.toDocFrame()).toBe(
        Proto.ProtoVerticalAlignment.TOP,
      );
      expect(Alignment.Vertical.Middle.toDocFrame()).toBe(
        Proto.ProtoVerticalAlignment.MIDDLE,
      );
      expect(Alignment.Vertical.Bottom.toDocFrame()).toBe(
        Proto.ProtoVerticalAlignment.BOTTOM,
      );
    });
  });
});

// ---------------------------------------------------------------------------
// Border
// ---------------------------------------------------------------------------
describe("Border", () => {
  it("should store width and color and convert to DocFrame", () => {
    const border = new Border(
      new AbsoluteMeasure(1, "pt"),
      Color.rgb(0, 0, 0),
    );
    const df = border.toDocFrame();
    expect(df.weight?.value).toBe(1);
    expect(df.color?.r).toBe(0);
  });
});

describe("SideBorders", () => {
  it("should convert all four sides to DocFrame", () => {
    const b = new Border(new AbsoluteMeasure(1, "pt"), Color.rgb(0, 0, 0));
    const sb = new SideBorders({ top: b, right: b, bottom: b, left: b });
    const df = sb.toDocFrame();
    expect(df.top).toBeDefined();
    expect(df.right).toBeDefined();
    expect(df.bottom).toBeDefined();
    expect(df.left).toBeDefined();
  });

  it("should handle partial borders", () => {
    const b = new Border(new AbsoluteMeasure(2, "pt"), Color.rgb(255, 0, 0));
    const sb = new SideBorders({ top: b });
    const df = sb.toDocFrame();
    expect(df.top).toBeDefined();
    expect(df.right).toBeFalsy();
  });
});

// ---------------------------------------------------------------------------
// Font
// ---------------------------------------------------------------------------
describe("Font", () => {
  it("should create a font with a name", () => {
    const font = new Font("arial");
    const df = font.toDocFrame();
    expect(df.name).toBe("arial");
  });

  it("should provide StandardFonts.Helvetica", () => {
    const df = StandardFonts.Helvetica.toDocFrame();
    expect(df.name).toBe("helvetica");
  });
});

// ---------------------------------------------------------------------------
// ParagraphFormat
// ---------------------------------------------------------------------------
describe("ParagraphFormat", () => {
  it("should auto-generate a name if none provided", () => {
    const pf = new ParagraphFormat({});
    expect(pf.props.name).toBeDefined();
    expect(pf.props.name!.length).toBeGreaterThan(0);
  });

  it("should use the provided name", () => {
    const pf = new ParagraphFormat({ name: "Heading" });
    expect(pf.props.name).toBe("Heading");
  });

  it("should serialize basic properties to DocFrame", () => {
    const pf = new ParagraphFormat({
      name: "Body",
      default: true,
      font: StandardFonts.Helvetica,
      fontSize: new AbsoluteMeasure(12, "pt"),
      lineFeed: new AbsoluteMeasure(14, "pt"),
      bold: true,
      italic: false,
    });
    const df = pf.toDocFrame();
    expect(df.name?.value).toBe("Body");
    expect(df.default?.value).toBe(true);
    expect(df.font?.value?.name).toBe("helvetica");
    expect(df.fontSize?.value?.value).toBe(12);
    expect(df.lineFeed?.value?.value).toBe(14);
    expect(df.bold?.value).toBe(true);
    expect(df.italic?.value).toBe(false);
  });

  it("should serialize alignment to DocFrame", () => {
    const pf = new ParagraphFormat({
      alignment: Alignment.Horizontal.Center,
    });
    const df = pf.toDocFrame();
    expect(df.alignment?.value).toBe(
      Proto.ProtoHorizontalAlignment.ALIGN_CENTER,
    );
  });

  it("should serialize spacing properties to DocFrame", () => {
    const pf = new ParagraphFormat({
      spaceAbove: new AbsoluteMeasure(6, "pt"),
      spaceBelow: new AbsoluteMeasure(3, "pt"),
    });
    const df = pf.toDocFrame();
    expect(df.spaceAbove?.value?.value).toBe(6);
    expect(df.spaceBelow?.value?.value).toBe(3);
  });

  it("should serialize indention properties to DocFrame", () => {
    const pf = new ParagraphFormat({
      indentionLevel: 2,
      indentionWidth: new AbsoluteMeasure(20, "pt"),
    });
    const df = pf.toDocFrame();
    expect(df.indentionLevel?.value).toBe(2);
    expect(df.indentionWidth?.value?.value).toBe(20);
  });

  it("should omit undefined optional properties", () => {
    const pf = new ParagraphFormat({ name: "Minimal" });
    const df = pf.toDocFrame();
    expect(df.font).toBeFalsy();
    expect(df.fontSize).toBeFalsy();
    expect(df.bold).toBeFalsy();
    expect(df.italic).toBeFalsy();
    expect(df.alignment).toBeFalsy();
    expect(df.spaceAbove).toBeFalsy();
    expect(df.spaceBelow).toBeFalsy();
  });
});

// ---------------------------------------------------------------------------
// PageDefinition
// ---------------------------------------------------------------------------
describe("PageDefinition", () => {
  it("should create a page definition with width and height", () => {
    const pd = new PageDefinition(
      new AbsoluteMeasure(100, "mm"),
      new AbsoluteMeasure(200, "mm"),
    );
    expect(pd.width?.value).toBe(100);
    expect(pd.height?.value).toBe(200);
    expect(pd.uuid).toBeDefined();
  });

  it("should auto-generate a UUID", () => {
    const pd1 = new PageDefinition();
    const pd2 = new PageDefinition();
    expect(pd1.uuid).toBeDefined();
    expect(pd2.uuid).toBeDefined();
    expect(pd1.uuid).not.toBe(pd2.uuid);
  });

  it("should convert to DocFrame with correct dimensions", () => {
    const pd = new PageDefinition(
      new AbsoluteMeasure(210, "mm"),
      new AbsoluteMeasure(297, "mm"),
    );
    const df = pd.toDocFrame();
    expect(df.pageWidth?.value?.value).toBe(210);
    expect(df.pageDepth?.value?.value).toBe(297);
    expect(df.Uuid).toBe(pd.uuid);
  });

  describe("predefined sizes", () => {
    it("should have A3 (297x420mm)", () => {
      expect(PageDefinitions.A3.width?.value).toBe(297);
      expect(PageDefinitions.A3.height?.value).toBe(420);
    });

    it("should have A4 (210x297mm)", () => {
      expect(PageDefinitions.A4.width?.value).toBe(210);
      expect(PageDefinitions.A4.height?.value).toBe(297);
    });

    it("should have A5 (148x210mm)", () => {
      expect(PageDefinitions.A5.width?.value).toBe(148);
      expect(PageDefinitions.A5.height?.value).toBe(210);
    });
  });
});

// ---------------------------------------------------------------------------
// ColumnDefinition
// ---------------------------------------------------------------------------
describe("ColumnDefinition", () => {
  it("should create a column definition with properties", () => {
    const cd = new ColumnDefinition({
      width: new AbsoluteMeasure(400, "pt"),
      position: ColumnPosition.Center,
      positionOffset: new AbsoluteMeasure(50, "pt"),
      interColumnSpace: new AbsoluteMeasure(20, "pt"),
    });
    expect(cd.uuid).toBeDefined();
    expect(cd.props.width.value).toBe(400);
  });

  it("should convert to DocFrame without applyImmediate", () => {
    const cd = new ColumnDefinition({
      width: new AbsoluteMeasure(400, "pt"),
      position: ColumnPosition.Left,
      positionOffset: new AbsoluteMeasure(70, "pt"),
      interColumnSpace: new AbsoluteMeasure(30, "pt"),
    });
    const nodes = cd.toDocFrame(false);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].cDef).toBeDefined();
    expect(nodes[0].cDef?.Uuid).toBe(cd.uuid);
  });

  it("should convert to DocFrame with applyImmediate", () => {
    const cd = new ColumnDefinition({
      width: new AbsoluteMeasure(400, "pt"),
      position: ColumnPosition.Left,
      positionOffset: new AbsoluteMeasure(70, "pt"),
      interColumnSpace: new AbsoluteMeasure(30, "pt"),
    });
    const nodes = cd.toDocFrame(true);
    expect(nodes).toHaveLength(2);
    expect(nodes[0].cDef).toBeDefined();
    expect(nodes[1].applyCDef).toBeDefined();
    expect(nodes[1].applyCDef?.cDefUuid).toBe(cd.uuid);
  });

  describe("predefined definitions", () => {
    it("should have A4 Single column", () => {
      expect(ColumnDefinitions.A4.Single.props.width.value).toBe(490);
    });

    it("should have A4 Double column", () => {
      expect(ColumnDefinitions.A4.Double.props.width.value).toBe(230);
    });
  });
});

// ---------------------------------------------------------------------------
// ColumnPosition
// ---------------------------------------------------------------------------
describe("ColumnPosition", () => {
  it.each([
    ["Center", ColumnPosition.Center, Proto.ProtoPositionMode.CENTER],
    ["Left", ColumnPosition.Left, Proto.ProtoPositionMode.LEFT],
    ["Folio", ColumnPosition.Folio, Proto.ProtoPositionMode.FOLIO],
    ["Right", ColumnPosition.Right, Proto.ProtoPositionMode.RIGHT],
    [
      "ReverseFolio",
      ColumnPosition.ReverseFolio,
      Proto.ProtoPositionMode.REVERSE_FOLIO,
    ],
  ] as const)("should map %s to correct proto value", (_name, pos, expected) => {
    expect(pos.toDocFrame()).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// ReferencePoint
// ---------------------------------------------------------------------------
describe("referencePointToDocFrame", () => {
  it.each([
    ["top-left", Proto.ProtoImageReferencePoint.REF_POINT_TOP_LEFT],
    ["top-right", Proto.ProtoImageReferencePoint.REF_POINT_TOP_RIGHT],
    ["center", Proto.ProtoImageReferencePoint.REF_POINT_CENTER],
    ["bottom-left", Proto.ProtoImageReferencePoint.REF_POINT_BOTTOM_LEFT],
    ["bottom-right", Proto.ProtoImageReferencePoint.REF_POINT_BOTTOM_RIGHT],
  ] as const)("should map '%s' to correct proto value", (point, expected) => {
    expect(referencePointToDocFrame(point)).toBe(expected);
  });

  it("should throw for unknown reference point", () => {
    expect(() =>
      referencePointToDocFrame("invalid" as any),
    ).toThrow("Unknown reference point");
  });
});
