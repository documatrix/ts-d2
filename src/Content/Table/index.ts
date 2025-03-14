import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";
import { Measure } from "~/Measure";

export interface TableSettings {
  width?: Measure;
  xOffset?: Measure;
}

export class Table extends BranchDocumentElement<TableSettings> {
  constructor(content?: Content, props?: TableSettings) {
    super(content, props || {});
    if (!this.props!.xOffset) {
      this.props!.xOffset = Measure.zero;
    }
  }

  public toDocFrame(): Proto.Node {
    const props = this.props!;

    return Proto.Node.create({
      table: Proto.ProtoTable.create({
        settings: Proto.ProtoTableSettings.create({
          width: props.width?.toDocFrame(),
          leftMeasure: Proto.ProtoBoxedBool.create({
            isNull: false,
            value: false,
          }),
          xOffset: props.xOffset?.toDocFrame(),
        }),
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
