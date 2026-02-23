import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";

export interface LoopProperties {
  /** Data path to iterate over */
  path?: string;
  /** UUID */
  uuid?: string;
}

export class Loop extends BranchDocumentElement<LoopProperties> {
  constructor(content?: Content, props?: LoopProperties) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      loop: Proto.ProtoLoop.create({
        path: this.props?.path,
        uuid: this.props?.uuid,
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
