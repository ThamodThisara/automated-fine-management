// Authentication helpers for integration tests.

import jwt from "jsonwebtoken";
import request from "supertest";

// Signs a JWT exactly like auth.controller.setAuthCookie, for building a cookie directly.
export const signToken = ({ _id, id, role }) =>
  jwt.sign({ _id, id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

// Returns a Cookie header value ("access_token=...") for the given payload.
export const cookieFor = (payload) => `access_token=${signToken(payload)}`;

// Logs in through the real /login endpoint and returns the Set-Cookie array so tests can
// exercise the genuine login -> cookie flow end to end.
export const loginCookie = async (app, credentials) => {
  const res = await request(app).post("/api/v1/auth/login").send(credentials);
  return res.headers["set-cookie"];
};
