import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";

export class Directory extends BranchDocumentElement {
  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      directory: Proto.ProtoDirectory.create({}),

      children: this.childrenToDocFrame(),
    });
  }
}
