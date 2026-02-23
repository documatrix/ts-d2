import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";

/**
 * WsArea (Widow/orphan and Split area) wraps content to control
 * page break behavior.
 */
export class WsArea extends BranchDocumentElement {
  constructor(content?: Content) {
    super(content);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      wsArea: Proto.ProtoWsArea.create({}),
      children: this.childrenToDocFrame(),
    });
  }
}
