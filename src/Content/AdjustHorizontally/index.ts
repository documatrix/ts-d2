import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";
import { Measure } from "~/Measure";

export interface AdjustHorizontallyProperties {
  /** Minimum font size for horizontal adjustment */
  minFontSize?: Measure;
  /** Maximum font size for horizontal adjustment */
  maxFontSize?: Measure;
}

export class AdjustHorizontally extends BranchDocumentElement<AdjustHorizontallyProperties> {
  constructor(content?: Content, props?: AdjustHorizontallyProperties) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      adjustHorizontally: Proto.ProtoAdjustHorizontally.create({
        minFontSize: this.props?.minFontSize?.toDocFrame(),
        maxFontSize: this.props?.maxFontSize?.toDocFrame(),
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
