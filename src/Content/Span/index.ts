import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";

export interface SpanProperties {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}

export class Span extends BranchDocumentElement<SpanProperties> {
  constructor(content?: Content, props?: SpanProperties) {
    super(content, props || {});
  }

  public toDocFrame(): Proto.Node {
    let bold: Proto.ProtoBoxedBool | undefined = undefined;
    if (this.props?.bold !== undefined) {
      bold = Proto.ProtoBoxedBool.create({
        isNull: false,
        value: this.props.bold,
      });
    }

    let italic: Proto.ProtoBoxedBool | undefined = undefined;
    if (this.props?.italic !== undefined) {
      italic = Proto.ProtoBoxedBool.create({
        isNull: false,
        value: this.props.italic,
      });
    }

    let underline: Proto.ProtoBoxedBool | undefined = undefined;
    if (this.props?.underline !== undefined) {
      underline = Proto.ProtoBoxedBool.create({
        isNull: false,
        value: this.props.underline,
      });
    }

    let strikethrough: Proto.ProtoBoxedBool | undefined = undefined;
    if (this.props?.strikethrough !== undefined) {
      strikethrough = Proto.ProtoBoxedBool.create({
        isNull: false,
        value: this.props.strikethrough,
      });
    }

    return Proto.Node.create({
      span: Proto.ProtoSpan.create({
        bold: bold,
        italic: italic,
        underline: underline,
        strikethrough: strikethrough,
      }),

      children: this.childrenToDocFrame(),
    });
  }
}
