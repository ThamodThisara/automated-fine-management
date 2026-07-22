import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { buildTestApp } from "../helpers/buildTestApp.js";
import {
  connectTestDB,
  disconnectTestDB,
  clearDB,
  seedUsers,
  SEED_CREDENTIALS,
} from "../helpers/db.js";
import { cookieFor } from "../helpers/auth.js";

const app = buildTestApp();
const adminCookie = cookieFor({ _id: "a1", id: "ADM-001", role: "admin" });

beforeAll(async () => {
  await connectTestDB();
  await clearDB();
  await seedUsers();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe("POST /api/v1/auth/login", () => {
  it("logs in a valid admin and sets an HttpOnly access_token cookie", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send(SEED_CREDENTIALS.admin);

    expect(res.status).toBe(200);
    expect(res.body.role).toBe("admin");
    expect(res.body.password).toBeUndefined(); // password never returned

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    const authCookie = cookies.find((c) => c.startsWith("access_token="));
    expect(authCookie).toBeDefined();
    expect(authCookie.toLowerCase()).toContain("httponly");
  });

  it("rejects a wrong password with 400", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: SEED_CREDENTIALS.admin.email, password: "WrongPass!1" });

    expect(res.status).toBe(400);
    expect(res.headers["set-cookie"]).toBeUndefined();
  });

  it("returns 404 for an unknown user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "ghost@test.local", password: "whatever" });

    expect(res.status).toBe(404);
  });

  it("returns 400 when the password field is missing", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: SEED_CREDENTIALS.admin.email });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/v1/auth/signup (admin-only)", () => {
  it("blocks anonymous signup with 401", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({ role: "admin", name: "Intruder" });

    expect(res.status).toBe(401);
  });

  // Regression test: the officer branch of signup used to call
  // next(errorHandler(...)) without `return` when pStation was missing, then kept
  // running — creating the user and calling res.json() again after a response had
  // already been sent (pStation is schema-required for "officer", so the later
  // .save() also failed, triggering a *second* next(error) call). That produced a
  // double-response crash instead of a clean 400. Now it must stop at the first error.
  it("rejects an officer signup missing pStation with a clean 400", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .set("Cookie", adminCookie)
      .send({
        name: "New Officer",
        password: "NewOfficer@123",
        nic: "981234567V",
        dob: "1998-04-04",
        address: "12 Test Ave",
        phoneNumber: "0712345678",
        email: "newofficer-missing-pstation@test.local",
        role: "officer",
        id: "OFF-100",
        // pStation intentionally omitted
      });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/v1/auth/logout", () => {
  it("clears the access_token cookie", async () => {
    const res = await request(app).post("/api/v1/auth/logout");
    expect(res.status).toBe(200);
    const cookies = res.headers["set-cookie"] || [];
    // clearCookie sets access_token to empty.
    expect(cookies.some((c) => c.startsWith("access_token="))).toBe(true);
  });
});
