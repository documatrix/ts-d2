import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";

import Proto from "docframe-types";

export type HeaderMode = "append-initial" | "append" | "extend" | "replace";

function headerModeToDocFrame(mode: HeaderMode): Proto.ProtoHeaderMode {
  switch (mode) {
    case "append-initial":
      return Proto.ProtoHeaderMode.HEADER_MODE_APPEND_INITIAL;
    case "append":
      return Proto.ProtoHeaderMode.HEADER_MODE_APPEND;
    case "extend":
      return Proto.ProtoHeaderMode.HEADER_MODE_EXTEND;
    case "replace":
      return Proto.ProtoHeaderMode.HEADER_MODE_REPLACE;
    default:
      throw new Error(`Unknown header mode: ${mode}`);
  }
}

export interface HeaderProperties {
  mode?: HeaderMode;
}

export class Header extends BranchDocumentElement<HeaderProperties> {
  constructor(content?: Content, props?: HeaderProperties) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      header: Proto.ProtoHeader.create({
        mode: this.props?.mode
          ? headerModeToDocFrame(this.props.mode)
          : undefined,
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
