import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";

export interface LinkProperties {
  /** The URL to link to */
  url: string;
}

export class Link extends BranchDocumentElement<LinkProperties> {
  constructor(content?: Content, url?: string) {
    super(content, url ? { url } : undefined);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      link: Proto.ProtoLink.create({
        url: this.props?.url,
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
