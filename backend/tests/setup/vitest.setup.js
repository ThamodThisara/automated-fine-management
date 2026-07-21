// Runs once before any test module is imported (see vitest.config.js -> setupFiles).
// Sets safe, self-contained environment variables so the app code can be imported and
// exercised without a real .env, real secrets, or any outbound network calls.

process.env.NODE_ENV = "test";

// Signing secret used by auth.controller (login) and verifyToken middleware. Tests both
// sign and verify with this value, so it does not need to match the production secret.
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";

// payment.controller builds a Stripe client at import time from process.env.STRIPE.
// A dummy truthy key lets the module import without throwing; no Stripe call is ever made.
process.env.STRIPE = process.env.STRIPE || "sk_test_dummy";

// Dedicated local test database — never the real app database.
process.env.MONGO_TEST_URL =
  process.env.MONGO_TEST_URL ||
  "mongodb://127.0.0.1:27017/automated-fine-management-test";
