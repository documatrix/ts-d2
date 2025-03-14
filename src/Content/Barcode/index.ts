import Proto from "docframe-types";

import { DocumentElement } from "content/DocumentElement";
import { AbsoluteMeasure, Measure } from "~/Measure";
import {
  ReferencePoint,
  referencePointToDocFrame,
} from "content/ReferencePoint";

interface BarcodeProperties {
  type: Proto.ProtoBarcodeType;
  x: AbsoluteMeasure;
  y: AbsoluteMeasure;
  referencePoint: ReferencePoint;

  /**
   * Rotation in degrees, counter-clockwise
   */
  rotation: number;
  width: AbsoluteMeasure;
  height: AbsoluteMeasure;
  data: string;
  positionAbsolute: boolean;
}

export class Barcode extends DocumentElement {
  props: BarcodeProperties;

  constructor(props: BarcodeProperties) {
    super();

    this.props = props;
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      barcode: Proto.ProtoBarcode.create({
        type: this.props.type,

        positionAbsolute: this.props.positionAbsolute,
        referencePoint: referencePointToDocFrame(this.props.referencePoint),
        x: this.props.x.toDocFrame(),
        y: this.props.y.toDocFrame(),
        rotation: this.props.rotation,

        width: this.props.width.toDocFrame(),
        height: this.props.height.toDocFrame(),
        padding: Measure.zero.toDocFrame(),

        data: this.props.data,
      }),
    });
  }
}
