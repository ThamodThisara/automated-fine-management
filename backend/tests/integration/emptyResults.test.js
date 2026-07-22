// Regression tests for the "Model.find() always returns an array" bug: several controllers
// used to gate on `if (results)` (always truthy for an array, even []) instead of checking
// `.length`. For unfiltered "list everything" endpoints the correct fix was to drop the dead
// check entirely and always respond 200 — an empty collection is not an error condition.
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { buildTestApp } from "../helpers/buildTestApp.js";
import { connectTestDB, disconnectTestDB, clearDB, seedUsers } from "../helpers/db.js";
import { cookieFor } from "../helpers/auth.js";

const app = buildTestApp();

const officerCookie = cookieFor({ _id: "o1", id: "OFF-001", role: "officer" });

beforeAll(async () => {
  await connectTestDB();
  await clearDB();
  await seedUsers();
  // Vehicle, Violation and Activity collections are intentionally left empty.
});

afterAll(async () => {
  await disconnectTestDB();
});

describe("Unfiltered list endpoints on an empty collection", () => {
  it("GET /api/v1/vehicle/getallvehicles returns 200 with []", async () => {
    const res = await request(app)
      .get("/api/v1/vehicle/getallvehicles")
      .set("Cookie", officerCookie);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("GET /api/v1/violation/getallrules returns 200 with []", async () => {
    const res = await request(app)
      .get("/api/v1/violation/getallrules")
      .set("Cookie", officerCookie);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("GET /api/v1/violation/search returns 200 with [] when there is nothing to search", async () => {
    const res = await request(app)
      .get("/api/v1/violation/search")
      .query({ searchText: "speeding" })
      .set("Cookie", officerCookie);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("GET /api/v1/activity/recent/:aId returns 200 with [] for a user with no activity yet", async () => {
    const res = await request(app)
      .get("/api/v1/activity/recent/some-user-with-no-activity")
      .set("Cookie", officerCookie);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("GET /api/v1/fine/getallfine (public) returns 200 with [] when no fines exist", async () => {
    const res = await request(app).get("/api/v1/fine/getallfine");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
