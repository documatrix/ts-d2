import Proto from "docframe-types";

import { DocumentElement } from "content/DocumentElement";

export class Linebreak extends DocumentElement {
  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      linebreak: Proto.ProtoLinebreak.create({}),
    });
  }
}
