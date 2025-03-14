import Proto from "docframe-types";

import { DocumentElement } from "content/DocumentElement";

export class Text extends DocumentElement {
  constructor(content: string) {
    super();
    this.content = content;
  }

  public content: string;

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      text: Proto.ProtoText.create({
        content: this.content,
      }),
    });
  }
}
