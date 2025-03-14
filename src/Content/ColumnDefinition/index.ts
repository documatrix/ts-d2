import Proto from "docframe-types";

import { v4 as uuidv4 } from "uuid";
import { AbsoluteMeasure } from "~/Measure";

class ColumnPositionMode {
  public readonly value: Proto.ProtoPositionMode;

  constructor(value: Proto.ProtoPositionMode) {
    this.value = value;
  }

  public toDocFrame(): Proto.ProtoPositionMode {
    return this.value;
  }
}

export namespace ColumnPosition {
  export const Center = new ColumnPositionMode(Proto.ProtoPositionMode.CENTER);
  export const Left = new ColumnPositionMode(Proto.ProtoPositionMode.LEFT);
  export const Folio = new ColumnPositionMode(Proto.ProtoPositionMode.FOLIO);
  export const Right = new ColumnPositionMode(Proto.ProtoPositionMode.RIGHT);
  export const ReverseFolio = new ColumnPositionMode(
    Proto.ProtoPositionMode.REVERSE_FOLIO,
  );
}

export interface ColumnDefinitionProperties {
  width: AbsoluteMeasure;
  position: ColumnPositionMode;
  interColumnSpace: AbsoluteMeasure;
  positionOffset: AbsoluteMeasure;
}

export class ColumnDefinition {
  props: ColumnDefinitionProperties;
  uuid: string;

  constructor(props: ColumnDefinitionProperties) {
    this.props = props;

    this.uuid = uuidv4();
  }

  public toDocFrame(applyImmediate: boolean): Proto.Node[] {
    const result = [
      Proto.Node.create({
        cDef: Proto.ProtoCDef.create({
          Uuid: this.uuid,
          columSettings: Proto.ProtoColumnSettings.create({
            width: Proto.ProtoBoxedMeasure.create({
              isNull: false,
              value: this.props.width.toDocFrame(),
            }),
            positionOffset: Proto.ProtoBoxedMeasure.create({
              isNull: false,
              value: this.props.positionOffset.toDocFrame(),
            }),
            positionMode: this.props.position.toDocFrame(),
            interColumnSpace: Proto.ProtoBoxedMeasure.create({
              isNull: false,
              value: this.props.interColumnSpace.toDocFrame(),
            }),
          }),
        }),
      }),
    ];

    if (applyImmediate) {
      result.push(
        Proto.Node.create({
          applyCDef: Proto.ProtoApplyProtoCDef.create({
            cDefUuid: this.uuid,
          }),
        }),
      );
    }

    return result;
  }
}

export const ColumnDefinitions = {
  A4: {
    Single: new ColumnDefinition({
      width: new AbsoluteMeasure(490, "pt"),
      position: ColumnPosition.Left,
      positionOffset: new AbsoluteMeasure(70, "pt"),
      interColumnSpace: new AbsoluteMeasure(30, "pt"),
    }),
    Double: new ColumnDefinition({
      width: new AbsoluteMeasure(230, "pt"),
      position: ColumnPosition.Left,
      positionOffset: new AbsoluteMeasure(70, "pt"),
      interColumnSpace: new AbsoluteMeasure(30, "pt"),
    }),
  },
};
