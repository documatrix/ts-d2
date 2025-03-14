import { BranchDocumentElement } from "content/BranchDocumentElement";

import Proto from "docframe-types";
import { ParagraphFormat } from "~/ParagraphFormat";
import { Content } from "content/DocumentElement";

export interface ParagraphSettings {
  paragraphFormatName?: string;
  overwrite?: ParagraphFormat;
}

export class Paragraph extends BranchDocumentElement<ParagraphSettings> {
  constructor(
    content?: Content,
    paragraphFormatName?: string | ParagraphFormat,
    overwrite?: ParagraphFormat,
  ) {
    super(content, {
      overwrite,
      paragraphFormatName:
        typeof paragraphFormatName === "string"
          ? paragraphFormatName
          : paragraphFormatName?.props?.name,
    });
  }

  public toDocFrame(): Proto.Node {
    const par = {} as Proto.IProtoParagraph;

    if (this.props!.overwrite) {
      par.overwrite = this.props!.overwrite.toDocFrame();
    }

    if (this.props!.paragraphFormatName) {
      par.format = Proto.ProtoParagraphFormat.create({
        name: Proto.ProtoBoxedString.create({
          isNull: false,
          value: this.props!.paragraphFormatName,
        }),
      });
    }

    return Proto.Node.create({
      paragraph: Proto.ProtoParagraph.create(par),
      children: this.childrenToDocFrame(),
    });
  }
}
