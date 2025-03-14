import Proto from "docframe-types";

import { DocumentElement } from "content/DocumentElement";

export class Pagebreak extends DocumentElement {
  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      newPage: Proto.ProtoNewPage.create({}),
    });
  }
}
