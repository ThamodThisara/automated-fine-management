import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { buildTestApp } from "../helpers/buildTestApp.js";
import {
  connectTestDB,
  disconnectTestDB,
  clearDB,
  seedUsers,
} from "../helpers/db.js";
import { cookieFor } from "../helpers/auth.js";

const app = buildTestApp();

// Role cookies (tokens carry the role verifyRole checks).
const adminCookie = cookieFor({ _id: "a1", id: "ADM-001", role: "admin" });
const officerCookie = cookieFor({ _id: "o1", id: "OFF-001", role: "officer" });
const driverCookie = cookieFor({ _id: "d1", id: "DRV-001", role: "driver" });

beforeAll(async () => {
  await connectTestDB();
  await clearDB();
  await seedUsers();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe("Authentication guard (verifyToken)", () => {
  it("blocks a protected route with no cookie (401)", async () => {
    const res = await request(app).get("/api/v1/user/getalldrivers");
    expect(res.status).toBe(401);
  });

  it("blocks a protected route with an invalid token (401)", async () => {
    const res = await request(app)
      .get("/api/v1/user/getalldrivers")
      .set("Cookie", "access_token=garbage.token.value");
    expect(res.status).toBe(401);
  });

  it("allows a protected route with a valid admin cookie (200)", async () => {
    const res = await request(app)
      .get("/api/v1/user/getalldrivers")
      .set("Cookie", adminCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("Authorization guard (verifyRole)", () => {
  it("forbids a driver from an admin-only route (403)", async () => {
    const res = await request(app)
      .get("/api/v1/user/getalladmins")
      .set("Cookie", driverCookie);
    expect(res.status).toBe(403);
  });

  it("allows an admin on an admin-only route (200)", async () => {
    const res = await request(app)
      .get("/api/v1/user/getalladmins")
      .set("Cookie", adminCookie);
    expect(res.status).toBe(200);
  });

  it("forbids a driver from issuing a fine (403)", async () => {
    const res = await request(app)
      .post("/api/v1/fine/fineissue")
      .set("Cookie", driverCookie)
      .send({});
    expect(res.status).toBe(403);
  });

  it("lets an officer past the authorization guard for fine issuing (not 401/403)", async () => {
    const res = await request(app)
      .post("/api/v1/fine/fineissue")
      .set("Cookie", officerCookie)
      .send({}); // empty body -> controller validation returns 400, proving auth passed
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
    expect(res.status).toBe(400);
  });
});

describe("Public routes stay open", () => {
  it("serves the public fine search without authentication (200)", async () => {
    const res = await request(app).get("/api/v1/fine/getallfine");
    expect(res.status).toBe(200);
  });
});

describe("Admin can create accounts (signup with admin cookie)", () => {
  it("creates a new driver and returns 200", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .set("Cookie", adminCookie)
      .send({
        name: "New Driver",
        password: "NewDriver@123",
        nic: "991234567V",
        dob: "1999-05-05",
        address: "45 New Road",
        phoneNumber: "0711234567",
        email: "newdriver@test.local",
        role: "driver",
        id: "DRV-100",
        vType: "Van",
        model: "Nissan Caravan",
      });
    expect(res.status).toBe(200);
  });
});
