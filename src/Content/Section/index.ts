import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";

export interface SectionProperties {
  uuid?: string;
  /** UUID of the column definition to apply to this section */
  cDefUuid?: string;
}

export class Section extends BranchDocumentElement<SectionProperties> {
  constructor(content?: Content, props?: SectionProperties) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      section: Proto.ProtoSection.create({
        uuid: this.props?.uuid,
        cDefUuid: this.props?.cDefUuid,
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
