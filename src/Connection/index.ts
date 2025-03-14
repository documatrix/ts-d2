import axios from "axios";
import FormData from "form-data";

import Proto from "docframe-types";

import { Document } from "content/Document";
import { OutputParams } from "~/OutputFormat";

export class Connection {
  url: string;
  token: string;

  constructor(url: string = "http://localhost:8080", token: string = "") {
    this.url = url;
    this.token = token;
  }

  get docframeCallUrl() {
    return `${this.url}/api/docframe?token=${this.token}`;
  }

  convertTo<K extends keyof OutputParams>(
    format: K,
    doc: Document,
    outputParams?: OutputParams[K],
  ): Promise<Blob> {
    const node = doc.toDocFrame();

    const protoData = Proto.Node.encode(node).finish();

    const form = new FormData();

    let meta = {
      format,
    };

    if (outputParams) {
      meta = {
        ...meta,
        ...outputParams,
      };
    }

    form.append("meta", JSON.stringify(meta), {
      contentType: "application/json",
      filename: "meta",
    });

    form.append("proto-data", protoData, {
      contentType: "application/protobuf",
      filename: "data.proto",
    });

    return new Promise((resolve, reject) => {
      axios
        .postForm(this.docframeCallUrl, form, {
          headers: {
            ...form.getHeaders(),
          },
          responseType: "arraybuffer",
        })
        .then(async (res) => {
          const blob = await new Response(res.data, {
            headers: {
              "Content-Type": res.headers["content-type"],
            },
          }).blob();

          resolve(blob);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export const defaultConnection = new Connection();
