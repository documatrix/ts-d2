import { describe, it } from "vitest";
import Proto from "docframe-types";
import { BranchDocumentElement } from "Content/BranchDocumentElement";
import { DocumentElement, Content } from "Content/DocumentElement";
import { Text } from "Content/Text";
import { Linebreak } from "Content/Linebreak";

/**
 * Concrete subclass for testing the abstract BranchDocumentElement.
 */
class TestBranch extends BranchDocumentElement<{ label?: string }> {
  constructor(content?: Content, props?: { label?: string }) {
    super(content, props);
  }

  public toDocFrame(): Proto.Node {
    return Proto.Node.create({
      children: this.childrenToDocFrame(),
    });
  }

  /** Expose protected children for test assertions */
  public getChildren(): DocumentElement[] {
    return this.children;
  }
}

// ---------------------------------------------------------------------------
// Constructor behavior
// ---------------------------------------------------------------------------
describe("BranchDocumentElement", () => {
  describe("constructor", () => {
    it("should create an empty children array when no content is provided", () => {
      const branch = new TestBranch();
      expect(branch.getChildren()).toEqual([]);
    });

    it("should convert a string content to a single Text child", () => {
      const branch = new TestBranch("hello");
      const children = branch.getChildren();
      expect(children).toHaveLength(1);
      expect(children[0]).toBeInstanceOf(Text);
      expect((children[0] as Text).content).toBe("hello");
    });

    it("should wrap a single DocumentElement in an array", () => {
      const lb = new Linebreak();
      const branch = new TestBranch(lb);
      const children = branch.getChildren();
      expect(children).toHaveLength(1);
      expect(children[0]).toBe(lb);
    });

    it("should handle an array of mixed strings and elements", () => {
      const lb = new Linebreak();
      const branch = new TestBranch(["hello", lb, "world"]);
      const children = branch.getChildren();
      expect(children).toHaveLength(3);
      expect(children[0]).toBeInstanceOf(Text);
      expect((children[0] as Text).content).toBe("hello");
      expect(children[1]).toBe(lb);
      expect(children[2]).toBeInstanceOf(Text);
      expect((children[2] as Text).content).toBe("world");
    });

    it("should handle an array of only strings", () => {
      const branch = new TestBranch(["a", "b", "c"]);
      const children = branch.getChildren();
      expect(children).toHaveLength(3);
      children.forEach((c) => expect(c).toBeInstanceOf(Text));
    });

    it("should store props from constructor", () => {
      const branch = new TestBranch(undefined, { label: "test" });
      expect(branch.props?.label).toBe("test");
    });
  });

  // ---------------------------------------------------------------------------
  // Child management
  // ---------------------------------------------------------------------------
  describe("child management", () => {
    it("appendChild should add a child at the end", () => {
      const branch = new TestBranch("first");
      const lb = new Linebreak();
      branch.appendChild(lb);
      const children = branch.getChildren();
      expect(children).toHaveLength(2);
      expect(children[1]).toBe(lb);
    });

    it("prependChild should add a child at the beginning", () => {
      const branch = new TestBranch("second");
      const lb = new Linebreak();
      branch.prependChild(lb);
      const children = branch.getChildren();
      expect(children).toHaveLength(2);
      expect(children[0]).toBe(lb);
    });

    it("appendChildren should add multiple children at the end", () => {
      const branch = new TestBranch("first");
      const lb1 = new Linebreak();
      const lb2 = new Linebreak();
      branch.appendChildren([lb1, lb2]);
      const children = branch.getChildren();
      expect(children).toHaveLength(3);
      expect(children[1]).toBe(lb1);
      expect(children[2]).toBe(lb2);
    });

    it("prependChildren should add multiple children at the beginning", () => {
      const branch = new TestBranch("last");
      const lb1 = new Linebreak();
      const lb2 = new Linebreak();
      branch.prependChildren([lb1, lb2]);
      const children = branch.getChildren();
      expect(children).toHaveLength(3);
      expect(children[0]).toBe(lb1);
      expect(children[1]).toBe(lb2);
    });
  });

  // ---------------------------------------------------------------------------
  // Props
  // ---------------------------------------------------------------------------
  describe("props", () => {
    it("should return undefined props when not set", () => {
      const branch = new TestBranch();
      expect(branch.props).toBeUndefined();
    });

    it("should allow setting props via setter", () => {
      const branch = new TestBranch();
      branch.props = { label: "updated" };
      expect(branch.props?.label).toBe("updated");
    });

    it("should allow clearing props", () => {
      const branch = new TestBranch(undefined, { label: "initial" });
      branch.props = undefined;
      expect(branch.props).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // childrenToDocFrame
  // ---------------------------------------------------------------------------
  describe("childrenToDocFrame", () => {
    it("should return an empty array for no children", () => {
      const branch = new TestBranch();
      const df = branch.toDocFrame();
      expect(df.children).toHaveLength(0);
    });

    it("should map all children to DocFrame nodes", () => {
      const branch = new TestBranch(["hello", new Linebreak(), "world"]);
      const df = branch.toDocFrame();
      expect(df.children).toHaveLength(3);
      expect(df.children[0].text).toBeDefined();
      expect(df.children[1].linebreak).toBeDefined();
      expect(df.children[2].text).toBeDefined();
    });
  });
});
