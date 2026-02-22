import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

import Proto from "docframe-types";

import { Document } from "content/Document";
import { OutputParams } from "~/OutputFormat";

// Load environment variables from .env file
dotenv.config();

export class Connection {
  url: string;
  token: string;

  constructor(url?: string, token?: string) {
    this.url = url || process.env.DOCPIPE_URL || "http://localhost:8080";
    this.token = token || process.env.DOCPIPE_TOKEN || "";
  }

  get docframeCallUrl() {
    return `${this.url}/api/docframe?token=${this.token}`;
  }

  convertTo<K extends keyof OutputParams>(
    format: K,
    doc: Document,
    outputParams?: OutputParams[K],
    jobParams?: Record<string, any>,
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

    if (jobParams) {
      meta = {
        ...meta,
        ...jobParams,
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
