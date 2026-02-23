import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";
import { Color } from "~/Color";

export interface SpanProperties {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  color?: Color;
  subscript?: boolean;
  superscript?: boolean;
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

    let subscript: Proto.ProtoBoxedBool | undefined = undefined;
    if (this.props?.subscript !== undefined) {
      subscript = Proto.ProtoBoxedBool.create({
        isNull: false,
        value: this.props.subscript,
      });
    }

    let superscript: Proto.ProtoBoxedBool | undefined = undefined;
    if (this.props?.superscript !== undefined) {
      superscript = Proto.ProtoBoxedBool.create({
        isNull: false,
        value: this.props.superscript,
      });
    }

    return Proto.Node.create({
      span: Proto.ProtoSpan.create({
        bold: bold,
        italic: italic,
        underline: underline,
        strikethrough: strikethrough,
        color: this.props?.color?.toDocFrame(),
        subscript: subscript,
        superscript: superscript,
      }),

      children: this.childrenToDocFrame(),
    });
  }
}
