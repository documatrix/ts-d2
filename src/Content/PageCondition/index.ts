import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";

export interface PageConditionProperties {
  /** UUID */
  uuid?: string;
  /** Code expression to evaluate per page */
  code?: string;
}

export class PageCondition extends BranchDocumentElement<PageConditionProperties> {
  constructor(content?: Content, props?: PageConditionProperties) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      pageCondition: Proto.ProtoPageCondition.create({
        uuid: this.props?.uuid,
        code: this.props?.code,
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
