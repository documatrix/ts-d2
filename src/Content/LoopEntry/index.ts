import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";

export interface LoopEntryProperties {
  /** Data path for this loop entry */
  path?: string;
  /** Index of this entry in the loop */
  index?: number;
  /** UUID */
  uuid?: string;
}

export class LoopEntry extends BranchDocumentElement<LoopEntryProperties> {
  constructor(content?: Content, props?: LoopEntryProperties) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      loopEntry: Proto.ProtoLoopEntry.create({
        path: this.props?.path,
        index: this.props?.index,
        uuid: this.props?.uuid,
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
