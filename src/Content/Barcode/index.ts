import Proto from "docframe-types";

import { DocumentElement } from "content/DocumentElement";
import { AbsoluteMeasure, Measure } from "~/Measure";
import {
  ReferencePoint,
  referencePointToDocFrame,
} from "content/ReferencePoint";

export interface BarcodeProperties {
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
  padding?: AbsoluteMeasure;
  code?: string;
  altText?: string;
  uuid?: string;
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
        padding: (this.props.padding ?? Measure.zero).toDocFrame(),

        data: this.props.data,
        code: this.props.code,
        altText: this.props.altText,
        uuid: this.props.uuid,
      }),
    });
  }
}
