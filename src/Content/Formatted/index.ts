import Proto from "docframe-types";

import { DocumentElement } from "content/DocumentElement";

export class Formatted extends DocumentElement {
  constructor(doctypeContent: string | undefined, htmlContent?: string) {
    super();
    this.content = {
      doctype: doctypeContent,
      html: htmlContent,
    };
  }

  public content: {
    doctype: string | undefined;
    html: string | undefined;
  };

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      formatted: Proto.ProtoFormatted.create({
        doctypeContent: this.content.doctype,
        htmlContent: this.content.html,
      }),
    });
  }
}
