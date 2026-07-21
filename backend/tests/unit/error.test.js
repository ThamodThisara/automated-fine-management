import { describe, it, expect } from "vitest";
import { errorHandler } from "../../utils/error.js";

describe("errorHandler util", () => {
  it("returns an Error instance", () => {
    const err = errorHandler(400, "Bad request");
    expect(err).toBeInstanceOf(Error);
  });

  it("attaches the given statusCode and message", () => {
    const err = errorHandler(404, "Not found");
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Not found");
  });

  it("carries a 403 forbidden status through unchanged", () => {
    const err = errorHandler(403, "Forbidden");
    expect(err.statusCode).toBe(403);
    expect(err.message).toBe("Forbidden");
  });
});
