import Proto from "docframe-types";

import { BranchDocumentElement } from "content/BranchDocumentElement";
import { Content } from "content/DocumentElement";

export type SemanticType = "none" | "part" | "art" | "sect" | "div";

function semanticTypeToDocFrame(type: SemanticType): Proto.ProtoSemanticType {
  switch (type) {
    case "none":
      return Proto.ProtoSemanticType.SEMANTIC_TYPE_NONE;
    case "part":
      return Proto.ProtoSemanticType.SEMANTIC_TYPE_PART;
    case "art":
      return Proto.ProtoSemanticType.SEMANTIC_TYPE_ART;
    case "sect":
      return Proto.ProtoSemanticType.SEMANTIC_TYPE_SECT;
    case "div":
      return Proto.ProtoSemanticType.SEMANTIC_TYPE_DIV;
    default:
      throw new Error(`Unknown semantic type: ${type}`);
  }
}

export interface DirectoryProperties {
  name?: string;
  editable?: boolean;
  semanticType?: SemanticType;
}

export class Directory extends BranchDocumentElement<DirectoryProperties> {
  constructor(content?: Content, props?: DirectoryProperties) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      directory: Proto.ProtoDirectory.create({
        name: this.props?.name,
        editable: this.props?.editable,
        semanticType: this.props?.semanticType
          ? semanticTypeToDocFrame(this.props.semanticType)
          : undefined,
      }),
      children: this.childrenToDocFrame(),
    });
  }
}
