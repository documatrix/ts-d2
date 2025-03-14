import Proto from "docframe-types";
import { v4 } from "uuid";
import { AbsoluteMeasure } from "~/Measure";

export class PageDefinition {
  width?: AbsoluteMeasure;
  height?: AbsoluteMeasure;
  uuid: string;

  constructor(width?: AbsoluteMeasure, height?: AbsoluteMeasure) {
    this.width = width;
    this.height = height;

    this.uuid = v4();
  }

  public toDocFrame(): Proto.ProtoPDef {
    return new Proto.ProtoPDef({
      pageDepth: new Proto.ProtoBoxedMeasure({
        isNull: this.height === undefined,
        value: this.height?.toDocFrame(),
      }),
      pageWidth: new Proto.ProtoBoxedMeasure({
        isNull: this.width === undefined,
        value: this.width?.toDocFrame(),
      }),
      Uuid: this.uuid,
    });
  }
}

export namespace PageDefinitions {
  export const A3 = new PageDefinition(
    new AbsoluteMeasure(297, "mm"),
    new AbsoluteMeasure(420, "mm"),
  );

  export const A4 = new PageDefinition(
    new AbsoluteMeasure(210, "mm"),
    new AbsoluteMeasure(297, "mm"),
  );

  export const A5 = new PageDefinition(
    new AbsoluteMeasure(148, "mm"),
    new AbsoluteMeasure(210, "mm"),
  );
}
