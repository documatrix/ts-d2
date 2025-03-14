import { Node } from "docframe-types";
import { Content, DocumentElement } from "content/DocumentElement";
import { Text } from "content/Text";

export abstract class BranchDocumentElement<P = never> extends DocumentElement {
  protected children: DocumentElement[] = [];
  protected _props?: P;

  constructor(children?: Content, props?: P) {
    super();

    this._props = props;

    if (children === undefined) {
      this.children = [];
      return;
    }

    this.children = documentElementsFromContent(children);
  }

  public appendChildren(children: DocumentElement[]): void {
    this.children = this.children.concat(children);
  }

  public appendChild(child: DocumentElement): void {
    this.children.push(child);
  }

  public prependChildren(children: DocumentElement[]): void {
    this.children = children.concat(this.children);
  }

  public prependChild(child: DocumentElement): void {
    this.children.unshift(child);
  }

  public childrenToDocFrame(): Node[] {
    return this.children.map((child) => child.toDocFrame());
  }

  set props(props: P | undefined) {
    this._props = props;
  }

  get props(): P | undefined {
    return this._props;
  }
}

function documentElementsFromContent(content: Content): DocumentElement[] {
  if (typeof content === "string") {
    return [new Text(content)];
  } else if (Array.isArray(content)) {
    return content.map(documentElementsFromContent).flat();
  } else {
    return [content];
  }
}
