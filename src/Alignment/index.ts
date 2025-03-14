import Proto from "docframe-types";

export class HorizontalAlignment {
  public readonly value: Proto.ProtoHorizontalAlignment;

  constructor(value: Proto.ProtoHorizontalAlignment) {
    this.value = value;
  }

  public toDocFrame(): Proto.ProtoHorizontalAlignment {
    return this.value;
  }
}

export class VerticalAlignment {
  public readonly value: Proto.ProtoVerticalAlignment;

  constructor(value: Proto.ProtoVerticalAlignment) {
    this.value = value;
  }

  public toDocFrame(): Proto.ProtoVerticalAlignment {
    return this.value;
  }
}

export namespace Alignment {
  export const Horizontal = {
    Left: new HorizontalAlignment(Proto.ProtoHorizontalAlignment.ALIGN_LEFT),
    Center: new HorizontalAlignment(Proto.ProtoHorizontalAlignment.ALIGN_CENTER),
    Right: new HorizontalAlignment(Proto.ProtoHorizontalAlignment.ALIGN_RIGHT),
    Justify: new HorizontalAlignment(Proto.ProtoHorizontalAlignment.ALIGN_JUSTIFY),
    FullJustify: new HorizontalAlignment(Proto.ProtoHorizontalAlignment.ALIGN_FULL_JUSTIFY),
  };

  export const Vertical = {
    Top: new VerticalAlignment(Proto.ProtoVerticalAlignment.TOP),
    Middle: new VerticalAlignment(Proto.ProtoVerticalAlignment.MIDDLE),
    Bottom: new VerticalAlignment(Proto.ProtoVerticalAlignment.BOTTOM),
  };
}

