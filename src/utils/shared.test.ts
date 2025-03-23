// import { createFormTitle } from "./shared";

// describe("createFormTitle", () => {
//   it("should return an empty string for null or undefined", () => {
//     expect(createFormTitle(null)).toBe("");
//     expect(createFormTitle(undefined)).toBe("");
//   });

//   it("should return an empty string for an empty string", () => {
//     expect(createFormTitle("")).toBe("");
//   });

//   it("should trim leading and trailing spaces", () => {
//     expect(createFormTitle("  hello  ")).toBe("hello");
//   });

//   it("should convert all characters to lowercase", () => {
//     expect(createFormTitle("Hello World")).toBe("hello-world");
//   });

//   it("should replace spaces between words with hyphens", () => {
//     expect(createFormTitle("hello world test")).toBe("hello-world-test");
//   });

//   it("should handle strings with multiple spaces between words", () => {
//     expect(createFormTitle("hello   world")).toBe("hello-world");
//   });
// });
