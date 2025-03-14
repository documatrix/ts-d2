import Proto from "docframe-types";

export abstract class DocumentElement {
  public abstract toDocFrame(): Proto.Node;
}

export type Content = string | DocumentElement | (DocumentElement | string)[];
