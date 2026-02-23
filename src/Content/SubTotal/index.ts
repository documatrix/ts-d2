import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";
import { Measure } from "~/Measure";

export type SubTotalPosition = "above-footer" | "below-content";

function subTotalPositionToDocFrame(
  pos: SubTotalPosition,
): Proto.ProtoSubTotalPosition {
  switch (pos) {
    case "above-footer":
      return Proto.ProtoSubTotalPosition.POSITION_ABOVE_FOOTER;
    case "below-content":
      return Proto.ProtoSubTotalPosition.POSITION_BELOW_CONTENT;
    default:
      throw new Error(`Unknown sub total position: ${pos}`);
  }
}

export interface SubTotalProperties {
  /** Whether to apply immediately */
  applyImmediate?: boolean;
  /** Position of the sub total */
  position?: SubTotalPosition;
  /** Height of the sub total area */
  height?: Measure;
}

export class SubTotal extends BranchDocumentElement<SubTotalProperties> {
  constructor(content?: Content, props?: SubTotalProperties) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      subTotal: Proto.ProtoSubTotal.create({
        applyImmediate: this.props?.applyImmediate,
        position: this.props?.position
          ? subTotalPositionToDocFrame(this.props.position)
          : undefined,
        height: this.props?.height?.toDocFrame(),
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
