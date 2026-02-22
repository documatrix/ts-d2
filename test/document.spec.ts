import { describe, it } from "vitest";
import { PageDefinitions } from "Content/PageDefinition";
import { Document } from "content/Document";

describe("Document", () => {
  describe("constructor", () => {
    it("should use A4 format if no format is specified", () => {
      const doc = new Document();
      expect(doc.props?.pageDefinition).toBe(PageDefinitions.A4);
    });
  });
});
