import axios from "axios";
import FormData from "form-data";

import Proto from "docframe-types";

import { Document } from "content/Document";
import { OutputParams } from "~/OutputFormat";

export type DocPipeParams = {
  application?: string;
  client?: string;
  instance?: string;
  inputQueue?: string;
  jobFinishedCallbacks?: CallbackUrlParams[];
};

export enum RetryType {
  NO_RETRY = 0,
  EXPONENTIAL_BACKOFF = 1,
  FIXED_INTERVAL = 2,
}

export type CallbackUrlParams = {
  externalId: string;
  url: string;
  headers?: { [key: string]: string };
  retryPolicy?: [{
    interval: number;
    maxRetries: number;
    type: RetryType;
  }];
  timeout?: number;
};

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
    docpipeParams?: DocPipeParams,
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

    if (docpipeParams) {
      form.append("job-params", JSON.stringify(docpipeParams), {
        contentType: "application/json",
        filename: "job-params",
      });
    }

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
