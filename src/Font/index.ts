import { ProtoFont } from "docframe-types";

export class Font {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  public toDocFrame(): ProtoFont {
    return ProtoFont.create({
      name: this.name,
      // TODO: suppot font mapping for docframe step
      id: 5
    });
  }
}

export const StandardFonts = {
  Helvetica: new Font("helvetica"),
};
