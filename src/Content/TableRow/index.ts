import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";
import { AbsoluteMeasure } from "~/Measure";

export interface TableRowProperties {
  minHeight?: AbsoluteMeasure;
}

export class TableRow extends BranchDocumentElement<TableRowProperties> {
  constructor(content?: Content, props?: TableRowProperties) {
    super(content, props || {});
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      tableRow: Proto.ProtoTableRow.create({
        settings: Proto.ProtoTableRowSettings.create({
          minHeight: this.props!.minHeight?.toDocFrame(),
        }),
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
