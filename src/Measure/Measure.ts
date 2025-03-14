import Proto from "docframe-types";

export type AbsoluteMeasureUnit = "pt" | "cm" | "mm" | "in" | "px";
export type RelativeMeasureUnit = "%";
export type MeasureUnit = AbsoluteMeasureUnit | RelativeMeasureUnit;

export class Measure<Unit = MeasureUnit> {
  readonly value: number;
  readonly unit: Unit;

  static zero = new Measure(0, "pt" as AbsoluteMeasureUnit);

  constructor(value: number, unit: Unit) {
    this.value = value;
    this.unit = unit;
  }

  public toDocFrame(): Proto.ProtoMeasure {
    switch (this.unit) {
      case "pt":
        return new Proto.ProtoMeasure({
          value: this.value,
          mtype: Proto.ProtoMeasureType.PT,
        });

      case "cm":
        return new Proto.ProtoMeasure({
          value: this.value,
          mtype: Proto.ProtoMeasureType.CM,
        });

      case "mm":
        return new Proto.ProtoMeasure({
          value: this.value,
          mtype: Proto.ProtoMeasureType.MM,
        });

      case "in":
        return new Proto.ProtoMeasure({
          value: this.value,
          mtype: Proto.ProtoMeasureType.IN,
        });

      case "px":
        return new Proto.ProtoMeasure({
          value: this.value,
          mtype: Proto.ProtoMeasureType.PX,
        });

      case "%":
        return new Proto.ProtoMeasure({
          value: this.value,
          mtype: Proto.ProtoMeasureType.PERCENT,
        });

      default:
        throw new Error(`Unknown measure unit: ${this.unit}`);
    }
  }
}

export class AbsoluteMeasure extends Measure<AbsoluteMeasureUnit> {}

export class RelativeMeasure extends Measure<RelativeMeasureUnit> {
  constructor(value: number) {
    super(value, "%");
  }
}

export type Sides<T> = {
  top?: T;
  right?: T;
  bottom?: T;
  left?: T;
};

export class SideMeasures {
  value: Sides<AbsoluteMeasure>;

  constructor(settings: Sides<AbsoluteMeasure>) {
    this.value = settings;
  }

  public toDocFrame(): Proto.ProtoSideMeasures {
    return new Proto.ProtoSideMeasures({
      top: this.value.top?.toDocFrame(),
      right: this.value.right?.toDocFrame(),
      bottom: this.value.bottom?.toDocFrame(),
      left: this.value.left?.toDocFrame(),
    });
  }
}
