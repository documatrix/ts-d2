import Proto from "docframe-types";

import { DocumentElement } from "content/DocumentElement";
import { Measure } from "~/Measure";
import { Color } from "~/Color";

export type RuleStyle =
  | "solid"
  | "sparse-shading"
  | "medium-shading"
  | "dense-shading"
  | "light-dotted"
  | "medium-dotted"
  | "heavy-dotted"
  | "light-dashed"
  | "medium-dashed"
  | "heavy-dashed"
  | "dash-pattern"
  | "double";

function ruleStyleToDocFrame(style: RuleStyle): Proto.ProtoRuleStyle {
  switch (style) {
    case "solid":
      return Proto.ProtoRuleStyle.SOLID;
    case "sparse-shading":
      return Proto.ProtoRuleStyle.SPARSE_SHADING;
    case "medium-shading":
      return Proto.ProtoRuleStyle.MEDIUM_SHADING;
    case "dense-shading":
      return Proto.ProtoRuleStyle.DENSE_SHADING;
    case "light-dotted":
      return Proto.ProtoRuleStyle.LIGHT_DOTTED;
    case "medium-dotted":
      return Proto.ProtoRuleStyle.MEDIUM_DOTTED;
    case "heavy-dotted":
      return Proto.ProtoRuleStyle.HEAVY_DOTTED;
    case "light-dashed":
      return Proto.ProtoRuleStyle.LIGHT_DASHED;
    case "medium-dashed":
      return Proto.ProtoRuleStyle.MEDIUM_DASHED;
    case "heavy-dashed":
      return Proto.ProtoRuleStyle.HEAVY_DASHED;
    case "dash-pattern":
      return Proto.ProtoRuleStyle.DASH_PATTERN;
    case "double":
      return Proto.ProtoRuleStyle.DOUBLE;
    default:
      throw new Error(`Unknown rule style: ${style}`);
  }
}

export type RuleMode = "normal" | "boundary";

function ruleModeToDocFrame(mode: RuleMode): Proto.ProtoRuleMode {
  switch (mode) {
    case "normal":
      return Proto.ProtoRuleMode.NORMAL;
    case "boundary":
      return Proto.ProtoRuleMode.BOUNDARY;
    default:
      throw new Error(`Unknown rule mode: ${mode}`);
  }
}

export interface RuleBoundaries {
  start?: Measure;
  end?: Measure;
}

export interface RuleProperties {
  /** Horizontal offset */
  xOffset?: Measure;
  /** Vertical offset */
  yOffset?: Measure;
  /** Width of the rule */
  width?: Measure;
  /** Thickness of the rule line */
  thickness?: Measure;
  /** Rotation in degrees */
  rotation?: number;
  /** Rule color */
  color?: Color;
  /** Rule style (solid, dashed, dotted, etc.) */
  style?: RuleStyle;
  /** Rule mode */
  mode?: RuleMode;
  /** Rule boundaries for boundary mode */
  boundaries?: RuleBoundaries;
}

export class Rule extends DocumentElement {
  props: RuleProperties;

  constructor(props: RuleProperties) {
    super();
    this.props = props;
  }

  public toDocFrame(): Proto.Node {
    const rule: Proto.IProtoRule = {
      xOffset: this.props.xOffset?.toDocFrame(),
      yOffset: this.props.yOffset?.toDocFrame(),
      width: this.props.width?.toDocFrame(),
      thickness: this.props.thickness?.toDocFrame(),
      rotation: this.props.rotation,
      color: this.props.color?.toDocFrame(),
    };

    if (this.props.style) {
      rule.style = ruleStyleToDocFrame(this.props.style);
    }

    if (this.props.mode) {
      rule.mode = ruleModeToDocFrame(this.props.mode);
    }

    if (this.props.boundaries) {
      rule.boundaries = Proto.ProtoRuleBoundaries.create({
        start: this.props.boundaries.start?.toDocFrame(),
        end: this.props.boundaries.end?.toDocFrame(),
      });
    }

    return Proto.Node.create({
      rule: Proto.ProtoRule.create(rule),
    });
  }
}
