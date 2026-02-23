import Proto from "docframe-types";

import { DocumentElement } from "content/DocumentElement";

export type VariableSpecialType =
  | "table-number"
  | "doc-page-count"
  | "doc-cur-page"
  | "cur-page"
  | "page-count"
  | "prev-page"
  | "section-page"
  | "updated-at"
  | "generated-at";

function specialTypeToDocFrame(
  type: VariableSpecialType,
): Proto.ProtoVariableSpecialType {
  switch (type) {
    case "table-number":
      return Proto.ProtoVariableSpecialType.TABLE_NUMBER;
    case "doc-page-count":
      return Proto.ProtoVariableSpecialType.DOC_PAGE_COUNT;
    case "doc-cur-page":
      return Proto.ProtoVariableSpecialType.DOC_CUR_PAGE;
    case "cur-page":
      return Proto.ProtoVariableSpecialType.CUR_PAGE;
    case "page-count":
      return Proto.ProtoVariableSpecialType.PAGE_COUNT;
    case "prev-page":
      return Proto.ProtoVariableSpecialType.PREV_PAGE;
    case "section-page":
      return Proto.ProtoVariableSpecialType.SECTION_PAGE;
    case "updated-at":
      return Proto.ProtoVariableSpecialType.UPDATED_AT;
    case "generated-at":
      return Proto.ProtoVariableSpecialType.GENERATED_AT;
    default:
      throw new Error(`Unknown variable special type: ${type}`);
  }
}

export interface VariableProperties {
  /** Data path to the variable */
  path?: string;
  /** Static content value */
  content?: string;
  /** UUID of the format to apply */
  formatUuid?: string;
  /** Special type of the variable (e.g. page number) */
  specialType?: VariableSpecialType;
  /** UUID */
  uuid?: string;
}

export class Variable extends DocumentElement {
  props: VariableProperties;

  constructor(props: VariableProperties) {
    super();
    this.props = props;
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      variable: Proto.ProtoVariable.create({
        path: this.props.path,
        content: this.props.content,
        formatUuid: this.props.formatUuid,
        specialType: this.props.specialType
          ? specialTypeToDocFrame(this.props.specialType)
          : undefined,
        uuid: this.props.uuid,
      }),
    });
  }
}
