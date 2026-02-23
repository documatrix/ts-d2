import Proto from "docframe-types";

import { DocumentElement } from "content/DocumentElement";

export interface TagProperties {
  /** Tag name */
  name: string;
  /** UUID */
  uuid?: string;
  /** Tag parameters */
  params?: string[];
  /** Name code expression */
  nameCode?: string;
  /** Whether name is in code mode */
  codeMode?: boolean;
}

export class Tag extends DocumentElement {
  props: TagProperties;

  constructor(props: TagProperties) {
    super();
    this.props = props;
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      tag: Proto.ProtoTag.create({
        name: this.props.name,
        uuid: this.props.uuid,
        params: this.props.params,
        nameCode: this.props.nameCode,
        codeMode: this.props.codeMode,
      }),
    });
  }
}
