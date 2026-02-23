import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";

import Proto from "docframe-types";

export type FooterMode = "append-initial" | "append" | "extend" | "replace";

function footerModeToDocFrame(mode: FooterMode): Proto.ProtoFooterMode {
  switch (mode) {
    case "append-initial":
      return Proto.ProtoFooterMode.FOOTER_MODE_APPEND_INITIAL;
    case "append":
      return Proto.ProtoFooterMode.FOOTER_MODE_APPEND;
    case "extend":
      return Proto.ProtoFooterMode.FOOTER_MODE_EXTEND;
    case "replace":
      return Proto.ProtoFooterMode.FOOTER_MODE_REPLACE;
    default:
      throw new Error(`Unknown footer mode: ${mode}`);
  }
}

export interface FooterProperties {
  mode?: FooterMode;
}

export class Footer extends BranchDocumentElement<FooterProperties> {
  constructor(content?: Content, props?: FooterProperties) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      footer: Proto.ProtoFooter.create({
        mode: this.props?.mode
          ? footerModeToDocFrame(this.props.mode)
          : undefined,
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
