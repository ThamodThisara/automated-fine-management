// Regression tests for the payment-confirmation fix: updateSuccessPayment used to trust
// whatever "sessionId" the client sent and mark that fine paid unconditionally, without ever
// asking Stripe whether a payment actually happened. It now retrieves the real Stripe Checkout
// Session and only marks the fine paid when Stripe reports payment_status === "paid", reading
// the target fine id from the session's metadata (set server-side in `checkout`) rather than
// from client input.
//
// The Stripe SDK is mocked so these tests are deterministic and never hit the real network.
import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from "vitest";
import request from "supertest";

const mockRetrieve = vi.hoisted(() => vi.fn());

vi.mock("stripe", () => ({
  default: vi.fn(() => ({
    checkout: {
      sessions: {
        retrieve: mockRetrieve,
      },
    },
  })),
}));

const { buildTestApp } = await import("../helpers/buildTestApp.js");
const { connectTestDB, disconnectTestDB, clearDB } = await import(
  "../helpers/db.js"
);
const { default: Fine } = await import("../../model/fine.model.js");

const app = buildTestApp();

const seedFine = (overrides = {}) =>
  Fine.create({
    dId: "DRV-001",
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
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(() => {
  mockRetrieve.mockClear();
});

describe("POST /api/pay/update-fine", () => {
  it("marks the fine paid when Stripe reports payment_status 'paid'", async () => {
    const fine = await seedFine();
    mockRetrieve.mockResolvedValueOnce({
      payment_status: "paid",
      metadata: { fineId: fine._id.toString() },
    });

    const res = await request(app)
      .post("/api/pay/update-fine")
      .send({ sessionId: "cs_test_fake_session_paid" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const updated = await Fine.findById(fine._id);
    expect(updated.state).toBe(true);
  });

  it("does NOT mark the fine paid when Stripe reports payment not completed", async () => {
    const fine = await seedFine();
    mockRetrieve.mockResolvedValueOnce({
      payment_status: "unpaid",
      metadata: { fineId: fine._id.toString() },
    });

    const res = await request(app)
      .post("/api/pay/update-fine")
      .send({ sessionId: "cs_test_fake_session_unpaid" });

    expect(res.status).toBe(402);

    const stillUnpaid = await Fine.findById(fine._id);
    expect(stillUnpaid.state).toBe(false);
  });

  it("returns 404 when the session's fine id does not match any fine", async () => {
    mockRetrieve.mockResolvedValueOnce({
      payment_status: "paid",
      metadata: { fineId: "000000000000000000000000" },
    });

    const res = await request(app)
      .post("/api/pay/update-fine")
      .send({ sessionId: "cs_test_fake_session_ghost_fine" });

    expect(res.status).toBe(404);
  });

  it("returns 400 when no sessionId is provided", async () => {
    const res = await request(app).post("/api/pay/update-fine").send({});
    expect(res.status).toBe(400);
    expect(mockRetrieve).not.toHaveBeenCalled();
  });

  it("cannot be tricked by sending a fine's own _id as sessionId (the original vulnerability)", async () => {
    const fine = await seedFine();
    // Simulates the old exploit: POST the fine's own _id as "sessionId" directly, skipping
    // Stripe entirely. Since retrieve() is mocked to reject for anything that isn't a real
    // Stripe session id, this must fail rather than update the fine.
    mockRetrieve.mockRejectedValueOnce(
      new Error("No such checkout session")
    );

    const res = await request(app)
      .post("/api/pay/update-fine")
      .send({ sessionId: fine._id.toString() });

    expect(res.status).not.toBe(200);

    const stillUnpaid = await Fine.findById(fine._id);
    expect(stillUnpaid.state).toBe(false);
  });
});
