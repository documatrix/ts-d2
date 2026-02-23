import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";

/**
 * CarryOver defines content that is carried over to the next page
 * when a table or other element breaks across pages.
 */
export class CarryOver extends BranchDocumentElement {
  constructor(content?: Content) {
    super(content);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      carryOver: Proto.ProtoCarryOver.create({}),
      children: this.childrenToDocFrame(),
    });
  }
}
