import Proto from "docframe-types";
import { v4 as uuidv4 } from "uuid";
import { AbsoluteMeasure } from "~/Measure";
import { Font } from "~/Font";
import { HorizontalAlignment } from "~/Alignment";

export interface ParagraphFormatProperties {
  default?: boolean;
  name?: string;

  alignment?: HorizontalAlignment;

  font?: Font;
  fontSize?: AbsoluteMeasure;
  characterWidth?: AbsoluteMeasure;
  characterSpacing?: AbsoluteMeasure;
  lineFeed?: AbsoluteMeasure;
  bold?: boolean;
  italic?: boolean;

  indentionLevel?: number;
  indentionWidth?: AbsoluteMeasure;

  spaceAbove?: AbsoluteMeasure;
  spaceBelow?: AbsoluteMeasure;
}

export class ParagraphFormat {
  props: ParagraphFormatProperties;

  constructor(props: ParagraphFormatProperties) {
    this.props = props;

    this.props.name = props.name || uuidv4();
  }

  public toDocFrame(): Proto.IProtoParagraphFormat {
    let format: Proto.IProtoParagraphFormat = {
      default: Proto.ProtoBoxedBool.create({
        isNull: false,
        value: this.props.default || false,
      }),
      name: Proto.ProtoBoxedString.create({
        isNull: false,
        value: this.props.name,
      }),
    };

    if (this.props.alignment) {
      format.alignment = Proto.ProtoBoxedHorizontalAlignment.create({
        isNull: false,
        value: this.props.alignment.toDocFrame(),
      });
    }

    if (this.props.font) {
      format.font = Proto.ProtoBoxedFont.create({
        isNull: false,
        value: this.props.font.toDocFrame(),
      });
    }

    if (this.props.fontSize) {
      format.fontSize = Proto.ProtoBoxedMeasure.create({
        isNull: false,
        value: this.props.fontSize.toDocFrame(),
      });
    }

    if (this.props.characterWidth) {
      format.characterWidth = Proto.ProtoBoxedMeasure.create({
        isNull: false,
        value: this.props.characterWidth.toDocFrame(),
      });
    }

    if (this.props.characterSpacing) {
      format.characterSpacing = Proto.ProtoBoxedMeasure.create({
        isNull: false,
        value: this.props.characterSpacing.toDocFrame(),
      });
    }

    if (this.props.lineFeed) {
      format.lineFeed = Proto.ProtoBoxedMeasure.create({
        isNull: false,
        value: this.props.lineFeed.toDocFrame(),
      });
    }

    if (this.props.indentionLevel !== undefined) {
      format.indentionLevel = Proto.ProtoBoxedInt32.create({
        isNull: false,
        value: this.props.indentionLevel,
      });
    }

    if (this.props.indentionWidth) {
      format.indentionWidth = Proto.ProtoBoxedMeasure.create({
        isNull: false,
        value: this.props.indentionWidth.toDocFrame(),
      });
    }

    if (this.props.bold !== undefined) {
      format.bold = Proto.ProtoBoxedBool.create({
        isNull: false,
        value: !!this.props.bold,
      });
    }

    if (this.props.italic !== undefined) {
      format.italic = Proto.ProtoBoxedBool.create({
        isNull: false,
        value: !!this.props.italic,
      });
    }

    if (this.props.spaceAbove) {
      format.spaceAbove = Proto.ProtoBoxedMeasure.create({
        isNull: false,
        value: this.props.spaceAbove.toDocFrame(),
      });
    }

    if (this.props.spaceBelow) {
      format.spaceBelow = Proto.ProtoBoxedMeasure.create({
        isNull: false,
        value: this.props.spaceBelow.toDocFrame(),
      });
    }

    return Proto.ProtoParagraphFormat.create(format);
  }
}
