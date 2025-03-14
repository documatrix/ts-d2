import Proto from "docframe-types";

export class Color {
  private color: Proto.ProtoColor;

  static rgb(r: number, g: number, b: number): Color {
    if (r < 0 || r > 255) {
      throw new Error(`Invalid red value: ${r}`);
    }

    if (g < 0 || g > 255) {
      throw new Error(`Invalid green value: ${g}`);
    }

    if (b < 0 || b > 255) {
      throw new Error(`Invalid blue value: ${b}`);
    }

    return new Color(Proto.ProtoColor.create({
      type: Proto.ProtoColorType.RGB,
      r,
      g,
      b,
    }));
  }

  static cmyk(c: number, m: number, y: number, k: number): Color {
    if (c < 0 || c > 100) {
      throw new Error(`Invalid cyan value: ${c}`);
    }

    if (m < 0 || m > 100) {
      throw new Error(`Invalid magenta value: ${m}`);
    }

    if (y < 0 || y > 100) {
      throw new Error(`Invalid yellow value: ${y}`);
    }

    if (k < 0 || k > 100) {
      throw new Error(`Invalid black value: ${k}`);
    }

    return new Color(Proto.ProtoColor.create({
      type: Proto.ProtoColorType.CMYK,
      c,
      m,
      y,
      k,
    }));
  }

  static fromHex(hex: string): Color {
    if (hex.startsWith("#")) {
      hex = hex.slice(1);
    }

    if (hex.length !== 6) {
      throw new Error(`Invalid hex color: ${hex}`);
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return new Color(Proto.ProtoColor.create({
      type: Proto.ProtoColorType.RGB,
      r,
      g,
      b,
    }));
  }

  private constructor(color: Proto.ProtoColor) {
    this.color = color;
  }


  public toDocFrame(): Proto.ProtoColor {
    return this.color;
  }
}

export namespace Colors {
  export const white = Color.rgb(255, 255, 255);

  export const black = Color.cmyk(0, 0, 0, 100);
}
