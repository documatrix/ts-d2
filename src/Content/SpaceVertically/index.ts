import Proto from "docframe-types";

import { DocumentElement } from "content/DocumentElement";
import { AbsoluteMeasure } from "~/Measure";

export class SpaceVertically extends DocumentElement {
  space: AbsoluteMeasure;

  constructor(space: AbsoluteMeasure) {
    super();

    this.space = space;
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      spaceVertically: Proto.ProtoSpaceVertically.create({
        space: this.space.toDocFrame(),
      }),
    });
  }
}
