import Proto from "docframe-types";

import { defaultConnection } from "~/Connection";
import { OutputFormat, OutputParams } from "~/OutputFormat";
import { BranchDocumentElement } from "content/BranchDocumentElement";
import { ColumnDefinition, ColumnDefinitions } from "content/ColumnDefinition";
import { Content } from "content/DocumentElement";
import { Footer } from "content/Footer";
import { Header } from "content/Header";
import { PageDefinition, PageDefinitions } from "content/PageDefinition";
import { ParagraphFormat } from "~/ParagraphFormat";
import { SpaceVertically } from "content/SpaceVertically";
import { StandardFonts } from "~/Font";
import { AbsoluteMeasure } from "~/Measure/Measure";

export interface DocumentProperties {
  pageDefinition: PageDefinition;
  columnDefinition: ColumnDefinition;

  defaultHeader?: Header;
  defaultFooter?: Footer;

  paragraphFormats?: Record<string, ParagraphFormat>;
}

export class Document extends BranchDocumentElement<DocumentProperties> {
  paragraphFormats: Record<string, ParagraphFormat> = {};

  constructor(content?: Content, props?: DocumentProperties) {
    super(content, props);

    if (props === undefined) {
      this.props = {
        pageDefinition: PageDefinitions.A4,
        columnDefinition: ColumnDefinitions.A4.Single,
        defaultHeader: new Header(
          new SpaceVertically(new AbsoluteMeasure(40, "pt")),
        ),
        defaultFooter: new Footer(
          new SpaceVertically(new AbsoluteMeasure(40, "pt")),
        ),
      };
    } else {
      this.props = props;
    }

    this.paragraphFormats = this.props.paragraphFormats || {
      Text: new ParagraphFormat({
        font: StandardFonts.Helvetica,
        fontSize: new AbsoluteMeasure(12, "pt"),
        lineFeed: new AbsoluteMeasure(14, "pt"),
        indentionWidth: new AbsoluteMeasure(15, "pt"),
        name: "Text",
        default: true,
      }),
    };
  }

  getParagraphFormat(name: string): ParagraphFormat | undefined {
    return this.paragraphFormats[name];
  }

  registerParagraphFormat(name: string, pf: ParagraphFormat) {
    this.paragraphFormats[name] = pf;
  }

  convertTo<Format extends keyof OutputParams>(
    outputFormat: Format,
    outputParams?: OutputParams[Format],
  ): Promise<Blob> {
    return defaultConnection.convertTo(outputFormat, this, outputParams);
  }

  convertToPDF(outputParams?: OutputParams["pdf"]): Promise<Blob> {
    return defaultConnection.convertTo(OutputFormat.PDF, this, outputParams);
  }

  /*
  public getProtoParagraphFormat(format?: ParagraphFormat): Proto.IProtoParagraphFormat {
    if (!format) {
      return this.defaultParagraphFormat;
    }

    if (!format.format.name) {
      throw new Error("ParagraphFormat must have a name");
    }

    if (!this.paragraphFormats[format.format.name]) {
      this.paragraphFormats[format.format.name] = format.toDocFrame();
    }

    return this.paragraphFormats[format.format.name];
  }
  */

  public toDocFrame(): Proto.Node {
    const props = this.props!;

    const docSettings = Object.values(this.paragraphFormats)
      .map((pf) =>
        Proto.Node.create({
          paragraphFormat: pf.toDocFrame(),
        }),
      )
      .concat([
        Proto.Node.create({
          pDef: props.pageDefinition.toDocFrame(),
        }),
        Proto.Node.create({
          applyPDef: Proto.ProtoApplyProtoPDef.create({
            pDefUuid: props.pageDefinition.uuid,
          }),
        }),
        ...props.columnDefinition.toDocFrame(true),
      ]);

    if (props.defaultHeader) {
      docSettings.push(props.defaultHeader.toDocFrame());
    }

    if (props.defaultFooter) {
      docSettings.push(props.defaultFooter.toDocFrame());
    }

    const content = this.childrenToDocFrame();

    for (const format of Object.values(this.paragraphFormats)) {
      docSettings.push(
        Proto.Node.create({
          paragraphFormat: format.toDocFrame(),
        }),
      );
    }

    return Proto.Node.create({
      children: docSettings.concat(...content),
    });
  }
}
