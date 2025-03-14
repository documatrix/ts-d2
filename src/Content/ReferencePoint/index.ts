import Proto from "docframe-types";

/**
 * A ReferencePoint is used for elements like barcodes to specify the reference point
 * of an object.
 * Example:
 * When specified reference point "top-left", the top-left point of a barcode is positioned
 * relative to the top-left edge of the current line or page.
 */
export type ReferencePoint = "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right";

export function referencePointToDocFrame(point: ReferencePoint): Proto.ProtoImageReferencePoint {
  switch (point) {
    case "top-left":
      return Proto.ProtoImageReferencePoint.REF_POINT_TOP_LEFT;

    case "top-right":
      return Proto.ProtoImageReferencePoint.REF_POINT_TOP_RIGHT;

    case "center":
      return Proto.ProtoImageReferencePoint.REF_POINT_CENTER;

    case "bottom-left":
      return Proto.ProtoImageReferencePoint.REF_POINT_BOTTOM_LEFT;

    case "bottom-right":
      return Proto.ProtoImageReferencePoint.REF_POINT_BOTTOM_RIGHT;

    default:
      throw new Error(`Unknown reference point: ${point}`);
  }
}