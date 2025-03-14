export enum OutputFormat {
  PDF = "pdf",
  PNG = "png",
  JPEG = "jpeg",
  HTML = "html",
  PS = "ps",
  TEXT = "text",
}

export interface OutputParams {
  [OutputFormat.HTML]: {};
  [OutputFormat.PDF]: {};
  [OutputFormat.JPEG]: {};
  [OutputFormat.PS]: {};
  [OutputFormat.TEXT]: {};
  [OutputFormat.PNG]: {
    /**
     * The width of the output in pixels.
     * @default The width of the document in pixels.
     */
    width?: number;

    /**
     * The height of the output in pixels.
     * @default The height of the document in pixels.
     */
    height?: number;

    /**
     * The resolution of the output in pixels per inch.
     * @default 300 dpi.
     */
    dpi?: number;
  };
}
