import { redirect } from "next/navigation";
import { joinPath } from "@/paths";
import { getJoinUrl, getSingleSearchParam, parseStringParam } from "./url";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
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

describe("getJoinUrl", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clear module cache
    process.env = { ...originalEnv }; // Reset environment variables
  });

  afterAll(() => {
    process.env = originalEnv; // Restore original environment
  });

  it("should return localhost URL in development environment", () => {
    process.env = { ...process.env, NODE_ENV: "development" };
    const tripId = "123";
    const expectedUrl = `http://localhost:3000${joinPath(new URLSearchParams({ tripId }))}`;
    expect(getJoinUrl(tripId)).toBe(expectedUrl);
  });

  it("should return localhost URL if VERCEL_URL is not defined", () => {
    delete process.env.VERCEL_URL;
    const tripId = "123";
    const expectedUrl = `http://localhost:3000${joinPath(new URLSearchParams({ tripId }))}`;
    expect(getJoinUrl(tripId)).toBe(expectedUrl);
  });

  it("should return production URL if VERCEL_URL is defined", () => {
    process.env.VERCEL_URL = "example.vercel.app";
    const tripId = "123";
    const expectedUrl = `https://example.vercel.app${joinPath(new URLSearchParams({ tripId }))}`;
    expect(getJoinUrl(tripId)).toBe(expectedUrl);
  });

  it("should handle tripId with special characters", () => {
    process.env.VERCEL_URL = "example.vercel.app";
    const tripId = "abc-123";
    const expectedUrl = `https://example.vercel.app${joinPath(new URLSearchParams({ tripId }))}`;
    expect(getJoinUrl(tripId)).toBe(expectedUrl);
  });

  it("should handle empty tripId gracefully", () => {
    process.env.VERCEL_URL = "example.vercel.app";
    const tripId = "";
    const expectedUrl = `https://example.vercel.app${joinPath(new URLSearchParams({ tripId }))}`;
    expect(getJoinUrl(tripId)).toBe(expectedUrl);
  });
});
