// Regression test for a crash bug: email.controller.js's sendEmail used to swallow its own
// errors silently. After it was changed to rethrow (so failures are visible), one of its
// callers — checkFinesAndSendReminder — used `fines.forEach(async (fine) => {...})`, which does
// not await its callback and is not caught by a surrounding try/catch. A rejected sendEmail
// inside it became an unhandled promise rejection, which crashes the whole Node process on
// Node 15+ (confirmed on this project's Node 20). Both cron functions now isolate each fine's
// send failure in its own try/catch so one bad recipient can't take down the batch (or the
// server, since this runs inside the same process as the Express app via node-cron).
//
// nodemailer is mocked so no real email is ever sent and failures are fully deterministic.
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

const mockSendMail = vi.hoisted(() => vi.fn());

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail: mockSendMail })),
  },
}));

const { checkFinesAndSendReminder, checkFinesAndSendEmails, updateBlockedFines } =
  await import("../../controllers/email.controller.js");
const { connectTestDB, disconnectTestDB, clearDB } = await import(
  "../helpers/db.js"
);
const { default: Fine } = await import("../../model/fine.model.js");

// Mirrors the offset trick the controller itself uses, so seeded dates land on the exact
// same "today"/"issued N days ago" the controller will compute, regardless of server TZ.
const localToday = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000);
};

const daysAgo = (n) => {
  const d = localToday();
  d.setDate(d.getDate() - n);
  return d;
};

// checkFinesAndSendEmails filters by an exact expireDate string match in the Mongo query
// itself (Mongoose casts "YYYY-MM-DD" to midnight UTC), so seeded fines must match that
// normalized form exactly, not just the same calendar day.
const dateStringDaysAgo = (n) => daysAgo(n).toISOString().split("T")[0];

const seedFine = (overrides = {}) =>
  Fine.create({
    dId: "DRV-001",
    dName: "Test Driver",
    email: "driver@test.local",
    vNo: "ABC-1234",
    time: "10:00",
    place: "Main Street",
    violation: "Speeding",
    pId: "OFF-001",
    pName: "Test Officer",
    pStation: "Central",
    charge: "Rs. 1000",
    state: false,
    block: false,
    issueDate: daysAgo(10),
    expireDate: daysAgo(-4), // arbitrary future date, just needs to satisfy the required field
    ...overrides,
  });

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearDB();
  mockSendMail.mockReset();
});

describe("checkFinesAndSendReminder resilience", () => {
  it("does not throw when a send fails, and still attempts the remaining fines", async () => {
    await seedFine({ dId: "DRV-FAIL", email: "fail@test.local" });
    await seedFine({ dId: "DRV-OK", email: "ok@test.local" });

    let call = 0;
    mockSendMail.mockImplementation(() => {
      call += 1;
      return call === 1
        ? Promise.reject(new Error("simulated SMTP failure"))
        : Promise.resolve({});
    });

    await expect(checkFinesAndSendReminder()).resolves.toBeUndefined();
    expect(mockSendMail).toHaveBeenCalledTimes(2);
  });
});

describe("checkFinesAndSendEmails resilience", () => {
  it("does not abort the batch when one fine's email fails", async () => {
    const yesterday = new Date(dateStringDaysAgo(1));
    await seedFine({
      dId: "DRV-FAIL",
      email: "fail@test.local",
      expireDate: yesterday,
      block: true,
    });
    await seedFine({
      dId: "DRV-OK",
      email: "ok@test.local",
      expireDate: yesterday,
      block: true,
    });

    let call = 0;
    mockSendMail.mockImplementation(() => {
      call += 1;
      return call === 1
        ? Promise.reject(new Error("simulated SMTP failure"))
        : Promise.resolve({});
    });

    await expect(checkFinesAndSendEmails()).resolves.toBeUndefined();
    // Fine 1's send fails (1 call, its cc is skipped since both sends share one try/catch),
    // but fine 2 is still reached and gets both its sends (driver + fixed cc address) — proving
    // the batch continues past the first failure instead of aborting.
    expect(mockSendMail).toHaveBeenCalledTimes(3);
    const recipients = mockSendMail.mock.calls.map((call) => call[0].to);
    expect(recipients).toContain("ok@test.local");
  });
});

describe("checkFinesAndSendEmails ADMIN_NOTIFICATION_EMAIL copy", () => {
  const originalAdminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

  afterEach(() => {
    if (originalAdminEmail === undefined) {
      delete process.env.ADMIN_NOTIFICATION_EMAIL;
    } else {
      process.env.ADMIN_NOTIFICATION_EMAIL = originalAdminEmail;
    }
  });

  it("sends a copy to ADMIN_NOTIFICATION_EMAIL when it is configured", async () => {
    process.env.ADMIN_NOTIFICATION_EMAIL = "admin@test.local";
    const yesterday = new Date(dateStringDaysAgo(1));
    await seedFine({
      email: "driver@test.local",
      expireDate: yesterday,
      block: true,
    });

    mockSendMail.mockResolvedValue({});

    await expect(checkFinesAndSendEmails()).resolves.toBeUndefined();
    expect(mockSendMail).toHaveBeenCalledTimes(2);
    const recipients = mockSendMail.mock.calls.map((call) => call[0].to);
    expect(recipients).toContain("driver@test.local");
    expect(recipients).toContain("admin@test.local");
  });

  it("skips the admin copy without erroring when ADMIN_NOTIFICATION_EMAIL is not set", async () => {
    delete process.env.ADMIN_NOTIFICATION_EMAIL;
    const yesterday = new Date(dateStringDaysAgo(1));
    await seedFine({
      email: "driver@test.local",
      expireDate: yesterday,
      block: true,
    });

    mockSendMail.mockResolvedValue({});

    await expect(checkFinesAndSendEmails()).resolves.toBeUndefined();
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: "driver@test.local" })
    );
  });
});

// Regression test for the index.js cron ordering: updateBlockedFines() must run BEFORE
// checkFinesAndSendEmails() in the same daily tick, because checkFinesAndSendEmails only
// matches fines where block:true. A fine that expired yesterday isn't blocked yet until
// updateBlockedFines sets it — so if the email check ran first (the old order), that fine
// would never match on this run, and by tomorrow its expireDate is no longer "yesterday" for
// either function, meaning it would silently never receive the notice at all.
describe("cron ordering: updateBlockedFines must run before checkFinesAndSendEmails", () => {
  const originalAdminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

  beforeEach(() => {
    // Irrelevant to what's being tested here — neutralize it for a deterministic call count.
    delete process.env.ADMIN_NOTIFICATION_EMAIL;
  });

  afterEach(() => {
    if (originalAdminEmail === undefined) {
      delete process.env.ADMIN_NOTIFICATION_EMAIL;
    } else {
      process.env.ADMIN_NOTIFICATION_EMAIL = originalAdminEmail;
    }
  });

  it("with the OLD order (email check first), a freshly-expired fine is missed entirely", async () => {
    const yesterday = new Date(dateStringDaysAgo(1));
    await seedFine({
      email: "driver@test.local",
      expireDate: yesterday,
      state: false,
      block: false, // not yet blocked — updateBlockedFines hasn't run yet
    });

    mockSendMail.mockResolvedValue({});

    await checkFinesAndSendEmails(); // wrong order: runs before the fine is blocked
    expect(mockSendMail).not.toHaveBeenCalled();

    await updateBlockedFines(); // now it becomes blocked, too late for today's email pass
    const fine = await Fine.findOne({ email: "driver@test.local" });
    expect(fine.block).toBe(true);
    expect(fine.blockNoticeSent).toBe(false); // never got the notice, and never will
  });

  it("with the NEW order (block update first), the same fine is correctly notified", async () => {
    const yesterday = new Date(dateStringDaysAgo(1));
    await seedFine({
      email: "driver@test.local",
      expireDate: yesterday,
      state: false,
      block: false,
    });

    mockSendMail.mockResolvedValue({});

    await updateBlockedFines(); // matches index.js's actual call order
    await checkFinesAndSendEmails();

    expect(mockSendMail).toHaveBeenCalledTimes(1);
    const fine = await Fine.findOne({ email: "driver@test.local" });
    expect(fine.blockNoticeSent).toBe(true);
  });
});
