import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";
import { Measure } from "~/Measure";

export interface IndentationProperties {
  /** Left indentation */
  left?: Measure;
  /** Right indentation */
  right?: Measure;
  /** UUID */
  uuid?: string;
}

export class Indentation extends BranchDocumentElement<IndentationProperties> {
  constructor(content?: Content, props?: IndentationProperties) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    const indent: Proto.IProtoIndentation = {
      uuid: this.props?.uuid,
    };

    if (this.props?.left) {
      indent.left = Proto.ProtoBoxedMeasure.create({
        isNull: false,
        value: this.props.left.toDocFrame(),
      });
    }

    if (this.props?.right) {
      indent.right = Proto.ProtoBoxedMeasure.create({
        isNull: false,
        value: this.props.right.toDocFrame(),
      });
    }

    return Proto.Node.create({
      indentation: Proto.ProtoIndentation.create(indent),
      children: this.childrenToDocFrame(),
    });
  }
}
