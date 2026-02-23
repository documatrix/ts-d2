import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";

export interface SelectionProperties {
  /** UUID */
  uuid?: string;
  /** Internal name for the selection */
  internalName?: string;
  /** Display name */
  name?: string;
  /** Whether multiple entries can be selected */
  multi?: boolean;
  /** Minimum number of selections required */
  min?: number;
  /** Maximum number of selections allowed */
  max?: number;
}

export class Selection extends BranchDocumentElement<SelectionProperties> {
  constructor(content?: Content, props?: SelectionProperties) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      selection: Proto.ProtoSelection.create({
        uuid: this.props?.uuid,
        internalName: this.props?.internalName,
        name: this.props?.name,
        multi: this.props?.multi,
        min: this.props?.min,
        max: this.props?.max,
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
