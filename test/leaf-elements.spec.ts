import { describe, it } from "vitest";
import Proto from "docframe-types";
import { Text } from "Content/Text";
import { Linebreak } from "Content/Linebreak";
import { Pagebreak } from "Content/Pagebreak";
import { SpaceVertically } from "Content/SpaceVertically";
import { Rule } from "Content/Rule";
import { Image } from "Content/Image";
import { Variable } from "Content/Variable";
import { Barcode } from "Content/Barcode";
import { Tag } from "Content/Tag";
import { Formatted } from "Content/Formatted";
import { AbsoluteMeasure, Measure } from "~/Measure";
import { Color } from "~/Color";

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------
describe("Text", () => {
  it("should store the content string", () => {
    const text = new Text("hello");
    expect(text.content).toBe("hello");
  });

  it("should produce a DocFrame node with text content", () => {
    const text = new Text("world");
    const df = text.toDocFrame();
    expect(df.text).toBeDefined();
    expect(df.text?.content).toBe("world");
  });

  it("should handle empty string", () => {
    const text = new Text("");
    expect(text.content).toBe("");
    expect(text.toDocFrame().text?.content).toBe("");
  });
});

// ---------------------------------------------------------------------------
// Linebreak
// ---------------------------------------------------------------------------
describe("Linebreak", () => {
  it("should produce a DocFrame node with linebreak", () => {
    const lb = new Linebreak();
    const df = lb.toDocFrame();
    expect(df.linebreak).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Pagebreak
// ---------------------------------------------------------------------------
describe("Pagebreak", () => {
  it("should produce a DocFrame node with newPage", () => {
    const pb = new Pagebreak();
    const df = pb.toDocFrame();
    expect(df.newPage).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// SpaceVertically
// ---------------------------------------------------------------------------
describe("SpaceVertically", () => {
  it("should store the space measure", () => {
    const space = new AbsoluteMeasure(20, "pt");
    const sv = new SpaceVertically(space);
    expect(sv.space).toBe(space);
  });

  it("should produce a DocFrame node with spaceVertically", () => {
    const sv = new SpaceVertically(new AbsoluteMeasure(10, "mm"));
    const df = sv.toDocFrame();
    expect(df.spaceVertically).toBeDefined();
    expect(df.spaceVertically?.space?.value).toBe(10);
    expect(df.spaceVertically?.space?.mtype).toBe(Proto.ProtoMeasureType.MM);
  });
});

// ---------------------------------------------------------------------------
// Rule
// ---------------------------------------------------------------------------
describe("Rule", () => {
  it("should store properties", () => {
    const rule = new Rule({
      width: new Measure(100, "%"),
      thickness: new AbsoluteMeasure(1, "pt"),
    });
    expect(rule.props.width?.value).toBe(100);
    expect(rule.props.thickness?.value).toBe(1);
  });

  it("should produce a DocFrame node with basic rule properties", () => {
    const rule = new Rule({
      xOffset: new AbsoluteMeasure(5, "pt"),
      yOffset: new AbsoluteMeasure(10, "pt"),
      width: new Measure(100, "%"),
      thickness: new AbsoluteMeasure(2, "pt"),
      rotation: 45,
      color: Color.rgb(255, 0, 0),
    });
    const df = rule.toDocFrame();
    expect(df.rule).toBeDefined();
    expect(df.rule?.xOffset?.value).toBe(5);
    expect(df.rule?.yOffset?.value).toBe(10);
    expect(df.rule?.width?.value).toBe(100);
    expect(df.rule?.thickness?.value).toBe(2);
    expect(df.rule?.rotation).toBe(45);
    expect(df.rule?.color?.r).toBe(255);
  });

  it("should map rule styles correctly", () => {
    const styles: Array<[string, number]> = [
      ["solid", Proto.ProtoRuleStyle.SOLID],
      ["sparse-shading", Proto.ProtoRuleStyle.SPARSE_SHADING],
      ["medium-shading", Proto.ProtoRuleStyle.MEDIUM_SHADING],
      ["dense-shading", Proto.ProtoRuleStyle.DENSE_SHADING],
      ["light-dotted", Proto.ProtoRuleStyle.LIGHT_DOTTED],
      ["medium-dotted", Proto.ProtoRuleStyle.MEDIUM_DOTTED],
      ["heavy-dotted", Proto.ProtoRuleStyle.HEAVY_DOTTED],
      ["light-dashed", Proto.ProtoRuleStyle.LIGHT_DASHED],
      ["medium-dashed", Proto.ProtoRuleStyle.MEDIUM_DASHED],
      ["heavy-dashed", Proto.ProtoRuleStyle.HEAVY_DASHED],
      ["dash-pattern", Proto.ProtoRuleStyle.DASH_PATTERN],
      ["double", Proto.ProtoRuleStyle.DOUBLE],
    ];
    for (const [style, expected] of styles) {
      const rule = new Rule({ style: style as any });
      const df = rule.toDocFrame();
      expect(df.rule?.style).toBe(expected);
    }
  });

  it("should map rule modes correctly", () => {
    const normalRule = new Rule({ mode: "normal" });
    expect(normalRule.toDocFrame().rule?.mode).toBe(
      Proto.ProtoRuleMode.NORMAL,
    );

    const boundaryRule = new Rule({ mode: "boundary" });
    expect(boundaryRule.toDocFrame().rule?.mode).toBe(
      Proto.ProtoRuleMode.BOUNDARY,
    );
  });

  it("should serialize boundaries", () => {
    const rule = new Rule({
      boundaries: {
        start: new AbsoluteMeasure(10, "pt"),
        end: new AbsoluteMeasure(90, "pt"),
      },
    });
    const df = rule.toDocFrame();
    expect(df.rule?.boundaries).toBeDefined();
    expect(df.rule?.boundaries?.start?.value).toBe(10);
    expect(df.rule?.boundaries?.end?.value).toBe(90);
  });

  it("should handle minimal properties", () => {
    const rule = new Rule({});
    const df = rule.toDocFrame();
    expect(df.rule).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Image
// ---------------------------------------------------------------------------
describe("Image", () => {
  it("should store properties", () => {
    const img = new Image({ src: "logo.png", alt: "Logo" });
    expect(img.props.src).toBe("logo.png");
    expect(img.props.alt).toBe("Logo");
  });

  it("should serialize basic string properties", () => {
    const img = new Image({
      src: "photo.jpg",
      alt: "Photo",
      name: "photo1",
      filename: "photo.jpg",
      hyperlink: "https://example.com",
      uuid: "test-uuid",
      imageContent: "base64data",
    });
    const df = img.toDocFrame();
    expect(df.image?.src).toBe("photo.jpg");
    expect(df.image?.alt).toBe("Photo");
    expect(df.image?.name).toBe("photo1");
    expect(df.image?.filename).toBe("photo.jpg");
    expect(df.image?.hyperlink).toBe("https://example.com");
    expect(df.image?.uuid).toBe("test-uuid");
    expect(df.image?.imageContent).toBe("base64data");
  });

  it("should serialize scale as boxed double", () => {
    const img = new Image({ scale: 0.5 });
    const df = img.toDocFrame();
    expect(df.image?.scale?.value).toBe(0.5);
    expect(df.image?.scale?.isNull).toBe(false);
  });

  it("should serialize columnScale as boxed double", () => {
    const img = new Image({ columnScale: 0.75 });
    const df = img.toDocFrame();
    expect(df.image?.columnScale?.value).toBe(0.75);
  });

  it("should serialize dimensions as boxed measures", () => {
    const img = new Image({
      width: new AbsoluteMeasure(200, "pt"),
      height: new AbsoluteMeasure(100, "pt"),
      x: new AbsoluteMeasure(50, "pt"),
      y: new AbsoluteMeasure(60, "pt"),
    });
    const df = img.toDocFrame();
    expect(df.image?.width?.value?.value).toBe(200);
    expect(df.image?.height?.value?.value).toBe(100);
    expect(df.image?.x?.value?.value).toBe(50);
    expect(df.image?.y?.value?.value).toBe(60);
  });

  it("should serialize positionAbsolute as boxed bool", () => {
    const img = new Image({ positionAbsolute: true });
    const df = img.toDocFrame();
    expect(df.image?.positionAbsolute?.value).toBe(true);
  });

  it("should serialize rotation", () => {
    const img = new Image({ rotation: 90 });
    const df = img.toDocFrame();
    expect(df.image?.rotation).toBe(90);
  });

  it("should serialize flip settings", () => {
    const img = new Image({ flip: { x: true, y: false } });
    const df = img.toDocFrame();
    expect(df.image?.flipSettings?.x).toBe(true);
    expect(df.image?.flipSettings?.y).toBe(false);
  });

  it("should serialize crop settings", () => {
    const img = new Image({
      crop: {
        x: new AbsoluteMeasure(10, "pt"),
        y: new AbsoluteMeasure(20, "pt"),
        width: new AbsoluteMeasure(100, "pt"),
        height: new AbsoluteMeasure(80, "pt"),
      },
    });
    const df = img.toDocFrame();
    expect(df.image?.cropSettings?.x?.value?.value).toBe(10);
    expect(df.image?.cropSettings?.y?.value?.value).toBe(20);
    expect(df.image?.cropSettings?.width?.value?.value).toBe(100);
    expect(df.image?.cropSettings?.height?.value?.value).toBe(80);
  });

  it("should serialize reference point", () => {
    const img = new Image({ referencePoint: "center" });
    const df = img.toDocFrame();
    expect(df.image?.referencePoint).toBe(
      Proto.ProtoImageReferencePoint.REF_POINT_CENTER,
    );
  });

  it("should serialize scale type", () => {
    const types: Array<[string, number]> = [
      ["relative", Proto.ProtoImageScaleType.IMAGE_SCALE_TYPE_RELATIVE],
      ["absolute", Proto.ProtoImageScaleType.IMAGE_SCALE_TYPE_ABSOLUTE],
      [
        "relative-to-column",
        Proto.ProtoImageScaleType.IMAGE_SCALE_TYPE_RELATIVE_TO_COLUMN,
      ],
    ];
    for (const [type, expected] of types) {
      const img = new Image({ scaleType: type as any });
      expect(img.toDocFrame().image?.scaleType).toBe(expected);
    }
  });

  it("should handle empty properties", () => {
    const img = new Image({});
    const df = img.toDocFrame();
    expect(df.image).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Variable
// ---------------------------------------------------------------------------
describe("Variable", () => {
  it("should store properties", () => {
    const v = new Variable({ path: "data.name", content: "fallback" });
    expect(v.props.path).toBe("data.name");
    expect(v.props.content).toBe("fallback");
  });

  it("should serialize basic properties to DocFrame", () => {
    const v = new Variable({
      path: "item.price",
      content: "N/A",
      formatUuid: "fmt-1",
      uuid: "var-1",
    });
    const df = v.toDocFrame();
    expect(df.variable?.path).toBe("item.price");
    expect(df.variable?.content).toBe("N/A");
    expect(df.variable?.formatUuid).toBe("fmt-1");
    expect(df.variable?.uuid).toBe("var-1");
  });

  it("should map all special types correctly", () => {
    const types: Array<[string, number]> = [
      ["table-number", Proto.ProtoVariableSpecialType.TABLE_NUMBER],
      ["doc-page-count", Proto.ProtoVariableSpecialType.DOC_PAGE_COUNT],
      ["doc-cur-page", Proto.ProtoVariableSpecialType.DOC_CUR_PAGE],
      ["cur-page", Proto.ProtoVariableSpecialType.CUR_PAGE],
      ["page-count", Proto.ProtoVariableSpecialType.PAGE_COUNT],
      ["prev-page", Proto.ProtoVariableSpecialType.PREV_PAGE],
      ["section-page", Proto.ProtoVariableSpecialType.SECTION_PAGE],
      ["updated-at", Proto.ProtoVariableSpecialType.UPDATED_AT],
      ["generated-at", Proto.ProtoVariableSpecialType.GENERATED_AT],
    ];
    for (const [type, expected] of types) {
      const v = new Variable({ specialType: type as any });
      expect(v.toDocFrame().variable?.specialType).toBe(expected);
    }
  });

  it("should omit specialType when not set", () => {
    const v = new Variable({ path: "test" });
    const df = v.toDocFrame();
    // specialType should be default/falsy when not explicitly set
    expect(df.variable?.specialType).toBeFalsy();
  });
});

// ---------------------------------------------------------------------------
// Barcode
// ---------------------------------------------------------------------------
describe("Barcode", () => {
  const defaultBarcodeProps = {
    type: Proto.ProtoBarcodeType.QR,
    x: new AbsoluteMeasure(100, "pt"),
    y: new AbsoluteMeasure(200, "pt"),
    referencePoint: "top-left" as const,
    rotation: 0,
    width: new AbsoluteMeasure(50, "pt"),
    height: new AbsoluteMeasure(50, "pt"),
    data: "https://example.com",
    positionAbsolute: true,
  };

  it("should store properties", () => {
    const bc = new Barcode(defaultBarcodeProps);
    expect(bc.props.data).toBe("https://example.com");
    expect(bc.props.type).toBe(Proto.ProtoBarcodeType.QR);
  });

  it("should serialize to DocFrame with all required fields", () => {
    const bc = new Barcode(defaultBarcodeProps);
    const df = bc.toDocFrame();
    expect(df.barcode).toBeDefined();
    expect(df.barcode?.type).toBe(defaultBarcodeProps.type);
    expect(df.barcode?.x?.value).toBe(100);
    expect(df.barcode?.y?.value).toBe(200);
    expect(df.barcode?.width?.value).toBe(50);
    expect(df.barcode?.height?.value).toBe(50);
    expect(df.barcode?.data).toBe("https://example.com");
    expect(df.barcode?.positionAbsolute).toBe(true);
    expect(df.barcode?.referencePoint).toBe(
      Proto.ProtoImageReferencePoint.REF_POINT_TOP_LEFT,
    );
  });

  it("should serialize optional fields", () => {
    const bc = new Barcode({
      ...defaultBarcodeProps,
      padding: new AbsoluteMeasure(5, "pt"),
      code: "CODE128",
      altText: "Barcode alt",
      uuid: "bc-uuid",
    });
    const df = bc.toDocFrame();
    expect(df.barcode?.padding?.value).toBe(5);
    expect(df.barcode?.code).toBe("CODE128");
    expect(df.barcode?.altText).toBe("Barcode alt");
    expect(df.barcode?.uuid).toBe("bc-uuid");
  });

  it("should default padding to Measure.zero when not provided", () => {
    const bc = new Barcode(defaultBarcodeProps);
    const df = bc.toDocFrame();
    expect(df.barcode?.padding?.value).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Tag
// ---------------------------------------------------------------------------
describe("Tag", () => {
  it("should store properties", () => {
    const tag = new Tag({ name: "myTag" });
    expect(tag.props.name).toBe("myTag");
  });

  it("should serialize to DocFrame with all properties", () => {
    const tag = new Tag({
      name: "pageTag",
      uuid: "tag-1",
      params: ["param1", "param2"],
      nameCode: "getTagName()",
      codeMode: true,
    });
    const df = tag.toDocFrame();
    expect(df.tag).toBeDefined();
    expect(df.tag?.name).toBe("pageTag");
    expect(df.tag?.uuid).toBe("tag-1");
    expect(df.tag?.params).toEqual(["param1", "param2"]);
    expect(df.tag?.nameCode).toBe("getTagName()");
    expect(df.tag?.codeMode).toBe(true);
  });

  it("should handle minimal properties", () => {
    const tag = new Tag({ name: "simple" });
    const df = tag.toDocFrame();
    expect(df.tag?.name).toBe("simple");
  });
});

// ---------------------------------------------------------------------------
// Formatted
// ---------------------------------------------------------------------------
describe("Formatted", () => {
  it("should store doctype and html content", () => {
    const f = new Formatted("doctype content", "<p>html</p>");
    expect(f.content.doctype).toBe("doctype content");
    expect(f.content.html).toBe("<p>html</p>");
  });

  it("should serialize to DocFrame with both content types", () => {
    const f = new Formatted("doctype", "<b>bold</b>");
    const df = f.toDocFrame();
    expect(df.formatted).toBeDefined();
    expect(df.formatted?.doctypeContent).toBe("doctype");
    expect(df.formatted?.htmlContent).toBe("<b>bold</b>");
  });

  it("should handle undefined doctype content", () => {
    const f = new Formatted(undefined, "<p>only html</p>");
    expect(f.content.doctype).toBeUndefined();
    expect(f.content.html).toBe("<p>only html</p>");
  });

  it("should handle only doctype content", () => {
    const f = new Formatted("only doctype");
    expect(f.content.doctype).toBe("only doctype");
    expect(f.content.html).toBeUndefined();
  });
});
