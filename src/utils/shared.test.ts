import { getStringOrEmpty, isBlank } from "./shared";

describe("getStringOrEmpty", () => {
  it("should return the trimmed string if a non-empty string is provided", () => {
    expect(getStringOrEmpty("  hello  ")).toBe("hello");
  });

  it("should return an empty string if the input is undefined", () => {
    expect(getStringOrEmpty(undefined as unknown as string)).toBe("");
  });

  it("should return an empty string if the input is null", () => {
    expect(getStringOrEmpty(null as unknown as string)).toBe("");
  });

  it("should return an empty string if the input is an empty string", () => {
    expect(getStringOrEmpty("")).toBe("");
  });
});

describe("isBlank", () => {
  it("should return true for undefined", () => {
    expect(isBlank(undefined)).toBe(true);
  });

  it("should return true for null", () => {
    expect(isBlank(null)).toBe(true);
  });

  it("should return true for an empty string", () => {
    expect(isBlank("")).toBe(true);
  });

  it("should return true for a string with only whitespace", () => {
    expect(isBlank("   ")).toBe(true);
  });

  it("should return false for a non-empty string", () => {
    expect(isBlank("hello")).toBe(false);
  });

  it("should return false for a string with non-whitespace characters and spaces", () => {
    expect(isBlank("  hello  ")).toBe(false);
  });
});
