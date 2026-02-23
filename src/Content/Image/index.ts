import Proto from "docframe-types";

import { DocumentElement } from "content/DocumentElement";
import { Measure } from "~/Measure";
import {
  ReferencePoint,
  referencePointToDocFrame,
} from "content/ReferencePoint";

export type ImageScaleType = "relative" | "absolute" | "relative-to-column";

function imageScaleTypeToDocFrame(
  type: ImageScaleType,
): Proto.ProtoImageScaleType {
  switch (type) {
    case "relative":
      return Proto.ProtoImageScaleType.IMAGE_SCALE_TYPE_RELATIVE;
    case "absolute":
      return Proto.ProtoImageScaleType.IMAGE_SCALE_TYPE_ABSOLUTE;
    case "relative-to-column":
      return Proto.ProtoImageScaleType.IMAGE_SCALE_TYPE_RELATIVE_TO_COLUMN;
    default:
      throw new Error(`Unknown image scale type: ${type}`);
  }
}

export interface FlipSettings {
  x?: boolean;
  y?: boolean;
}

export interface CropSettings {
  x?: Measure;
  y?: Measure;
  width?: Measure;
  height?: Measure;
}

export interface ImageProperties {
  /** Alternative text for accessibility */
  alt?: string;
  /** Image name */
  name?: string;
  /** Image source URL or path */
  src?: string;
  /** Image filename */
  filename?: string;
  /** Scale factor (e.g. 1.0 = 100%) */
  scale?: number;
  /** Scale relative to column width (e.g. 0.5 = 50% of column) */
  columnScale?: number;
  /** Image width */
  width?: Measure;
  /** Image height */
  height?: Measure;
  /** X position */
  x?: Measure;
  /** Y position */
  y?: Measure;
  /** Whether the image is positioned absolutely */
  positionAbsolute?: boolean;
  /** Rotation in degrees */
  rotation?: number;
  /** Flip settings */
  flip?: FlipSettings;
  /** Crop settings */
  crop?: CropSettings;
  /** Reference point for positioning */
  referencePoint?: ReferencePoint;
  /** Hyperlink URL */
  hyperlink?: string;
  /** Scale type */
  scaleType?: ImageScaleType;
  /** UUID */
  uuid?: string;
  /** Inline image content as base64-encoded string */
  imageContent?: string;
}

export class Image extends DocumentElement {
  props: ImageProperties;

  constructor(props: ImageProperties) {
    super();
    this.props = props;
  }

  public toDocFrame(): Proto.Node {
    const p = this.props;

    const image: Proto.IProtoImage = {
      alt: p.alt,
      name: p.name,
      src: p.src,
      filename: p.filename,
      rotation: p.rotation,
      hyperlink: p.hyperlink,
      uuid: p.uuid,
      imageContent: p.imageContent,
    };

    if (p.scale !== undefined) {
      image.scale = Proto.ProtoBoxedDouble.create({
        isNull: false,
        value: p.scale,
      });
    }

    if (p.columnScale !== undefined) {
      image.columnScale = Proto.ProtoBoxedDouble.create({
        isNull: false,
        value: p.columnScale,
      });
    }

    if (p.width) {
      image.width = Proto.ProtoBoxedMeasure.create({
        isNull: false,
        value: p.width.toDocFrame(),
      });
    }

    if (p.height) {
      image.height = Proto.ProtoBoxedMeasure.create({
        isNull: false,
        value: p.height.toDocFrame(),
      });
    }

    if (p.x) {
      image.x = Proto.ProtoBoxedMeasure.create({
        isNull: false,
        value: p.x.toDocFrame(),
      });
    }

    if (p.y) {
      image.y = Proto.ProtoBoxedMeasure.create({
        isNull: false,
        value: p.y.toDocFrame(),
      });
    }

    if (p.positionAbsolute !== undefined) {
      image.positionAbsolute = Proto.ProtoBoxedBool.create({
        isNull: false,
        value: p.positionAbsolute,
      });
    }

    if (p.flip) {
      image.flipSettings = Proto.ProtoFlipSettings.create({
        x: p.flip.x,
        y: p.flip.y,
      });
    }

    if (p.crop) {
      const cropSettings: Proto.IProtoCropSettings = {};
      if (p.crop.x) {
        cropSettings.x = Proto.ProtoBoxedMeasure.create({
          isNull: false,
          value: p.crop.x.toDocFrame(),
        });
      }
      if (p.crop.y) {
        cropSettings.y = Proto.ProtoBoxedMeasure.create({
          isNull: false,
          value: p.crop.y.toDocFrame(),
        });
      }
      if (p.crop.width) {
        cropSettings.width = Proto.ProtoBoxedMeasure.create({
          isNull: false,
          value: p.crop.width.toDocFrame(),
        });
      }
      if (p.crop.height) {
        cropSettings.height = Proto.ProtoBoxedMeasure.create({
          isNull: false,
          value: p.crop.height.toDocFrame(),
        });
      }
      image.cropSettings = Proto.ProtoCropSettings.create(cropSettings);
    }

    if (p.referencePoint) {
      image.referencePoint = referencePointToDocFrame(p.referencePoint);
    }

    if (p.scaleType) {
      image.scaleType = imageScaleTypeToDocFrame(p.scaleType);
    }

    return Proto.Node.create({
      image: Proto.ProtoImage.create(image),
    });
  }
}
