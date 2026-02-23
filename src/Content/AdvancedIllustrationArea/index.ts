import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";
import { Measure } from "~/Measure";

export type TextFlowType = "around" | "no-flow" | "foreground" | "background";

function textFlowTypeToDocFrame(
  type: TextFlowType,
): Proto.ProtoAdvancedIllustrationAreaTextFlowType {
  switch (type) {
    case "around":
      return Proto.ProtoAdvancedIllustrationAreaTextFlowType.AROUND;
    case "no-flow":
      return Proto.ProtoAdvancedIllustrationAreaTextFlowType.NO_FLOW;
    case "foreground":
      return Proto.ProtoAdvancedIllustrationAreaTextFlowType.FOREGROUND;
    case "background":
      return Proto.ProtoAdvancedIllustrationAreaTextFlowType.BACKGROUND;
    default:
      throw new Error(`Unknown text flow type: ${type}`);
  }
}

export interface AdvancedIllustrationAreaProperties {
  /** UUID */
  uuid?: string;
  /** Whether the AIA is absolutely positioned */
  absolute?: boolean;
  /** Width */
  width?: Measure;
  /** Height */
  height?: Measure;
  /** X position */
  x?: Measure;
  /** Y position */
  y?: Measure;
  /** How text flows around the AIA */
  textFlow?: TextFlowType;
  /** Rotation in degrees */
  rotation?: number;
}

export class AdvancedIllustrationArea extends BranchDocumentElement<AdvancedIllustrationAreaProperties> {
  constructor(
    content?: Content,
    props?: AdvancedIllustrationAreaProperties,
  ) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      advancedIllustrationArea:
        Proto.ProtoAdvancedIllustrationArea.create({
          uuid: this.props?.uuid,
          absolute: this.props?.absolute,
          width: this.props?.width?.toDocFrame(),
          height: this.props?.height?.toDocFrame(),
          x: this.props?.x?.toDocFrame(),
          y: this.props?.y?.toDocFrame(),
          textFlow: this.props?.textFlow
            ? textFlowTypeToDocFrame(this.props.textFlow)
            : undefined,
          rotation: this.props?.rotation,
        }),
      children: this.childrenToDocFrame(),
    });
  }
}
