import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";

export interface TableContentGroupProperties {
  /** UUID */
  uuid?: string;
}

export class TableContentGroup extends BranchDocumentElement<TableContentGroupProperties> {
  constructor(content?: Content, props?: TableContentGroupProperties) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      tableContentGroup: Proto.ProtoTableContentGroup.create({
        uuid: this.props?.uuid,
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
