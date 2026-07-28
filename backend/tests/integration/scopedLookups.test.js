// Regression tests for scoped-by-id lookups that used to gate on `if (result)` where `result`
// came from Model.find({...}) — an array, always truthy even when empty — so the "not found"
// branch could never run. These endpoints are now expected to return 404 when nothing matches
// the given id, unlike the unfiltered "list everything" endpoints (see emptyResults.test.js).
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { buildTestApp } from "../helpers/buildTestApp.js";
import { connectTestDB, disconnectTestDB, clearDB, seedUsers } from "../helpers/db.js";
import { cookieFor } from "../helpers/auth.js";
import Fine from "../../model/fine.model.js";
import Station from "../../model/station.model.js";

const app = buildTestApp();

const officerCookie = cookieFor({ _id: "o1", id: "OFF-001", role: "officer" });

const seedFine = (overrides = {}) =>
  Fine.create({
    driver: "DRV-001",
    dNic: "990000000V",
    dName: "Test Driver",
    email: "driver@test.local",
    vNo: "ABC-1234",
    issueDate: new Date(),
    time: "10:00",
    place: "Main Street",
    expireDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    violation: "Speeding",
    pId: "OFF-001",
    pName: "Test Officer",
    pStation: "Central",
    charge: "Rs. 1000",
    state: false,
    block: false,
    ...overrides,
  });

beforeAll(async () => {
  await connectTestDB();
  await clearDB();
  await seedUsers();
  await seedFine(); // unpaid, unblocked fine for driver DRV-001 only
});

afterAll(async () => {
  await disconnectTestDB();
});

describe("GET /api/v1/fine/getfine/:driverId", () => {
  it("returns 200 with the matching fines for a driver id that has fines", async () => {
    const res = await request(app)
      .get("/api/v1/fine/getfine/DRV-001")
      .set("Cookie", officerCookie);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("returns 404 for a driver id with no fines", async () => {
    const res = await request(app)
      .get("/api/v1/fine/getfine/NO-SUCH-DRIVER")
      .set("Cookie", officerCookie);
    expect(res.status).toBe(404);
  });
});

describe("GET /api/v1/fine/getfineofficer/:pId", () => {
  it("returns 404 for an officer id with no issued fines", async () => {
    const res = await request(app)
      .get("/api/v1/fine/getfineofficer/NO-SUCH-OFFICER")
      .set("Cookie", officerCookie);
    expect(res.status).toBe(404);
  });
});

describe("GET /api/v1/fine/getunpaidfine/:driverId", () => {
  it("returns 404 for a driver id with no unpaid fines", async () => {
    const res = await request(app)
      .get("/api/v1/fine/getunpaidfine/NO-SUCH-DRIVER")
      .set("Cookie", officerCookie);
    expect(res.status).toBe(404);
  });
});

describe("GET /api/v1/fine/getblockdriverfine/:driverId", () => {
  it("returns 404 when the driver has no blocked fines (the seeded fine is unblocked)", async () => {
    const res = await request(app)
      .get("/api/v1/fine/getblockdriverfine/DRV-001")
      .set("Cookie", officerCookie);
    expect(res.status).toBe(404);
  });
});

describe("GET /api/v1/station/getall", () => {
  it("is publicly accessible (no auth) and returns the seeded stations", async () => {
    await Station.create({
      station: "Central",
      email: "central@test.local",
      phone: "0110000000",
    });
    const res = await request(app).get("/api/v1/station/getall");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({
      station: "Central",
      email: "central@test.local",
      phone: "0110000000",
    });
  });
});
