import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";

export interface SelectionEntryProperties {
  /** UUID */
  uuid?: string;
  /** Internal name for the selection entry */
  internalName?: string;
  /** Display name */
  name?: string;
  /** Whether this entry is selected */
  selected?: boolean;
}

export class SelectionEntry extends BranchDocumentElement<SelectionEntryProperties> {
  constructor(content?: Content, props?: SelectionEntryProperties) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      selectionEntry: Proto.ProtoSelectionEntry.create({
        uuid: this.props?.uuid,
        internalName: this.props?.internalName,
        name: this.props?.name,
        selected: this.props?.selected,
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
