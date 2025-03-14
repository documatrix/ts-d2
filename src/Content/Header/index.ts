import { BranchDocumentElement } from "content/BranchDocumentElement";

import Proto from "docframe-types";

export class Header extends BranchDocumentElement<never> {
  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      header: Proto.ProtoHeader.create(),
      children: this.childrenToDocFrame(),
    });
  }
}
