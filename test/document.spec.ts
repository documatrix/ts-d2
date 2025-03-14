import { describe, it } from "@jest/globals";
import { PageDefinitions } from "content/PageDefinition";
import { Document } from "content/Document";

describe("Document", () => {
  describe("constructor", () => {
    it("should use A4 format if no format is specified", () => {
      const doc = new Document();
      expect(doc.props?.pageDefinition).toBe(PageDefinitions.A4);
    });
  });
});
