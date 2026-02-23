import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";
import { Measure, SideMeasures } from "~/Measure";
import { HorizontalAlignment, VerticalAlignment } from "~/Alignment";
import { Color } from "~/Color";
import { SideBorders } from "~/Border";

export interface TableCellProperties {
  alignment?: HorizontalAlignment;
  backgroundColor?: Color;
  border?: SideBorders;
  margin?: SideMeasures;
  padding?: SideMeasures;
  verticalAlignment?: VerticalAlignment;
  width?: Measure;
  rotation?: number;
  defaultParagraphFormat?: string;
}

export class TableCell extends BranchDocumentElement<TableCellProperties> {
  constructor(content?: Content, props?: TableCellProperties) {
    super(content, props || {});
  }

  public toDocFrame(): Proto.Node {
    const props = this.props!;

    const settings: Proto.IProtoTableCellSettings = {
      align: Proto.ProtoBoxedHorizontalAlignment.create({
        isNull: false,
        value:
          props!.alignment?.toDocFrame() ||
          Proto.ProtoHorizontalAlignment.ALIGN_LEFT,
      }),
      backgroundColor: props.backgroundColor?.toDocFrame(),
      border: props.border?.toDocFrame(),
      margin: props.margin?.toDocFrame(),
      padding: props.padding?.toDocFrame(),
      valign: Proto.ProtoBoxedVerticalAlignment.create({
        isNull: false,
        value:
          props.verticalAlignment?.toDocFrame() ||
          Proto.ProtoVerticalAlignment.TOP,
      }),
      width: props.width?.toDocFrame(),
    };

    if (props.rotation !== undefined) {
      settings.rotation = Proto.ProtoBoxedDouble.create({
        isNull: false,
        value: props.rotation,
      });
    }

    if (props.defaultParagraphFormat !== undefined) {
      settings.defaultParagraphFormat = Proto.ProtoBoxedString.create({
        isNull: false,
        value: props.defaultParagraphFormat,
      });
    }

    return Proto.Node.create({
      tableCell: Proto.ProtoTableCell.create({
        settings: Proto.ProtoTableCellSettings.create(settings),
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
