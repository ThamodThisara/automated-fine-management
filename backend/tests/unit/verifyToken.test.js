import { describe, it, expect, vi } from "vitest";
import jwt from "jsonwebtoken";
import { verifyToken, verifyRole } from "../../middleware/verifyToken.js";

// Invokes a middleware with a mock req and resolves once next() has been called
// (verifyToken calls next inside jwt.verify's async callback).
const invoke = async (middleware, req) => {
  const res = {};
  let resolveDone;
  const done = new Promise((r) => (resolveDone = r));
  const next = vi.fn(() => resolveDone());
  middleware(req, res, next);
  await Promise.race([done, new Promise((r) => setTimeout(r, 200))]);
  return { req, res, next };
};

describe("verifyToken middleware", () => {
  it("rejects with 401 when no access_token cookie is present", async () => {
    const { next } = await invoke(verifyToken, { cookies: {} });
    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(401);
  });

  it("rejects with 401 when the token is malformed/invalid", async () => {
    const { next } = await invoke(verifyToken, {
      cookies: { access_token: "not-a-real-token" },
    });
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(401);
  });

  it("attaches req.user and calls next() with no error for a valid token", async () => {
    const token = jwt.sign(
      { _id: "abc123", id: "ADM-001", role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const { req, next } = await invoke(verifyToken, {
      cookies: { access_token: token },
    });
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeUndefined(); // next() with no error
    expect(req.user).toMatchObject({ id: "ADM-001", role: "admin" });
  });
});

describe("verifyRole middleware", () => {
  it("calls next() when the user's role is allowed", async () => {
    const mw = verifyRole("admin", "officer");
    const { next } = await invoke(mw, { user: { role: "officer" } });
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeUndefined();
  });

  it("rejects with 403 when the user's role is not allowed", async () => {
    const mw = verifyRole("admin");
    const { next } = await invoke(mw, { user: { role: "driver" } });
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(403);
  });

  it("rejects with 401 when there is no authenticated user", async () => {
    const mw = verifyRole("admin");
    const { next } = await invoke(mw, {});
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(401);
  });
});
