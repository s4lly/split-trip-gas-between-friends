import { redirect } from "next/navigation";
import { getSingleSearchParam, parseStringParam } from "./url";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("../paths", () => ({
  errorPath: jest.fn(() => "/error"),
}));

describe("getSingleSearchParam", () => {
  it("should return the value for a valid key", () => {
    const searchParams = { key1: "value1" };
    expect(getSingleSearchParam(searchParams, "key1")).toBe("value1");
  });

  it("should log an error and redirect if the value is an array", () => {
    const searchParams = { key1: ["value1", "value2"] };
    console.error = jest.fn();

    getSingleSearchParam(searchParams, "key1");

    expect(console.error).toHaveBeenCalledWith(
      `Expected a single value for "key1", but got an array.`,
    );
    expect(redirect).toHaveBeenCalledWith("/error");
  });

  it("should log an error and redirect if the key is missing", () => {
    const searchParams = {};
    console.error = jest.fn();

    getSingleSearchParam(searchParams, "key1");

    expect(console.error).toHaveBeenCalledWith(
      `Missing required search parameter: "key1".`,
    );
    expect(redirect).toHaveBeenCalledWith("/error");
  });
});

describe("parseStringParam", () => {
  it("should parse a valid string to a number", () => {
    expect(parseStringParam("123")).toBe(123);
  });

  it("should log an error and redirect if the string is not a valid number", () => {
    console.error = jest.fn();

    parseStringParam("abc");

    expect(console.error).toHaveBeenCalledWith(
      "failed to parse string param to a number: ",
      "abc",
    );
    expect(redirect).toHaveBeenCalledWith("/error");
  });
});
