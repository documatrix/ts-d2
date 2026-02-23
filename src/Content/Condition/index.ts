import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";

export interface ConditionProperties {
  /** UUID */
  uuid?: string;
  /** Code expression to evaluate */
  code?: string;
  /** Pre-evaluated result */
  result?: boolean;
  /** Whether the condition should be re-evaluated on regeneration */
  regenerate?: boolean;
}

export class Condition extends BranchDocumentElement<ConditionProperties> {
  constructor(content?: Content, props?: ConditionProperties) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      condition: Proto.ProtoCondition.create({
        uuid: this.props?.uuid,
        code: this.props?.code,
        result: this.props?.result,
        regenerate: this.props?.regenerate,
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
