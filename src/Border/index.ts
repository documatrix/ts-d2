import Proto from "docframe-types";
import { Color } from "~/Color";
import { AbsoluteMeasure, Sides } from "~/Measure";

export class Border {
  width: AbsoluteMeasure;
  color: Color;

  constructor(width: AbsoluteMeasure, color: Color) {
    this.width = width;
    this.color = color;
  }

  public toDocFrame(): Proto.ProtoBorder {
    return new Proto.ProtoBorder({
      weight: this.width.toDocFrame(),
      color: this.color.toDocFrame(),
    });
  }
}

export class SideBorders {
  value: Sides<Border>;

  constructor(settings: Sides<Border>) {
    this.value = settings;
  }

  public toDocFrame(): Proto.ProtoSideBorders {
    return new Proto.ProtoSideBorders({
      top: this.value.top?.toDocFrame(),
      right: this.value.right?.toDocFrame(),
      bottom: this.value.bottom?.toDocFrame(),
      left: this.value.left?.toDocFrame(),
    });
  }
}
