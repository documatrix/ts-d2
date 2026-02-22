import Proto from "docframe-types";

export class Font {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  public toDocFrame(): Proto.ProtoFont {
    return Proto.ProtoFont.create({
      name: this.name,
      // TODO: suppot font mapping for docframe step
      id: 5
    });
  }
}

export const StandardFonts = {
  Helvetica: new Font("helvetica"),
};
