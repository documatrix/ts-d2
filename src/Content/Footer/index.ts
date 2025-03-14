import { BranchDocumentElement } from "content/BranchDocumentElement";

import Proto from "docframe-types";

export class Footer extends BranchDocumentElement {
  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      footer: Proto.ProtoFooter.create(),
      children: this.childrenToDocFrame(),
    });
  }
}
